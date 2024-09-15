<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->

        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button @click="openDisctountDetailForm">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="tax in discounts" :key="tax.id" @click="openActionSheet(tax)">
                    <ion-label>
                        <h2>{{ tax.discount }}</h2>
                    </ion-label>
                    <ion-label slot="end">
                        <p>{{ tax.discount_rate }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent, onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { DISCOUNT } from '@/models/discount.model';
import { getDiscounts } from '@/services/system/discount.service';
import { presentToast } from '@/composables/toast.composables';

export default defineComponent({
    components:{
        // HeaderComponent
    },
    setup(){
        const router = useRouter();
        const discounts = ref<DISCOUNT[]>([])
        let saveTimeout: number | undefined;

        //#region   Actionsheet
                const actionSheetButtons = (tax:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(tax);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(tax);
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
                header: `Options for Unit ${tax.tax_code}  ${tax.tax_description}`,
                buttons: actionSheetButtons(tax)
            });
            await actionSheet.present();
        };
        //#endregion


        const handleDelete = (tax: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (tax: any) => {
            router.push(`/System/Discount/Details/${tax.id}`);
        };
        const openDisctountDetailForm = async() => {
            router.push(`/System/Discount/Details/0`);
        }

        async function fetchList() {
            try {
                const result = await getDiscounts();
                if(result.success){
                    discounts.value = result.data;
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        onMounted(async () => {
           await fetchList()
        });
        return{
            header:"Discount List",
            icons,
            router,
            discounts,

            openActionSheet,
            handleDelete,
            handleEdit,
            openDisctountDetailForm
        }
    }
})
</script>