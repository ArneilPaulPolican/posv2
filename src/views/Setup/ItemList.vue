<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-nav-link router-direction="forward" :component="component">
                <ion-fab-button size="small" @click="openItemDetailForm">
                    <ion-icon :icon="icons.addSharp"></ion-icon>
                </ion-fab-button>
            </ion-nav-link>
        </ion-fab>

        <ion-item>
            <!-- Search Input -->
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="item in items" :key="item.item_code" @click="openActionSheet(item)">
                    <ion-avatar aria-hidden="true" slot="start">
                        <!-- <img alt="" v-if="item.image" :src="item.image" /> -->
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

import { ITEM } from '@/models/item.model';
import { addUnit } from '@/services/system/unit.service';
import { addTax } from '@/services/system/tax.service';
import { UNIT } from '@/models/unit.model';
import { TAX } from '@/models/tax.model';
import ItemDetail from './ItemDetail.vue';

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
            item_code: '002',
            item_description: 'sample 1',
            bar_code: '002',
            alias: 'NA',
            category: 'NA',
            price: 0,
            cost: 0,
            quantity: 0,
            unit_id: 0,
            is_inventory: false,
            generic_name: 'NA',
            tax_id: 0,
            remarks: 'NA',
            image_path: '', // This will be set by processedImageSavePath
            is_package: false,
            is_locked: false,
            expiry_date:'',
            lot_number:''
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

        // add data
        const addData = async () => {
            try {
                const response = await addItem(item.value, imagePath.value);
                if(response){
                    console.log('Item successfully created')
                }else{
                    console.error('Item adding failed')
                }
            } catch (err) {
                dbLock.release(); // Release the lock after the operation
                console.error('Error adding data:', err)
            }
        }

        const openItemDetailForm = async() => {
            router.push(`/Setup/Item/Details/0`);
        }

        
        async function fetchList() {
            items.value = await getItems()
            console.log(items.value)
            console.log('get items ',JSON.stringify(items.value));
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
            addData,
            openItemDetailForm,

            openActionSheet,
            handleDelete,
            handleEdit,
        }
    },
}
</script>