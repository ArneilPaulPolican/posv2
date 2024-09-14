<template>
    <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button @click="handlePrint">
                <ion-icon :icon="icons.printSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-item>
            <ion-button @click="openStartDateModal()" size="medium" expand="block" style="height: 90%">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.calendar"></ion-icon>
                    <ion-label>{{ start_date }}</ion-label>
                </div>
            </ion-button>
            <ion-button @click="openEndDateModal()" size="medium" expand="block" style="height: 90%">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.calendar"></ion-icon>
                    <ion-label>{{ end_date }}</ion-label>
                </div>
            </ion-button>
        </ion-item>
        <ion-modal :keep-contents-mounted="true" :is-open="startDteModalOpen" style="margin-top: 65px;">
            <ion-datetime format="MM/dd/yyyy" @ionChange="onStartDateChange($event.detail.value)"></ion-datetime>
        </ion-modal>
        <ion-modal :keep-contents-mounted="true" :is-open="endDteModalOpen" style="margin-top: 65px;">
            <ion-datetime format="MM/dd/yyyy" @ionChange="onEndDateChange($event.detail.value)"></ion-datetime>
        </ion-modal>
        <ion-content :fullscreen="true">
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="sales in sales_detail_report" :key="sales.id" >
                    <ion-grid>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label>
                                    <h2>SI-{{ sales.sales_number }}</h2>
                                    <p>{{ sales.sales_date }}</p>
                                    <p v-if="sales.is_locked">Locked</p><p v-else>Unlocked</p>
                                    <p>{{ sales.remarks }}</p>
                                    <p>{{ sales.customer }}</p>
                                    <p>{{ sales.discount }}</p>
                                </ion-label>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label>
                                    <p>{{ sales.item_barcode }}</p>
                                    <p>{{ sales.item_description }}</p>
                                    <p>Qty: {{ sales.quantity }}</p>
                                    <p>Cost: {{ sales.item_cost }}</p>
                                    <p>Price: {{ sales.price }}</p>
                                    <p>Net Price: {{ sales.net_price }}</p>
                                </ion-label>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { presentToast } from '@/composables/toast.service';
import { SALES_DETAILS_REPORT_DTO } from '@/models/sales-detail-report.model';
import { SALES_DTO } from '@/models/sales.model';
import { icons } from '@/plugins/icons';
import { getSales } from '@/services/activity/sales.service';
import { generateSalesDetailReport, getSalesDetailReport } from '@/services/report/sales-details-report.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
    setup(){

        const sales_detail_report = ref<SALES_DETAILS_REPORT_DTO[]>([])
        const sales = ref<SALES_DTO[]>([])
        const start_date = ref(new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                    }))
        const end_date = ref(new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
                }))
        const startDteModalOpen = ref(false)
        const endDteModalOpen = ref(false)

        async function openStartDateModal() {
            startDteModalOpen.value = true;
        }
        const onStartDateChange = async (selectedDate: Date) => {
            const _date = new Date(selectedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                    });
            console.log('test',_date)
            start_date.value = _date;
            startDteModalOpen.value = false;
            await fetchList();
        }
        
        async function openEndDateModal() {
            endDteModalOpen.value = true;
        }
        const onEndDateChange = async (selectedDate: Date) => {
            const _date = new Date(selectedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                    });
            console.log('test',_date)
            end_date.value = _date;
            endDteModalOpen.value = false;
            await fetchList();
        }

        async function handlePrint() {
            try {
                await generateSalesDetailReport(start_date.value, end_date.value);
            } catch (error) {
                await presentToast(`Operation failed${error}`)
            }
        }
        
        async function fetchList() {
            try {
                const result = await getSalesDetailReport(start_date.value, end_date.value);
                if(result.success){
                    console.log(result.data)
                    sales_detail_report.value = result.data;
                }
            } catch (error) {
                await presentToast(`Operation failed${error}`)
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
            sales_detail_report,

            start_date,
            end_date,
            startDteModalOpen,
            endDteModalOpen,
            openStartDateModal,
            onStartDateChange,

            openEndDateModal,
            onEndDateChange,
            handlePrint
        }
    }
});
</script>