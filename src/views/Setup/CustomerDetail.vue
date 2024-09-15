<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        
        <ion-item>
            <div style="display: flex; overflow-x: auto; white-space: nowrap; width: 100%; padding-right: 10px;height: 100%; align-items: center;">
                <!-- <ion-icon :ios="icons.arrowBackOutline" :md="icons.arrowBackSharp" @click="handleReturn"></ion-icon> -->
                <ion-button size="small" expand="block" style="height: 90%"
                    @click="handleReturn()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                        <ion-label >Back</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" size="small" expand="block" style="height: 90%"
                    @click="handleSave()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.saveSharp"></ion-icon>
                        <ion-label >Save</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" size="small" expand="block" style="height: 90%"
                    @click="handleLock()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label >Lock</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="is_locked" size="small" expand="block" style="height: 90%"
                    @click="handleUnlock()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label >Unlock</ion-label>
                    </div>
                </ion-button>
            </div>
        </ion-item>
        <ion-item>
            <h1>{{ customer.customer_code }}</h1>
        </ion-item>

        <ion-content :fullscreen="true">
            <ion-list :inset="true" style="margin: 5px">
                <div style="padding: 5px;">
                    <ion-item>
                        <ion-label position="stacked">Fullname :</ion-label>
                        <ion-textarea :disabled="is_locked" v-model="customer.customer" placeholder="Customer Fullname"></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Category :</ion-label>
                        <ion-textarea :disabled="is_locked" v-model="customer.category" placeholder="Enter Category"></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Email :</ion-label>
                        <ion-input :disabled="is_locked" v-model="customer.email" placeholder="Enter Email"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">TIN :</ion-label>
                        <ion-input :disabled="is_locked" v-model="customer.tin" placeholder="Enter Tax Identification No."></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Address :</ion-label>
                        <ion-textarea :disabled="is_locked" v-model="customer.address" placeholder="Enter Full Address"></ion-textarea>
                        <br>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Contact Number :</ion-label>
                        <ion-textarea :disabled="is_locked" v-model="customer.contact_number" placeholder="Enter Contact Number" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Reward No. :</ion-label>
                        <ion-input :disabled="is_locked" v-model="customer.reward_number" placeholder="Enter Reward No."></ion-input>
                    </ion-item>
                    
                    <ion-item>
                        <div style="height: 100px;width: auto; display: flex;flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center;">
                            <img v-if="customer.image_path" :src="customer.image_path" alt="Image" />
                        </div>
                    </ion-item>
                    <ion-item >
                        <ion-button v-if="!is_locked" @click="captureImage">
                            <ion-icon :icon="icons.camera"></ion-icon>
                        </ion-button>
                        <ion-button v-if="!is_locked" @click="retreiveImage">
                            <ion-icon :icon="icons.attachSharp"></ion-icon>
                        </ion-button>
                    </ion-item>
                    
                </div>

            </ion-list>

            
        </ion-content>


        <!-- <AlertComponent v-if="open_alert"
        :title="alertTitle"
        :sub_title="alertSubTitle"
        :message="alertMessage"
        /> -->
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
// import AlertComponent from '@/components/Modal/AlertComponent.vue';
import { Lock } from '@/services/lock';
import { CUSTOMER } from '@/models/customer.model';
import { addCustomers, getCustomerById, getLastCustomerCode, lockCustomers, unlockCustomers, updateCustomers } from '@/services/setup/customer.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { presentToast } from '@/composables/toast.composables';
import { usePhotoGallery } from '@/composables/image.composable';

