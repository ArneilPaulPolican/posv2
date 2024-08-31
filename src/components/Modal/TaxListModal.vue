<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-title>Select Tax</ion-title>
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
                <ion-item v-for="unit in tax" :key="unit.id">
                    <ion-button size="medium" @click="handleTaxPicked(unit)">
                        <ion-label>Pick</ion-label>
                    </ion-button>
                    &nbsp;
                    <ion-label>
                        <h2>{{ unit.tax_code }}</h2>
                        <p>{{ unit.tax }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { TAX } from '@/models/tax.model';
import { icons } from '@/plugins/icons';
import { getTaxes } from '@/services/system/tax.service';
import { defineComponent, onMounted, ref } from 'vue';


export default defineComponent({
    setup(_, {emit}){
        const tax = ref<TAX[]>([])

        const handleTaxPicked = async (tax:TAX) =>{
            // return to the ItemDetail.vue the unit.id, unit.unit_code and unit.unit_description
            console.log("Selected tax ",tax)
            emit('tax-picked', tax);
            emit('close'); 
        }


        onMounted(async () => {
            setTimeout(async () => {
                const taxData = await getTaxes();
                tax.value = taxData;
                console.log("getUnits result",tax.value)
            }, 500);
        });
        return{
            icons,
            tax,

            handleTaxPicked
        }
    }
});
</script>