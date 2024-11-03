<template>
    <ion-page style="margin-top: 65px;">
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Select Price</ion-title>
            </ion-toolbar>
        </ion-header>
        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="item_price in item_prices" :key="item_price.id">
                    <ion-button size="medium" @click="handlePickedUnit(item_price)">
                        <ion-label>Pick</ion-label>
                    </ion-button>
                    &nbsp;
                    <ion-label>
                        <h2>{{ item_price.unit_code }}</h2>
                        <p>{{ item_price.unit }}</p>
                        <p>{{ item_price.particulars }}</p>
                        <p>Price:&nbsp;{{ item_price.price.toFixed(2) }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.composables';
import { defineComponent, onMounted, ref } from 'vue';
import { modalController } from '@ionic/vue';
import { getItemPrices } from '@/services/setup/item-price.service';
import { ITEM_PRICE_DTO } from '@/models/item-price.model';

export default defineComponent({
    

    props: {
        item_id:{
            type: Number,
            required: true
        }
    },
    setup(props){
        const item_prices = ref<ITEM_PRICE_DTO[]>([])

        // const handlePickedUnit = async (unit:UNIT) =>{
        //     emit('unit-picked', unit);
        //     emit('close'); 
        // }

        const cancel = () => modalController.dismiss('', 'cancel');
        const handlePickedUnit = (item_price:ITEM_PRICE_DTO) => {
            modalController.dismiss(item_price , 'confirm');
        }
        onMounted(async () => {
            setTimeout(async () => {
                try {
                    console.log('Item Id', props.item_id)
                    const result = await getItemPrices(1,10, props.item_id);
                    if(result.success){
                        item_prices.value = result.data;
                    }
                } catch (error) {
                    await presentToast('Failed retreiving Price list')
                }
            }, 500);
        });
        return{
            icons,
            item_prices,

            handlePickedUnit,
            cancel
        }
    }
});
</script>