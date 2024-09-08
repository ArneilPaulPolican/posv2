<template>
    <ion-page>
        <ion-item>
            <ion-label position="stacked">Search Billed Out Sales</ion-label>
            <ion-searchbar placeholder="Enter Keyword"> </ion-searchbar>
        </ion-item>
        <ion-item>
            <ion-chip>
                Date: &nbsp;
                <ion-label>{{ date_today.toLocaleDateString() }}</ion-label>
                <ion-icon :icon="icons.calendarNumberOutline"></ion-icon>
            </ion-chip>
            <ion-chip>
                Terminal: &nbsp;
                <ion-label>{{ terminal }}</ion-label>
                <ion-icon :icon="icons.terminalOutline"></ion-icon>
            </ion-chip>
        </ion-item>
        <ion-content :fullscreen="true">
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="sales in sales_list" :key="sales.id" @click="openActionSheet(sales)">
                    <ion-label>
                        <h2>{{ sales.sales_number }}</h2>
                        <h2>{{ sales.sales_date }}</h2>
                        <p>{{ sales.customer }}</p>
                    </ion-label>
                    <ion-label slot="end" >
                        <h2>{{ sales.net_amount }}<ion-note>/Amnt.</ion-note></h2>
                        <h2>{{ sales.balance_amount }}<ion-note>/Bal.</ion-note></h2>
                        <p>{{ sales.status }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>

        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { SALES_DTO } from '@/models/sales.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.service';
import { cancelSales, getBilledSales, getOpenSales, getSales } from '@/services/activity/sales.service';
import { onIonViewDidEnter, actionSheetController } from '@ionic/vue';
import { defineComponent, onActivated, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
    components:{
    },
    setup(){
        const router = useRouter();
        const date_today: Date = new Date();
        const terminal = '001'
        const sales_list = ref<SALES_DTO[]>([]);
        
        //#region   Actionsheet
        const actionSheetButtons = (sales:any) => [
            {
                text: 'View',
                handler: () => {
                    handleView(sales);
                },
                data: {
                    action: 'view',
                },
            },
            {
                text: 'Cancel',
                handler: () => {
                    handleCancel(sales);
                },
                data: {
                    action: 'cancel',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (sales:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for sales ${sales.sales_number}`,
                buttons: actionSheetButtons(sales)
            });
            await actionSheet.present();
        };
        //#endregion
        const handleView = (sales: any) => {
            router.push(`/Activity/Sales/Details/${sales.id}`);
        };
        const handleCancel = async (sales: any) => {
            try {
                const result = await cancelSales(sales)
                if(result.success){
                    await presentToast('Cancelation successful')
                }else{
                    await presentToast('Cancelation failed')
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`);
            }
        }

        async function fetchData() {
            try {
                const result = await getBilledSales();
                if(result.success){
                    sales_list.value = result.data
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }
        
        onIonViewDidEnter(async () => {
            await fetchData()
        });
        // onMounted(async () =>{
        //     // await fetchData()
        // })
        return{
            icons,
            date_today,
            terminal,
            sales_list,

            openActionSheet
        }
    }
});
</script>