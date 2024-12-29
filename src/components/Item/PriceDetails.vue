<template>

    <ion-page style="margin-top: 65px;">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                </ion-buttons>
                <ion-title>Price</ion-title>
                <ion-buttons slot="end">
                <ion-button color="medium" @click="cancel">Close</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">

            <ion-card>
                <ion-card-header>
                <ion-card-title>Price Details</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    <ion-item>
                        <ion-input label="Unit" label-placement="floating" fill="solid"  :readonly="true" v-model="item_price.unit" placeholder="Pc(s)" 
                        @click="openUnitModal"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-textarea label="Particulars" label-placement="floating" fill="solid" v-model="item_price.particulars">
                        </ion-textarea>
                    </ion-item>
                    <ion-item>
                        <InputFloat label="Cost" label-placement="floating" fill="solid" v-model="item_price.cost"></InputFloat>
                    </ion-item>
                    <ion-item>
                        <InputFloat label="Price" label-placement="floating" fill="solid" v-model="item_price.price"></InputFloat>
                    </ion-item>
                </ion-card-content>

                <ion-item>
                    <ion-button size="medium" color="danger" @click="cancel" :strong="true">
                        <ion-icon :icon="icons.closeCircleOutline"></ion-icon>
                        &nbsp;Cancel
                    </ion-button>
                    <ion-button size="medium" slot="end" @click="onSubmit" :strong="true">
                        <ion-icon :icon="icons.saveOutline"></ion-icon>
                        &nbsp;Save
                    </ion-button>
                </ion-item> 
            </ion-card>

        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { ITEM_PRICE_DTO } from '@/models/item-price.model';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref, toRefs, PropType } from 'vue';
import UnitListModal from '../Modal/UnitListModal.vue';
import InputFloat from '../InputFloat.vue';
import { icons } from '@/plugins/icons';
import { addItemPrice, updateItemPrice } from '@/services/setup/item-price.service';
import { presentToast } from '@/composables/toast.composables';

export default defineComponent({
    components: { 
        InputFloat
    },
    props: {
        item_price_props: {
            type: Object as PropType<ITEM_PRICE_DTO | null>,
            default: () => ({})
        },
        item_id:{
            type: Number,
            required: true
        }
    },
    setup(props){
        const { item_price_props } = toRefs(props);
        const item_price = ref<ITEM_PRICE_DTO>({
            id: 0,
            item_id: 0,
            item_code:  '',
            item_barcode: '',
            item_description: '',
            unit_id:  0,
            unit_code:  '',
            unit:  '',
            particulars:'NA',
            cost: 0,
            price: 0,
        })
        const openUnitModal = async () => {
            const modal = await modalController.create({
            component: UnitListModal,
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
            item_price.value.unit_id = data.id;
            item_price.value.unit_code = data.unit_code;
            item_price.value.unit = data.unit;
            }
        };
        const cancel = () => modalController.dismiss('', 'cancel');
        
        async function onSubmit() {
            try {
                if(item_price.value.id === 0 ){
                    const result = await addItemPrice(item_price.value);
                    if(result.success){
                        await presentToast(`Item price added successfully!`)
                    }
                }else{
                    const result = await updateItemPrice(item_price.value);
                    if(result.success){
                        await presentToast(`Item price updated successfully!`)
                    }
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
            modalController.dismiss('' , 'confirm');
        }
        
        async function loadDataValue() {
            item_price.value = {
                id: 0,
                item_id: props.item_id,
                item_code:  '',
                item_barcode: '',
                item_description: '',
                unit_id:  0,
                unit_code: '',
                unit:  '',
                particulars: 'NA',
                cost: 0,
                price: 0,
            }
            if(item_price_props.value && Object.keys(item_price_props.value).length > 0){
                item_price.value = {
                    id: item_price_props.value.id,
                    item_id: item_price_props.value.item_id,
                    item_code:  item_price_props.value.item_code,
                    item_barcode: item_price_props.value.item_barcode,
                    item_description: item_price_props.value.item_description,
                    unit_id:  item_price_props.value.unit_id,
                    unit_code:  item_price_props.value.unit_code,
                    unit:  item_price_props.value.unit,
                    particulars: item_price_props.value.particulars,
                    cost: item_price_props.value.cost,
                    price: item_price_props.value.price,
                }
            }
        }
        onMounted(async () => {
            loadDataValue()
        });
        onIonViewDidEnter(async () => {
            loadDataValue()
        });
        return{
            icons,
            item_price,
            openUnitModal,
            onSubmit,
            cancel,
        }
    }
})
</script>