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
                        <ion-icon :icon="icons.arrowBackSharp"></ion-icon>&nbsp;
                        <ion-label>Back</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" size="medium" expand="block" style="height: 90%" @click="handleSave">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.saveSharp"></ion-icon>&nbsp;
                        <ion-label>Save</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" size="medium" expand="block" style="height: 90%" @click="handleLock">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.lockClosedSharp"></ion-icon>&nbsp;
                        <ion-label>Lock</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="is_locked" size="medium" expand="block" style="height: 90%" @click="handleUnlock">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.lockClosedSharp"></ion-icon>&nbsp;
                        <ion-label>Unlock</ion-label>
                    </div>
                </ion-button>
            </div>
        </ion-item>
        <ion-item >
            <h1 slot="end">
                {{ stock_out.out_number }}
            </h1>
        </ion-item>

        <ion-content :fullscreen="true">
            <ion-list :inset="true" style="margin: 5px">
                <ion-item>
                    <ion-row>
                        <ion-col size="6">
                            <ion-label position="stacked">Date</ion-label>
                            <ion-input :disabled="is_locked" :readonly="true" v-model="stock_out.out_date" ></ion-input>
                        </ion-col>
                        <ion-col size="6">
                            <ion-label position="stacked">Status</ion-label>
                            <ion-input :disabled="is_locked" v-model="stock_out.status" placeholder="New" ></ion-input>
                        </ion-col>
                    </ion-row>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Remarks</ion-label>
                    <ion-input :disabled="is_locked" v-model="stock_out.remarks" placeholder="Remarks" ></ion-input>
                </ion-item>
            </ion-list>
            
            <ion-item>
                <ion-label position="stacked">Barcode</ion-label>
                <ion-input  placeholder="00000000001"></ion-input>
            </ion-item>
            
            <ion-list :inset="true" style="margin: 5px">
                <div style="padding: 5px;" v-for="item in stock_out_items" :key="item.id"  @click="!is_locked && openActionSheet(item)">
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
import { STOCK_OUT, STOCK_OUT_DTO } from '@/models/stock-out.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.service';
import {  deleteStockOut, getStockOutById, lockStockOut, unlockStockOut, updateStockOut } from '@/services/activity/stock-out.service';
import { actionSheetController, modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, readonly, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { STOCK_OUT_ITEMS_DTO } from '@/models/stock-out-item.model';
import ItemListModal from '@/components/Modal/ItemListModal.vue';
import { addBulkStockOutItem, deleteStockOutItem, getStockOutItemsByOUTId } from '@/services/activity/stock-out-items.service';
import StockoutItemDetailsModal from '@/components/Modal/StockoutItemDetailsModal.vue';


export default defineComponent({
    setup(){
        const route = useRoute();
        const router = useRouter();
        const stock_out = ref<STOCK_OUT>({
            id: 0,
            user_id: 0,
            out_number:'',
            out_date: '',
            remarks: '',
            status: ''
        });
        const stock_out_items = ref<STOCK_OUT_ITEMS_DTO[]>([]);
        const stock_out_id = ref(0);
        const out_number = ref('');
        const is_locked = ref(false);

        
        //#region   Actionsheet
        const actionSheetButtons = (item: STOCK_OUT_ITEMS_DTO) => [
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
        //#endregion.

        const handleDelete = async (item: STOCK_OUT_ITEMS_DTO) => {
            try {
                const result = await deleteStockOutItem(item.id)
                if(result.success){
                    await presentToast('Item deleted successfully');
                    await fetchDetails();
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`);
            }
        }
        const handleEdit = async (item: STOCK_OUT_ITEMS_DTO) => {
            const modal = await modalController.create({
            component: StockoutItemDetailsModal,
            componentProps: { stock_out: stock_out, stock_out_item: item } 
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                if (data && data._rawValue) { // Check if data is a ref object with _rawValue property
                    const stock_in_items = data._rawValue; // Get the array of SALES_ITEM_DTO objects
                    await fetchDetails();
                } else {
                    console.error('Error: data is not a ref object with _rawValue property');
                }
            }
        }
        // Open Item Modal
        const openItemModal = async () => {
            const modal = await modalController.create({
            component: ItemListModal,
            componentProps: { data: stock_out, trx: 'OUT' } 
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                if (data && data._rawValue) { // Check if data is a ref object with _rawValue property
                    const stock_out_items = data._rawValue; // Get the array of SALES_ITEM_DTO objects
                    await addBulkStockOutItem(stock_out.value.id, stock_out_items); // add new selected items
                    await fetchDetails();
                } else {
                    console.error('Error: data is not a ref object with _rawValue property');
                }
            }
        };
        async function handleReturn() {
            router.push(`/activity/stock-out`);
        }

        async function handleLock() {
            try {
                const result = await lockStockOut(stock_out.value);
                if(result.success){
                    is_locked.value = true;
                    await presentToast(`Stock In lock successfully`);
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`);
            }
        }
        
        async function handleUnlock() {
            try {
                const result = await unlockStockOut(stock_out.value);
                if(result.success){
                    is_locked.value = false;
                    await presentToast(`Stock In lock successfully`);
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`);
            }
        }

        async function handleSave() {
            try {
                const result = await updateStockOut(stock_out.value)
                if(result.success){
                    await presentToast('Stock Out successfully updated');
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }

        async function fetchDetails() {
            const routeParams = +route.params.id;
            stock_out_id.value = routeParams ; 

            try {
                const result = await getStockOutById(routeParams) 
                if(result.success){
                    stock_out.value ={
                        id: result.data?.id,
                        user_id: result.data?.user_id,
                        out_number: result.data?.out_number,
                        out_date: result.data?.out_date,
                        remarks: result.data?.remarks,
                        status: result.data?.status
                    }

                    const item_result = await getStockOutItemsByOUTId(routeParams)
                    if(item_result.success){
                        stock_out_items.value = item_result.data;
                    }
                }
                
            } catch (error) {
                await presentToast(`Operation failed ${error}`);
                handleReturn();
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
            stock_out,
            stock_out_id,
            stock_out_items,
            is_locked,

            handleReturn,
            handleSave,
            handleLock,
            handleUnlock,

            openActionSheet,
            openItemModal
        }
    }
})
</script>