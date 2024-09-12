<template>
    <ion-page style="margin-top: 65px;">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
                </ion-buttons>
                <ion-title>Sales Details</ion-title>
                <ion-buttons slot="end">
                <ion-button @click="handleSave" :strong="true">Confirm</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-header :translucent="true">
            <ion-toolbar>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    <ion-item>
                        <ion-label position="stacked">Barcode</ion-label>
                        <ion-input v-model="sales_item_local.item_barcode" :readonly="true" placeholder="Walk-in" ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Discription</ion-label>
                        <ion-input v-model="sales_item_local.item_description" placeholder="No Discount"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Discount</ion-label>
                        <ion-input readonly v-model="sales_item_local.discount" placeholder="No Discount"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Disc. Rate</ion-label>
                                <ion-input readonly v-model="sales_item_local.discount_rate" placeholder="No. PAX"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Disc. Amount</ion-label>
                                <ion-input  readonly v-model="sales_item_local.discount_amount" placeholder="NEW"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Price</ion-label>
                                <ion-input @ionInput="updateAmount" v-model="sales_item_local.price" placeholder="No. PAX"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Quantity</ion-label>
                                <ion-input v-model="sales_item_local.quantity" placeholder="NEW"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Net Price</ion-label>
                                <ion-input readonly v-model="sales_item_local.net_price" placeholder="0.00"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Amount</ion-label>
                                <ion-input readonly v-model="sales_item_local.amount" placeholder="0.00"></ion-input>
                            </ion-col>
                        </ion-row>

                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
        
    </ion-page>
</template>
  
