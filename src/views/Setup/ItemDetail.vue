<template>
    <ion-page :key="$route.path">
        <!-- <HeaderComponent :title="header" /> -->

        <ion-item>
            <ion-icon :ios="icons.arrowBackOutline" :md="icons.arrowBackSharp" @click="icon_is_clicked"></ion-icon>
            <ion-button slot="end" size="medium" expand="block" style="height: 100%"
                @click="handleSave()">
                <ion-label>Save</ion-label>
            </ion-button>
        </ion-item>
        
        <ion-item>
            <h1>{{ item.item_code }}</h1>
        </ion-item>

        <ion-content :fullscreen="true">
            
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    <ion-item >
                        <ion-label position="stacked">Barcode :</ion-label>
                        <ion-input v-model="item.bar_code" placeholder="012345678912"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Description :</ion-label>
                        <ion-textarea v-model="item.item_description" placeholder="Item Description"></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Unit :</ion-label>
                                <ion-input :readonly="true" v-model="item.unit" placeholder="Pc(s)" @click="openUnitModal(true)"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Price : </ion-label>
                                <ion-input  v-model="item.price" type="number" placeholder="Enter Price" ></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">Cost :</ion-label>
                                <ion-input v-model="item.cost" type="number" placeholder="Enter Cost" ></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Onhand Quantity :</ion-label>
                                <ion-input v-model="item.quantity" type="number" placeholder="0.00"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col>
                                <ion-label position="stacked">Tax :</ion-label>
                                <ion-input :readonly="true" v-model="item.tax" placeholder="VAT" @click="openTaxModal(true)"></ion-input>
                            </ion-col>
                            <ion-col  size="8">
                                <ion-datetime-button v-model="item.expiry_date" datetime="datetime"></ion-datetime-button>
                                <ion-modal :keep-contents-mounted="true">
                                    <ion-datetime id="datetime"></ion-datetime>
                                </ion-modal>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Alias :</ion-label>
                        <ion-textarea v-model="item.alias" placeholder="Alias" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Generic Name :</ion-label>
                        <ion-textarea v-model="item.generic_name" placeholder="Generic Name" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Remarks :</ion-label>
                        <ion-textarea v-model="item.remarks" placeholder="Remarks" ></ion-textarea>
                    </ion-item>
                    <ion-item>
                        <img v-if="item.image_path" :src="item.image_path" >
                    </ion-item>
                </div>

            </ion-list>

            
            <ion-modal :is-open="open_unit_modal" @close="open_unit_modal = false">
                <UnitListModal @unit-picked="handleUnitPicked"  @close="open_unit_modal = false"/>
            </ion-modal>
            <ion-modal :is-open="open_tax_modal" @close="open_tax_modal = false">
                <TaxListModal @unit-picked="handleTaxPicked"  @close="open_tax_modal = false"/>
            </ion-modal>
        </ion-content>
        
        <AlertComponent v-if="open_alert"
        :title="alertTitle"
        :sub_title="alertSubTitle"
        :message="alertMessage"
        @cancel="open_alert = false"
        @confirm="confirmReturn"
        />
    </ion-page>
</template>

<script  lang="ts">
import { icons } from '@/plugins/icons';
import { onBeforeUnmount, onMounted, ref, toRaw } from 'vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { addItem, getItemById, getItems, getLastItemCode, updateItem } from '@/services/setup/item.service';
import { Lock } from '@/services/lock';
import ITEM_DTO, { ITEM } from '@/models/item.model';
import UnitListModal from '@/components/Modal/UnitListModal.vue';
import TaxListModal from '@/components/Modal/TaxListModal.vue';
import AlertComponent from '@/components/Modal/AlertComponent.vue';
import { onIonViewDidEnter } from '@ionic/vue';


export default {
name: 'ITEM DETAILS', // Update the component name here
    components: { 
        // HeaderComponent,
        UnitListModal,
        TaxListModal,
        AlertComponent
    },
    setup() {
        //#region VARIABLES
        const route = useRoute();
        const dbLock = new Lock(); // Create a new lock
        const router = useRouter();
        const imagePath = ref('');
        // const item = ref<any>({});
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
        //#endregion

        //#region FUNCTIONS
        // Back
        function icon_is_clicked(){
            router.push(`/Setup/Items`);
        }
        
        function openUnitModal(isOpen: boolean) {
            open_unit_modal.value = isOpen
        }

        const handleUnitPicked = (unit: any) => {
            // Handle the picked unit data here
            open_unit_modal.value = false;
            console.log('Picked unit:', unit);
            item.value.unit_id = unit.id;
            console.log('unit:', item.value.unit_id);
            // Process the unit data as needed
        };

        const confirmReturn =() => {
            open_alert.value = false;
        }
        
        
        function openTaxModal(isOpen: boolean) {
            open_tax_modal.value = isOpen
        }
        const handleTaxPicked = (tax: any) => {
            // Handle the picked unit data here
            open_tax_modal.value = false;
            console.log('Picked unit:', tax);
            item.value.tax_id = tax.id;
            console.log('unit:', item.value.tax_id);
            // Process the unit data as needed
        };

        // add data
        const handleSave = async () => {
            try {
                if(item_id == 0){
                    console.log('New')
                    const response = await addItem(item.value, imagePath.value);
                    if(response){
                        console.log('Item successfully created')
                    }else{
                        console.error('Failed to create item')
                    }
                }else{
                    console.log('Update')
                    const response = await updateItem(item.value, imagePath.value);
                    if(response){
                        console.log('Item successfully updated')
                    }else{
                        console.error('Failed to update item')
                    }
                }
            } catch (err) {
                dbLock.release(); // Release the lock after the operation
                console.error('Error adding data:', err)
            }
        }

        async function fetchDetails() {
            const routeParams = +route.params.id;
            item_id = routeParams ;
            if(item_id != 0){
                const itemRes = await getItemById(routeParams)
                if(itemRes){
                    item.value = {
                        id: itemRes.id,
                        item_code: itemRes.item_code,
                        item_description: itemRes.item_description ,
                        bar_code: itemRes.bar_code ,
                        alias: itemRes.alias ,
                        category: itemRes.category,
                        price: itemRes.price,
                        cost: itemRes.cost ,
                        quantity: itemRes.quantity,
                        unit_id: itemRes.unitId, // Map unitId to unit_id
                        unit: itemRes.unit_code,
                        is_inventory: itemRes.is_inventory ,
                        generic_name: itemRes.generic_name,
                        tax_id: itemRes.taxId, // Map taxId to tax_id
                        tax: itemRes.tax_code,
                        remarks: itemRes.remarks,
                        image_path: itemRes.image_path,
                        // file_extension: itemRes.file_extension || '',
                        is_package: itemRes.is_package,
                        // item_components: itemRes.item_components || [], // Handle optional properties
                        is_locked: itemRes.is_locked ,
                        expiry_date: itemRes.expiry_date ,
                        lot_number: itemRes.lot_number,
                    };
                }else{ 
                    alertTitle.value = 'Not Found';
                    alertMessage.value = 'No Item exist';
                    open_alert.value = true; // Open the alert
                }
            }else{
                const item_code = await getLastItemCode();
                const current_code = parseInt(item_code, 10);
                const next_code = current_code + 1;
                const formatted_next_code = next_code.toString().padStart(10, '0');
                item.value.item_code = formatted_next_code;
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
            handleUnitPicked,
            icon_is_clicked,

            open_alert,
            alertMessage,
            alertTitle,
            alertSubTitle,
            not_found,

            handleSave,
            openUnitModal,
            openTaxModal,
            handleTaxPicked,
            confirmReturn
        }
    }
}
</script>