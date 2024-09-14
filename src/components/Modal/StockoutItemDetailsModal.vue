<template>
    <ion-page style="margin-top: 65px;">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
                </ion-buttons>
                <ion-title>Stock Out Item Details</ion-title>
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
                        <ion-input v-model="stock_out_item_local.item_barcode" :readonly="true" ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Discription</ion-label>
                        <ion-input v-model="stock_out_item_local.item_description" :readonly="true"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Unit</ion-label>
                        <ion-input v-model="stock_out_item_local.unit_code" :readonly="true"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Cost</ion-label>
                                <ion-input @ionInput="updateAmount()" type="number" v-model="stock_out_item_local.cost" placeholder="0.00"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Quantity</ion-label>
                                <ion-input v-model="stock_out_item_local.quantity" placeholder="0.00"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col>
                                <ion-label position="stacked">Amount</ion-label>
                                <ion-input readonly v-model="stock_out_item_local.amount" placeholder="0.00"></ion-input>
                            </ion-col>
                        </ion-row>

                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
        
    </ion-page>
</template>
  
<script lang="ts">
import { presentToast } from '@/composables/toast.service';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, readonly, ref, toRefs, watch } from 'vue';
import ITEM_DTO from '@/models/item.model';
import { updateStockOutItem } from '@/services/activity/stock-out-items.service';
import { STOCK_OUT_ITEMS_DTO } from '@/models/stock-out-item.model';

  
export default defineComponent({
    props: {
        stock_out: {
            type: Object,
            default: () => ({})
        },
        stock_out_item: {
            type: Object as () => STOCK_OUT_ITEMS_DTO | null,
            default:() => ({})
        }
    },
    setup(props) {
        const { stock_out } = toRefs(props);
        const stock_out_item = props.stock_out_item;
        const stock_out_item_local = ref<STOCK_OUT_ITEMS_DTO>({
            id: 0,
            out_id: 0,
            item_id: 0,
            date_time: '',
            item_barcode:  '',
            item_description: '',
            item_image_path:  '',
            unit_id: 0,
            unit_code:'',
            unit:'',
            quantity: 0,
            cost: 0,
            amount: 0,
            particulars: '',
            is_inventory: false
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
                const res = await updateStockOutItem(stock_out_item_local.value)
                if(res){
                    await presentToast('Update Succesful!');
                    confirm()
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`);
            }
        }
        
        const cancel = () => modalController.dismiss('', 'cancel');
        const confirm = () => modalController.dismiss(stock_out_item_local, 'confirm');


        async function updateAmount(){
            let _qty =  stock_out_item_local.value.quantity ?? 0;
            let cost = stock_out_item_local.value.cost ?? 0;
            stock_out_item_local.value.amount = _qty * cost;
        }

        async function fetchDetails(){
            try {
                    // const result = await getStockInItemsById(props.stock_in_item?.id || 0);
                if(stock_out_item){
                    stock_out_item_local.value = {
                        id: stock_out_item?.id ?? 0,
                        out_id: stock_out_item?.out_id ?? 0,
                        date_time: stock_out_item?.date_time ?? '',
                        item_id: stock_out_item?.item_id ?? 0,
                        item_barcode:  stock_out_item?.item_barcode ?? '',
                        item_description: stock_out_item?.item_description ?? '',
                        item_image_path:  stock_out_item?.item_image_path ?? '',
                        unit_id: stock_out_item?.unit_id ?? 0,
                        unit_code: stock_out_item?.unit_code ?? '',
                        unit: stock_out_item?.unit ?? '',
                        quantity: stock_out_item?.quantity ?? 0,
                        cost: stock_out_item?.cost ?? 0,
                        amount: stock_out_item?.amount ?? 0,
                        particulars: stock_out_item?.particulars,
                        is_inventory: stock_out_item?.is_inventory,
                    }
                }
            } catch (error) {
                await presentToast('Error')
            }

        }
        onMounted(async () =>{
            if (props.stock_out_item) {
                await fetchDetails()
            } 
        })
        onIonViewDidEnter(async () => {
            if (props.stock_out_item) {
                await fetchDetails()
            }
        })
        return {
            stock_out_item,
            stock_out_item_local,
            item,

            handleSave,
            updateAmount,
            cancel,
        }
    }
});
</script>