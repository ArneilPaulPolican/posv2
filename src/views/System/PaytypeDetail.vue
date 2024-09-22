<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->

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
        
        <ion-content :fullscreen="true">
            <ion-list :inset="true" style="margin: px">
                <div style="padding: 5px;">
                    <ion-item>
                        <!-- <ion-label position="stacked">Paytype :</ion-label> -->
                        <ion-input label="Paytype" label-placement="floating" fill="solid" v-model="paytype.paytype" placeholder="Enter Tax Code"></ion-input>
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
import { getPaytypesById, updatePaytype } from '@/services/system/paytype.service';
import { presentToast } from '@/composables/toast.composables';

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
            try {
                const result = await updatePaytype(paytype.value);
                if(result.success){
                    await presentToast('Paytype successfully updated')
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)

            }
        }

        async function fetchDetails() {
            const routeParams = +route.params.id;
            paytype_id = routeParams ; 
            try {
                const result = await getPaytypesById(routeParams)
                if(result.success && result.data){
                    paytype.value = { ... result.data }
                }else{
                    handleReturn();
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
                handleReturn();
            }
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