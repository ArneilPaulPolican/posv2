<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-title>Select Discount</ion-title>
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
                <ion-item v-for="discount in discount_list" :key="discount.id">
                    <ion-button size="medium" @click="handleDiscountPicked(discount)">
                        <ion-label>Pick</ion-label>
                    </ion-button>
                    &nbsp;
                    <ion-label>
                        <h2>{{ discount.discount }}</h2>
                        <p>{{ discount.discount_rate }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { DISCOUNT } from '@/models/discount.model';
import { TAX } from '@/models/tax.model';
import { icons } from '@/plugins/icons';
import { getDiscounts } from '@/services/system/discount.service';
import { getTaxes } from '@/services/system/tax.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';


export default defineComponent({
    setup(_, {emit}){
        const discount_list = ref<DISCOUNT[]>([])

        const handleDiscountPicked = async (discount:DISCOUNT) =>{
            console.log("Selected tax ",discount)
            emit('discount-picked', discount);
            emit('close'); 
        }


        async function fetchList() {
            const discountData = await getDiscounts();
            discount_list.value = discountData;
            console.log("getDiscounts result",discount_list.value)
        }
        
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        onMounted(async() =>{
            await fetchList()
        })
        return{
            icons,
            discount_list,

            handleDiscountPicked
        }
    }
});
</script>