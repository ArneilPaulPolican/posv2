<template>
    <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button size="small" position="stacked"  @click="openItemModal">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>
        <ion-item style="position: relative;">
            <div style="display: flex; overflow-x: auto; white-space: nowrap; width: 100%; padding-right: 10px;height: 100%">
                <ion-button size="medium" expand="block" style="height: 90%" @click="handleSave">
                    <ion-icon :icon="icons.saveSharp"></ion-icon>&nbsp;
                    <ion-label>Save</ion-label>
                </ion-button>
                <ion-button size="medium" expand="block" style="height: 90%" @click="handleLock">
                    <ion-icon :icon="icons.lockClosedSharp"></ion-icon>&nbsp;
                    <ion-label>Lock</ion-label>
                </ion-button>
                <ion-button size="medium" expand="block" style="height: 90%" @click="handleReturn">
                    <ion-icon :icon="icons.arrowBackSharp"></ion-icon>&nbsp;
                    <ion-label>Back</ion-label>
                </ion-button>
            </div>
        </ion-item>
        
        <ion-item >
            <ion-row>
                <ion-col>
                    <h1>
                        {{ stock_in.in_number }}
                    </h1>
                <!-- </ion-col>
                <ion-col size="6"> -->
                </ion-col>
            </ion-row>
        </ion-item>


        <ion-content :fullscreen="true">
            <ion-list :inset="true">
                <ion-item>
                    <ion-label position="stacked">Date</ion-label>
                    <ion-input :readonly="true" v-model="stock_in.in_date" ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Remarks</ion-label>
                    <ion-input v-model="stock_in.remarks" placeholder="Remarks" ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Status</ion-label>
                    <ion-input v-model="stock_in.status" placeholder="New" ></ion-input>
                </ion-item>
            </ion-list>
            
            <ion-item>
                <ion-label position="stacked">Barcode</ion-label>
                <ion-input  placeholder="00000000001"></ion-input>
            </ion-item>
            
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    
                </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { STOCK_IN, STOCK_IN_DTO } from '@/models/stock-in.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.service';
import { getStockInById, getStockIn, getLastINNumber, addStockIn, updateStockIn } from '@/services/activity/stock-in.service';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, readonly, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ItemListModal from '@/components/Modal/ItemListModal.vue';
import { addBulkStockInItem } from '@/services/activity/stock-in-items.service';


export default defineComponent({
    setup(){
        const route = useRoute();
        const router = useRouter();
        const stock_in = ref<STOCK_IN>({
            id: 0,
            user_id: 0,
            in_number: '',
            in_date: '',
            remarks: '',
            status: ''
        });
        const stocki_in_id = ref(0);
        const in_number = ref('');

        
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

        async function handleReturn() {
            router.push(`/activity/stock-in`);
        }

        async function handleLock() {
            await presentToast('handle lock here')
        }

        async function handleSave() {
            try {
                const response = await updateStockIn(stock_in.value)
                if(response.success){
                    await presentToast('Update Stock In successful');
                }else{
                    await presentToast('Update Stock In failed')
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        async function fetchDetails() {
            const routeParams = +route.params.id;
            stocki_in_id.value = routeParams ; 
            try {
                const response = await getStockInById(stocki_in_id.value)
                if(response.success){
                    stock_in.value ={
                        id: response.data?.id,
                        user_id: response.data?.user_id,
                        in_number: response.data?.in_number,
                        in_date: response.data?.in_date,
                        remarks: response.data?.remarks,
                        status: response.data?.status
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

            handleReturn,
            handleSave,
            handleLock,
            openItemModal
        }
    }
})
</script>