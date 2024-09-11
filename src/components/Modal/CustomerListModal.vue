<template>
    <ion-page style="margin-top: 65px;">
        
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
                </ion-buttons>
                <ion-title>Select Customer</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-item>
            <!-- Search Input -->
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>

        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="customer in customers" :key="customer.id">
                    <ion-button size="medium" @click="confirm(customer)">
                        <ion-label>Pick</ion-label>
                    </ion-button>
                    &nbsp;
                    <ion-label>
                        <h2>{{ customer.customer_code }}</h2>
                        <p>{{ customer.customer }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { presentToast } from '@/composables/toast.service';
import { CUSTOMER } from '@/models/customer.model';
import { icons } from '@/plugins/icons';
import { getCustomers } from '@/services/setup/customer.service';
import { getTaxes } from '@/services/system/tax.service';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';


export default defineComponent({
    setup(){
        const customers = ref<CUSTOMER[]>([])

        const cancel = () => modalController.dismiss('', 'cancel');
        const confirm = (customer:CUSTOMER) => {
            modalController.dismiss(customer , 'confirm');
        }

        async function fetchList() {
            try {
                const result = await getCustomers();
                if(result.success){
                    customers.value = result.data;
                }
        } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        onMounted(async () => {
            await fetchList()
        });
        return{
            icons,
            customers,

            cancel,
            confirm,
            // handleCustomerPicked
        }
    }
});
</script>