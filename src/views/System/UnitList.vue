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
                <ion-item v-for="unit in units" :key="unit.id" @click="openActionSheet(unit)">
                    <ion-label>
                        <h2>{{ unit.unit_code }}</h2>
                        <p>{{ unit.unit }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { addUnit, deleteUnit, getUnits, unitAssociatedWithItem } from '@/services/system/unit.service';
import { defineComponent, onActivated, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { actionSheetController, onIonViewDidEnter, onIonViewWillEnter } from '@ionic/vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { UNIT } from '@/models/unit.model';
import { presentToast } from '@/composables/toast.composables';


export default defineComponent({
    components: { 
        // HeaderComponent
    },
    setup(){
        const router = useRouter();
        const units = ref<UNIT[]>([]);
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
        const openActionSheet = async (unit:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Unit ${unit.unit_code}  ${unit.unit_description}`,
                buttons: actionSheetButtons(unit)
            });
            await actionSheet.present();
        };
        //#endregion
        
        const handleDelete = async (unit: any) => {
            try {
                const checkUnit = await unitAssociatedWithItem(unit.id);
                if(checkUnit.exist){
                    await presentToast(`Unable to delete Unit associated with Item.`);
                    return;
                }
                const result = await deleteUnit(unit.id)
                if(result.success){
                    await presentToast(`Unit deleted successfully!`)
                    await fetchList()
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`,'middle',3000)
            }
        };
        const handleEdit = (unit: any) => {
            router.push(`/System/Unit/Details/${unit.id}`);
        }
        const handleAdd = async() => {
            try {
                const result = await addUnit()
                if(result.success){
                    router.push(`/System/Unit/Details/${result.data}`);
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`,'middle',3000)
            }
        }
        
        async function fetchList() {
            try {
                const result = await getUnits(page.value, page_size.value, search_key.value)
                if(result.success){
                    units.value = result.data;
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
            header:'Unit List',
            icons,
            units,

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