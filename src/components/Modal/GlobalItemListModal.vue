<template>
    <ion-page style="margin-top: 65px;">
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Select Item</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-item>
             <!-- <ion-label label="Barcode" label-placement="floating">Search Item</ion-label> -->
            <ion-searchbar label="Barcode" label-placement="floating" v-model="search_key" @ionChange="fetchList" placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                 <div v-for="item in items" :key="item.item_code" >
                    <ion-item>
                        <h3>{{ item.item_description }}</h3>
                    </ion-item>
                    <ion-item>
                        <ion-grid>
                            <ion-row>
                                <ion-col>
                                    <ion-button size="medium" @click="handlePickedItem(item)">
                                        <ion-label>Pick</ion-label>
                                    </ion-button>
                                </ion-col>
                                <ion-col  size="9">
                                    <ion-label>
                                        <p>{{ item.item_code }}</p>
                                        <p>{{ item.bar_code }}</p>
                                        <p v-if="item.is_locked">Locked</p><p v-else>Unlocked</p>
                                    </ion-label>
                                    <ion-label slot="end">
                                        <p v-if="item.is_inventory">Inv.</p> <p v-else>Non-Inv.</p>
                                        <p>Qty: {{ item.quantity }}</p>
                                        <p>Cost: {{ item.cost }}</p>
                                        <p>Price: {{ item.price }}</p>
                                    </ion-label>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                 </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>


<script lang="ts">
import { icons } from '@/plugins/icons';
import { markRaw } from 'vue';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Lock } from '@/services/lock';
import {  getItems } from '@/services/setup/item.service';

import ITEM_DTO, { ITEM } from '@/models/item.model';
import { modalController } from '@ionic/vue';
import { UNIT } from '@/models/unit.model';
import { TAX } from '@/models/tax.model';
import { presentToast } from '@/composables/toast.composables';

// Define the interface for your data
interface DemoTableRow {
  id: number
  name: string
  value: number
}

export default {
name: 'DashboardView', // Update the component name here
    components: { 
        // HeaderComponent
    },
    setup() {
        const router = useRouter();
        const items = ref<ITEM[]>([])
        const page = ref(1);
        const page_size = ref(10);
        const search_key = ref('')

        const imagePath = ref('');
        // const db_connection = await DBConnectionService.getInstance();
        const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)

        const unit = ref<UNIT>({
            id:0,
            unit_code: 'Pc(s)',
            unit:'Pieces'
        });
        const tax = ref<TAX>({
            id:0,
            tax_code: 'NonVAT',
            tax:'None Vat',
            rate:0,
            sort_no:0
        });

        const cancel = () => modalController.dismiss('', 'cancel');
        const handlePickedItem = (item:ITEM) => {
            modalController.dismiss(item , 'confirm');
        }

        async function fetchList() {
            const result = await getItems(page.value, page_size.value, search_key.value)
            if(result.success){
                items.value = result.data;
            }else{
                await presentToast('No item found');
            }
        }
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        onMounted(async () => {
            await fetchList()
        });
        return {
            header:'Item List',
            icons,
            // item_obersvable,
            // component: markRaw(ItemDetail),
            fetchList,

            items,
            imagePath,

            handlePickedItem,
            cancel,
            
            page,
            page_size,
            search_key,
        }
    },
}
</script>