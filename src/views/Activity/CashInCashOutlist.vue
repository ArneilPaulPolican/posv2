<template>
<ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button  >
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-item>
            <!-- Search Input -->
             <ion-label position="stacked">Search Cash In / Cash Out</ion-label>
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="cash_in_cash_out in cash_in_cash_outs" :key="cash_in_cash_out.id" @click="">
                    <ion-label>
                        <h2>{{ cash_in_cash_out.cash_in_out_number }}</h2>
                        <p>{{ cash_in_cash_out.cash_in_out_date }}</p>
                        <p>{{ cash_in_cash_out.remarks }}</p>
                    </ion-label>
                    <ion-label slot=end>
                        {{ cash_in_cash_out.amount }}
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { presentToast } from '@/composables/toast.service';
import { CASH_IN_OUTS } from '@/models/cashin-cashout.model';
import { icons } from '@/plugins/icons';
import { getCashInCashOut } from '@/services/activity/cash-in-cash-out.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
    setup(){
        const router = useRouter();
        const cash_in_cash_outs = ref<CASH_IN_OUTS[]>([]);


        async function fetchList() {
            try {
                const result = await getCashInCashOut() 
                if(result.success){
                    cash_in_cash_outs.value = result.data 
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        onMounted(async()=>{
            await fetchList()
        })
        onIonViewDidEnter(async()=>{
            await fetchList()
        })
        return{
            icons,
            cash_in_cash_outs
        }
    }
})
</script>