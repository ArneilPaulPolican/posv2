<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        <!-- <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button  @click="handleAdd">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab> -->
        <ion-item>
            <ion-searchbar label="Barcode" label-placement="floating" v-model="search_key" @ionChange="fetchList" placeholder="Enter keyword"></ion-searchbar> 
            <ion-button size="small" expand="block" style="height: 70%"
                    @click="handleAdd()">
                    <ion-icon :icon="icons.addOutline"></ion-icon>
                    <ion-label>Add</ion-label>
            </ion-button>
        </ion-item>
        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="tax in taxes" :key="tax.id" @click="openActionSheet(tax)">
                    <ion-label>
                        <h2>{{ tax.tax_code }}</h2>
                        <p>{{ tax.tax }}</p>
                        <p>Rate: {{ tax.rate }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent, onActivated, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { TAX } from '@/models/tax.model';
import { addTax, deleteTax, getTaxes } from '@/services/system/tax.service';
import { presentToast } from '@/composables/toast.composables';


export default defineComponent({
    components: { 
        // HeaderComponent
    },
    setup(){
        const router = useRouter();
        const taxes = ref<TAX[]>([]);
        const search_key = ref('')
        const page = ref(1);
        const page_size = ref(10);
        //#region   Actionsheet
        const actionSheetButtons = (unit:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(unit);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(unit);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (tax:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Tax ${tax.tax_code}  ${tax.tax_description}`,
                buttons: actionSheetButtons(tax)
            });
            await actionSheet.present();
        };
        //#endregion
        const handleDelete = async (tax: any) => {
            try {
                const result = await deleteTax(tax.id)
                if(result.success){
                    await presentToast(`Tax deleted successfully!`)
                    await fetchList()
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`,'middle',3000)
            }
        };
        const handleEdit = (tax: any) => {
            router.push(`/System/Tax/Details/${tax.id}`);
        }
        const handleAdd = async() => {
            try {
                const result = await addTax()
                if(result.success){
                    router.push(`/System/Tax/Details/${result.data}`);
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`,'middle',3000)
            }
        }

        async function fetchList() {
            try {
                console.log('triggered')
                const result = await getTaxes(page.value, page_size.value, search_key.value);
                if(result.success){
                    taxes.value = result.data;
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        onMounted(async() =>{
            await fetchList()
        })
        return{
            header:'Tax List',
            icons,
            taxes,

            openActionSheet,
            handleDelete,
            handleEdit,
            handleAdd,
            fetchList,
            
            page,
            page_size,
            search_key,
        }
    }
});
</script>