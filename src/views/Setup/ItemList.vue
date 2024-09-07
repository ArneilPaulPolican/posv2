<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-nav-link router-direction="forward" :component="component">
                <ion-fab-button size="small" @click="addNewItem">
                    <ion-icon :icon="icons.addSharp"></ion-icon>
                </ion-fab-button>
            </ion-nav-link>
        </ion-fab>

        <ion-item>
            <!-- Search Input -->
             <ion-label position="stacked">Search Item</ion-label>
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="item in items" :key="item.item_code" @click="openActionSheet(item)">
                    <ion-avatar aria-hidden="true" slot="start">
                        <ion-icon aria-hidden="true" slot="start" :name="icons.imageOutline"></ion-icon>
                    </ion-avatar>
                    <ion-label>
                        <h2>{{ item.bar_code }}</h2>
                        <p>{{ item.item_description }}</p>
                        <p>{{ item.generic_name }}</p>
                    </ion-label>
                    <ion-label slot="end">
                        <p v-if="item.is_locked">Active</p><p v-else>Inactive</p>
                        <p v-if="item.is_inventory">Inventory</p> <p v-else>Non-inventory</p>
                        <p>{{ item.quantity }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>


<script lang="ts">
import { icons } from '@/plugins/icons';
import { markRaw } from 'vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Lock } from '@/services/lock';
import { DBConnectionService } from '@/services/database.connection';
import { addItem, getItems } from '@/services/setup/item.service';

import ITEM_DTO, { ITEM } from '@/models/item.model';
import { addUnit } from '@/services/system/unit.service';
import { addTax } from '@/services/system/tax.service';
import { UNIT } from '@/models/unit.model';
import { TAX } from '@/models/tax.model';
import ItemDetail from './ItemDetail.vue';
import { presentToast } from '@/composables/toast.service';

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
        const item = ref<ITEM>({
            id:0,
            item_code: 'NA',
            bar_code: 'NA',
            item_description: 'NA',
            alias: 'NA',
            category: 'NA',
            price: 0,
            cost: 0,
            quantity: 0,
            unit_id: 1,
            is_inventory: false,
            generic_name: 'NA',
            tax_id: 1,
            remarks: 'NA',
            image_path: 'NA',
            is_package: false,
            is_locked: false,
            expiry_date:'NA',
            lot_number:'NA'
        });

        const imagePath = ref('');
        const dbLock = new Lock(); // Create a new lock
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
            is_inclusive: false
        });

        //#region   Actionsheet
        const actionSheetButtons = (item:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(item);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(item);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (item:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Item ${item.bar_code}  ${item.item_description}`,
                buttons: actionSheetButtons(item)
            });
            await actionSheet.present();
        };
        //#endregion

        //#region  EVENTS
        const handleDelete = (item: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (item: any) => {
            router.push(`/Setup/Item/Details/${item.id}`);
        }
        //#endregion


        const addNewItem = async() => {
            try {
                const result = await addItem(item.value, '')
                if(result.success){
                    router.push(`/Setup/Item/Details/${result.insertedId}`);
                }
            } catch (error) {
                await presentToast(`Erroe adding new item ${error}`)
            }
        }
        
        async function fetchList() {
            const result = await getItems()
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
            component: markRaw(ItemDetail),

            items,
            imagePath,
            
            // events
            addNewItem,

            openActionSheet,
            handleDelete,
            handleEdit,
        }
    },
}
</script>