<template>
    <ion-page>
        <ion-item>
            <ion-icon :ios="icons.arrowBackOutline" :md="icons.arrowBackSharp" @click="handleReturn"></ion-icon>
            <ion-button slot="end" size="medium" expand="block" style="height: 90%"
                @click="handleSave()">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.saveSharp"></ion-icon>
                    <ion-label>Save</ion-label>
                </div>
            </ion-button>
        </ion-item>
        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    <ion-item>
                        <ion-label position="stacked">Unit code :</ion-label>
                        <ion-input v-model="unit.unit_code" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Unit :</ion-label>
                        <ion-input v-model="unit.unit" placeholder="Tax Name"></ion-input>
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
        
        <AlertComponent v-if="open_alert"
        :title="alertTitle"
        :sub_title="alertSubTitle"
        :message="alertMessage"
        />
    </ion-page>
    
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import AlertComponent from '@/components/Modal/AlertComponent.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Lock } from '@/services/lock';
import { addUnit, getUnitsById, updateUnit } from '@/services/system/unit.service';
import { UNIT } from '@/models/unit.model';
import { onIonViewDidEnter } from '@ionic/vue';


export default defineComponent({
    components:{
        AlertComponent
    },
    setup(){
        const router = useRouter();
        const route = useRoute();
        const dbLock = new Lock(); // Create a new lock
        const unit = ref<UNIT>({
            id:0,
            unit_code: 'NA',
            unit: 'NA',
        });
        let unit_id = 0 ;
        const open_alert = ref(false);
        const alertTitle = ref('');
        const alertSubTitle = ref('');
        const alertMessage = ref('');
        let saveTimeout: number | undefined;

            // BACK
        function handleReturn(){
            router.push(`/System/Units`);
        }
        const handleSave = async () => {
          
            setTimeout(async () => {
                try {
                    if(unit_id == 0){
                        const response = await addUnit(unit.value);
                        alertSubTitle.value = 'Adding Unit'
                        if(response){
                            alertMessage.value = 'Tax successfully created';
                            alertTitle.value = 'Success';
                        }else{
                            alertTitle.value = 'Failed';
                            alertMessage.value = 'Failed to create item';
                        }
                    }else{
                        const response = await updateUnit(unit.value);
                        alertSubTitle.value = 'Updating Item'
                        if(response){
                            alertMessage.value = 'Tax successfully updated';
                            alertTitle.value = 'Success';
                        }else{
                            alertMessage.value = 'Failed to update item';
                            alertTitle.value = 'Failed';
                        }
                    }
                    open_alert.value = true; // Open the alert
                } catch (err) {
                    dbLock.release(); // Release the lock after the operation
                }   
            }, 500);
        }

        async function fetchDetails() {
            const routeParams = +route.params.id;
            unit_id = routeParams;
            if(unit_id != 0){
                const result = await getUnitsById(routeParams)
                if(result.success && result.data){
                    unit.value = {
                        id: result.data.id,
                        unit_code: result.data.unit_code,
                        unit: result.data.unit
                    }
                }else{
                    alertTitle.value = 'Not Found';
                    alertSubTitle.value = 'UNIT Not Found'
                    alertMessage.value = 'No UNIT exist';
                    open_alert.value = true; // Open the alert
                }
            }
        }
        onMounted(async () => {
            await fetchDetails()
        });
        onIonViewDidEnter(async () => {
            await fetchDetails()
        });
        return{
            header:'Unit Details',
            icons,
            unit_id,
            open_alert,
            alertMessage,
            alertTitle,
            alertSubTitle,

            unit,

            handleReturn,
            handleSave
        }
    }
}) 
</script>