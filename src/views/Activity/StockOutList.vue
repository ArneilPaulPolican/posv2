<template>
<ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button @click=openDetailForm >
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-item>
            <!-- Search Input -->
             <ion-label position="stacked">Search Stock Out</ion-label>
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="stock_out in stock_outs" :key="stock_out.id" @click="openActionSheet(stock_out)">
                    <ion-label>
                        <h2>{{ stock_out.out_number }}</h2>
                        <p>{{ stock_out.out_date }}</p>
                        <p>{{ stock_out.remarks }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { presentToast } from '@/composables/toast.composables';
import { STOCK_IN } from '@/models/stock-in.model';
import { STOCK_OUT } from '@/models/stock-out.model';
import { icons } from '@/plugins/icons';
import { getStockInById, getStockIn } from '@/services/activity/stock-in.service';
import { addStockOut, getStockOut } from '@/services/activity/stock-out.service';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
    setup(){
        const router = useRouter();
        const stock_outs = ref<STOCK_OUT[]>([]);
        //#region   Actionsheet
        const actionSheetButtons = (stock_out:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(stock_out);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(stock_out);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (stock_out:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Tax ${stock_out.in_number}  ${stock_out.in_date}`,
                buttons: actionSheetButtons(stock_out)
            });
            await actionSheet.present();
        };
        //#endregion
        const handleDelete = (stock_out: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (stock_out: any) => {
            router.push(`/activity/stock-out/details/${stock_out.id}`);
        }
        const openDetailForm = async() => {     
            try {
                const result = await addStockOut()
                if(result.success){
                    router.push(`/activity/stock-out/details/${result.data}`);
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }


        async function fetchList() {    
            try {
                const result = await getStockOut()
                if(result.success){
                    stock_outs.value = result.data;
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
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
            stock_outs,

            openActionSheet,
            openDetailForm
        }
    }
})
</script>