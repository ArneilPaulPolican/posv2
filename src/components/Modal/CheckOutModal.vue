<template>
    <ion-page style="margin-top: 65px;">
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-title>Sales Details</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-item>
            <ion-button slot="end" @click="" size="medium" expand="block" style="height: 90%">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.cashSharp"></ion-icon>
                    <ion-label>Collect</ion-label>
                </div>
            </ion-button>
            <ion-button slot="end" @click="$emit('close')" size="medium" expand="block" fill="outline">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.closeCircleSharp"></ion-icon>
                    <ion-label>Close</ion-label>
                </div>
            </ion-button>
        </ion-item>

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
                        <ion-input @ionInput="computeChange()" v-model="amount" placeholder="0.00"></ion-input>
                    </ion-col>
                    <ion-col size="6">
                        <ion-label position="stacked">Change</ion-label>
                        <ion-input v-model="change" placeholder="0.00"></ion-input>
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
import { COLLECTIONS_LINES_DTO } from '@/models/collection-lines.model';
import { COLLECTIONS, COLLECTIONS_DTO } from '@/models/collections.model';
import { PAYTYPE } from '@/models/paytype.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.service';
import { getPaytypes } from '@/services/system/paytype.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref, toRefs } from 'vue';


export default defineComponent({
    props: {
        sales: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props, {emit}){
        const { sales } = toRefs(props);
        const selected_paytype = ref<PAYTYPE>();
        const paytypes = ref<PAYTYPE[]>([]);
        const collection = ref<COLLECTIONS_DTO>();
        const collection_line = ref<COLLECTIONS_LINES_DTO>();

        const amount = ref(sales.value.total_amount);
        const change = ref(0);
        
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
        }
    }
});
</script>