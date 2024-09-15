<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->

        <ion-item>
            <div style="display: flex; overflow-x: auto; white-space: nowrap; width: 100%; padding-right: 10px;height: 100%; align-items: center;">
                <!-- <ion-icon :ios="icons.arrowBackOutline" :md="icons.arrowBackSharp" @click="handleBackButton"></ion-icon> -->
                <ion-button size="medium" expand="block" style="height: 90%"
                    @click="handleBackButton()" >
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                        <ion-label>Back</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" size="medium" expand="block" style="height: 90%"
                    @click="handleSave()" >
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.saveSharp"></ion-icon>
                        <ion-label>Save</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" size="medium" expand="block" style="height: 90%"
                    @click="handleLock()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label>Lock</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="is_locked" size="medium" expand="block" style="height: 90%"
                    @click="handleUnlock()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.lockOpenSharp"></ion-icon>
                        <ion-label>Unlock</ion-label>
                    </div>
                </ion-button>
            </div>
        </ion-item>
        
        <ion-item>
            <h1>{{ item.item_code }}</h1>
        </ion-item>

        <ion-content :fullscreen="true">
            
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    <ion-item >
                        <ion-label position="stacked">Barcode :</ion-label>
                        <ion-input :disabled="is_locked" v-model="item.bar_code" placeholder="012345678912"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Description :</ion-label>
                        <ion-textarea :disabled="is_locked" v-model="item.item_description" placeholder="Item Description"></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Unit :</ion-label>
                                <ion-input :disabled="is_locked" :readonly="true" v-model="item.unit" placeholder="Pc(s)" @click="openUnitModal(true)"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Price : </ion-label>
                                <!-- <ion-input :disabled="is_locked" v-model="trimmedPrice" type="number" placeholder="Enter Price" ></ion-input> -->
                                <InputFloat :disabled="is_locked" :amount="item.price" @update="(floatValue) => item.price = floatValue"></InputFloat>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Cost :</ion-label>
                                <!-- <ion-input :disabled="is_locked" v-model="item.cost" type="number" placeholder="Enter Cost" ></ion-input> -->
                                <InputFloat :disabled="is_locked" :amount="item.cost" @update="(floatValue) => item.cost = floatValue"></InputFloat>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Onhand Quantity :</ion-label>
                                <InputFloat :disabled="is_locked" :amount="item.quantity" @update="(floatValue) => item.quantity = floatValue"></InputFloat>
                                <!-- <ion-input v-model="item.quantity" type="number" placeholder="0.00" disabled></ion-input> -->
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    
                    <ion-item>
                        <ion-row>
                            <ion-col>
                                <ion-checkbox :disabled="is_locked" v-model="item.is_inventory" label-placement="start">Is Inventory</ion-checkbox>
                            </ion-col>
                            <ion-col >
                                <ion-checkbox :disabled="is_locked" v-model="item.is_vat_inclusive" label-placement="start">VAT Inclusive</ion-checkbox>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Tax :</ion-label>
                        <ion-input :disabled="is_locked" :readonly="true" v-model="item.tax" placeholder="VAT"></ion-input>
                        <ion-button :disabled="is_locked" slot="end" fill="outline" size="medium" style="align-self: center;" @click="openTaxModal(true)">
                            <ion-icon :icon="icons.ellipsisHorizontalOutline"></ion-icon>
                        </ion-button>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Alias :</ion-label>
                        <ion-textarea :disabled="is_locked" v-model="item.alias" placeholder="Alias" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Generic Name :</ion-label>
                        <ion-textarea :disabled="is_locked" v-model="item.generic_name" placeholder="Generic Name" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Remarks :</ion-label>
                        <ion-textarea :disabled="is_locked" v-model="item.remarks" placeholder="Remarks" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <div style="height: 100px;width: auto; display: flex;flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center;">
                            <img v-if="item.image_path" :src="item.image_path" alt="Image" />
                        </div>
                    </ion-item>
                    <ion-item >
                        <ion-button v-if="!is_locked" @click="captureImage">
                            <ion-icon :icon="icons.camera"></ion-icon>
                        </ion-button>
                        <ion-button v-if="!is_locked" @click="retreiveImage">
                            <ion-icon :icon="icons.attachSharp"></ion-icon>
                        </ion-button>
                    </ion-item>
                </div>

            </ion-list>

            
            <ion-modal :is-open="open_unit_modal" @close="open_unit_modal = false">
                <UnitListModal @unit-picked="handleUnitPicked"  @close="open_unit_modal = false"/>
            </ion-modal>
            <ion-modal :is-open="open_tax_modal" @close="open_tax_modal = false">
                <TaxListModal @tax-picked="handleTaxPicked"  @close="open_tax_modal = false"/>
            </ion-modal>
        </ion-content>
        
    </ion-page>
