<template>
    <ion-page>
        <!-- <HeaderComponent :key="$route.fullPath" :title="header" /> -->

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
        
        <ion-item>
            <h1>{{ tax.tax_code }}</h1>
        </ion-item>

        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    <ion-item>
                        <ion-label position="stacked">Tax code :</ion-label>
                        <ion-input v-model="tax.tax_code" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Tax :</ion-label>
                        <ion-input v-model="tax.tax" placeholder="Tax Name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col>
                                <ion-label position="stacked">Rate :</ion-label>
                                <ion-input v-model="tax.rate" type="number" placeholder="Rate"></ion-input>
                            </ion-col>
                            <ion-col >
                                <ion-checkbox v-model="tax.is_inclusive" label-placement="start">Is Inclusive</ion-checkbox>
                            </ion-col>
                        </ion-row>
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
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import AlertComponent from '@/components/Modal/AlertComponent.vue';
import { addTax, getTaxes, getTaxesById, updateTax } from '@/services/system/tax.service';
import { Lock } from '@/services/lock';
import { TAX } from '@/models/tax.model';
import { onIonViewDidEnter } from '@ionic/vue';

export default defineComponent({
    components: { 
        // HeaderComponent,
        AlertComponent,
    },
    setup(){
        const router = useRouter();
        const route = useRoute();
        const dbLock = new Lock(); // Create a new lock
        const tax = ref<TAX>({
            id:0,
            tax_code: 'NA',
            tax: 'NA',
            rate: 0,
            is_inclusive: false,
        });
        let tax_id = 0 ;
        const open_alert = ref(false);
        const alertTitle = ref('');
        const alertSubTitle = ref('');
        const alertMessage = ref('');
        const not_found = ref(false)

        // BACK
        const handleReturn = () => {
            // router.push(`/System/Tax`);
            // router.back();
            router.go(-1);
        }
        const handleSave = async () => {
            console.log("save event triggered");

            setTimeout(async () => {
                try {
                    if(tax_id == 0){
                        console.log('New')
                        const response = await addTax(tax.value);
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
                        const response = await updateTax(tax.value);
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
            tax_id = routeParams ; 
            if(tax_id != 0){
                const taxResult = await getTaxesById(routeParams)
                if(taxResult){
                    tax.value ={
                        id: taxResult.id,
                        tax_code: taxResult.tax_code,
                        tax: taxResult.tax,
                        rate: taxResult.rate,
                        is_inclusive: taxResult.is_inclusive
                    }
                }else{
                    alertTitle.value = 'Not Found';
                    alertSubTitle.value = 'TAX Not Found'
                    alertMessage.value = 'No tax exist';
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
            header:"Tax Details",
            icons,
            router,
            tax,

            open_alert,
            alertMessage,
            alertTitle,
            alertSubTitle,

            handleReturn,
            handleSave,

            not_found
        }
    }
});
</script>