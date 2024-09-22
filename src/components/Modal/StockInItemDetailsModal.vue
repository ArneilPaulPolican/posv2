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
                        <ion-input label="" label-placement="floating" fill="solid" v-model="stock_in_item_local.item_barcode" :readonly="true" ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Discription</ion-label>
                        <ion-input label="" label-placement="floating" fill="solid" v-model="stock_in_item_local.item_description" :readonly="true"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Unit</ion-label>
                        <ion-input label="" label-placement="floating" fill="solid" v-model="stock_in_item_local.unit_code" :readonly="true"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Cost</ion-label>
                                <!-- <ion-input label="" label-placement="floating" fill="solid" @ionInput="updateAmount()" type="number" v-model="stock_in_item_local.cost" placeholder="0.00"></ion-input> -->
                                <InputFloat :amount="stock_in_item_local.cost" @update="(floatValue) => stock_in_item_local.cost = floatValue" @ionInput="updateAmount()"></InputFloat>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Quantity</ion-label>
                                <!-- <ion-input label="" label-placement="floating" fill="solid" v-model="stock_in_item_local.quantity" placeholder="0.00"></ion-input> -->
                                <InputFloat :amount="stock_in_item_local.quantity" @update="(floatValue) => stock_in_item_local.quantity = floatValue" @ionInput="updateAmount()"></InputFloat>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col>
                                <ion-label position="stacked">Amount</ion-label>
                                <!-- <ion-input label="" label-placement="floating" fill="solid" readonly v-model="stock_in_item_local.amount" placeholder="0.00"></ion-input> -->
                                <InputFloat :amount="stock_in_item_local.amount" @update="(floatValue) => stock_in_item_local.amount = floatValue"></InputFloat>
                            </ion-col>
                        </ion-row>

                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
        
    </ion-page>
</template>
  
<script lang="ts">
import { presentToast } from '@/composables/toast.composables';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, readonly, ref, toRefs, watch } from 'vue';
import ITEM_DTO from '@/models/item.model';
import { getItemById } from '@/services/setup/item.service';
import { STOCK_IN_ITEMS_DTO } from '@/models/stock-in-item.model';
import { updateStockInItem } from '@/services/activity/stock-in-items.service';
import InputFloat from '../InputFloat.vue';

  
export default defineComponent({
    components: { 
        InputFloat
    },
    props: {
        stock_in: {
            type: Object,
            default: () => ({})
        },
        stock_in_item: {
            type: Object as () => STOCK_IN_ITEMS_DTO | null,
            default:() => ({})
        }
    },
    setup(props) {
        const { stock_in } = toRefs(props);
        const stock_in_item = props.stock_in_item;
        const stock_in_item_local = ref<STOCK_IN_ITEMS_DTO>({
            id: 0,
            in_id: 0,
            item_id: 0,
            date_time: '',
            item_code:  '',
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
            is_inventory: false,
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
                const res = await updateStockInItem(stock_in_item_local.value)
                if(res){
                    await presentToast('Update Succesful!');
                    confirm()
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`);
            }
        }
        
        const cancel = () => modalController.dismiss('', 'cancel');
        const confirm = () => modalController.dismiss(stock_in_item_local, 'confirm');


        async function updateAmount(){
            let _qty =  stock_in_item_local.value.quantity ?? 0;
            let cost = stock_in_item_local.value.cost ?? 0;
            stock_in_item_local.value.amount = _qty * cost;
        }

        async function fetchDetails(){
            try {
                    // const result = await getStockInItemsById(props.stock_in_item?.id || 0);
                if(stock_in_item){
                    stock_in_item_local.value = {
                        id: stock_in_item?.id ?? 0,
                        in_id: stock_in_item?.in_id ?? 0,
                        date_time: stock_in_item?.date_time ?? '',
                        item_id: stock_in_item?.item_id ?? 0,
                        item_code:  stock_in_item?.item_code ?? '',
                        item_barcode:  stock_in_item?.item_barcode ?? '',
                        item_description: stock_in_item?.item_description ?? '',
                        item_image_path:  stock_in_item?.item_image_path ?? '',
                        unit_id: stock_in_item?.unit_id ?? 0,
                        unit_code: stock_in_item?.unit_code ?? '',
                        unit: stock_in_item?.unit ?? '',
                        quantity: stock_in_item?.quantity ?? 0,
                        cost: stock_in_item?.cost ?? 0,
                        amount: stock_in_item?.amount ?? 0,
                        particulars: stock_in_item?.particulars,
                        is_inventory: stock_in_item?.is_inventory,
                    }
                }
            } catch (error) {
                await presentToast('Error')
            }

        }
        onMounted(async () =>{
            if (props.stock_in) {
                await fetchDetails()
            } 
        })
        onIonViewDidEnter(async () => {
            if (props.stock_in) {
                await fetchDetails()
            }
        })
        return {
            stock_in_item,
            stock_in_item_local,
            item,

            handleSave,
            updateAmount,
            cancel,
        }
    }
});
</script>