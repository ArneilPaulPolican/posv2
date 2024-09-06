<template>
    <ion-page>
        <ion-item>
            <ion-label position="stacked">Search Sales</ion-label>
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
                        <p>{{ sales.sales_date }}</p>
                        {{ sales.customer }}
                    </ion-label>
                    <ion-label slot="end" >
                        <h2>{{ sales.net_amount?.toFixed(2) }}<ion-note> / Net</ion-note> </h2>
                        {{ sales.balance_amount?.toFixed(2) }}<ion-note> / Bal</ion-note> 
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
import { getOpenSales, getSales } from '@/services/activity/sales.service';
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
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(sales);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(sales);
                },
                data: {
                    action: 'Edit',
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
        const handleDelete = (tax: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (sales: any) => {
            router.push(`/Activity/Sales/Details/${sales.id}`);
        }

        async function fetchData() {
            const response = await getOpenSales()
            sales_list.value = response
        }
        
        onIonViewDidEnter(async () => {
            await fetchData()
        });
        onMounted(async () =>{
            await fetchData()
        })
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