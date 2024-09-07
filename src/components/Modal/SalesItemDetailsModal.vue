<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-title>Sales Details</ion-title>
            </ion-toolbar>
            
            <ion-item>
                <ion-button @click="handleSave" size="medium" expand="block">
                    <ion-label>Save</ion-label>
                </ion-button>
                <ion-button @click="$emit('close')" size="medium" expand="block" fill="outline">
                    <ion-label>Close</ion-label>
                </ion-button>
            </ion-item>
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
                                <ion-input readonly v-model="sales_item_local.discount_amount" placeholder="NEW"></ion-input>
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
                                <ion-input v-model="sales_item_local.net_price" placeholder="0.00"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Amount</ion-label>
                                <ion-input v-model="sales_item_local.amount" placeholder="0.00"></ion-input>
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
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue';

  
export default defineComponent({
    props: {
        sales_item: {
            type: Object as () => SALES_ITEM_DTO | null,
            default: () => ({}) 
        }
    },
    components: { 
    },
    setup(props, {emit}) {
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
            tax_rate: 0,
            tax_amount:  0,
            particulars:  '',
            user_id:  0,
            user:  '',
        })

        async function handleSave() {
            try {
                const res = await updateSalesItem(sales_item_local.value)
                if(res){
                    await presentToast('Update Succesful!');
                }else{
                    await presentToast('Update unsuccesful!');
                }
                emit('submit')

            } catch (error) {
                await presentToast('Error');
            }
        }
        function updateAmount(){
            let _qty =  sales_item_local.value.quantity;
            let price = (sales_item_local.value.price?? 0);
            let net_price = (sales_item_local.value.price?? 0);
            let _amount = (sales_item_local.value.price?? 0) * _qty;
            let _net_amount = (sales_item_local.value.price?? 0) * _qty;
            let _discount_amount = 0;

            if(price != 0 && sales_item_local.value.discount_rate != 0){
                net_price = parseFloat((price - (price * (sales_item_local.value.discount_rate / 100))).toFixed(2));
            }


            sales_item_local.value.net_price = net_price;
            _net_amount = parseFloat((_qty * net_price).toFixed(2))
            sales_item_local.value.amount = _net_amount;
            sales_item_local.value.discount_amount = parseFloat((_amount - _net_amount).toFixed(2));
        }
        async function fetchDetails(){
            setTimeout(async () => {
                try {
                    const result = await getSalesItemById(props.sales_item?.id || 0)
                    if(result){
                        sales_item_local.value = {
                            id: result.id | 0,
                            sales_id: result.sales_id,
                            date_time: result.date_time,
                            item_id: result.item_id,
                            item_code: result.item_code,
                            item_barcode: result.item_barcode,
                            item_description: result.item_description,
                            item_alias: result.item_alias,
                            item_category: result.item_category,
                            item_cost: result.item_cost,
                            item_image: '',
                            unit_id: result.unit_id,
                            unit: result.unit,
                            unit_code: result.unit_code,
                            quantity: result.quantity,
                            price: result.price,
                            discount_id: result.discount_id,
                            discount: result.discount,
                            discount_rate: result.discount_rate,
                            discount_amount: result.discount_amount,
                            net_price: result.net_price,
                            amount: result.amount,
                            tax_id: result.tax_id,
                            tax: result.tax,
                            tax_rate: result.tax_rate,
                            tax_amount: result.tax_amount,
                            particulars: result.particulars,
                            user_id: result.user_id,
                            user:  result.user,
                        }
                    }
                    
                } catch (error) {
                  await presentToast('Error')
                }
            }, 300);
            await updateAmount()

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

            handleSave,
            updateAmount
        }
    }
});
</script>