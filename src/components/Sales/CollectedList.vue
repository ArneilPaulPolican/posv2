<template>
    <ion-page>
        <ion-item>
            <ion-label position="stacked">Search Collected Sales</ion-label>
            <ion-searchbar v-model="search_key"  @ionChange="fetchList" placeholder="Enter Keyword"> </ion-searchbar>
        </ion-item>
        <ion-modal :keep-contents-mounted="false" :is-open="salesDateModalOpen" style="margin-top: 65px;">
            <ion-datetime format="MM/dd/yyyy" @ionChange="onSalesDateChange($event.detail.value)"></ion-datetime>
        </ion-modal>
        <ion-item>
            <ion-chip @click="openStartDateModal()">
                Date: &nbsp;
                <ion-label>{{ date_today }}</ion-label>
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
                        <h2>{{ sales.sales_number }} {{ sales.sales_date }}</h2>
                        <p>{{ sales.customer }}</p>
                    </ion-label>
                    <ion-label slot="end" >
                        <h2>{{ sales.total_amount }}<ion-note>/Amnt.</ion-note></h2>
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
import { presentToast } from '@/composables/toast.composables';
import { getCollectedSales, getOpenSales, getSales } from '@/services/activity/sales.service';
import { onIonViewDidEnter, actionSheetController } from '@ionic/vue';
import { defineComponent, onActivated, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Storage } from '@capacitor/storage';


export default defineComponent({
    components:{
    },
    setup(){
        const router = useRouter();
        const date_today = ref('');
        const terminal = '001'
        const sales_list = ref<SALES_DTO[]>([]);
        
        const page = ref(1);
        const page_size = ref(10);
        const search_key = ref('')
        const salesDateModalOpen = ref(false)
        
        //#region   Actionsheet
        const actionSheetButtons = (sales:any) => [
            {
                text: 'Open',
                handler: () => {
                    handleOpen(sales);
                },
                data: {
                    action: 'Open',
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
        const handleOpen = (sales: any) => {
            router.push(`/Activity/Sales/Details/${sales.id}`);
        }

        async function openStartDateModal() {
            salesDateModalOpen.value = true;
        }
        const onSalesDateChange = async (selectedDate: Date) => {
            const _date = new Date(selectedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                    });
            console.log('test',_date)
            date_today.value = _date;
            salesDateModalOpen.value = false
            await fetchList();
        }
        async function fetchList() {
            try {
                const login_date = await Storage.get({ key: 'login_date' });
                date_today.value = login_date.value ?? new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                const result = await getCollectedSales();
                if(result.success){
                    sales_list.value = result.data
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }
        
        onIonViewDidEnter(async () => {
            // date_today.value = new Date().toLocaleDateString('en-US', {
            //     year: 'numeric',
            //     month: '2-digit',
            //     day: '2-digit'
            // });
            await fetchList()
        });
        onMounted(async () =>{
            // date_today.value = new Date().toLocaleDateString('en-US', {
            //     year: 'numeric',
            //     month: '2-digit',
            //     day: '2-digit'
            // });
            await fetchList()
        })
        return{
            icons,
            terminal,
            sales_list,

            openActionSheet,
            fetchList,
            openStartDateModal,
            onSalesDateChange,

            salesDateModalOpen,
            page,
            page_size,
            search_key,
            date_today,
        }
    }
});
</script>