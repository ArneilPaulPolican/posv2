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
                <div style="padding: 5px;">
                    <ion-item>
                        <ion-input label="Barcode" label-placement="floating" fill="solid" :disabled="is_locked" v-model="item.bar_code" ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-textarea label="Description" label-placement="floating" fill="solid" autoGrow="true" :disabled="is_locked" v-model="item.item_description" placeholder="Item Description"></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6" @click="openUnitModal">
                                <ion-input label="Unit" label-placement="floating" fill="solid" :disabled="is_locked" :readonly="true" v-model="item.unit" placeholder="Pc(s)" ></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <InputFloat label="Price" :disabled="is_locked" :amount="item.price" @update="(floatValue) => item.price = floatValue"></InputFloat>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <InputFloat label="Cost" :disabled="is_locked" :amount="item.cost" @update="(floatValue) => item.cost = floatValue"></InputFloat>
                            </ion-col>
                            <ion-col size="6">
                                <InputFloat readonly label="Onhand Quantity" :disabled="is_locked" :amount="item.quantity" @update="(floatValue) => item.quantity = floatValue"></InputFloat>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    
                    <ion-item>
                        <ion-row>
                            <ion-col>
                                <ion-checkbox :disabled="is_locked" v-model="item.is_inventory" label-placement="start">Is Inventory</ion-checkbox>
                            </ion-col>
                            <ion-col >
                                <ion-checkbox disabled="true" v-model="item.is_vat_inclusive" label-placement="start">VAT Inclusive</ion-checkbox>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-input label="Tax" label-placement="floating" fill="solid" :disabled="is_locked" :readonly="true" v-model="item.tax" placeholder="VAT" @click="openTaxModal"></ion-input>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">Alias </ion-label> -->
                        <ion-textarea label="Alias" label-placement="floating" fill="solid" autoGrow="true" :disabled="is_locked" v-model="item.alias" placeholder="Alias" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">Generic Name </ion-label> -->
                        <ion-textarea label="Generic Name" label-placement="floating" fill="solid" autoGrow="true" :disabled="is_locked" v-model="item.generic_name" placeholder="Generic Name" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">Remarks </ion-label> -->
                        <ion-textarea label="Remarks" label-placement="floating" fill="solid" autoGrow="true" :disabled="is_locked" v-model="item.remarks" placeholder="Remarks" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-grid>
                            <ion-row>
                                <ion-col>
                                    <div style="height: 200px;width: auto; display: flex;flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center;">
                                        <img v-if="item.image_path" :src="item.image_path" alt="Image" style="height: 200px;width: auto;"/>
                                    </div>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                    <ion-item >
                        <ion-row>
                            <ion-col> 
                                <ion-button v-if="!is_locked" @click="captureImage" size="large" expand="block">
                                    <ion-icon :icon="icons.camera"></ion-icon>
                                </ion-button>
                            </ion-col>
                            <ion-col> 
                                <ion-button v-if="!is_locked" @click="retreiveImage" size="large" expand="block">
                                    <ion-icon :icon="icons.attachSharp"></ion-icon>
                                </ion-button>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                </div>

            </ion-list>

            <!-- PRICES -->
            <ion-card>
                <ion-card-header>
                <ion-card-title>Prices</ion-card-title>
                <!-- <ion-card-subtitle>Card Subtitle</ion-card-subtitle> -->
                </ion-card-header>
                <ion-button fill="clear" size="medium" xstyle="height: 90%"
                    @click="openPriceDetailModal(null)" >
                        <ion-icon :icon="icons.addCircle"></ion-icon>
                        <ion-label>&nbsp;New Price</ion-label>
                </ion-button>
                <ion-card-content>
                    <ion-list :inset="true" style="margin: 10px" v-for="price in itemPrices" :key="price.id">
                        <ion-grid>
                            <ion-row>
                                <ion-col>
                                    <ion-button v-if="!is_locked" color="danger" @click="confirmDelete('price', price)">
                                        <ion-icon :icon="icons.trashBinOutline"></ion-icon>
                                    </ion-button>
                                    <ion-button v-if="!is_locked" @click="openPriceDetailModal(price)">
                                        <ion-icon :icon="icons.pencilOutline"></ion-icon>
                                    </ion-button>
                                </ion-col>
                                <ion-col  size="9">
                                    <p>{{ price.unit_code }} &nbsp; {{  price.unit }}</p>
                                    <p>{{ price.particulars }}</p>
                                    <p>{{ price.price.toFixed(2) }}</p>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-list>
                </ion-card-content>
            </ion-card>

            <!-- COMPONENTS -->
            <ion-card>
                <ion-card-header>
                <ion-card-title>Components</ion-card-title>
                <!-- <ion-card-subtitle>Card Subtitle</ion-card-subtitle> -->
                </ion-card-header>
                <ion-button fill="clear"     size="medium" xstyle="height: 90%"
                    @click="openComponentDetailModal(null)" >
                        <ion-icon :icon="icons.addCircle"></ion-icon>
                        <ion-label>&nbsp;New Component</ion-label>
                </ion-button>
                <ion-card-content>
                    <ion-list :inset="true" style="margin: 10px" v-for="component in itemComponents" :key="component.id">
                        <ion-grid>
                            <ion-row>
                                <ion-col>
                                    <ion-button v-if="!is_locked" color="danger" @click="confirmDelete('component', component)">
                                        <ion-icon :icon="icons.trashBinOutline"></ion-icon>
                                    </ion-button>
                                    <ion-button v-if="!is_locked" @click="openComponentDetailModal(component)">
                                        <ion-icon :icon="icons.pencilOutline"></ion-icon>
                                    </ion-button>
                                </ion-col>
                                <ion-col  size="9">
                                    <p>{{ component.component_barcode }}</p>
                                    <p>{{ component.component_description }}</p>
                                    <p>{{ component.unit_code }}</p>
                                    <p>{{ component.quantity }}</p>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-list>
                </ion-card-content>
            </ion-card>
            
                  <!-- Global Alert -->
            <GlobalAlertComponent
                ref="globalAlert"
                :header="alertHeader"
                :message="alertMessage"
                :buttons="alertButtons"
            />
        </ion-content>

    </ion-page>
