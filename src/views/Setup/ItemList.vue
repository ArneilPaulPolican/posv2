<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        <!-- <ion-fab slot="fixed" vertical="top" horizontal="end">
            <ion-nav-link router-direction="forward" :component="component">
                <ion-fab-button size="small" @click="addNewItem">
                    <ion-icon :icon="icons.addSharp"></ion-icon>
                </ion-fab-button>
            </ion-nav-link>
        </ion-fab> -->

        <ion-item>
            <!-- Search Input -->
             <!-- <ion-label label="Barcode" label-placement="floating">Search Item</ion-label> -->
            <ion-searchbar label="Barcode" label-placement="floating" v-model="search_key" @ionChange="fetchList" placeholder="Enter keyword"></ion-searchbar> 
            <ion-button size="small" expand="block" style="height: 70%"
                    @click="addNewItem()">
                    <ion-icon :icon="icons.addOutline"></ion-icon>
                    <ion-label>Add</ion-label>
            </ion-button>
        </ion-item>
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                 <div v-for="item in items" :key="item.item_code" @click="openActionSheet(item)">
                    <ion-item>
                        <h3>{{ item.item_description }}</h3>
                    </ion-item>
                    <ion-item>
                        <ion-avatar aria-hidden="true" slot="start">
                            <img :src="item.image_path" />
                        </ion-avatar>
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
                    </ion-item>
                 </div>
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
import { addItem, deleteItem, getItems, getTransaction } from '@/services/setup/item.service';

import ITEM_DTO, { ITEM } from '@/models/item.model';
import { addUnit } from '@/services/system/unit.service';
import { addTax } from '@/services/system/tax.service';
import { UNIT } from '@/models/unit.model';
import { TAX } from '@/models/tax.model';
import ItemDetail from './ItemDetail.vue';
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
            is_vat_inclusive: false,
            generic_name: 'NA',
            tax_id: 1,
            remarks: 'NA',
            image_path: 'NA',
            is_package: false,
            is_locked: false,
            expiry_date:'NA',
            lot_number:'NA'
        });
        const page = ref(1);
        const page_size = ref(10);
        const search_key = ref('')

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
            sort_no:0
        });

        //#region   Actionsheet
        const actionSheetButtons = (item:any) => [
            {
                icon: icons.trashOutline,
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
                icon: icons.pencil,
                text: 'Edit',
                handler: () => {
                    handleEdit(item);
                },
                data: {
                    action: 'Edit',
                },
            },
            {
                icon: icons.closeCircleOutline,
                text: 'Cancel',
                handler: () => {
                    // handleEdit(item);
                },
                data: {
                    action: 'Cancel',
                },
            },
            {
                text: '',
                handler: () => {
                    // handleEdit(item);
                },
                data: {
                    action: '',
                },
            },
            
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (item:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Item ${item.bar_code}  ${item.item_description}`,
                buttons: actionSheetButtons(item),
            });
            await actionSheet.present();
        };
        //#endregion

        //#region  EVENTS
        const handleDelete = async (item: any) => {
            // throw new Error('Function not implemented.');
            try {
                const checkTransaction = await getTransaction(item.id);
                if(checkTransaction.exist){
                    await presentToast(`Unable to delete Item associated with transaction.`);
                    return;
                }
                const result = await deleteItem(item.id)
                if(result.success){
                    await presentToast(`Item deleted successfully`);
                }else{
                    await presentToast(`Item deleted unsuccessfully ${result.message}`);
                }
                await fetchList();
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        };
        const handleEdit = (item: any) => {
            router.push(`/Setup/Item/Details/${item.id}`);
        }
        //#endregion


        const addNewItem = async() => {
            try {
                const result = await addItem(item.value)
                if(result.success){
                    router.push(`/Setup/Item/Details/${result.data}`);
                }
            } catch (error) {
                await presentToast(`Erroe adding new item ${error}`,'middle', 3000)
            }
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
            component: markRaw(ItemDetail),
            fetchList,

            items,
            imagePath,
            
            // events
            addNewItem,

            openActionSheet,
            handleDelete,
            handleEdit,

            
            page,
            page_size,
            search_key,
        }
    },
}
</script>