<script lang="ts">
import { SALES_ITEM_DTO } from '@/models/sales-item.model';
import { presentToast } from '@/composables/toast.service';
import { getSalesItemById, updateSalesItem } from '@/services/activity/sales-item.service';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, readonly, ref, toRefs, watch } from 'vue';
import { discountPerQuantity, netPrice } from '@/composables/sales-composable';
import { SALES_DTO } from '@/models/sales.model';
import ITEM_DTO from '@/models/item.model';
import { getItemById } from '@/services/setup/item.service';

  
export default defineComponent({
    props: {
        sales: {
            type: Object,
            default: () => ({})
        },
        sales_item: {
            type: Object as () => SALES_ITEM_DTO | null,
            default: () => ({}) 
        }
    },
    setup(props) {
        const { sales } = toRefs(props);
        const sales_item = props.sales_item;
        const alertButtons = ['Confirm'];
        const sales_item_local = ref<SALES_ITEM_DTO>({
            id:  0,
            sales_id:  0,
            date_time:  '',
            item_id:  0,
            item_code:  '',
            item_description:  '',
            item_barcode:  '',
            item_alias:  '',
            item_category:  '',
            item_cost:  0,
            item_image: '',
            unit_id:  0,
            unit:  '',
            unit_code: '',
            quantity:  0,
            price:  0,
            discount_id:  0,
            discount:  '',
            discount_rate:  0,
            discount_amount:  0,
            net_price:  0,
            amount:  0,
            tax_id:  0,
            tax: '',
            tax_code: '',
            tax_rate: 0,
            tax_amount:  0,
            particulars:  '',
            user_id:  0,
            user:  '',
        })
        const item = ref<ITEM_DTO>({
            id:0,
            item_code: '',
            bar_code: '',
            item_description: '',
            alias: '',
            category: '',
            price: 0,
            cost: 0,
            quantity: 0,
            unit_id: 0,
            unit:'',
            is_inventory: false,
            generic_name: '',
            tax_id: 0,
            tax:'',
            remarks: '',
            image_path: '',
            is_package: false,
            is_locked: false,
            is_vat_inclusive: false,
            expiry_date:'',
            lot_number:''
        });

        async function handleSave() {
            try {
                const res = await updateSalesItem(sales_item_local.value)
                if(res){
                    await presentToast('Update Succesful!');
                    confirm();
                }else{
                    await presentToast('Update unsuccesful!');
                }
            } catch (error) {
                await presentToast('Error');
            }
        }
        
        const cancel = () => modalController.dismiss('', 'cancel');
        const confirm = () => modalController.dismiss('', 'confirm');


        async function updateAmount(){
            let _qty =  sales_item_local.value.quantity;
            let price = (sales_item_local.value.price?? 0);
            item.value.price = (sales_item_local.value.price ?? 0);
            let _net_price = await netPrice(item.value as ITEM_DTO, sales.value as SALES_DTO);
            let _amount = (sales_item_local.value.price?? 0) * _qty;
            let _net_amount = (sales_item_local.value.price?? 0) * _qty;

            // if(price != 0 && sales_item_local.value.discount_rate != 0){
                // net_price = parseFloat((price - (price * (sales_item_local.value.discount_rate / 100))).toFixed(2));
            // net_price = await netPrice(item.value as ITEM_DTO, sales.value as SALES_DTO)
            // }
            console.log(`_net_price ${_net_price}`)
            sales_item_local.value.net_price = _net_price;
            _net_amount = parseFloat((_qty * _net_price).toFixed(2))
            sales_item_local.value.amount = _net_amount;
            sales_item_local.value.discount_amount = await discountPerQuantity(_qty, item.value as ITEM_DTO, sales.value as SALES_DTO ) * _qty;
        }
        async function fetchDetails(){
            setTimeout(async () => {
                try {
                    // const result = await getSalesItemById(props.sales_item?.id || 0);
                    if(sales_item){
                        sales_item_local.value = {
                            id: sales_item.id ?? 0,
                            sales_id: sales_item.sales_id,
                            date_time: sales_item.date_time,
                            item_id: sales_item.item_id,
                            item_code: sales_item.item_code,
                            item_barcode: sales_item.item_barcode,
                            item_description: sales_item.item_description,
                            item_alias: sales_item.item_alias,
                            item_category: sales_item.item_category,
                            item_cost: sales_item.item_cost,
                            item_image: '',
                            unit_id: sales_item.unit_id,
                            unit: sales_item.unit,
                            unit_code: sales_item.unit_code,
                            quantity: sales_item.quantity,
                            price: sales_item.price,
                            discount_id: sales_item.discount_id,
                            discount: sales_item.discount,
                            discount_rate: sales_item.discount_rate,
                            discount_amount: sales_item.discount_amount,
                            net_price: sales_item.net_price,
                            amount: sales_item.amount,
                            tax_id: sales_item.tax_id,
                            tax: sales_item.tax,
                            tax_code: sales_item.tax_code,
                            tax_rate: sales_item.tax_rate,
                            tax_amount: sales_item.tax_amount,
                            particulars: sales_item.particulars,
                            user_id: sales_item.user_id,
                            user:  sales_item.user,
                        }
                    }

                    const item_res = await getItemById(props.sales_item?.item_id || 0);
                    if(item_res.success){
                        console.log('Retreived item', item_res.data)
                        item.value = {
                            id: item_res.data?.id,
                            item_code: item_res.data?.item_code,
                            item_description: item_res.data?.item_description ,
                            bar_code: item_res.data?.bar_code ,
                            alias: item_res.data?.alias ,
                            category: item_res.data?.category,
                            price: item_res.data?.price,
                            cost: item_res.data?.cost ,
                            quantity: item_res.data?.quantity,
                            unit_id: item_res.data?.unitId, // Map unitId to unit_id
                            unit: item_res.data?.unit_code,
                            is_inventory: item_res.data?.is_inventory ,
                            generic_name: item_res.data?.generic_name,
                            tax_id: item_res.data?.taxId,
                            tax: item_res.data?.tax_code,
                            tax_rate: (item_res.data?.tax_rate ?? 0) ,
                            remarks: item_res.data?.remarks,
                            image_path: item_res.data?.image_path,
                            is_package: item_res.data?.is_package,
                            is_locked: (item_res.data?.is_locked ?? false),
                            is_vat_inclusive: (item_res.data?.is_vat_inclusive ?? false),
                            expiry_date: item_res.data?.expiry_date,
                            lot_number: item_res.data?.lot_number,
                        };
                    }
                } catch (error) {
                  await presentToast('Error')
                }
            }, 300);

        }
        onMounted(async () =>{
            if (props.sales_item) {
                await fetchDetails()
            } 
        })
        onIonViewDidEnter(async () => {
            if (props.sales_item) {
                await fetchDetails()
            }
        })
        return {
            alertButtons,
            sales_item_local,
            item,

            handleSave,
            updateAmount,
            cancel,
        }
    }
});
</script>