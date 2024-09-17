<template>
    <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button :disabled="is_locked" size="small" position="stacked"  @click="openItemModal">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>
        <ion-item style="position: relative;">
            <div style="display: flex; overflow-x: auto; white-space: nowrap; width: 100%; padding-right: 10px;height: 100%">
                <ion-button size="medium" expand="block" style="height: 90%" @click="handleReturn">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                        <ion-label>Back</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" size="medium" expand="block" style="height: 90%" @click="handleSave">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.saveSharp"></ion-icon>
                        <ion-label>Save</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" size="medium" expand="block" style="height: 90%" @click="handleLock">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label>Lock</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="is_locked" size="medium" expand="block" style="height: 90%" @click="handleUnlock">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label>Unlock</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="is_locked" size="medium" expand="block" style="height: 90%" @click="handlePrint()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.printSharp"></ion-icon>
                        <ion-label>Print</ion-label>
                    </div>
                </ion-button>
            </div>
        </ion-item>
        
        <ion-item >
            <h1 slot="end">
                {{ stock_in.in_number }}
            </h1>
        </ion-item>


        <ion-content :fullscreen="true">
            <ion-list :inset="true" style="margin: 5px">
                <ion-item>
                    
                    <ion-row>
                        <ion-col size="6">
                            <ion-label position="stacked">Date</ion-label>
                            <ion-input :disabled="is_locked" :readonly="true" v-model="stock_in.in_date" ></ion-input>
                        </ion-col>
                        <ion-col size="6">
                            <ion-label position="stacked">Status</ion-label>
                            <ion-input :disabled="is_locked" v-model="stock_in.status" placeholder="New" ></ion-input>
                        </ion-col>
                    </ion-row>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Remarks</ion-label>
                    <ion-textarea :disabled="is_locked" v-model="stock_in.remarks" placeholder="Remarks" ></ion-textarea>
                </ion-item>
            </ion-list>
            
            <ion-item>
                <ion-label position="stacked">Barcode</ion-label>
                <ion-input  placeholder="00000000001"></ion-input>
            </ion-item>
            
            <ion-list :inset="true" style="margin: 5px">
                <div style="padding: 5px;" v-for="item in stock_in_items" :key="item.id"  @click="!is_locked && openActionSheet(item)">
                    <ion-item >
                        <ion-label>
                            <p>{{ item.item_barcode }}</p>
                            <h1>{{ item.item_description }}</h1>
                        </ion-label>
                    </ion-item>
                    <ion-item >
                        <div style="width: 50px; height: 50px; overflow: hidden;">
                            <img alt="" :src="item.item_image_path" style="width: 100%; height: 100%; object-fit: cover;"/>
                        </div>
                        &nbsp;
                        <ion-label slot="end">
                            <p>Cost:&nbsp;{{ item.cost?.toFixed(2) }}</p>
                            <p>Qty:&nbsp;{{ item.quantity }}</p>
                            <p>Amount:&nbsp;{{ item.amount?.toFixed(2) }}</p>
                        </ion-label>
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { STOCK_IN, STOCK_IN_DTO } from '@/models/stock-in.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.composables';
import { getStockInById, getStockIn, getLastINNumber, addStockIn, updateStockIn, lockStockIn, unlockStockIn } from '@/services/activity/stock-in.service';
import { actionSheetController, modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, readonly, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ItemListModal from '@/components/Modal/ItemListModal.vue';
import { addBulkStockInItem, deleteStockInItem, getStockInItemsByINId } from '@/services/activity/stock-in-items.service';
import { STOCK_IN_ITEMS_DTO } from '@/models/stock-in-item.model';
import StockInItemDetailsModal from '@/components/Modal/StockInItemDetailsModal.vue';
import { onLockRecordInventory, onUnlockUpdateItemInventory } from '@/composables/inventory';
import { generateStockInReceipt } from '@/services/receipt/stock-in-receipt.service';


export default defineComponent({
    setup(){
        const route = useRoute();
        const router = useRouter();
        const stock_in_items = ref<STOCK_IN_ITEMS_DTO[]>([]);
        const stock_in = ref<STOCK_IN_DTO>({
            id: 0,
            user_id: 0,
            user: '',
            in_number: '',
            in_date: '',
            remarks: '',
            status: '',
            is_locked:false
        });
        const stocki_in_id = ref(0);
        const in_number = ref('');
        const is_locked = ref(false);

        
        //#region   Actionsheet
        const actionSheetButtons = (item: STOCK_IN_ITEMS_DTO) => [
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
        const openActionSheet = async (item:any) => {
            const actionSheet = await actionSheetController.create({
                header: `Options for Item ${item.item_barcode}  ${item.item_description}`,
                buttons: actionSheetButtons(item)
            });
            await actionSheet.present();
        };
        //#endregion
        
        // Open Item Modal
        const openItemModal = async () => {
            const modal = await modalController.create({
            component: ItemListModal,
            componentProps: { data: stock_in, trx: 'IN' } 
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                if (data && data._rawValue) { // Check if data is a ref object with _rawValue property
                    const stock_in_items = data._rawValue; // Get the array of SALES_ITEM_DTO objects
                    console.log(`Received data: ${JSON.stringify(stock_in_items)}`);
                    await addBulkStockInItem(stock_in.value.id, stock_in_items); // add new selected items
                    await handleSave(); // Save with updated total_amount
                } else {
                    console.error('Error: data is not a ref object with _rawValue property');
                }
            }
        };

        
        async function handleDelete(item: STOCK_IN_ITEMS_DTO) {
            try {
                const result = await deleteStockInItem(item.id)
                if(result.success){
                    await presentToast(`Item deleted successfully`);
                    await fetchDetails()
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`);
            }
        }
        
        // Open Item Modal
        const handleEdit = async (item: STOCK_IN_ITEMS_DTO) => {
            const modal = await modalController.create({
            component: StockInItemDetailsModal,
            componentProps: { stock_in: stock_in, stock_in_item: item } 
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                if (data && data._rawValue) { // Check if data is a ref object with _rawValue property
                    const stock_in_items = data._rawValue; // Get the array of SALES_ITEM_DTO objects
                    console.log(`Received data: ${JSON.stringify(stock_in_items)}`);
                    await handleSave(); // Save with updated total_amount
                } else {
                    console.error('Error: data is not a ref object with _rawValue property');
                }
            }
        };


        async function handleReturn() {
            router.push(`/activity/stock-in`);
        }

        async function handleLock() {
            try {
                const inventory_result = await onLockRecordInventory(stock_in_items.value, stock_in.value.id , 'IN', stock_in.value.in_date, stock_in.value.in_number)
                if(inventory_result.success){
                    const result = await lockStockIn(stock_in.value)
                    if(result.success){
                        is_locked.value = true;
                        await presentToast('Stock In lock succesfully')
                        await fetchDetails()
                    }
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
                await handleUnlock();
            }
        }
        
        async function handleUnlock() {
            try {
                const inventory_result =  await onUnlockUpdateItemInventory('IN', stock_in.value.id, stock_in.value.in_date, stock_in.value.in_number)
                if(inventory_result.success){
                    const result = await unlockStockIn(stock_in.value)
                    if(result.success){
                        is_locked.value = false;
                        await presentToast('Stock In unlock succesfully')
                        await fetchDetails()
                    }
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }


        async function handleSave() {
            try {
                const response = await updateStockIn(stock_in.value)
                if(response.success){
                    await presentToast('Update Stock In successful');
                    await fetchDetails();
                }else{
                    await presentToast('Update Stock In failed')
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        async function handlePrint() {
            try {
                await generateStockInReceipt(stock_in.value, stock_in_items.value)
            } catch (error) {
                await presentToast(`Operation failed ${error}`);
            }
        }
        async function fetchDetails() {
            const routeParams = +route.params.id;
            stocki_in_id.value = routeParams;
            try {
                const response = await getStockInById(stocki_in_id.value)
                if(response.success){
                    is_locked.value = response.data?.is_locked;

                    stock_in.value ={
                        id: response.data?.id,
                        user_id: response.data?.user_id,
                        user: '',
                        in_number: response.data?.in_number,
                        in_date: response.data?.in_date,
                        remarks: response.data?.remarks,
                        status: response.data?.status,
                        is_locked: response.data?.is_locked
                    }

                    const item_result =await getStockInItemsByINId(stocki_in_id.value);
                    if(item_result.success){
                        stock_in_items.value = item_result.data;
                    }
                }else{
                    await presentToast(`No Stock In found`)
                } 
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        onMounted(async()=>{
            await fetchDetails()
        })
        onIonViewDidEnter(async()=>{
            await fetchDetails()
        })
        return{
            icons,
            stock_in,
            in_number,
            stocki_in_id,
            is_locked,
            stock_in_items,

            handleReturn,
            handleSave,
            handleLock,
            handleUnlock,
            handlePrint,
            openItemModal,
            openActionSheet
        }
    }
})
</script>