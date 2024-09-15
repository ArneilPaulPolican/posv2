<template>
    <ion-page style="margin-top: 65px;">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
                </ion-buttons>
                <ion-title>Payment</ion-title>
                <ion-buttons slot="end">
                <ion-button @click="onCollectSubmit()" :strong="true">Confirm</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-item>
                <ion-label position="stacked">Paytype</ion-label>
                <ion-select v-model="selected_paytype" placeholder="Select fruit"
                    @ionChange="onPaytypeSelect($event.detail.value)">
                    <ion-select-option v-for="paytype in paytypes" :value="paytype">{{ paytype.paytype }}</ion-select-option>
                </ion-select>
            </ion-item>
            <ion-item>
                <ion-row>
                    <ion-col size="6">
                        <ion-label position="stacked">Amount</ion-label>
                        <!-- <ion-input @ionInput="computeChange()" v-model="amount" placeholder="0.00"></ion-input> -->
                        <InputFloat :amount="amount" @update="(floatValue) => amount = floatValue" @ionInput="computeChange()"></InputFloat>
                    </ion-col>
                    <ion-col size="6">
                        <ion-label position="stacked">Change</ion-label>
                        <!-- <ion-input readonly v-model="change" placeholder="0.00"></ion-input> -->
                        <InputFloat readonly :amount="change" @update="(floatValue) => change = floatValue"></InputFloat>
                    </ion-col>
                </ion-row>
            </ion-item>
            <ion-item v-if="selected_paytype?.paytype.toLowerCase() != 'cash'">
                <ion-label position="stacked">Refrence</ion-label>
                <ion-input placeholder="RF: 0123456"></ion-input>
            </ion-item>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { COLLECTIONS_LINES, COLLECTIONS_LINES_DTO } from '@/models/collection-lines.model';
import { COLLECTIONS, COLLECTIONS_DTO } from '@/models/collections.model';
import { PAYTYPE } from '@/models/paytype.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.composables';
import { getPaytypes } from '@/services/system/paytype.service';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { getLastCollectionNumber } from '@/services/activity/collection.service';
import { onPaymentSubmitUpdateSalesBalance } from '@/composables/payment.composable';
import { SALES_DTO } from '@/models/sales.model';
import InputFloat from '../InputFloat.vue';


export default defineComponent({
    components: { 
        InputFloat
    },
    props: {
        sales: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props){
        const { sales } = toRefs(props);
        const selected_paytype = ref<PAYTYPE>({
            id: 0,
            paytype: '',
            is_default_value: false
        });
        const paytypes = ref<PAYTYPE[]>([]);
        const collection = ref<COLLECTIONS>({
            id:  0,
            ci_date: '',
            ci_number: '',
            customer_id: 0,
            sales_id: 0,
            total_amount: 0,
            user_id: 0,
            is_locked: false
        });
        const collection_line = ref<COLLECTIONS_LINES[]>([]);

        const amount = ref(sales.value.net_amount ?? 0);
        const change = ref(0);
        const particulars = ref ('');
        
        async function onPaytypeSelect(paytype:PAYTYPE) {
            console.log('paytype',paytype)
            selected_paytype.value = paytype
        }

        async function computeChange() {
            let _amount = amount.value;
            let _change =  amount.value - sales.value.total_amount;
            console.log(_change); 
            change.value = _change
        }

        async function onCollectSubmit() {
            try {
                collection.value.ci_date = new Date().toLocaleDateString('en-US', 
                { year: 'numeric', month: '2-digit', day: '2-digit' });
                collection.value.ci_number = await getLastCollectionNumber();
                collection.value.customer_id = sales.value.customer_id;
                collection.value.sales_id = sales.value.id;
                collection.value.total_amount = amount.value;
                collection.value.user_id = 1;

                collection_line.value.push({
                    id:0,
                    collection_id: 0,
                    paytype_id: (selected_paytype.value?.id ?? 0),
                    particulars: particulars.value,
                    amount: amount.value,
                    change: change.value
                })

                const result = await onPaymentSubmitUpdateSalesBalance(sales.value as SALES_DTO, collection.value as COLLECTIONS_DTO, collection_line.value)
                if (result.success){
                    await presentToast('Collection Successful');
                    await confirm();
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }
        
        const cancel = () => modalController.dismiss('', 'cancel');
        const confirm = () => modalController.dismiss('', 'confirm');
        
        const fetchList = async () =>{
            try {
                const result = await getPaytypes();
                if(result.success){
                    paytypes.value = result.data;
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`);
            }
        }
        onMounted(async ()=>{
            console.log('props',sales)
            await fetchList()
        })
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        return{
            icons,
            amount,
            change,

            selected_paytype,
            paytypes,

            collection,
            collection_line,

            onPaytypeSelect,
            computeChange,
            onCollectSubmit,
            cancel
        }
    }
});
</script>