<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button  @click="openUnitDetailForm">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        
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
import { getUnits } from '@/services/system/unit.service';
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
        
        const handleDelete = (unit: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (unit: any) => {
            router.push(`/System/Unit/Details/${unit.id}`);
        }
        const openUnitDetailForm = async() => {
            router.push(`/System/Unit/Details/0`);
        }
        
        async function fetchList() {
            try {
                const result = await getUnits()
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
            openUnitDetailForm
        }
    }
});
</script>