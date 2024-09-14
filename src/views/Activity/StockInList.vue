<template>
    <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button @click="openDetailForm">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        
        <ion-item>
            <!-- Search Input -->
             <ion-label position="stacked">Search Stock In</ion-label>
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="stock_in in stock_ins" :key="stock_in.id" @click="openActionSheet(stock_in)">
                    <ion-label>
                        <h2>{{ stock_in.in_number }}</h2>
                        <p>{{ stock_in.in_date }}</p>
                        <p v-if="stock_in.is_locked">Locked</p><p v-else>Unlocked</p>
                        <p>{{ stock_in.remarks }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { presentToast } from '@/composables/toast.service';
import { STOCK_IN } from '@/models/stock-in.model';
import { icons } from '@/plugins/icons';
import { getStockInById, getStockIn, addStockIn } from '@/services/activity/stock-in.service';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
    setup(){
        const router = useRouter();
        const stock_ins = ref<STOCK_IN[]>([]);
        //#region   Actionsheet
        const actionSheetButtons = (stock_in:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(stock_in);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(stock_in);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (stock_in:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Tax ${stock_in.in_number}  ${stock_in.in_date}`,
                buttons: actionSheetButtons(stock_in)
            });
            await actionSheet.present();
        };
        //#endregion
        const handleDelete = (tax: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (tax: any) => {
            router.push(`/activity/stock-in/details/${tax.id}`);
        }
        const openDetailForm = async() => {
            // router.push(`/activity/stock-in/details/0`);
            try {
                const result = await addStockIn()
                if(result.success){
                    router.push(`/activity/stock-in/details/${result.data}`);
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }


        async function fetchList() {
            try {
                const response = await getStockIn() 
                if(response.success){
                    stock_ins.value = response.data
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
            stock_ins,

            openActionSheet,
            openDetailForm
        }
    }
})
</script>