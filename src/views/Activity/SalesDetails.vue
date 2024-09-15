<template>
    <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button :disabled="is_locked" size="small" position="stacked"  @click="openItemModal">
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
                <ion-button v-if="!is_locked" :disbaled="is_locked" size="medium" expand="block" style="height: 90%" @click="handleSave()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.saveSharp"></ion-icon>
                        <ion-label>Save</ion-label>
                    </div>
                </ion-button>
                <ion-button size="medium" expand="block" style="height: 90%" @click="handleCheckOut()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.basketSharp"></ion-icon>
                        <ion-label>Check Out</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" size="medium" expand="block" style="height: 90%" @click="handleLock()">
                    <div class="icon-label-wrapper">
                        <ion-icon  :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label>Lock</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="is_locked" size="medium" expand="block" style="height: 90%" @click="handleUnlock()">
                    <div class="icon-label-wrapper">
                        <ion-icon  :icon="icons.lockClosedSharp"></ion-icon>
                        <ion-label>Unlock</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="is_locked && !is_billed_out" size="medium" expand="block" style="height: 90%" @click="handleBillOut()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.receiptSharp"></ion-icon>
                        <ion-label>Bill out</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="is_locked" size="medium" expand="block" style="height: 90%" @click="handlePrint()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.printSharp"></ion-icon>
                        <ion-label>Print</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!sales.is_cancelled && is_locked && is_billed_out" @click="confirmReturn" size="medium" expand="block" style="height: 90%">
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
                    <ion-label position="stacked">Date</ion-label>
                    <ion-input :readonly="true" v-model="sales.sales_date" placeholder="MM/dd/yyyy"></ion-input>
                </ion-col>
                <ion-col size="6">
                    <ion-label position="stacked">Sales Number</ion-label>
                    <ion-input :readonly="true" v-model="sales.sales_number" placeholder="0000000001"></ion-input>
                </ion-col>
            </ion-row>
        </ion-item>
        <ion-content>
            <ion-list :inset="true" style="margin: 5px">
                <div style="padding: 5px;">
                    <ion-item>
                        <ion-label position="stacked">Customer</ion-label>
                        <ion-input :disabled="is_locked" v-model="sales.customer" :readonly="true" placeholder="Walk-in" 
                        @click="openCustomerModal"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Discount</ion-label>
                        <ion-input :disabled="is_locked" v-model="sales.discount" placeholder="No Discount" 
                        @click="openDiscountModal"></ion-input>
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
                                <ion-input :disabled="is_locked" v-model="sales.no_of_pax" placeholder="No. PAX"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <ion-label position="stacked">Status</ion-label>
                                <ion-input :disabled="is_locked" v-model="sales.status" placeholder="NEW"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Remarks</ion-label>
                        <ion-textarea :disabled="is_locked" v-model="sales.remarks" placeholder="Remarks"></ion-textarea>
                    </ion-item>
                </div>
            </ion-list>

            <ion-item>
                <ion-label position="stacked">Barcode</ion-label>
                <ion-input  placeholder="00000000001"></ion-input>
            </ion-item>

            <ion-list :inset="true" style="margin: 5px">
                <div style="padding: 5px;">
                    <!-- List -->
                     <div v-for="item in sales_item_list" :key="item.id"  @click="!is_locked && openActionSheet(item)">
                        <ion-item >
                            <ion-label>
                                <p>{{ item.item_barcode }}</p>
                                <h1>{{ item.item_description }}</h1>
                            </ion-label>
                        </ion-item>
                        <ion-item >
                            <!-- <img alt="" :src="item.item_image" style="width: 100px;height: 100px; position: con;"/> -->
                            <div style="width: 50px; height: 50px; overflow: hidden;">
                                <img alt="" :src="item.item_image" style="width: 100%; height: 100%; object-fit: cover;"/>
                            </div>
                            &nbsp;
                            <ion-label>
                                <p>Tax:&nbsp;{{ item.tax_code }}</p>
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
                </div>
            </ion-list>
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
import { actionSheetController, modalController, onIonViewDidEnter } from '@ionic/vue';
import ItemListModal from '@/components/Modal/ItemListModal.vue';
import SalesItemDetailsModal from '@/components/Modal/SalesItemDetailsModal.vue';
import CustomerListModal from '@/components/Modal/CustomerListModal.vue';
import DiscountListModal from '@/components/Modal/DiscountListModal.vue';
import CheckOutModal from '@/components/Modal/CheckOutModal.vue';
import { addSales, billOutSales, getLastSalesNumber, getSales, getSalesById, lockSales, unlockSales, updateSales } from '@/services/activity/sales.service';
import { Lock } from '@/services/lock';
import { addBulkSalesItem, deleteSalesItem, getSalesItemBySalesId, updatebULKSalesItem } from '@/services/activity/sales-item.service';
import { generateSales } from '@/composables/pdf-generator';
import { disc } from 'ionicons/icons';
import { DISCOUNT_DTO } from '@/models/discount.model';
import { presentToast } from '@/composables/toast.composables';
import { onLockRecordInventory, onUnlockUpdateItemInventory } from '@/composables/inventory';


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
            senior_pwd_id: 'NA',
            discounted_pax:0
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
        const is_locked = ref(false);
        const is_billed_out = ref(false);


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
        
        const handleDelete = async (item: any) => {
            // throw new Error('Function not implemented.');
            try {
                const result = await deleteSalesItem(item.id);
                if(result.success){
                    await presentToast('Item deleted successfully')
                    await calculateAmount(); // recalculate total_amount
                    await handleSave(); // Save with updated total_amount
                    await fetchDetails()
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        };
        
        // BACK
        const confirmReturn =() => {
            router.push(`/Activity/Sales/Open`);
        }
        
        // Pick Customer
        const openCustomerModal = async () => {
            const modal = await modalController.create({
            component: CustomerListModal,
            // componentProps: { data: sales } 
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                sales.value.customer_id = data.id;
                sales.value.customer = data.customer;
            }
        };

        // Select Discount
        const openDiscountModal = async () => {
            const modal = await modalController.create({
            component: DiscountListModal,
            // componentProps: { data: sales } 
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                sales.value.discount_id = data.id;
                sales.value.discount = data.discount;
                sales.value.discount_rate = data.discount_rate;

                await updateSalesItemDiscount()
            }
        };

        // Open Item Modal
        const openItemModal = async () => {
            const modal = await modalController.create({
                component: ItemListModal,
                componentProps: { data: sales, trx: 'SI' } 
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                if (data && data._rawValue) { // Check if data is a ref object with _rawValue property
                    const salesItems = data._rawValue; // Get the array of SALES_ITEM_DTO objects
                    console.log(`Received data: ${JSON.stringify(salesItems)}`);
                    await addBulkSalesItem(sales_id, salesItems); // add new selected items
                    await calculateAmount(); // recalculate total_amount
                    await handleSave(); // Save with updated total_amount
                } else {
                    console.error('Error: data is not a ref object with _rawValue property');
                }
            }
        };

        // edit sales item
        const handleEdit = async (item: any) => {
            const modal = await modalController.create({
                component: SalesItemDetailsModal,
                componentProps: { sales: sales, sales_item: item } 
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();
            if (role === 'confirm') {
                await calculateAmount();
                await handleSave();
            }
        };
        
        async function calculateAmount() {
            const result = await getSalesItemBySalesId(sales_id)
            if(result.success && result.data){
                sales_item_list.value = result.data;
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
                const response = await updateSales(sales.value as SALES_DTO)
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
                if(!sales.value.is_locked && sales.value.total_amount >0){
                    const inventory_result = await onLockRecordInventory(sales_item_list.value, sales.value.id ?? 0, 'SI', sales.value.sales_date, sales.value.sales_number)
                    if(inventory_result.success){
                        sales.value.balance_amount = (sales.value.net_amount ?? 0) - (sales.value.paid_amount ?? 0); 
                        const response = await lockSales(sales.value)
                        if(response.success){
                            await presentToast('Sales successfully locked')
                            await fetchDetails()
                            is_locked.value = true;
                        }
                    }
                }else{
                    await presentToast(`Total Amount is ${ sales.value.total_amount}`)
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
                await handleUnlock()
            }
        }
        
        async function handleUnlock() {
            try {
                const inventory_result = await onUnlockUpdateItemInventory('SI', sales.value.id ?? 0, sales.value.sales_date, sales.value.sales_number)
                if(inventory_result.success){
                    const response = await unlockSales(sales.value)
                    if(response.success){
                        await presentToast('Sales successfully unlocked');
                        await fetchDetails()
                        is_locked.value = false;
                    }else{
                        await presentToast('Failed to unlocked sales')
                    }
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }

        async function handleBillOut() {
            try {
                if(sales.value.net_amount > 0){
                    const response = await billOutSales(sales.value);
                    if(response.success){
                        is_billed_out.value = true;
                        await presentToast('Sales successfully billed out!');
                    }else{
                        await presentToast('Failed to bill out sales')
                    }
                    open_alert.value = true
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
            
        }

        async function handlePrint() {
            await generateSales(sales.value, sales_item_list.value)
        }

        // Checkout
        const handleCheckOut = async () => {
            if(sales.value.net_amount > 0){
                const modal = await modalController.create({
                component: CheckOutModal,
                componentProps: { sales: sales } 
                });

                modal.present();
                const { data, role } = await modal.onWillDismiss();
                if (role === 'confirm') {
                    await fetchDetails();
                }
            }
        };

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
                    if(result.success && result.data){
                        sales.value = result.data;
                        is_locked.value = result.data.is_locked;
                        is_billed_out.value = result.data.is_billed_out;
                        const sales_item_result = await getSalesItemBySalesId(routeParams);
                        if(sales_item_result.success && sales_item_result.data){
                            sales_item_list.value = sales_item_result.data;
                        }
                    }else{
                        await presentToast('Sales found');
                        confirmReturn();
                    }
                } catch (error) {
                    await presentToast(`Operation failed: ${error}`);
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
            is_locked,
            is_billed_out,
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
            openDiscountModal,
            openItemModal,
            openActionSheet,

            confirmReturn,

            handleSave,
            handleLock,
            handleBillOut,
            handleUnlock,
            handleCheckOut,
            handlePrint,
            calculateAmount,
        }
    }
})
</script>

<style>
  /* hide landscape layout by default */
  .landscape-layout {
    display: none;
  }

  /* show landscape layout on landscape mode and desktop view */
  @media (orientation: landscape) and (min-width: 768px) {
    .landscape-layout {
      display: block;
    }
  }

  /* show landscape layout on desktop view */
  @media (min-width: 1024px) {
    .landscape-layout {
      display: block;
    }
  }
</style>