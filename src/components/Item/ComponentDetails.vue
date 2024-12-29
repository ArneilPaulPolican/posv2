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
                        <ion-input label="Barcode" label-placement="floating" fill="solid" :readonly="true" v-model="item_component.component_barcode"  
                        @click="openGlobalItemListModal"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-textarea label="Description" label-placement="floating" fill="solid" :readonly="true" autoGrow="true" v-model="item_component.component_description" placeholder="Item Description"></ion-textarea>
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
import { ITEM_COMPONENT_DTO } from '@/models/item-component.model';
import { icons } from '@/plugins/icons';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref, toRefs, PropType } from 'vue';
import UnitListModal from '../Modal/UnitListModal.vue';
import InputFloat from '../InputFloat.vue';
import GlobalItemListModal from '../Modal/GlobalItemListModal.vue';
import { addItemComponent, updateItemComponent } from '@/services/setup/item-component.service';
import { presentToast } from '@/composables/toast.composables';


export default defineComponent({
    components: { 
        InputFloat
    },
    props: {
        item_component_props: {
            type: Object as PropType<ITEM_COMPONENT_DTO | null>,
            default: () => ({})
        },
        item_id:{
            type: Number,
            required: true
        }
    },
    setup(props){
        const { item_component_props } = toRefs(props);
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

        const openGlobalItemListModal = async () => {
            const modal = await modalController.create({
            component: GlobalItemListModal,
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                item_component.value.component_id = data.id;
                item_component.value.component_code = data.item_code;
                item_component.value.component_barcode = data.bar_code;
                item_component.value.component_description = data.item_description;
            }
        };
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

        async function onSubmit() {
            try {
                if(item_component.value.id === 0){
                    const result = await addItemComponent(item_component.value);
                    if(result.success){
                        await presentToast(`Item price added successfully!`)
                    }
                }else{
                    const result = await updateItemComponent(item_component.value);
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
            if(item_component_props.value && Object.keys(item_component_props.value).length > 0){
                item_component.value = {
                    id: item_component_props.value.id,
                    item_id: item_component_props.value.item_id,
                    item_code:  item_component_props.value.item_code,
                    item_barcode: item_component_props.value.item_barcode,
                    item_description: item_component_props.value.item_description,
                    component_id: item_component_props.value.component_id,
                    component_code: item_component_props.value.component_code,
                    component_barcode: item_component_props.value.component_barcode,
                    component_description: item_component_props.value.component_description,
                    unit_id:  item_component_props.value.unit_id,
                    unit_code:  item_component_props.value.unit_code,
                    unit:  item_component_props.value.unit,
                    particulars: item_component_props.value.particulars,
                    quantity: item_component_props.value.quantity,
                }
            }
            console.log(item_component.value.id)
        }
        onMounted(async () => {
            loadDataValue()
        });
        onIonViewDidEnter(async () => {
            loadDataValue()
        });
        return{
            icons,
            item_component,
            openGlobalItemListModal,
            openUnitModal,
            cancel,
            onSubmit,
        }
    }
})
</script>