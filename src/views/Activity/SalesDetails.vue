<template>
    <ion-page>
        <!-- <HeaderComponent :title="header"/> -->
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button size="small" position="stacked"  @click="openItemModal(true)">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>


        <ion-item style="position: relative;">
            <div style="display: flex; overflow-x: auto; white-space: nowrap; width: 100%; padding-right: 10px;height: 100%; align-items: center;">
                <ion-button @click="confirmReturn" size="medium" expand="block" style="height: 90%">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                        <ion-label>Back</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!sales.is_locked" size="medium" expand="block" style="height: 90%" @click="handleSave()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.saveSharp"></ion-icon>&nbsp;
                        <ion-label>Save</ion-label>
                    </div>
                </ion-button>
                <ion-button size="medium" expand="block" style="height: 90%" @click="handleCheckOut()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.basketSharp"></ion-icon>
                        <ion-label>Check Out</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!sales.is_locked" size="medium" expand="block" style="height: 90%" @click="handleLock()">
                    <div class="icon-label-wrapper">
                        <ion-icon  :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label>Lock</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="sales.is_locked" size="medium" expand="block" style="height: 90%" @click="handleUnlock()">
                    <div class="icon-label-wrapper">
                        <ion-icon  :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label>Unlock</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="sales.is_locked" size="medium" expand="block" style="height: 90%" @click="handleBillOut()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.receiptSharp"></ion-icon>
                        <ion-label>Bill</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="sales.is_locked" size="medium" expand="block" style="height: 90%" @click="handlePrint()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.printSharp"></ion-icon>
                        <ion-label>Print</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!sales.is_cancelled && sales.is_locked && sales.is_billed_out" @click="confirmReturn" size="medium" expand="block" style="height: 90%">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.closeCircle"></ion-icon>
                        <ion-label>Cancel</ion-label>
                    </div>
                </ion-button>
            </div>
        </ion-item>

        <div style="background-color: black;">
            <ion-item style="background-color: black;">
                <div>
                    <ion-chip>
                        Terminal: &nbsp;
                        <ion-label>{{ sales.terminal_number }}</ion-label>
                        <ion-icon :icon="icons.terminalOutline"></ion-icon>
                    </ion-chip>
                </div>
                <h1 slot="end">
                    ₱&nbsp;{{ (sales.net_amount?? 0).toFixed(2) }}
                </h1>
            </ion-item>
        </div>

        <ion-item>
            <ion-row>
                <ion-col size="6">
                    <ion-label position="stacked">Date:</ion-label>
                    <ion-input :readonly="true" v-model="sales.sales_date" placeholder="MM/dd/yyyy"></ion-input>
                </ion-col>
                <ion-col size="6">
                    <ion-label position="stacked">Sales Number:</ion-label>
                    <ion-input :readonly="true" v-model="sales.sales_number" placeholder="0000000001"></ion-input>
                </ion-col>
            </ion-row>
        </ion-item>
        <ion-content>
            <ion-list :inset="true" style="margin: 5px">
                <div style="padding: 5px;">
                    <ion-item>
                        <ion-label position="stacked">Customer</ion-label>
                        <ion-input v-model="sales.customer" :readonly="true" placeholder="Walk-in" @click="openCustomerModal(true)"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Discount</ion-label>
                        <ion-input v-model="sales.discount" placeholder="No Discount" @click="openDiscountModal(true)"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-chip>
                            <ion-label>Disc. Rate: {{ sales.discount_rate ?? 0 }}</ion-label>
                        </ion-chip>
                        <ion-chip>
                            <ion-label>Disc. Amount: {{ sales.discount_amount ?? 0 }}</ion-label>
                        </ion-chip>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col size="6">
                                <ion-label position="stacked">No. PAX</ion-label>
                                <ion-input v-model="sales.no_of_pax" placeholder="No. PAX"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Status</ion-label>
                                <ion-input v-model="sales.status" placeholder="NEW"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Remarks</ion-label>
                        <ion-textarea v-model="sales.remarks" placeholder="Remarks"></ion-textarea>
                    </ion-item>
                </div>
            </ion-list>

            <ion-item>
                <ion-label position="stacked">Barcode</ion-label>
                <ion-input  placeholder="00000000001"></ion-input>
            </ion-item>

            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">

                    
                    <!-- List -->
                    <ion-item v-for="item in sales_item_list" :key="item.id" @click="openActionSheet(item)">
                        <!-- <img alt="" :src="item.item_image" style="width: 100px;height: 100px; position: con;"/> -->
                        <div style="width: 50px; height: 50px; overflow: hidden;">
                            <img alt="" :src="item.item_image" style="width: 100%; height: 100%; object-fit: cover;"/>
                        </div>
                        &nbsp;
                        <ion-label>
                            <h1>{{ item.item_barcode }}</h1>
                            <p>{{ item.item_description }}</p>
                            <p>Tax:&nbsp;{{ item.tax }}</p>
                            <p>Rate:&nbsp;{{ item.tax_rate.toFixed(2) }}</p>
                            <p>Amount:&nbsp;{{ item.tax_amount?.toFixed(2) }}</p>
                        </ion-label>
                        <ion-label slot="end">
                            <p>Price:&nbsp;{{ item.price?.toFixed(2) }}</p>
                            <p>Qty:&nbsp;{{ item.quantity }}</p>
                            <p>Amount:&nbsp;{{ item.amount?.toFixed(2) }}</p>
                        </ion-label>
                    </ion-item>
                </div>
            </ion-list>

            <ion-modal :is-open="open_customer_modal" @close="open_customer_modal = false">
                <CustomerListModal @customer-picked="handleCustomerPicked"  @close="open_customer_modal = false"/>
            </ion-modal>

            <ion-modal :is-open="open_discount_modal" >
                <DiscountListModal @discount-picked="handleDiscountPicked" @close="open_discount_modal = false"/>
            </ion-modal>

            <ion-modal :is-open="open_item_modal" @close="open_item_modal = false">
                <ItemListModal :sales="sales" @item-picked="handleSubmitItems"  @close="open_item_modal = false"/>
            </ion-modal>

            <ion-modal :is-open="open_sales_item_modal" @close="open_sales_item_modal = false">
                <SalesItemDetailsModal :sales_item="sales_item" 
                @close="open_sales_item_modal = false"
                @submit="() => { handleUpdateSalesItem(); open_sales_item_modal = false; }"/>
            </ion-modal>
            
            <ion-modal :is-open="open_checkout_modal" @close="open_checkout_modal = false">
                <CheckOutModal :sales="sales" @submit="submitCheckOut()"  @close="open_checkout_modal = false"/>
            </ion-modal>

        </ion-content>
        <AlertComponent
        :title="alertTitle"
        :sub_title="alertSubTitle"
        :message="alertMessage"
        :is-open="open_alert" 
        @cancel="open_alert = false"
        @confirm="confirmReturn"
        />
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import AlertComponent from '@/components/Modal/AlertComponent.vue';
import { defineComponent, onActivated, onMounted, Ref, ref, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SALES, SALES_DTO } from '@/models/sales.model';
import { SALES_ITEM, SALES_ITEM_DTO } from '@/models/sales-item.model';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import ItemListModal from '@/components/Modal/ItemListModal.vue';
import SalesItemDetailsModal from '@/components/Modal/SalesItemDetailsModal.vue';
import CustomerListModal from '@/components/Modal/CustomerListModal.vue';
import DiscountListModal from '@/components/Modal/DiscountListModal.vue';
import { addSales, billOutSales, getLastSalesNumber, getSales, getSalesById, lockSales, unlockSales, updateSales } from '@/services/activity/sales.service';
import { Lock } from '@/services/lock';
import { addBulkSalesItem, getSalesItemBySalesId, updatebULKSalesItem } from '@/services/activity/sales-item.service';
import { generateSales } from '@/composables/pdf-generator';
import { disc } from 'ionicons/icons';
import { DISCOUNT_DTO } from '@/models/discount.model';
import { presentToast } from '@/composables/toast.service';
import { unlockCustomers } from '@/services/setup/customer.service';
import CheckOutModal from '@/components/Modal/CheckOutModal.vue';
// import { generatePDF } from '@/composables/pdf-generator';

