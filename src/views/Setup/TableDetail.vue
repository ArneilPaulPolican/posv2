<template>
    <ion-page>
        
        <ion-item>  
            <ion-button size="medium" expand="block" style="height: 90%"
                @click="handleReturn">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                    <ion-label>Back</ion-label>
                </div>
            </ion-button>
            <ion-button size="medium" expand="block" style="height: 90%"
                @click="handleSave">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.saveSharp"></ion-icon>
                    <ion-label>Save</ion-label>
                </div>
            </ion-button> 
            
            <ion-button v-if="!is_locked" size="medium" expand="block" style="height: 90%" @click="handleLock()">
                <div class="icon-label-wrapper">
                    <ion-icon  :icon="icons.lockClosedSharp"></ion-icon>
                    <ion-label>Lock</ion-label>
                </div>
            </ion-button>
            <ion-button v-if="is_locked" size="medium" expand="block" style="height: 90%" @click="handleUnlock()">
                <div class="icon-label-wrapper">
                    <ion-icon  :icon="icons.lockClosedSharp"></ion-icon>
                    <ion-label>Unlock</ion-label>
                </div>
            </ion-button>         
        </ion-item>

        <ion-content :fullscreen="true">
            <ion-list :inset="true" style="margin: px">
                <div style="padding: 5px;">
                    <ion-item>
                        <!-- <ion-label position="stacked">Table Code :</ion-label> -->
                        <ion-input label="Table Code" label-placement="floating" fill="solid" :disabled="is_locked" v-model="table.table_code" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">Table :</ion-label> -->
                        <ion-input label="Table" label-placement="floating" fill="solid" :disabled="is_locked" v-model="table.table_name" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">Category :</ion-label> -->
                        <ion-input label="Category" label-placement="floating" fill="solid" :disabled="is_locked" v-model="table.category" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">pax :</ion-label> -->
                        <ion-input label="Pax" label-placement="floating" fill="solid" :disabled="is_locked" v-model="table.pax" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    
                    <ion-item>
                        <img :src="table.image_path" />
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { TABLE } from '@/models/table.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.composables';
import router from '@/router';
import { getTableById, getTables, lockTable, unlockTable, updateTable } from '@/services/setup/table.service';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, markRaw, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


export default defineComponent({
    components:{

    },
    setup() {
        const table = ref<TABLE>({
            id: 0,
            table_code: '',
            table_name: '',
            category: '',
            pax: 0,
            image_path: '',
            is_locked: false
        });
        const router = useRouter();
        const route = useRoute();
        const table_id = ref(0)
        const is_locked = ref(false);
        
        const handleReturn = async() => {
            router.push(`/setup/tables`);
        }

        
        async function handleSave() {
            try {
                const result = await updateTable(table.value);
                if(result.success){
                    await presentToast('Table Unlock successfully!')
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }

        async function handleUnlock() {
            try {
                const result = await unlockTable(table.value);
                if(result.success){
                    is_locked.value = false;
                    await presentToast('Table Unlock successfully!')
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }

        async function handleLock() {
            try {
                const result = await lockTable(table.value);
                if(result.success){
                    is_locked.value = true;
                    await presentToast('Table Lock successfully!')
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        
        async function fetchDetails() {
            const routeParams = +route.params.id;
            table_id.value = routeParams; 

            setTimeout(async () => {
                const result = await getTableById(routeParams)
                if(result.success && result.data){
                    table.value ={
                        id: result.data.id,
                        table_code: result.data.table_code,
                        table_name: result.data.table_name,
                        category: result.data.category,
                        pax: result.data.pax,
                        image_path: result.data.image_path,
                        is_locked: result.data.is_locked,
                    }
                }
            }, 500);
        }
        onMounted(async () => {
          await fetchDetails()
        })
        onIonViewDidEnter(async () => {
            await fetchDetails()
        })
        return{
            icons,
            table,
            is_locked,

            handleReturn,
            handleUnlock,
            handleLock,
            handleSave
        }
    },
});
</script>