</template>

<script  lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { addItem, getItemById, getItems, lockItem, unlockItem, updateItem } from '@/services/setup/item.service';
import { Lock } from '@/services/lock';
import ITEM_DTO, { ITEM } from '@/models/item.model';
import UnitListModal from '@/components/Modal/UnitListModal.vue';
import TaxListModal from '@/components/Modal/TaxListModal.vue';
import { onIonViewDidEnter } from '@ionic/vue';
import { presentToast } from '@/composables/toast.composables';
import { reload } from 'ionicons/icons';
import { usePhotoGallery } from '@/composables/image.composable';
import InputFloat from '@/components/InputFloat.vue';


export default defineComponent({
    components: { 
        UnitListModal,
        TaxListModal,
        InputFloat
    },
    setup() {
        //#region VARIABLES
        const { takePhoto, selectPhoto, loadImageFromFilesystem, savedPhotoPath } = usePhotoGallery();

        const route = useRoute();
        const dbLock = new Lock(); // Create a new lock
        const router = useRouter();
        const item = ref<ITEM_DTO>({
            id:0,
            item_code: '',
            bar_code: '',
            item_description: '',
            alias: '',
            category: '',
            price: 0,
            cost: 0,
            quantity: 0,
            unit_id: 0,
            unit:'',
            is_inventory: false,
            generic_name: '',
            tax_id: 0,
            tax:'',
            remarks: '',
            image_path: '',
            is_package: false,
            is_locked: false,
            is_vat_inclusive: false,
            expiry_date:'',
            lot_number:''
        });
        let item_id = 0;
        const open_unit_modal = ref(false);
        const open_tax_modal = ref(false);
        const open_alert = ref(false);
        const alertTitle = ref('');
        const alertSubTitle = ref('');
        const alertMessage = ref('');
        const not_found = ref(false);

        const is_locked = ref(false);
        //#endregion

        //#region FUNCTIONS
        // Back
        function handleBackButton(){
            router.push(`/Setup/Items`);
        }

        // const trimLeadingZero = async (value: string) => {
        //     return value.replace(/^0+/g, '');
        // }
        
        function openUnitModal(isOpen: boolean) {
            if(!is_locked){
                open_unit_modal.value = isOpen
            }
        }

        const handleUnitPicked = (unit: any) => {
            // Handle the picked unit data here
            open_unit_modal.value = false;
            item.value.unit_id = unit.id;
            item.value.unit = unit.unit_code;
            // Process the unit data as needed
        };

        const confirmReturn =() => {
            open_alert.value = false;
        }
        
        function openTaxModal(isOpen: boolean) {
            open_tax_modal.value = isOpen;
        }
        const handleTaxPicked = (tax: any) => {
            open_tax_modal.value = false;
            item.value.tax_id = tax.id;
            item.value.tax = tax.tax;
        };

        // Capture an image and save it
        const captureImage = async () => {
            const dataUrl = await takePhoto();
            console.log(`dataUrl ${JSON.stringify(dataUrl)}`);
            const webPath = dataUrl?.webPath;
            const format = dataUrl?.format;
            // blobUrl.value = dataUrl?.webPath ?? '';
            console.log(`webPath: ${webPath}`);
            console.log(`format: ${format}`);
            // await updateImage(webPath) 
            if(webPath){
                item.value.image_path = webPath ?? '';
            }
        };

        const retreiveImage = async () => {
            const dataUrl = await selectPhoto();
            console.log(`dataUrl ${JSON.stringify(dataUrl)}`);
            const webPath = dataUrl?.webPath;
            const format = dataUrl?.format;
            // blobUrl.value = dataUrl?.webPath ?? '';
            console.log(`webPath: ${webPath}`);
            console.log(`format: ${format}`);
            // updateImage(webPath) 
            if(webPath){
                item.value.image_path = webPath ?? '';
            }
        };

        const handleSave = async () => {
            try {
                const response = await updateItem(item.value);
                if(response){
                    await presentToast('Item successfully updated');
                }else{
                    await presentToast('Failed to update item')
                }
            } catch (err) {
                await presentToast(`Operation failed: ${err}`)
            }
        }

        const handleLock = async () => {
            try {
                const response = await lockItem(item.value);
                if(response.success){
                    await presentToast('Item successfully locked');
                    is_locked.value = true;
                }else{
                    await presentToast('Failed to lock item')
                }
            } catch (err) {
                await presentToast('Error adding data:')
            }
        }

        const handleUnlock = async () => {
            try {
                const response = await unlockItem(item.value);
                if(response.success){
                    await presentToast('Item successfully unlock');
                    is_locked.value = false;
                }else{
                    await presentToast('Failed to unlock item')
                }
            } catch (err) {
                await presentToast(`Operation failed: ${err}`)
            }
        }

        async function fetchDetails() {
            const routeParams = +route.params.id;
            item_id = routeParams;

            setTimeout(async () => {
                const itemRes = await getItemById(routeParams)
                if(itemRes.success){
                    if(itemRes.data){
                        is_locked.value = itemRes.data.is_locked;
                        console.log(itemRes.data.image_path);
                        item.value = {
                            id: itemRes.data.id,
                            item_code: itemRes.data.item_code,
                            item_description: itemRes.data.item_description ,
                            bar_code: itemRes.data.bar_code ,
                            alias: itemRes.data.alias ,
                            category: itemRes.data.category,
                            price: itemRes.data.price,
                            cost: itemRes.data.cost ,
                            quantity: itemRes.data.quantity,
                            unit_id: itemRes.data.unitId, // Map unitId to unit_id
                            unit: itemRes.data.unit_code,
                            is_inventory: itemRes.data.is_inventory ,
                            generic_name: itemRes.data.generic_name,
                            tax_id: itemRes.data.taxId,
                            tax: itemRes.data.tax_code,
                            remarks: itemRes.data.remarks,
                            image_path: itemRes.data.image_path,
                            is_package: itemRes.data.is_package,
                            is_locked: itemRes.data.is_locked ,
                            is_vat_inclusive: itemRes.data.is_vat_inclusive,
                            expiry_date: itemRes.data.expiry_date,
                            lot_number: itemRes.data.lot_number,
                        };

                    }
                }else{ 
                    await presentToast('No item found');
                    handleBackButton()
                }
                
            }, 300);
        }
        //#endregion
        onMounted(async () => {
            await fetchDetails();
        });
        onIonViewDidEnter(async () => {
            await fetchDetails()
        });
        
        return{
            header:'ITEM DETAILS',
            icons,
            item,
            open_unit_modal,
            open_tax_modal,
            handleUnitPicked,
            handleBackButton,

            is_locked,

            open_alert,
            alertMessage,
            alertTitle,
            alertSubTitle,
            not_found,

            handleSave,
            openUnitModal,
            openTaxModal,
            handleTaxPicked,
            confirmReturn,

            handleLock,
            handleUnlock,

            captureImage,
            retreiveImage,
            // trimLeadingZero
        }
    },
    computed: {
        trimmedPrice: {
            get() {
                return this.item.price.toString().replace(/^0+/g, '');
            },
            set(value: string) {
                this.item.price = parseFloat(value);
            }
        }
    }
});
</script>