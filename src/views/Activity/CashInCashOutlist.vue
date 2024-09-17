<template>
<ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button  @click="handleNew">
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
                <ion-item v-for="cash_in_cash_out in cash_in_cash_outs" :key="cash_in_cash_out.id" @click="openActionSheet(cash_in_cash_out)">
                    <ion-label>
                        <h2>{{ cash_in_cash_out.cash_in_out_number }}</h2>
                        <p>{{ cash_in_cash_out.cash_in_out_date }}</p>
                        <p v-if="cash_in_cash_out.is_locked">Locked</p><p v-else>Unlocked</p>
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
import { presentToast } from '@/composables/toast.composables';
import { CASH_IN_OUTS } from '@/models/cashin-cashout.model';
import { icons } from '@/plugins/icons';
import { addNewCashInCashOut, deleteCashInCashOut, getCashInCashOut } from '@/services/activity/cash-in-cash-out.service';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
    setup(){
        const router = useRouter();
        const cash_in_cash_outs = ref<CASH_IN_OUTS[]>([]);

        //#region   Actionsheet
        const actionSheetButtons = (cash_in_cash_out:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(cash_in_cash_out.id);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(cash_in_cash_out.id);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (stock_in:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Tax ${stock_in.in_number}  ${stock_in.in_date}`,
                buttons: actionSheetButtons(stock_in)
            });
            await actionSheet.present();
        };
        //#endregion
        const handleDelete = async (id: number) => {
            try {
                const result = await deleteCashInCashOut(id)
                if(result.success){
                    await presentToast('CashIn / CashOut deleted successfully');
                    await fetchList()
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        };
        const handleEdit = (id: number) => {
            router.push(`/activity/cash-in-cash-out/details/${id}`);
        }

        async function handleNew() {
            try {
                const result = await addNewCashInCashOut()
                if(result.success){
                    router.push(`/activity/cash-in-cash-out/details/${result.data}`)
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
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
            cash_in_cash_outs,

            openActionSheet,
            handleNew
        }
    }
})
</script>