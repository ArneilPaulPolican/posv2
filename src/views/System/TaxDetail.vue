<template>
    <ion-page>
        <!-- <HeaderComponent :key="$route.fullPath" :title="header" /> -->

        <ion-item>
            <ion-button size="medium" expand="block" style="height: 90%"
                @click="handleReturn()" >
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                    <ion-label>Back</ion-label>
                </div>
            </ion-button>
            <ion-button size="medium" expand="block" style="height: 90%"
                @click="handleSave()">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.saveSharp"></ion-icon>
                    <ion-label>Save</ion-label>
                </div>
            </ion-button>
        </ion-item>
        
        <ion-item>
            <h1>{{ tax.tax_code }}</h1>
        </ion-item>

        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    <ion-item>
                        <!-- <ion-label position="stacked">Tax code :</ion-label> -->
                        <ion-input label="Tax code" label-placement="floating" fill="solid" v-model="tax.tax_code" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">Tax :</ion-label> -->
                        <ion-input label="Tax" label-placement="floating" fill="solid" v-model="tax.tax" placeholder="Tax Name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col>
                                <!-- <ion-label position="stacked">Rate Percentage (%):</ion-label> -->
                                <!-- <ion-input label="" label-placement="floating" fill="solid" v-model="tax.rate" type="number" placeholder="12"></ion-input> -->
                                <InputFloat label="Rate Percentage (%)" :amount="tax.rate" @update="(floatValue) => tax.rate = floatValue"></InputFloat>
                            </ion-col>
                            <!-- <ion-col >
                                <ion-checkbox v-model="tax.is_inclusive" label-placement="start">Is Inclusive</ion-checkbox>
                            </ion-col> -->
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
import { presentToast } from '@/composables/toast.composables';
import InputFloat from '@/components/InputFloat.vue';

export default defineComponent({
    components: { 
        // HeaderComponent,
        AlertComponent,
        InputFloat
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
            router.go(-1);
        }
        const handleSave = async () => {
            try {
                const result = await updateTax(tax.value);
                if(result.success){
                    await presentToast('Tax successfully updated')
                }
            } catch (err) {
                await presentToast(`Operation failed ${err}`)
            }
        }
        async function fetchDetails() {
            const routeParams = +route.params.id;
            tax_id = routeParams ; 
            try {
                const result = await getTaxesById(routeParams)
                if(result.success && result.data){
                    tax.value ={ ... result.data}
                }else{
                    handleReturn()
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
                handleReturn()
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