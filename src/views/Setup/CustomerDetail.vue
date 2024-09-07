<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        
        <ion-item>
            <div style="display: flex; overflow-x: auto; white-space: nowrap; width: 100%; padding-right: 10px;height: 100%; align-items: center;">
                <!-- <ion-icon :ios="icons.arrowBackOutline" :md="icons.arrowBackSharp" @click="handleReturn"></ion-icon> -->
                <ion-button size="small" expand="block" style="height: 100%"
                    @click="handleReturn()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                        <ion-label >Back</ion-label>
                    </div>
                </ion-button>
                <ion-button size="small" expand="block" style="height: 100%"
                    @click="handleSave()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.saveSharp"></ion-icon>
                        <ion-label >Save</ion-label>
                    </div>
                </ion-button>
                <ion-button size="small" expand="block" style="height: 100%"
                    @click="handleLock()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label >Lock</ion-label>
                    </div>
                </ion-button>
                <ion-button size="small" expand="block" style="height: 100%"
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
            
            <ion-item>
                <img v-if="customer.image_path" :src="customer.image_path" >
            </ion-item>

            <ion-list :inset="true" style="margin: 5px">
                <div style="padding: 5px;">
                    <ion-item>
                        <ion-label position="stacked">Fullname :</ion-label>
                        <ion-textarea v-model="customer.customer" placeholder="Customer Fullname"></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Category :</ion-label>
                        <ion-textarea v-model="customer.category" placeholder="Enter Category"></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Email :</ion-label>
                        <ion-input v-model="customer.email" placeholder="Enter Email"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">TIN :</ion-label>
                        <ion-input v-model="customer.tin" placeholder="Enter Tax Identification No."></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Address :</ion-label>
                        <ion-textarea v-model="customer.address" placeholder="Enter Full Address"></ion-textarea>
                        <br>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Contact Number :</ion-label>
                        <ion-textarea v-model="customer.contact_number" placeholder="Enter Contact Number" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Reward No. :</ion-label>
                        <ion-input v-model="customer.reward_number" placeholder="Enter Reward No."></ion-input>
                    </ion-item>
                    <br>
                    
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
import { presentToast } from '@/composables/toast.service';

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


        
        // BACK
        const handleReturn = () => {
            router.push(`/Setup/Customers`);
        }

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
                        await presentToast('Customer successfully unlock')
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

            open_alert,
            alertMessage,
            alertTitle,
            alertSubTitle,
            not_found,

            handleReturn,
            handleSave,
            handleLock,
            handleUnlock
        }
    }
});
</script>