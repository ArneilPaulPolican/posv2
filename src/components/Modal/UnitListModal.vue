<template>
    <ion-page style="margin-top: 65px;">
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Select Unit</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-item>
            <!-- Search Input -->
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
            <!-- <ion-button @click="$emit('close')" size="medium" expand="block" fill="solid">
                <ion-label>Close</ion-label>
            </ion-button> -->
        </ion-item>

        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="unit in units" :key="unit.id">
                    <ion-button size="medium" @click="handlePickedUnit(unit)">
                        <ion-label>Pick</ion-label>
                    </ion-button>
                    &nbsp;
                    <ion-label>
                        <h2>{{ unit.unit_code }}</h2>
                        <p>{{ unit.unit }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { UNIT } from '@/models/unit.model';
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.composables';
import { getUnits } from '@/services/system/unit.service';
import { defineComponent, onMounted, ref } from 'vue';
import { modalController } from '@ionic/vue';

export default defineComponent({

    setup(_, {emit}){
        const units = ref<UNIT[]>([])

        // const handlePickedUnit = async (unit:UNIT) =>{
        //     emit('unit-picked', unit);
        //     emit('close'); 
        // }

        const cancel = () => modalController.dismiss('', 'cancel');
        const handlePickedUnit = (unit:UNIT) => {
            modalController.dismiss(unit , 'confirm');
        }
        onMounted(async () => {
            setTimeout(async () => {
                try {
                    const result = await getUnits();
                    if(result.success){
                        units.value = result.data;
                    }
                } catch (error) {
                    await presentToast('Failed retreiving Unit list')
                }
            }, 500);
        });
        return{
            icons,
            units,

            handlePickedUnit,
            cancel
        }
    }
});
</script>