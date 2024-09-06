<template>
    <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button size="small" position="stacked"  @click="">
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
import { presentToast } from '@/plugins/toast.service';
import { getStockInById, getStockIn, getLastINNumber, addStockIn, updateStockIn } from '@/services/activity/stoc-in.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, readonly, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


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

        async function handleReturn() {
            router.push(`/activity/stock-in`);
        }

        async function handleLock() {
            await presentToast('handle lock here')
        }

        async function handleSave() {
            if(stocki_in_id.value == 0){
                const response = await addStockIn(stock_in.value)
                if(response.success){
                    await presentToast('Stock In successfully created',);
                }else{
                    await presentToast('Add stock in failed')
                    // await presentToast('Failed to create sales')
                    // alertTitle.value = 'Failed';
                    // alertMessage.value = 'Failed to create sales';
                }
            }else{
                const response = await updateStockIn(stock_in.value)
                if(response.success){
                    await presentToast('Update Stock In successful');
                }else{
                    await presentToast('Update Stock In failed')
                }
            }
        }
        async function fetchDetails() {
            const routeParams = +route.params.id;
            stocki_in_id.value = routeParams ; 

            
            if(routeParams == 0){
                in_number.value = await getLastINNumber();
                const currentNumber = parseInt(in_number.value, 10);
                const nextNumber = currentNumber + 1;
                const formattedNextNumber = nextNumber.toString().padStart(10, '0');
                in_number.value = formattedNextNumber;
                stock_in.value.in_number = in_number.value;
                stock_in.value.in_date = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'});
            }else{
                const response = await getStockInById(routeParams) 
                if(response){
                    stock_in.value ={
                        id: response.id,
                        user_id: response.user_id,
                        in_number: response.in_number,
                        in_date: response.in_date,
                        remarks: response.remarks,
                        status: response.status
                    }
                }    
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
            handleLock
        }
    }
})
</script>