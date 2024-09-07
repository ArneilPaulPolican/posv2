<template>
    <ion-page>
        
        <ion-item>
            
            <ion-buttons slot="start">
                <ion-back-button default-href="/"></ion-back-button>
            </ion-buttons>
            <!-- <ion-icon :ios="icons.arrowBackOutline" :md="icons.arrowBackSharp" @click="handleReturn"></ion-icon> -->
            <ion-button slot="end" size="medium" expand="block" style="height: 100%">
                <ion-label>Save</ion-label>
            </ion-button>
        </ion-item>
        <ion-content :fullscreen="true">
            <ion-list :inset="true" style="margin: px">
                <div style="padding: 5px;">
                    <ion-item>
                        <ion-label position="stacked">Table Code :</ion-label>
                        <ion-input v-model="table.table_code" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Table :</ion-label>
                        <ion-input v-model="table.table_name" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Category :</ion-label>
                        <ion-input v-model="table.category" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">pax :</ion-label>
                        <ion-input v-model="table.pax" placeholder="Enter Tax Code"></ion-input>
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
import { presentToast } from '@/composables/toast.service';
import router from '@/router';
import { getTableById, getTables } from '@/services/setup/table.service';
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
        
        const openItemDetailForm = async() => {
            router.push(`/Setup/Table/Details/0`);
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

            openItemDetailForm,
        }
    },
});
</script>