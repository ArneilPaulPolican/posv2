<template>
    <ion-page>
        <!-- <HeaderComponent :title="header"/> -->
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button size="small" position="stacked"  @click="openItemModal(true)">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>


        <ion-item style="position: relative;">
            <div style="display: flex; overflow-x: auto; white-space: nowrap; width: 100%; padding-right: 10px;height: 100%">
            <ion-button size="medium" expand="block" style="height: 90%" @click="handleSave">
                <ion-icon :icon="icons.saveSharp"></ion-icon>&nbsp;
                <ion-label>Save</ion-label>
            </ion-button>
            <ion-button size="medium" expand="block" style="height: 90%">
                <ion-icon :icon="icons.lockClosedSharp"></ion-icon>&nbsp;
                <ion-label>Lock</ion-label>
            </ion-button>
            <ion-button size="medium" expand="block" style="height: 90%" @click="handleBillOut">
                <ion-icon :icon="icons.receiptSharp"></ion-icon>&nbsp;
                <ion-label>Bill Out</ion-label>
            </ion-button>
            <ion-button size="medium" expand="block" style="height: 90%" @click="printInvoice">
                <ion-icon :icon="icons.printSharp"></ion-icon>&nbsp;
                <ion-label>Print</ion-label>
            </ion-button>
            <ion-button @click="handleReturn" size="medium" expand="block" style="height: 90%">
                <ion-icon :icon="icons.closeCircle"></ion-icon>&nbsp;
                <ion-label>Cancel</ion-label>
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
                    ₱&nbsp;{{ amount.toFixed(2) }}
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
                            <ion-label>Disc. Rate: {{ sales.discount_rate?.toFixed(2) }}</ion-label>
                        </ion-chip>
                        <ion-chip>
                            <ion-label>Disc. Amount: {{ sales.discount_amount?.toFixed(2) }}</ion-label>
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
                    <ion-item v-for="item in sales_items" :key="item.id" @click="openActionSheet(item)">
                        <!-- <img alt="" :src="item.item_image" style="width: 100px;height: 100px; position: con;"/> -->
                        <div style="width: 100px; height: 100px; overflow: hidden;">
                            <img alt="" :src="item.item_image" style="width: 100%; height: 100%; object-fit: cover;"/>
                        </div>
                        &nbsp;

                        <ion-label>
                            <h2>{{ item.item_barcode }}</h2>
                            <p>{{ item.item_description }}</p>
                            <p>Price:&nbsp;{{ item.price?.toFixed(2) }}</p>
                            <p>Qty:&nbsp;{{ item.quantity }}</p>
                            <p>Amount:&nbsp;{{ item.amount?.toFixed(2) }}</p>
                        </ion-label>
                    </ion-item>
                </div>
            </ion-list>

            <!-- <iframe  :src="pdf_src" type="application/pdf" width="100%" height="500"></iframe> -->
            <!-- <iframe v-bind:src="pdf_src" type="application/pdf" width="100%" height="500" ref="iframeRef"></iframe>
            <iframe src="../../../public/tst.pdf" type="application/pdf" width="100%" height="500" ref="iframeRef"></iframe> -->
            <ion-modal :is-open="open_customer_modal" @close="open_customer_modal = false">
                <CustomerListModal @customer-picked="handleCustomerPicked"  @close="open_customer_modal = false"/>
            </ion-modal>

            <ion-modal :is-open="open_discount_modal" >
                <DiscountListModal @discount-picked="handleDiscountPicked" @close="open_discount_modal = false"/>
            </ion-modal>

            <ion-modal :is-open="open_item_modal" @close="open_item_modal = false">
                <ItemListModal :sales="sales" @item-picked="handleItemSubmit"  @close="open_item_modal = false"/>
            </ion-modal>

            <ion-modal :is-open="open_sales_item_modal" >
                <SalesItemDetailsModal :sales_item="sales_item" @close="open_sales_item_modal = false"/>
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
        <ion-modal :is-open="open_pdf_modal" >
            <PDFTemplate v-if="open_pdf_modal" :pdf_src="pdf_src" @close="open_pdf_modal = false"/>
        </ion-modal>
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
import PDFTemplate from '@/components/Modal/PDFTemplate.vue';
import { addSales, billOutSales, getLastSalesNumber, getSales, getSalesById, updateSales } from '@/services/activity/sales.service';
import { Lock } from '@/services/lock';
import { addBulkSalesItem, getSalesItemBySalesId, updatebULKSalesItem } from '@/services/activity/sales-item.service';
// import { generatePDF } from '@/composables/pdf-generator';

