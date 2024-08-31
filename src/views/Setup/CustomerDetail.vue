<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        
        <ion-item>
            <ion-icon :ios="icons.arrowBackOutline" :md="icons.arrowBackSharp" @click="handleReturn"></ion-icon>
            <ion-button slot="end" size="medium" expand="block" style="height: 100%"
                @click="handleSave()">
                <ion-label position="stacked">Save</ion-label>
            </ion-button>
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
import { addCustomers, getCustomerById, getLastCustomerCode } from '@/services/setup/customer.service';
import { onIonViewDidEnter } from '@ionic/vue';

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
            console.log("save event triggered");

            setTimeout(async () => {
                try {
                    if(customer_id == 0){
                        console.log('New')
                        const response =  await addCustomers(customer.value, imagePath.value);
                        if(response){
                            // trigger here to open the alert component
                            console.log('Customer successfully created')
                            alertMessage.value = 'Customer successfully created';
                            alertTitle.value = 'Success';
                        }else{
                            console.error('Failed to create Customer')
                            alertTitle.value = 'Failed';
                            alertMessage.value = 'Failed to create Customer';
                        }
                    }else{
                        console.log('Update')
                        const response = true; //await updateTax(tax.value);
                        alertSubTitle.value = 'Updating Customer'
                        if(response){
                            console.log('Customer successfully updated')
                            alertMessage.value = 'Customer successfully updated';
                            alertTitle.value = 'Success';
                        }else{
                            console.error('Failed to update Customer')
                            alertMessage.value = 'Failed to update Customer';
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
            customer_id = routeParams ; 
            if(customer_id!=0){
                const result = await getCustomerById(routeParams)
                if(result){
                    customer.value = {
                        id: result.id,
                        customer_code: result.customer_code,
                        customer: result.customer,
                        contact_number: result.contact_number,
                        contact_person: result.contact_person,
                        credit_limit: result.credit_limit,
                        category: result.category,
                        email: result.email,
                        address: result.address,
                        tin: result.tin,
                        reward_number: result.reward_number,
                        image_path: result.image_path,
                        is_locked: result.is_locked,
                        is_default_value: result.is_default_value,
                    }
                }else{ 
                    alertTitle.value = 'Not Found';
                    alertMessage.value = 'No Customer exist';
                    open_alert.value = true; // Open the alert
                }
            }else{
                
                const customer_code = await getLastCustomerCode();
                const current_code = parseInt(customer_code, 10);
                const next_code = current_code + 1;
                const formatted_next_code = next_code.toString().padStart(10, '0');
                customer.value.customer_code = formatted_next_code;
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
            handleSave
        }
    }
});
</script>