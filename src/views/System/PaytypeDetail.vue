<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->

        <ion-item>
            
            <ion-buttons slot="start">
                <ion-back-button default-href="/"></ion-back-button>
            </ion-buttons>
            <!-- <ion-icon :ios="icons.arrowBackOutline" :md="icons.arrowBackSharp" @click="handleReturn"></ion-icon> -->
            <ion-button slot="end" size="medium" expand="block" style="height: 100%"
                @click="handleSave()">
                <ion-label>Save</ion-label>
            </ion-button>
        </ion-item>
        
        <ion-content :fullscreen="true">
            <ion-list :inset="true" style="margin: px">
                <div style="padding: 5px;">
                    <ion-item>
                        <ion-label position="stacked">Paytype :</ion-label>
                        <ion-input v-model="paytype.paytype" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item slot="start">
                        <ion-row>
                            <ion-col>
                                <ion-checkbox v-model="paytype.is_default_value" label-placement="start">Is Default</ion-checkbox>
                            </ion-col>
                            <ion-col>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
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
import { defineComponent, onMounted, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import AlertComponent from '@/components/Modal/AlertComponent.vue';
import { Lock } from '@/services/lock';
import { PAYTYPE } from '@/models/paytype.model';
import { getPaytypesById } from '@/services/system/paytype.service';

export default defineComponent({
    components: { 
        // HeaderComponent,
        AlertComponent,
    },
    setup(){
        const router = useRouter();
        const route = useRoute();
        const dbLock = new Lock(); // Create a new lock
        const paytype = ref<PAYTYPE>({
            id:0,
            paytype: '',
            is_default_value: false,
        });
        let paytype_id = 0 ;
        const open_alert = ref(false);
        const alertTitle = ref('');
        const alertSubTitle = ref('');
        const alertMessage = ref('');

        
        // BACK
        const handleReturn = () =>{
            router.push(`/System/Paytypes`);
        }
        const handleSave = async () => {
            console.log("save event triggered");

            setTimeout(async () => {
                try {
                    if(paytype_id == 0){
                        console.log('New')
                        const response = true; // await addTax(paytype.value);
                        alertSubTitle.value = 'Adding Item'
                        if(response){
                            // trigger here to open the alert component
                            console.log('Tax successfully created')
                            alertMessage.value = 'Tax successfully created';
                            alertTitle.value = 'Success';
                        }else{
                            console.error('Failed to create item')
                            alertTitle.value = 'Failed';
                            alertMessage.value = 'Failed to create item';
                        }
                    }else{
                        console.log('Update')
                        const response = true ;//await updateTax(paytype.value);
                        alertSubTitle.value = 'Updating Item'
                        if(response){
                            console.log('Tax successfully updated')
                            alertMessage.value = 'Tax successfully updated';
                            alertTitle.value = 'Success';
                        }else{
                            console.error('Failed to update item')
                            alertMessage.value = 'Failed to update item';
                            alertTitle.value = 'Failed';
                        }
                    }
                    open_alert.value = true; // Open the alert
                    console.log('open_alert value', open_alert.value)
                } catch (err) {
                    dbLock.release(); // Release the lock after the operation
                    console.error('Error adding data:', err)
                }
            }, 300);
        }

        async function fetchDetails() {
            const routeParams = +route.params.id;
            paytype_id = routeParams ; 
            
            setTimeout(async () => {
                const paytypeResult = await getPaytypesById(routeParams)
                console.log("paytypeResult ", paytypeResult)
                if(paytypeResult){
                    paytype.value ={
                        id: paytypeResult.id,
                        paytype: paytypeResult.paytype,
                        is_default_value: paytypeResult.is_default_value,
                    }
                }else{
                    if(routeParams !=0 ){
                        
                        alertTitle.value = 'Not Found';
                        alertSubTitle.value = 'PAYTYPE Not Found'
                        alertMessage.value = 'No paytype exist';
                        open_alert.value = true; // Open the alert
                    }else{
                        paytype.value ={
                            id:0,
                            paytype: '',
                            is_default_value: false,
                        }
                    }
                }
            }, 500);
        }

        onMounted(async()=>{
            await fetchDetails
        })
        onIonViewDidEnter(async () => {
            await fetchDetails()
        });
        return{
            header:'Paytype Deail',
            icons,
            paytype,
            
            open_alert,
            alertMessage,
            alertTitle,
            alertSubTitle,

            handleReturn,
            handleSave
        }
    }
})
</script>