export default defineComponent({
    components:{
        HeaderComponent,
        AlertComponent,
        ItemListModal,
        SalesItemDetailsModal,
        CustomerListModal,
        DiscountListModal,
        CheckOutModal
    },
    setup(){
        const route = useRoute();
        const router = useRouter();
        const sales =  ref<SALES_DTO>({
            id: undefined,
            user_id: 0,
            user: '',
            sales_number: '0000000001',
            sales_date: '',
            sales_time: '',
            terminal_number: '001',
            customer_id: 0,
            customer_code:'',
            customer: '',
            customer_address: '',
            customer_tin: '',
            table_id: 1,
            table: '',
            total_amount: 0,
            balance_amount: 0,
            paid_amount: 0,
            discount_amount: 0,
            net_amount: 0,
            no_of_pax: 0,
            remarks: 'NA',
            status: 'NEW',
            is_locked: false,
            is_billed_out: false,
            is_cancelled: false,
            is_printed: false,
            discount_id: 1,
            discount: '',
            discount_rate: 0,
            senior_pwd_name:'NA',
            senior_pwd_id: 'NA'
        });
        let sales_id = 0;
        const open_alert = ref(false);
        const alertTitle = ref('');
        const alertSubTitle = ref('');
        const alertMessage = ref('');
        const not_found = ref(false);
        const sales_item_list = ref<SALES_ITEM_DTO[]>([]);
        const open_customer_modal =  ref(false);
        const open_discount_modal =  ref(false);
        const open_item_modal =  ref(false);
        const open_sales_item_modal = ref(false);
        const sales_item = ref(null);

        const open_checkout_modal =  ref(false);

        //#region   Actionsheet
        const actionSheetButtons = (item:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(item);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(item);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const openActionSheet = async (item:any) => {
            const actionSheet = await actionSheetController.create({
                header: `Options for Item ${item.item_barcode}  ${item.item_description}`,
                buttons: actionSheetButtons(item)
            });
            await actionSheet.present();
        };
        //#endregion

        //#region  EVENTS
        
        const handleDelete = (item: any) => {
            // throw new Error('Function not implemented.');
        };
        
        // BACK
        const handleReturn = async () => {
            await presentToast('reuturn handler');
            open_alert.value = true; // Open the alert
            // if(sales_id == 0){
            //     await presentToast('inside condition');
            //     alertTitle.value = 'Sales';
            //     alertMessage.value = 'Are you sure you want to quit without saving this transaction';
            // }else{
            //     await handleSave();
                // confirmReturn();
            // }
        }
        const confirmReturn =() => {
            open_alert.value = false;
            router.push(`/Activity/Sales/Open`);
        }
        
        // Pick Customer
        function openCustomerModal(isOpen: boolean) {
            open_customer_modal.value = isOpen
        }
        // Trigger when customer list is submitted
        async function handleCustomerPicked (customer: any)  {
            sales.value.customer_id = customer.id;
            sales.value.customer = customer.customer;
            open_customer_modal.value = false;
        };

        // Select Discount
        function openDiscountModal(isOpen: boolean) {
            open_discount_modal.value = isOpen
        }
        // Trigger when discount dialog is submitted
        async function handleDiscountPicked (discount: DISCOUNT_DTO) {
            sales.value.discount_id = discount.id;
            sales.value.discount = discount.discount;
            sales.value.discount_rate = discount.discount_rate;
            sales.value.discount_amount = discount.discount_amount;
            sales.value.senior_pwd_id= discount.senior_pwd_id;
            sales.value.senior_pwd_name= discount.senior_pwd_name;
            open_discount_modal.value = false;
            await updateSalesItemDiscount(); // update the discount in the selected items

            await handleSave();
        };

        const openItemModal = (isOpen: boolean) => {
            open_item_modal.value = isOpen
        }
        // Trigger when item list modal is submitted
        async function handleSubmitItems (sales_items: Ref<SALES_ITEM_DTO[]>)  {
            const routeParams = +route.params.id;
            sales_id = routeParams ; 

            await addBulkSalesItem(sales_id, sales_items.value); // add new selected items
            await calculateAmount(); // recalculate total_amount
            await handleSave(); // Save with updated total_amount
        };

        // edit sales item
        const handleEdit = async (item: any) => {
            sales_item.value = item;
            await presentToast("SelectedItem ", item)
            open_sales_item_modal.value = true;
        }
        //
        async function handleUpdateSalesItem() {
            await calculateAmount();
            await handleSave();
        }
        
        async function calculateAmount() {
            sales_item_list.value = await getSalesItemBySalesId(sales_id)
            let _amount = 0;
            let _disc_amount = 0;
            let _net_amount = 0;
            sales_item_list.value.forEach((item) => {
                _amount += parseFloat((item.amount ?? 0).toFixed(2))
                _disc_amount += parseFloat((item.discount_amount ?? 0).toFixed(2))
                _net_amount += (item.quantity * (item.net_price ?? 0));
            });
            sales.value.total_amount = _amount;
            sales.value.balance_amount = _amount;
            sales.value.discount_amount = _disc_amount;
            sales.value.net_amount = parseFloat(_net_amount.toFixed(2));
        }

        // Trigger only if Discount has changed
        async function updateSalesItemDiscount() {
            const update_sales_items = ref<SALES_ITEM_DTO[]>([]);
            let _total_amount = 0
            let _net_amount = 0
            sales_item_list.value.forEach((item) => {
                let _price = item.price ?? 0;
                let _net_price = item.net_price ?? 0;
                item.discount_id = sales.value.discount_id?? 1;
                item.discount_rate = sales.value.discount_rate?? 0;

                if(_price !=0 && item.discount_rate !=0 ){
                    _net_price = _price - (_price * (item.discount_rate / 100));
                }
                item.net_price = parseFloat(_net_price.toFixed(2))
                item.amount = parseFloat((_net_price * item.quantity).toFixed(2));

                _total_amount += parseFloat((_price  * item.quantity).toFixed(2));
                _net_amount += parseFloat(item.amount.toFixed(2));

                update_sales_items.value.push(item)
            });
            sales.value.total_amount = _total_amount;
            sales.value.discount_amount = _total_amount - _net_amount;
            sales.value.net_amount = _net_amount;
            await updatebULKSalesItem(update_sales_items.value)
        }

        async function handleSave() {
            try {
                sales.value.balance_amount = (sales.value.net_amount ?? 0) - (sales.value.paid_amount ?? 0); 
                const response = await updateSales(sales.value)
                if(response.success){
                    await presentToast(`Sales successfully updated`)
                }else{
                    await presentToast('Failed to update sales')
                }
                open_alert.value = true
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }

        async function handleLock() {
            try {
                if(!sales.value.is_locked){
                    sales.value.balance_amount = (sales.value.net_amount ?? 0) - (sales.value.paid_amount ?? 0); 
                    const response = await lockSales(sales.value)
                    if(response.success){
                        await presentToast('Sales successfully locked')
                    }else{
                        await presentToast('Failed to lock sales')
                    }
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }
        
        async function handleUnlock() {
            try {
                const response = await unlockSales(sales.value)
                if(response.success){
                    await presentToast('Sales successfully unlocked')
                }else{
                    await presentToast('Failed to unlocked sales')
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }

        async function handleBillOut() {
            try {
                const response = await billOutSales(sales.value);
                if(response.success){
                    await presentToast('Sales successfully billed out!');
                }else{
                    await presentToast('Failed to bill out sales')
                }
                open_alert.value = true
                
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
            
        }

        async function handlePrint() {
            await generateSales(sales.value, sales_item_list.value)
        }

        async function handleCheckOut() {
            open_checkout_modal.value = true;
        }
        async function submitCheckOut() {
            open_checkout_modal.value = false;
        }


        async function fetchDetails(){
            open_alert.value = false;
            open_customer_modal.value =false;
            open_discount_modal.value =  false;
            open_item_modal.value = false;
            open_sales_item_modal.value =false;
            open_checkout_modal.value =false;

            const routeParams = +route.params.id;
            sales_id = routeParams ; 
            setTimeout(async () => {
                try {
                    const result = await getSalesById(routeParams)
                    if(result){
                        sales.value = { ... result}
                        sales_item_list.value = await getSalesItemBySalesId(routeParams)
                    }else{
                        alertTitle.value = 'Not Found';
                        alertMessage.value = 'No Customer exist';
                        open_alert.value = true; // Open the alert
                    }
                    
                } catch (error) {
                    alertTitle.value = 'ERROR';
                    alertMessage.value = 'Error on fetching sales';
                    open_alert.value = true; // Open the alert
                }
            }, 300);
        }
        onMounted(async ()=>{
            await fetchDetails()
        });
        onIonViewDidEnter(async () => {
            await fetchDetails()
        });
        return{
            header:'Sales Details',
            sales,
            sales_item_list,
            sales_item,
            icons,
            open_customer_modal,
            open_discount_modal,
            open_item_modal,
            open_sales_item_modal,
            open_checkout_modal,
            
            
            open_alert,
            alertMessage,
            alertTitle,
            alertSubTitle,
            not_found,

            openCustomerModal,
            handleCustomerPicked,

            openItemModal,
            handleSubmitItems,

            openActionSheet,
            handleUpdateSalesItem,

            handleReturn,
            confirmReturn,

            handleSave,
            handleLock,
            handleBillOut,
            handleUnlock,
            handleCheckOut,
            submitCheckOut,

            openDiscountModal,
            handleDiscountPicked,
            handlePrint,
            calculateAmount,
        }
    }
})
</script>
