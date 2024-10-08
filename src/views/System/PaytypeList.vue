<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button @click="handleAdd">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="paytype in paytypes" :key="paytype.id" @click="openActionSheet(paytype)">
                    <ion-label>
                        <h2>{{ paytype.paytype }}</h2>
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
import { PAYTYPE } from '@/models/paytype.model';
import { addNewPaytype, deletePaytype, getPaytypes } from '@/services/system/paytype.service';
import { presentToast } from '@/composables/toast.composables';

export default defineComponent({
    components:{
        // HeaderComponent
    },
    setup(){
        const router = useRouter();
        const paytypes = ref<PAYTYPE[]>([])


        //#region   Actionsheet
        const actionSheetButtons = (paytype:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(paytype);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(paytype);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (paytype:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Unit ${paytype.tax_code}  ${paytype.tax_description}`,
                buttons: actionSheetButtons(paytype)
            });
            await actionSheet.present();
        };
        //#endregion

        const handleDelete = async (paytype: any) => {
            try {
                const result = await deletePaytype(paytype.id)
                if(result.success){
                    await presentToast(`Paytype deleted successfully!`)
                    await fetchList()
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        };
        const handleEdit = (paytype: any) => {
            router.push(`/System/Paytype/Details/${paytype.id}`);
        };
        const handleAdd = async() => {
            try {
                const result = await addNewPaytype()
                if(result.success){
                    router.push(`/System/Paytype/Details/${result.data}`);
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`,'middle',3000)
            }
        }
        
        async function fetchList() {
            try {
                const result = await getPaytypes()
                if(result.success){
                    paytypes.value = result.data
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }
        onMounted(async () => {
          await fetchList()
        })
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        return{
            header: 'Paytype List',
            icons,
            paytypes,

            handleEdit,
            handleAdd,
            openActionSheet
        }
    }
})
</script>