export default defineComponent({
    components: { 
        HeaderComponent,
        // AlertComponent,
    },
    setup(){
        const router = useRouter();
        const route = useRoute();
        const dbLock = new Lock(); // Create a new lock
        const customer = ref<CUSTOMER>({
            id: 0,
            customer_code:'NA',
            customer: 'NA',
            contact_number: 'NA',
            contact_person: 'NA',
            credit_limit: 0,
            category: 'NA',
            email: 'NA',
            address: 'NA',
            tin: 'NA',
            reward_number: 'NA',
            image_path: '',
            is_locked: false,
            is_default_value: false,
        });
        let customer_id = 0 ;
        const open_alert = ref(false);
        const alertTitle = ref('');
        const alertSubTitle = ref('');
        const alertMessage = ref('');
        const not_found = ref(false);
        const imagePath = ref('');
        const is_locked = ref(false);
        const { takePhoto, selectPhoto, loadImageFromFilesystem, savedPhotoPath } = usePhotoGallery();

        
        // BACK
        const handleReturn = () => {
            router.push(`/Setup/Customers`);
        }

                // Capture an image and save it
        const captureImage = async () => {
            const dataUrl = await takePhoto();
            console.log(`dataUrl ${JSON.stringify(dataUrl)}`);
            const webPath = dataUrl?.webPath;
            const format = dataUrl?.format;
            // blobUrl.value = dataUrl?.webPath ?? '';
            console.log(`webPath: ${webPath}`);
            console.log(`format: ${format}`);
            // await updateImage(webPath) 
            if(webPath){
                customer.value.image_path = webPath ?? '';
            }
        };

        const retreiveImage = async () => {
            const dataUrl = await selectPhoto();
            console.log(`dataUrl ${JSON.stringify(dataUrl)}`);
            const webPath = dataUrl?.webPath;
            const format = dataUrl?.format;
            // blobUrl.value = dataUrl?.webPath ?? '';
            console.log(`webPath: ${webPath}`);
            console.log(`format: ${format}`);
            // updateImage(webPath) 
            if(webPath){
                customer.value.image_path = webPath ?? '';
            }
        };

        const handleSave = async () => {
            setTimeout(async () => {
                try {
                    const response = await updateCustomers(customer.value)
                    if(response){
                        await presentToast('Customer successfully updated')
                    }else{
                        await presentToast('Failed to update Customer')
                    }
                } catch (err) {
                    await presentToast(`Update operation failed: ${err}`)
                }
            }, 300);
        }
        
        const handleLock = async () => {
            setTimeout(async () => {
                try {
                    const response = await lockCustomers(customer.value)
                    if(response){
                        await presentToast('Customer successfully lock')
                        is_locked.value = true;
                    }else{
                        await presentToast('Failed to lock Customer')
                    }
                } catch (err) {
                    await presentToast(`Lock operation failed : ${err}`)
                }
            }, 300);
        }
        
        const handleUnlock = async () => {
            setTimeout(async () => {
                try {
                    const response = await unlockCustomers(customer.value)
                    if(response){
                        await presentToast('Customer successfully unlock');
                        is_locked.value = false;
                    }else{
                        await presentToast('Failed to unlock Customer')
                    }
                } catch (err) {
                    await presentToast(`Unlock operation failed : ${err}`)
                }
            }, 300);
        }

        async function fetchDetails() {
            const routeParams = +route.params.id;
            customer_id = routeParams ; 
            try {
                const result = await getCustomerById(routeParams)
                if(result.success && result.data){
                    is_locked.value = result.data.is_locked;
                    customer.value = {
                        id: result.data.id,
                        customer_code: result.data.customer_code,
                        customer: result.data.customer,
                        contact_number: result.data.contact_number,
                        contact_person: result.data.contact_person,
                        credit_limit: result.data.credit_limit,
                        category: result.data.category,
                        email: result.data.email,
                        address: result.data.address,
                        tin: result.data.tin,
                        reward_number: result.data.reward_number,
                        image_path: result.data.image_path,
                        is_locked: result.data.is_locked,
                        is_default_value: result.data.is_default_value,
                    }
                }else{ 
                    await presentToast('No customer found');
                    handleReturn();
                }
                
            } catch (error) {
                await presentToast(`Error retreiving customer:  ${error}`);
                handleReturn();
            }
        }
        onMounted(async () =>{
            await fetchDetails();
        })
        onIonViewDidEnter(async () => {
            await fetchDetails()
        });

        return{
            header: "Customer Details",
            icons,
            router,
            customer,
            is_locked,

            open_alert,
            alertMessage,
            alertTitle,
            alertSubTitle,
            not_found,

            handleReturn,
            handleSave,
            handleLock,
            handleUnlock,
            
            captureImage,
            retreiveImage,
        }
    }
});
</script>