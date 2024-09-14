<template>
    <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button @click="handlePrint">
                <ion-icon :icon="icons.printSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-content :fullscreen="true">
            <ion-list :inset="true" style="margin: 5px">
                <div>
                    <ion-item>
                        <ion-label>Z Reading Date</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Gross Sales (Net of VAT)</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Regular Discount</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Seniorr Discount</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>PWD Discount</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Sales Return</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Net Sales</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                </div>
            </ion-list>
            
            <ion-list :inset="true" style="margin: 5px">
                <div>
                    <ion-item>
                        <ion-label>Cash</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Refund</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.cancelled_amount"></ion-input>
                    </ion-item>
                </div>
            </ion-list>

            
            <ion-item>
                <ion-label>Total Collection</ion-label>
                <ion-input slot="end" readonly v-model="z_reading.total_collection"></ion-input>
            </ion-item>

            
            <ion-list :inset="true" style="margin: 5px">
                <div>
                    <ion-item>
                        <ion-label>VAT Sales</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.vat_sales"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>VAT Amount</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.vat_amount"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Non-VAT</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.non_vat"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>VAT Exempt</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.vat_exempt"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>VAT Zero Rated</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.vat_zero_rated"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Sales Return</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Net Sales</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.z_reading_date"></ion-input>
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { presentToast } from '@/composables/toast.service';
import { Z_READINGS } from '@/models/z-reading.model';
import { icons } from '@/plugins/icons';
import { getCollectionLineByCollectionId } from '@/services/activity/collection-lines.service';
import { getSalesItemBySalesId } from '@/services/activity/sales-item.service';
import { getSalesById } from '@/services/activity/sales.service';
import { getCollectionForZRead, getSalesForZRead, getZReding } from '@/services/report/z-reading-report.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';



export default defineComponent({
    setup(){
        const z_reading = ref<Z_READINGS>({
            id: 0,
            z_reading_date: '',
            gross_sales: 0,
            regular_discount: 0,
            senior_discount: 0,
            pwd_discount: 0,
            sales_return: 0,
            net_sales: 0,
            collections: '',
            total_collection: 0,
            vat_sales: 0,
            vat_amount: 0,
            non_vat: 0,
            vat_exempt: 0,
            vat_zero_rated: 0,
            total_vat_analysis: 0,
            counter_id_start: '',
            counter_id_end: '',
            cancelled_transaction: 0,
            cancelled_amount: 0,
            number_of_transaction: 0,
            number_of_sku: 0,
            total_quantity: 0,
            ags_previous_reading: 0,
            ags_gross_sales: 0,
            ags_accumulated_gross_sales: 0,
            ans_previous_reading: 0,
            ans_net_sales: 0,
            ans_accumulated_net_sales: 0,
        });
        const z_reading_date = ref(new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                    }));

        async function handlePrint() {
        }
        async function fetchData() {
            try {
                
                let _total_gros_sales =0;
                let _total_regular_discount =0;
                let _total_senior_discount =0;
                let _total_pwd_discount =0;
                let _total_sales_return =0;
                let _total_net_sales =0;

                let collection_lines:any[] = [];
                let _total_cash =0;
                let _total_collection =0;

                let _total_vatable_sales =0;
                let _total_vat_amount =0;
                let _total_non_vat_amount =0;
                let _total_vat_exempt_amount =0;
                let _total_zero_vat_amount =0;
                let _total_vat =0;

                let z_counter: any[] = [];
                let z_counter_start ='';
                let z_counter_end ='';

                let _total_cancelled_trx =0;
                let _total_cancelled_amount =0;

                let _total_trx =0;
                let _total_no_of_sku =0;
                let _total_quantity =0;

                let ags_prev_reading =0;
                let ags_gross_sales =0;
                let ags_accu_gross_sales =0;

                let ans_prev_reading =0;
                let ans_net_sales =0;
                let ans_accu_net_sales =0

                let z_read_count =0;

                const result = await getCollectionForZRead(z_reading_date.value)
                console.log(result.data);

                if(result.success){
                    result.data?.forEach(async (item) => {

                        _total_collection += item.amount;
                        const collection_line_result = await getCollectionLineByCollectionId(item.id)
                        if(collection_line_result.success && collection_line_result.data){
                            collection_line_result.data?.forEach(async (lines) => {
                                collection_lines.push({ paytype: lines.paytype, amount: lines.amount })
                            });
                        }

                        console.log(`Sales Id ${item.sales_id}`);
                        const sales_result = await getSalesById(item.sales_id)
                        if(sales_result.success && sales_result.data){
                            _total_trx +=1;
                            _total_gros_sales += sales_result.data.total_amount;
                            // if (!sales_result.data.discount.toLowerCase().includes('pwd') &&
                            //     !sales_result.data.discount.toLowerCase().includes('senior')) 
                            if(sales_result.data.discount.toLowerCase().includes('senior')){
                                _total_senior_discount += sales_result.data.discount_amount;
                            }else if(sales_result.data.discount.toLowerCase().includes('pwd')){
                                _total_pwd_discount += sales_result.data.discount_amount;
                            }else{
                                _total_regular_discount += sales_result.data.discount_amount;
                            }

                            _total_net_sales += sales_result.data.net_amount;
                            z_counter.push(sales_result.data.sales_number);

                            if(sales_result.data.is_cancelled) _total_cancelled_trx +=1;
                            if(sales_result.data.is_cancelled) _total_cancelled_amount += sales_result.data.total_amount;

                            console.log(`Sales ${sales_result.data}`)
                            const sales_item_result = await getSalesItemBySalesId(item.sales_id)
                            if(sales_item_result.success){
                                console.log(`Sales Item ${sales_item_result.data}`)
                                // loop through sales items
                                sales_item_result.data?.forEach(async (sales_item) => {
                                    _total_no_of_sku += 1
                                    _total_quantity += sales_item.quantity;
                                });
                            }
                        }
                    });

                    z_reading.value.z_reading_date = z_reading_date.value;
                    z_reading.value.gross_sales = 0;
                    z_reading.value.regular_discount = 0;
                    z_reading.value.senior_discount = 0;
                    z_reading.value.pwd_discount = 0;
                    z_reading.value.sales_return = 0;
                    z_reading.value.net_sales = 0;
                    z_reading.value.collections = '';
                    z_reading.value.total_collection = 0;
                    z_reading.value.vat_sales = 0;
                    z_reading.value.vat_amount = 0;
                    z_reading.value.non_vat = 0;
                    z_reading.value.vat_exempt = 0;
                    z_reading.value.vat_zero_rated = 0;
                    z_reading.value.total_vat_analysis = 0;
                    z_reading.value.counter_id_start = '';
                    z_reading.value.counter_id_end= '';
                    z_reading.value.cancelled_transaction = 0;
                    z_reading.value.cancelled_amount = 0;
                    z_reading.value.number_of_transaction = 0;
                    z_reading.value.number_of_sku = 0;
                    z_reading.value.total_quantity = 0;
                    z_reading.value.ags_previous_reading = 0;
                    z_reading.value.ags_gross_sales = 0;
                    z_reading.value.ags_accumulated_gross_sales = 0;
                    z_reading.value.ans_previous_reading = 0;
                    z_reading.value.ans_net_sales = 0;
                    z_reading.value.ans_accumulated_net_sales = 0;
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        onMounted(async()=>{
            await fetchData()
        })
        onIonViewDidEnter(async()=>{
            await fetchData()
        })
        return{
            icons,
            z_reading,
            handlePrint
        }
    }
})
</script>