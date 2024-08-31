<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-title>Select Customer</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-item>
            <!-- Search Input -->
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
            <ion-button @click="$emit('close')" size="medium" expand="block" fill="outline">
                <ion-label>Close</ion-label>
            </ion-button>
        </ion-item>

        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="customer in customers" :key="customer.id">
                    <ion-button size="medium" @click="handleCustomerPicked(customer)">
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
import { CUSTOMER } from '@/models/customer.model';
import { icons } from '@/plugins/icons';
import { getCustomers } from '@/services/setup/customer.service';
import { getTaxes } from '@/services/system/tax.service';
import { defineComponent, onMounted, ref } from 'vue';


export default defineComponent({
    setup(_, {emit}){
        const customers = ref<CUSTOMER[]>([])

        const handleCustomerPicked = async (customer:CUSTOMER) =>{
            // return to the ItemDetail.vue the unit.id, unit.unit_code and unit.unit_description
            console.log("Selected customer ",customer)
            emit('customer-picked', customer);
            emit('close'); 
        }

        onMounted(async () => {
            setTimeout(async () => {
                const customerData = await getCustomers();
                customers.value = customerData;
                console.log("getUnits result",customers.value)
            }, 500);
        });
        return{
            icons,
            customers,

            handleCustomerPicked
        }
    }
});
</script>