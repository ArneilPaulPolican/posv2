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
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Disc. Rate</ion-label>
                                <ion-input v-model="sales_item_local.discount_rate" placeholder="No. PAX"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Disc. Amount</ion-label>
                                <ion-input v-model="sales_item_local.discount_amount" placeholder="NEW"></ion-input>
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
    setup(props) {
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
                    console.log('Update Succesful', res)
                }else{
                    console.log('Update unsuccesful')
                }
            } catch (error) {
                console.log(error)
            }
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
                  console.log(error)
                }
            }, 300);
        }
        onMounted(async () =>{
            if (props.sales_item) {
                // console.log({ ...props.sales_item })
                // sales_item_local.value = { ...props.sales_item };
                await fetchDetails()
            } 
        })
        onIonViewDidEnter(async () => {
            if (props.sales_item) {
                // sales_item_local.value = { ...props.sales_item };
                // console.log({ ...props.sales_item })
                await fetchDetails()
            }
        })
        return {
            alertButtons,
            sales_item_local,

            handleSave
        }
    }
});
</script>