<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-title>Select Unit</ion-title>
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
import { getUnits } from '@/services/system/unit.service';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({

    setup(_, {emit}){
        const units = ref<UNIT[]>([])

        const handlePickedUnit = async (unit:UNIT) =>{
            // return to the ItemDetail.vue the unit.id, unit.unit_code and unit.unit_description
            emit('unit-picked', unit);
            emit('close'); 
        }


        onMounted(async () => {
            setTimeout(async () => {
                const unitsData = await getUnits();
                units.value = unitsData;
            }, 500);
        });
        return{
            icons,
            units,

            handlePickedUnit
        }
    }
});
</script>