export default defineComponent({
    components:{
        HeaderComponent,
        AlertComponent,
        ItemListModal,
        SalesItemDetailsModal,
        CustomerListModal,
        DiscountListModal,
        PDFTemplate
    },
    setup(){
        const route = useRoute();
        const dbLock = new Lock(); // Create a new lock
        const router = useRouter();
        const amount = ref(0);
        const sales_number = ref('');
        const sales =  ref<SALES_DTO>({
            id: undefined,
            user_id: 0,
            user: '',
            sales_number: '0000000001',
            sales_date: '',
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
            no_of_pax: 0,
            remarks: 'NA',
            status: 'NEW',
            is_locked: false,
            is_billed_out: false,
            is_cancelled: false,
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
        const date_today = new Date;
        const sales_items = ref<SALES_ITEM_DTO[]>([]);
        const open_customer_modal =  ref(false);
        const open_discount_modal =  ref(false);
        const open_item_modal =  ref(false);
        const open_sales_item_modal = ref(false);
        const sales_item = ref(null);
        const pdf_src = ref('');
        const open_pdf_modal =  ref(false);

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
            console.log('reuturn handler');
            open_alert.value = true; // Open the alert
            // if(sales_id == 0){
            //     console.log('inside condition');
            //     alertTitle.value = 'Sales';
            //     alertMessage.value = 'Are you sure you want to quit without saving this transaction';
            // }else{
            //     await handleSave();
                confirmReturn();
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
        const handleCustomerPicked = (customer: any) => {
            sales.value.customer_id = customer.id;
            sales.value.customer = customer.customer;
            open_customer_modal.value = false;
            console.log('Picked customer:', sales.value.customer);
        };

        // Pick Discount
        function openDiscountModal(isOpen: boolean) {
            open_discount_modal.value = isOpen
        }
        const handleDiscountPicked = (discount: any) => {
            sales.value.discount_id = discount.id;
            sales.value.discount = discount.discount;
            sales.value.discount_rate = discount.discount_rate;
            sales.value.discount_amount = 0;
            open_discount_modal.value = false;
            console.log('Picked Discount:', sales.value.customer);
        };

        const openItemModal = (isOpen: boolean) => {
            open_item_modal.value = isOpen
        }
        const handleItemSubmit = (items: Ref<SALES_ITEM_DTO[]>) => {
            sales_items.value = items.value
            items.value.forEach((item) => {
                amount.value += (item.quantity * (item.price ?? 0))
                console.log(`Item Quantity: ${item.quantity}, Item Price: ${item.price}`);
            });
            sales.value.total_amount = parseFloat(amount.value.toFixed(2));
        };

        // edit sales item
        const handleEdit = async (item: any) => {
            sales_item.value = item;
            console.log("SelectedItem ", sales_item.value)
            open_sales_item_modal.value = true;
            console.log("open_sales_item_modal.value ", open_sales_item_modal.value)
        }

        async function updateSalesItems() {
            const new_sales_items = ref<SALES_ITEM_DTO[]>([]);
            const update_sales_items = ref<SALES_ITEM_DTO[]>([]);
            console.log('items ', sales_items);
            sales_items.value.forEach((item) => {
                if (item.id === 0) {
                    new_sales_items.value.push(item);
                }else{
                    update_sales_items.value.push(item)
                }
                
            });

            await addBulkSalesItem(sales.value.id?? 0, new_sales_items.value);
            await updatebULKSalesItem(update_sales_items.value)
        }

        async function handleSave() {
            try {
                console.log('Sales Id ', sales_id)
                if(sales_id == 0){
                    console.log(sales.value)
                    const response = await addSales(sales.value, sales_items.value);
                    if(response.success){
                        router.push(`/Activity/Sales/Details/${response.insertedId}`);
                        alertMessage.value = 'Sales successfully created,\n do you want to close this form?';
                        alertTitle.value = 'Success';
                    }else{
                        console.error('Failed to create sales')
                        alertTitle.value = 'Failed';
                        alertMessage.value = 'Failed to create sales';
                    }
                    open_alert.value = true
                }else{
                    const response = await updateSales(sales.value)
                    if(response.success){
                        alertMessage.value = 'Sales successfully updated';
                        alertTitle.value = 'Success';
                    }else{
                        console.error('Failed to update sales')
                        alertTitle.value = 'Failed';
                        alertMessage.value = 'Failed to update sales';
                    }
                    open_alert.value = true
                }
            } catch (error) {
                console.log(error)
            }
        }

        async function handleBillOut() {
            if(sales_id != 0){
                console.log(sales.value)
                    const response = await billOutSales(sales.value);
                    if(response.success){
                        alertMessage.value = 'Sales successfully updated';
                        alertTitle.value = 'Success';
                    }else{
                        console.error('Failed to update sales')
                        alertTitle.value = 'Failed';
                        alertMessage.value = 'Failed to update sales';
                    }
                    open_alert.value = true
            }
        }

        async function printInvoice() {
            // const blobURL = await generatePDF()
            // pdf_src.value = blobURL
            open_pdf_modal.value = true;
        }

        async function fetchDetails(){
            open_alert.value = false;
            open_customer_modal.value =false;
            open_discount_modal.value =  false;
            open_item_modal.value = false;
            open_sales_item_modal.value =false;
            open_pdf_modal.value = false;

            const routeParams = +route.params.id;
            sales_id = routeParams ; 
            setTimeout(async () => {
                try {
                    if(routeParams == 0){
                        sales_number.value = await getLastSalesNumber();
                        const currentSalesNumber = parseInt(sales_number.value, 10);
                        const nextSalesNumber = currentSalesNumber + 1;
                        const formattedNextSalesNumber = nextSalesNumber.toString().padStart(10, '0');
                        sales_number.value = formattedNextSalesNumber;
                        sales.value = {
                                id: 0,
                                user_id: 1,
                                user:'cashier',
                                sales_number: sales_number.value,
                                sales_date: new Date().toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                            }),
                                terminal_number: '001',
                                customer_id: 1,
                                customer_code:'',
                                customer: 'Walk-in',
                                customer_address: '',
                                customer_tin: '',
                                table_id: 1,
                                table: 'VIP',
                                total_amount: 0,
                                balance_amount: 0,
                                paid_amount: 0,
                                discount_amount: 0,
                                no_of_pax: 0,
                                remarks: 'NA',
                                status: 'NEW',
                                is_locked: false,
                                discount_id: 1,
                                discount:'No Discount',
                                discount_rate:0,
                                senior_pwd_name:'NA',
                                senior_pwd_id: 'NA'
                            }
                    }else{
                        const result = await getSalesById(routeParams)
                        if(result){
                            sales.value = {
                                id: result.id,
                                user_id: result.user_id,
                                user: result.user,
                                sales_number: result.sales_number,
                                sales_date: result.sales_date,
                                terminal_number: result.terminal_number,
                                customer_id: result.customer_id,
                                customer_code: result.customer_code,
                                customer: result.customer,
                                customer_address: result.customer_address,
                                customer_tin: result.customer_tin,
                                table_id: result.table_id,
                                table: result.table,
                                total_amount: result.total_amount,
                                balance_amount: result.balance_amount,
                                paid_amount: result.paid_amount,
                                no_of_pax: result.no_of_pax,
                                remarks: result.remarks,
                                status: result.status,
                                is_locked: result.is_locked,
                                is_billed_out: result.is_billed_out,
                                is_cancelled: result.is_cancelled,
                                discount_id: result.discount_id,
                                discount: result.discount,
                                discount_rate: result.discount_rate,
                                discount_amount: result.discount_amount,
                                senior_pwd_id: result.senior_pwd_id,
                                senior_pwd_name: result.senior_pwd_name,
                            }
                            sales_items.value = await getSalesItemBySalesId(routeParams)
                        }else{
                            alertTitle.value = 'Not Found';
                            alertMessage.value = 'No Customer exist';
                            open_alert.value = true; // Open the alert
                        }
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
        })
        
        onIonViewDidEnter(async () => {
            await fetchDetails()
            console.log('Home page did enter');
        });
        return{
            header:'Sales Details',
            sales,
            icons,
            amount,
            date_today,
            sales_items,
            open_customer_modal,
            open_discount_modal,
            open_item_modal,
            open_sales_item_modal,
            open_pdf_modal,
            sales_item,
            
            open_alert,
            alertMessage,
            alertTitle,
            alertSubTitle,
            not_found,

            pdf_src,

            openCustomerModal,
            handleCustomerPicked,

            openItemModal,
            handleItemSubmit,

            openActionSheet,
            handleReturn,
            confirmReturn,

            handleSave,
            handleBillOut,

            openDiscountModal,
            handleDiscountPicked,
            printInvoice,

        }
    }
})
</script>
