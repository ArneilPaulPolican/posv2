<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button  @click="openDetailForm">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        
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
import { getTaxes } from '@/services/system/tax.service';
import { presentToast } from '@/composables/toast.service';


export default defineComponent({
    components: { 
        // HeaderComponent
    },
    setup(){
        const router = useRouter();
        const taxes = ref<TAX[]>([]);
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
        const handleDelete = (tax: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (tax: any) => {
            router.push(`/System/Tax/Details/${tax.id}`);
        }
        const openDetailForm = async() => {
            router.push(`/System/Tax/Details/0`);
        }

        async function fetchList() {
            try {
                const result = await getTaxes();
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
            openDetailForm
        }
    }
});
</script>