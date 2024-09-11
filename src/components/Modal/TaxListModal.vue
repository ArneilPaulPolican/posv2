<template>
    <ion-page style="margin-top: 65px;">
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
                <ion-item v-for="tax in taxes" :key="tax.id">
                    <ion-button size="medium" @click="handleTaxPicked(tax)">
                        <ion-label>Pick</ion-label>
                    </ion-button>
                    &nbsp;
                    <ion-label>
                        <h2>{{ tax.tax_code }}</h2>
                        <p>{{ tax.tax }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { TAX } from '@/models/tax.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.service';
import { getTaxes } from '@/services/system/tax.service';
import { defineComponent, onMounted, ref } from 'vue';


export default defineComponent({
    setup(_, {emit}){
        const taxes = ref<TAX[]>([])

        const handleTaxPicked = async (tax:TAX) =>{
            emit('tax-picked', tax);
            emit('close'); 
        }


        onMounted(async () => {
            setTimeout(async () => {
                try {
                    const result = await getTaxes();
                    if(result.success){
                        taxes.value = result.data;
                    }
                } catch (error) {
                    await presentToast('Failed retreiving Tax list')
                }
            }, 500);
        });
        return{
            icons,
            taxes,

            handleTaxPicked
        }
    }
});
</script>