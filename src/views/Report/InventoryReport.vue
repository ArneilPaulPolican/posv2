<template>
    <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button @click="handlePrint">
                <ion-icon :icon="icons.printSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <!-- <ion-item>
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
        </ion-modal> -->
        <ion-content :fullscreen="true">
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="inventory in inventories" :key="inventory.id" >
                    <ion-grid>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label>
                                    <h2>{{ inventory.trx_type }}-{{ inventory.reference }}</h2>
                                    <p>{{ inventory.trx_date }}</p>
                                </ion-label>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label>
                                    <p>{{ inventory.item_barcode }}</p>
                                    <p>{{ inventory.item_description }}</p>
                                    <p>Qty: {{ inventory.quantity }}</p>
                                    <p>Cost: {{ inventory.cost }}</p>
                                    <p>Price: {{ inventory.price }}</p>
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
import { SYS_INVENTORY_DTO } from '@/models/sys-inventory.model';
import { icons } from '@/plugins/icons';
import { getSales } from '@/services/activity/sales.service';
import { generateSalesDetailReport, getSalesDetailReport } from '@/services/report/sales-details-report.service';
import { generateInventoryReport } from '@/services/report/sys-inventory-report.service';
import { getInventoryReport } from '@/services/sys-inventory.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
    setup(){

        const inventories = ref<SYS_INVENTORY_DTO[]>([])
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
                await generateInventoryReport();
            } catch (error) {
                await presentToast(`Operation failed${error}`)
            }
        }
        
        async function fetchList() {
            try {
                // const result = await getSalesDetailReport(start_date.value, end_date.value);
                const result = await getInventoryReport()
                if(result.success && result.data){
                    console.log(result.data)
                    inventories.value = result.data;
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
            inventories,

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