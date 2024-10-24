<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->

        <!-- <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button @click="handleAdd">
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
                <ion-item v-for="tax in discounts" :key="tax.id" @click="openActionSheet(tax)">
                    <ion-label>
                        <h2>{{ tax.discount }}</h2>
                        <p v-if="tax.is_locked">Locked</p><p v-else>Unlocked</p>
                    </ion-label>
                    <ion-label slot="end">
                        <p>{{ tax.discount_rate }}%</p>
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
import { addDiscouunt, deleteDiscount, getDiscounts } from '@/services/system/discount.service';
import { presentToast } from '@/composables/toast.composables';

export default defineComponent({
    components:{
        // HeaderComponent
    },
    setup(){
        const router = useRouter();
        const discounts = ref<DISCOUNT[]>([])
        let saveTimeout: number | undefined;
        const search_key = ref('');
        const page = ref(1);
        const page_size = ref(10);

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


        const handleDelete = async (discount: any) => {
            try {
                const result = await deleteDiscount(discount.id)
                if(result.success){
                    await presentToast(`Discount deleted successfully!`)
                    await fetchList()
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`,'middle',3000)
            }
        };
        const handleEdit = (discount: any) => {
            router.push(`/System/Discount/Details/${discount.id}`);
        };
        const handleAdd = async() => {
            try {
                const result = await addDiscouunt();
                if(result.success){
                    router.push(`/System/Discount/Details/${result.data}`);
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`,'middle', 3000)
            }
        }

        async function fetchList() {
            try {
                const result = await getDiscounts(page.value, page_size.value, search_key.value);
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
            handleAdd,
            fetchList,
            
            page,
            page_size,
            search_key,
        }
    }
})
</script>