</template>

<script  lang="ts">
import { icons } from '@/plugins/icons';
import { Component, defineComponent, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { addItem, getItemById, getItems, getTransaction, lockItem, unlockItem, updateItem } from '@/services/setup/item.service';
import { Lock } from '@/services/lock';
import ITEM_DTO, { ITEM } from '@/models/item.model';
import UnitListModal from '@/components/Modal/UnitListModal.vue';
import TaxListModal from '@/components/Modal/TaxListModal.vue';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { presentToast } from '@/composables/toast.composables';
import { reload } from 'ionicons/icons';
import { usePhotoGallery } from '@/composables/image.composable';
import InputFloat from '@/components/InputFloat.vue';
import { deleteItemComponent, getItemComponents } from '@/services/setup/item-component.service';
import { deleteItemPrice, getItemPrices } from '@/services/setup/item-price.service';
import { ITEM_COMPONENT, ITEM_COMPONENT_DTO } from '@/models/item-component.model';
import { ITEM_PRICE, ITEM_PRICE_DTO } from '@/models/item-price.model';
import ComponentDetails from '@/components/Item/ComponentDetails.vue';
import PriceDetails from '@/components/Item/PriceDetails.vue';
import GlobalAlert from '@/components/GlobalAlert.vue';
import GlobalAlertComponent from '@/components/GlobalAlertComponent.vue';


export default defineComponent({
    components: { 
        UnitListModal,
        TaxListModal,
        GlobalAlertComponent,
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
        const itemComponents = ref<ITEM_COMPONENT_DTO[]>([])
        const itemPrices = ref<ITEM_PRICE_DTO[]>([])
        let item_id = 0;
        const open_unit_modal = ref(false);
        const open_tax_modal = ref(false);

        const open_alert = ref(false);
        const alertTitle = ref('');
        const alertSubTitle = ref('');
        const alertMessage = ref('');
        const globalAlert = ref<InstanceType<typeof GlobalAlertComponent> | null>(null);
        const alertHeader = ref('');
        const deleteType = ref<string>('');
        const deleteData = ref<any>(null);

        const not_found = ref(false);

        const is_locked = ref(false);
        const with_trn = ref(false);
        //#endregion

        //#region FUNCTIONS
        // Back
        function handleBackButton(){
            router.push(`/Setup/Items`);
        }

        const openUnitModal = async () => {
            if(with_trn.value){
                await presentToast(`Item already has transaction.`);
                return;
            }
            if(!is_locked.value){
                const modal = await modalController.create({
                component: UnitListModal,
                // componentProps: { data: sales } 
                });

                modal.present();
                const { data, role } = await modal.onWillDismiss();
                if (role === 'confirm') {
                item.value.unit_id = data.id;
                item.value.unit = data.unit_code;
                }
            }
        };

        const confirmReturn =() => {
            open_alert.value = false;
        }
        const show_alert =() => {
            open_alert.value = true;
            console.log('alert triggered ', open_alert.value);
        }
        const alertButtons = [
            {
                text: 'Cancel',
                role: 'cancel',
            },
            {
                text: 'Confirm',
                role: 'confirm',
                handler: () => {
                    if (deleteType.value.toLowerCase() === 'price') {
                        deletePrice(deleteData.value); // Call the deletePrice function
                    } else if (deleteType.value.toLowerCase() === 'component') {
                        deleteComponents(deleteData.value); // Call the deleteComponent function
                    }
                },
            },
        ];

        const confirmDelete = (type:string, data: any) => {
            alertHeader.value = `Delete ${type}`;
            alertMessage.value = `Are you sure you want to delete this ${type}?`;
            deleteType.value = type;
            deleteData.value = data;
            globalAlert.value?.openAlert();
        };
        
        const openTaxModal = async () => {
            if(!is_locked.value){
                const modal = await modalController.create({
                component: TaxListModal,
                // componentProps: { data: sales } 
                });

                modal.present();
                const { data, role } = await modal.onWillDismiss();
                if (role === 'confirm') {
                    if(data.rate > 0) item.value.is_vat_inclusive = true;

                    item.value.tax_id = data.id;
                    item.value.tax = data.tax;
                }
            }
        };

        const openPriceDetailModal = async (itemPrice:ITEM_PRICE_DTO | null) => {
            if(!is_locked.value){
                const modal = await modalController.create({
                    component: PriceDetails,
                    componentProps: { item_price_props: itemPrice, item_id:item.value.id  } 
                });

                modal.present();
                const { data, role } = await modal.onWillDismiss();
                if (role === 'confirm') {
                    fetchDetails();
                }
            }
        };

        const openComponentDetailModal = async (itemComponent:ITEM_COMPONENT_DTO | null) => {
            if(!is_locked.value){
                const modal = await modalController.create({
                    component: ComponentDetails,
                    componentProps: { item_component_props: itemComponent, item_id:item.value.id  } 
                });

                modal.present();
                const { data, role } = await modal.onWillDismiss();
                if (role === 'confirm') {
                    fetchDetails();
                }
            }
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

                        const transaction = await getTransaction(itemRes.data.id);
                        if(transaction.exist){
                            with_trn.value = true;
                        }else{
                            with_trn.value = false;
                        }

                        await fetchPrices(item_id)
                        await fetchComponents(item_id);
                    }
                }else{ 
                    await presentToast('No item found');
                    handleBackButton()
                }
                
            }, 300);
        }

        async function deleteComponents(component: ITEM_COMPONENT) {
            console.log('delete components: ', component)
            try {
                const response = deleteItemComponent(component.id)
                if((await response).success){
                    await presentToast('Item Component successfully deleted!.');
                    await fetchDetails();
                }else{
                    await presentToast('Failed to unlock item')
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }

        async function fetchComponents(item_id:number) {
            try {
                setTimeout(async () => {
                    const itemComponentResult = await getItemComponents(1, 10, item_id);
                    if(itemComponentResult.success){
                        itemComponents.value = itemComponentResult.data;
                    }
                });
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }

        async function deletePrice(price:ITEM_PRICE) {
            console.log('delete price: ', price)
            try {
                const response = deleteItemPrice(price.id)
                if((await response).success){
                    await presentToast('Item  Price successfully deleted!.');
                    await fetchDetails();
                }else{
                    await presentToast('Failed to unlock item')
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }

        async function fetchPrices(item_id:number) {
            try {
                setTimeout(async () => {
                    const itemPricesResult = await getItemPrices(1, 10, item_id);
                    if(itemPricesResult.success){
                        itemPrices.value = itemPricesResult.data;
                    }
                });
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
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
            // handleUnitPicked,
            handleBackButton,

            is_locked,

            open_alert,
            alertMessage,
            alertTitle,
            alertHeader,
            alertSubTitle,
            not_found,

            handleSave,
            openUnitModal,
            openTaxModal,
            // handleTaxPicked,
            confirmReturn,

            show_alert,
            alertButtons,
            confirmDelete,
            globalAlert,

            handleLock,
            handleUnlock,

            captureImage,
            retreiveImage,
            // trimLeadingZero
            with_trn,
            itemPrices,
            deletePrice,
            openPriceDetailModal,

            itemComponents,
            openComponentDetailModal,
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