<template>
    <ion-page style="margin-top: 65px;">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
                </ion-buttons>
                <ion-title>Component</ion-title>
                <ion-buttons slot="end">
                <ion-button @click="" :strong="true">Confirm</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-card>
                <ion-card-header>
                <ion-card-title>Component Details</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-item>
                        <ion-input label="Barcode" label-placement="floating" fill="solid" v-model="item_component.component_barcode" ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-textarea label="Description" label-placement="floating" fill="solid" autoGrow="true" v-model="item_component.component_description" placeholder="Item Description"></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-input label="Unit" label-placement="floating" fill="solid"  :readonly="true" v-model="item_component.unit" placeholder="Pc(s)" 
                        @click="openUnitModal"></ion-input>
                    </ion-item>
                    <ion-item>
                        <InputFloat label="Price" label-placement="floating" fill="solid" v-model="item_component.quantity"></InputFloat>
                    </ion-item>
                </ion-card-content>
                
                <ion-item>
                    <ion-button size="medium" color="danger" @click="cancel" :strong="true">
                        <ion-icon :icon="icons.closeCircleOutline"></ion-icon>
                        &nbsp;Cancel
                    </ion-button>
                    <ion-button size="medium" slot="end" @click="" :strong="true">
                        <ion-icon :icon="icons.saveOutline"></ion-icon>
                        &nbsp;Save
                    </ion-button>
                </ion-item> 
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { ITEM_COMPONENT_DTO } from '@/models/item-component.model';
import { icons } from '@/plugins/icons';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import UnitListModal from '../Modal/UnitListModal.vue';
import InputFloat from '../InputFloat.vue';


export default defineComponent({
    components: { 
        InputFloat
    },
    props: {
        item: {
            type: Object,
            default: () => ({})
        },
        item_id:{
            type: Number,
            required: true
        }
    },
    setup(props){
        const { item } = toRefs(props);
        const item_component = ref<ITEM_COMPONENT_DTO>({
            id: 0,
            item_id: 0,
            item_code:  '',
            item_barcode: '',
            item_description: '',
            component_id: 0,
            component_code: '',
            component_barcode:  '',
            component_description: '',
            particulars:'',
            unit_id:  0,
            unit_code:  '',
            unit:  '',
            quantity: 0
        })

        const openUnitModal = async () => {
            const modal = await modalController.create({
            component: UnitListModal,
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                item_component.value.unit_id = data.id;
                item_component.value.unit_code = data.unit_code;
                item_component.value.unit = data.unit;
            }
        };
        const cancel = () => modalController.dismiss('', 'cancel');

        async function loadDataValue() {
            if(item.value && Object.keys(item.value).length > 0){
                item_component.value = {
                    id: item.value.id,
                    item_id: item.value.item_id,
                    item_code:  item.value.item_code,
                    item_barcode: item.value.item_barcode,
                    item_description: item.value.item_description,
                    component_id: item.value.component_id,
                    component_code: item.value.component_code,
                    component_barcode: item.value.component_barcode,
                    component_description: item.value.component_description,
                    unit_id:  item.value.unit_id,
                    unit_code:  item.value.unit_code,
                    unit:  item.value.unit,
                    particulars: item.value.particulars,
                    quantity: item.value.quantity,
                }
            }else{
                item_component.value = {
                    id: 0,
                    item_id: props.item_id,
                    item_code: '',
                    item_barcode: '',
                    item_description: '',
                    component_id: 0,
                    component_code: '',
                    component_barcode: '',
                    component_description: '',
                    unit_id:  0,
                    unit_code: '',
                    unit: '',
                    particulars: '',
                    quantity: 0,
                }
            }
        }
        onMounted(async () => {
            console.log(item.value)
        });
        onIonViewDidEnter(async () => {
            console.log(item.value)
        });
        return{
            icons,
            item_component,
            openUnitModal,
            cancel,
        }
    }
})
</script>