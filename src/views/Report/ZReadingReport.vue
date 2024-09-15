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
                        <ion-input slot="end" readonly v-model="z_reading.gross_sales"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Regular Discount</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.regular_discount"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Senior Discount</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.senior_discount"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>PWD Discount</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.pwd_discount"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Sales Return</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.sales_return"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Net Sales</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.net_sales"></ion-input>
                    </ion-item>
                </div>
            </ion-list>
            
            <ion-list :inset="true" style="margin: 5px">
                <div>
                    <ion-item>
                        <ion-label>Cash</ion-label>
                        <ion-input slot="end" readonly ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Refund</ion-label>
                        <ion-input slot="end" readonly ></ion-input>
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
                        <ion-label>Total</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.total_vat_analysis"></ion-input>
                    </ion-item>
                </div>
            </ion-list>

            <ion-list :inset="true" style="margin: 5px">
                <div>
                    <ion-item>
                        <ion-label>Counter Id Start</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.counter_id_start"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Counter Id End</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.counter_id_end"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Cancelled Transaction</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.cancelled_transaction"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Cancelled Amount</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.cancelled_amount"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>No. of Transaction</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.number_of_transaction"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>No. of SKU</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.number_of_sku"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label>Total Quantity</ion-label>
                        <ion-input slot="end" readonly v-model="z_reading.total_quantity"></ion-input>
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { presentToast } from '@/composables/toast.composables';
import { Z_READINGS } from '@/models/z-reading.model';
import { icons } from '@/plugins/icons';
import { getCollectionLineByCollectionId } from '@/services/activity/collection-lines.service';
import { getSalesItemBySalesId } from '@/services/activity/sales-item.service';
import { getSalesById } from '@/services/activity/sales.service';
import { getCollectionForZRead, getPreviousReading, getSalesForZRead, getZReding } from '@/services/report/z-reading-report.service';
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

                if(result.success && result.data){
                    for (const item of result.data) {
                        _total_collection += item.total_amount;
                        const collection_line_result = await getCollectionLineByCollectionId(item.id)
                        if(collection_line_result.success && collection_line_result.data){
                            for (const lines of collection_line_result.data) {
                                collection_lines.push({ paytype: lines.paytype, amount: lines.amount })
                            }
                        }

                        const sales_result = await getSalesById(item.sales_id)
                        if(sales_result.success && sales_result.data){
                            _total_trx +=1;
                            _total_gros_sales += sales_result.data.total_amount;
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

                            const sales_item_result = await getSalesItemBySalesId(item.sales_id)
                            if(sales_item_result.success){
                                // loop through sales items
                                for (const sales_item of sales_item_result.data) {
                                    _total_no_of_sku += 1
                                    _total_quantity += sales_item.quantity;

                                    if((sales_item.tax_amount?? 0) > 0){
                                        _total_vatable_sales += (sales_item.amount??0);
                                        _total_vat_amount += (sales_item.tax_amount??0);
                                    } else if(sales_item.tax.toLowerCase().includes('non')){
                                        _total_non_vat_amount += (sales_item.amount??0);
                                    } else if(sales_item.tax.toLowerCase().includes('exempt')){
                                        _total_vat_exempt_amount += (sales_item.amount??0);
                                    }else if(sales_item.tax.toLowerCase().includes('zero')){
                                        _total_zero_vat_amount += (sales_item.amount??0);
                                    }
                                    _total_vat += sales_item.tax_amount??0;
                                }
                            }
                        }
                    }


                    z_reading.value.z_reading_date = z_reading_date.value;
                    z_reading.value.gross_sales = _total_gros_sales;
                    z_reading.value.regular_discount = _total_regular_discount;
                    z_reading.value.senior_discount = _total_regular_discount;
                    z_reading.value.pwd_discount = _total_pwd_discount;
                    z_reading.value.sales_return = _total_sales_return;
                    z_reading.value.net_sales = _total_net_sales;
                    z_reading.value.collections = '';
                    z_reading.value.total_collection = _total_collection; 
                    z_reading.value.vat_sales = _total_vatable_sales;
                    z_reading.value.vat_amount = _total_vat_amount;
                    z_reading.value.non_vat = _total_non_vat_amount;
                    z_reading.value.vat_exempt = _total_vat_exempt_amount;
                    z_reading.value.vat_zero_rated = _total_zero_vat_amount;
                    z_reading.value.total_vat_analysis = _total_vat;
                    if (z_counter.length > 0) {
                        z_reading.value.counter_id_start = z_counter[z_counter.length - 1];
                        z_reading.value.counter_id_end= z_counter[0];
                    }

                    z_reading.value.cancelled_transaction = _total_cancelled_trx;
                    z_reading.value.cancelled_amount = _total_cancelled_amount;
                    z_reading.value.number_of_transaction = _total_trx;
                    z_reading.value.number_of_sku = _total_no_of_sku;
                    z_reading.value.total_quantity = _total_quantity;

                    const prev_reading = await getPreviousReading()
                    if(prev_reading.success && prev_reading.data){
                        z_reading.value.ags_previous_reading = prev_reading.data.ags_accumulated_gross_sales;
                        z_reading.value.ags_gross_sales = _total_gros_sales;
                        z_reading.value.ags_accumulated_gross_sales = prev_reading.data.ags_accumulated_gross_sales + _total_gros_sales;
                    
                        z_reading.value.ans_previous_reading = prev_reading.data.ans_accumulated_net_sales;
                        z_reading.value.ans_net_sales = _total_net_sales;
                        z_reading.value.ans_accumulated_net_sales = prev_reading.data.ans_accumulated_net_sales + _total_net_sales;
                    }

                    
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