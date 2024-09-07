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
        
        <div style="background-color: black;">
            <ion-item style="background-color: black;">
                <ion-row>
                    {{ stock_out.out_number }}
                </ion-row>
            </ion-item>
        </div>

        <ion-content :fullscreen="true">
            <ion-list :inset="true">
                <ion-item>
                    <ion-label position="stacked">Date</ion-label>
                    <ion-input :readonly="true" v-model="stock_out.out_date" ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Remarks</ion-label>
                    <ion-input v-model="stock_out.remarks" placeholder="Remarks" ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Status</ion-label>
                    <ion-input v-model="stock_out.status" placeholder="New" ></ion-input>
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
import { STOCK_OUT, STOCK_OUT_DTO } from '@/models/stock-out.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.service';
import { getStockInById, getStockIn } from '@/services/activity/stock-in.service';
import { addStockOut, getLastOTNumber, getStockOutById, updateStockOut } from '@/services/activity/stock-out.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, readonly, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


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
        const stock_out_id = ref(0);
        const out_number = ref('');

        async function handleReturn() {
            router.push(`/activity/stock-out`);
        }

        async function handleLock() {
            await presentToast('handle lock here')
        }

        async function handleSave() {
            if(stock_out_id.value == 0){
                const response = await addStockOut(stock_out.value)
                if(response.success){
                    await presentToast('Stock Out successfully created');
                }else{
                    await presentToast('Add Stock Out error')
                }
            }else{
                const response = await updateStockOut(stock_out.value)
                if(response.success){
                    await presentToast('Stock Out successfully updated', );
                }else{
                    await presentToast('Update Stock Out error')
                }
            }
        }

        async function fetchDetails() {
            const routeParams = +route.params.id;
            stock_out_id.value = routeParams ; 

            if(routeParams == 0){
                out_number.value = await getLastOTNumber();
                const currentNumber = parseInt(out_number.value, 10);
                const nextNumber = currentNumber + 1;
                const formattedNextNumber = nextNumber.toString().padStart(10, '0');
                out_number.value = formattedNextNumber;
                stock_out.value.out_number = out_number.value;
                stock_out.value.out_date = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'});
            }else{
            const response = await getStockOutById(routeParams) 
                if(response){
                    stock_out.value ={
                        id: response.id,
                        user_id: response.user_id,
                        out_number: response.out_number,
                        out_date: response.out_date,
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
            stock_out,
            stock_out_id,

            handleReturn,
            handleSave,
            handleLock
        }
    }
})
</script>