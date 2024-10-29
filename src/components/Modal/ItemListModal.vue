<template>
    <ion-page style="margin-top: 65px;">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
                </ion-buttons>
                <ion-title>Select Item</ion-title>
                <ion-buttons slot="end">
                <ion-button @click="confirm" :strong="true">Confirm</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-item>
            <!-- Search Input -->
            <ion-searchbar placeholder="Enter keyword" v-model="search_key" @ionChange="fetchList"></ion-searchbar>

        </ion-item>

        <ion-content :fullscreen="true">
            <ion-list :inset="true">
                <!-- List -->
                 <div v-for="item in items" :key="item.id">
                <ion-item>
                    <ion-label>
                        <h4>{{ item.item_description }} &nbsp;</h4>
                        <ion-note>Barcode:&nbsp;{{ item.bar_code }}</ion-note><br>
                    </ion-label>
                </ion-item>
                <ion-item >
                    <ion-avatar aria-hidden="true" slot="start">
                        <img alt="" :src="item.image_path" />
                    </ion-avatar>
                    &nbsp;
                    <ion-label>
                        <ion-note>Cost:&nbsp;{{ item.cost % 1 === 0 ? item.cost + '.00' : item.cost.toFixed(2) }} </ion-note><br>
                        <!-- <ion-note>On Hand:&nbsp;{{ item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(2) }} </ion-note><br> -->
                        <ion-note>{{ item.tax }} </ion-note><br>
                        <!-- <ion-note>VAT Rate:{{ item.tax_rate }} <div v-if="item.is_vat_inclusive">VAT Inclusive</div><div v-if="!item.is_vat_inclusive">VAT Exclusive</div></ion-note> -->
                    </ion-label>
                    <ion-label slot="end">
                        <ion-note>Price:&nbsp;{{ item.price % 1 === 0 ? item.price + '.00' : item.price.toFixed(2) }} </ion-note><br>
                        <ion-note><div v-if="item.is_inventory">Inventory</div><div v-if="!item.is_inventory">Non-inventory</div></ion-note>
                        <ion-note>Disc Rate:&nbsp;{{ sales.discount_rate }}% </ion-note>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <ion-label>
                        <ion-note>Quantity</ion-note><br>
                    </ion-label>
                    &nbsp;
                    &nbsp;
                    <ion-button size="medium" expand="block" color="success" @click="increase(item)">
                        <ion-icon :icon="icons.addCircleOutline"></ion-icon>
                    </ion-button>
                    <InputFloat fill="solid" autoGrow="true" v-model="item.quantity" style="width: 75px;text-align: end"/>
                    <ion-button size="medium" expand="block" color="danger" @click="decrease(item)">
                        <ion-icon :icon="icons.removeCircleOutline" ></ion-icon>
                    </ion-button>
                    <!-- <ion-select slot="end" interface="pop-over" placeholder="Qty" v-model="quantity" @ionChange="updateQuantity(quantity, item)">
                        <ion-select-option :value="0">0</ion-select-option>
                        <ion-select-option v-for="n in 500" :value="n" :key="n">{{ n }}</ion-select-option>
                    </ion-select> -->
                </ion-item>
                 </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import ITEM_DTO, { ITEM } from '@/models/item.model';
import { UNIT } from '@/models/unit.model';
import { icons } from '@/plugins/icons';
import { getUnits } from '@/services/system/unit.service';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
// import { Storage } from '@ionic/storage';
import { SALES_ITEM_DTO } from '@/models/sales-item.model';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { getItems } from '@/services/setup/item.service';
import { presentToast } from '@/composables/toast.composables';
import { computeVAT, discountPerQuantity, netPrice } from '@/composables/sales.composable';
import { SALES_DTO } from '@/models/sales.model';
import { STOCK_IN_ITEMS_DTO } from '@/models/stock-in-item.model';
import { STOCK_OUT_ITEMS_DTO } from '@/models/stock-out-item.model';
import InputFloat from '@/components/InputFloat.vue';

export default defineComponent({
    components:{
        InputFloat
    },
    props: {
        sales: {
            type: Object,
            default: () => ({})
        },
        trx:{
            type: String
        }
    },
    setup(props){
        const trx = props.trx;
        const { sales } = toRefs(props);
        const items = ref<ITEM_DTO[]>([]);
        const sales_items = ref<SALES_ITEM_DTO[]>([]);
        const stock_in_items = ref<STOCK_IN_ITEMS_DTO[]>([]);
        const stock_out_items = ref<STOCK_OUT_ITEMS_DTO[]>([]);
        const quantity = 0;
        const total_amount = ref(0);
        const page = ref(1);
        const page_size = ref(10);
        const search_key = ref('')
        
        const cancel = () => modalController.dismiss('', 'cancel');
        const confirm = () => {
            console.log(`${trx}`);
            if(trx == 'SI'){
                modalController.dismiss(sales_items , 'confirm');
            }
            if(trx == 'IN'){
                modalController.dismiss(stock_in_items , 'confirm');
            }
            if(trx == 'OUT'){
                modalController.dismiss(stock_out_items , 'confirm');
            }
        }

        const updateQuantity = async (qty : number, item: ITEM_DTO) =>{
            total_amount.value = await netPrice(item, sales.value as SALES_DTO) * qty;
            console.log(trx);
            if(trx == 'SI'){
                
                // Check if the item already exists in sales_items
                const existingItemIndex = sales_items.value.findIndex(saleItem => saleItem.item_id === item.id);

                if (existingItemIndex !== -1) {
                    // Item exists, update the quantity
                    sales_items.value[existingItemIndex].quantity = qty; // Update quantity
                    console.log('Qty',sales_items.value[existingItemIndex].quantity)
                    sales_items.value[existingItemIndex].amount = parseFloat((await netPrice(item, sales.value as SALES_DTO) * sales_items.value[existingItemIndex].quantity).toFixed(2));
                    // Optionally update other fields if necessary
                }else{
                    sales_items.value.push({
                        id:0,
                        sales_id:0,
                        item_id: item.id ?? 0,
                        item_code: item.item_code,
                        item_barcode: item.bar_code,
                        item_description: item.item_description,
                        item_alias: item.alias,
                        item_category: item.category,
                        item_cost: item.cost,
                        unit_id: item.unit_id,
                        item_image: item.image_path,
                        unit: item.unit ?? '',
                        unit_code: item.unit_code ?? '',
                        quantity: qty,
                        price: item.price,
                        net_price: await netPrice(item, sales.value as SALES_DTO),
                        amount: parseFloat((await netPrice(item, sales.value as SALES_DTO) * qty).toFixed(2)),
                        discount_id: sales.value.discount_id ?? 1,
                        discount: sales.value.discount ?? '',
                        discount_rate: sales.value.discount_rate ?? 0,
                        discount_amount: await discountPerQuantity(qty, item, sales.value as SALES_DTO ) * qty,
                        tax_id: item.tax_id,
                        tax: item.tax ?? '',
                        tax_code: item.tax_code ?? '',
                        tax_rate: item.tax_rate ?? 0,
                        tax_amount: await computeVAT(qty, item) * qty,
                        particulars:'',
                        user_id:1,
                        user:''
                    });
                }
                console.log(sales_items.value);
            }
            if(trx=='IN'){
                // console.log('within IN condition');
                const existingItemIndex = stock_in_items.value.findIndex(stock_in_Item => stock_in_Item.item_id === item.id);
                if (existingItemIndex !== -1) {
                    stock_in_items.value[existingItemIndex].quantity = qty; // Update quantity
                    console.log('Qty',stock_in_items.value[existingItemIndex].quantity)
                    stock_in_items.value[existingItemIndex].amount = parseFloat((await netPrice(item, sales.value as SALES_DTO) * stock_in_items.value[existingItemIndex].quantity).toFixed(2));
                }
                else{
                    stock_in_items.value.push({
                    id: 0,
                    in_id: 0,
                    date_time: '',
                    item_id: item.id ?? 0,
                    item_code: item.item_code,
                    item_barcode: item.bar_code,
                    item_description: item.item_description,
                    item_image_path: item.image_path,
                    is_inventory: item.is_inventory,
                    unit_id: item.unit_id,
                    unit_code: item.unit_code ?? '',
                    unit: item.unit ?? '',
                    quantity: qty,
                    cost: item.cost,
                    amount: item.cost * qty,
                    particulars: ''
                    })
                }
            }
            if(trx=='OUT'){
                // console.log('within OUT condition');
                const existingItemIndex = stock_out_items.value.findIndex(stock_out_item => stock_out_item.item_id === item.id);
                if (existingItemIndex !== -1) {
                    stock_out_items.value[existingItemIndex].quantity = qty; // Update quantity
                    console.log('Qty',stock_out_items.value[existingItemIndex].quantity)
                    stock_out_items.value[existingItemIndex].amount = parseFloat((await netPrice(item, sales.value as SALES_DTO) * stock_out_items.value[existingItemIndex].quantity).toFixed(2));
                }else{
                    stock_out_items.value.push({
                        id: 0,
                        out_id: 0,
                        date_time: '',
                        item_id: item.id ?? 0,
                        item_barcode: item.bar_code,
                        item_description: item.item_description,
                        item_image_path: item.image_path,
                        is_inventory: item.is_inventory,
                        unit_id: item.unit_id,
                        unit_code: item.unit_code ?? '',
                        unit: item.unit ?? '',
                        quantity: qty,
                        cost: item.cost,
                        amount: item.cost * qty,
                        particulars: ''
                    })
                }
            }
        }
        async function decrease(item: ITEM_DTO) {
            item.quantity--;
            await updateQuantity(item.quantity, item);
        }
        async function increase(item: ITEM_DTO) {
            item.quantity ++;
            await updateQuantity(item.quantity, item);
        }
        async function fetchList() {
            try {
                const result = await getItems(page.value, page_size.value, search_key.value);
                if(result.success){
                    items.value = result.data;
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
        }
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        onMounted(async () => {
            await fetchList()
        });
        return{
            icons,
            items,
            quantity,
            total_amount,

            // handlePickedItem,
            updateQuantity,
            cancel,
            confirm,
            fetchList,
            decrease,
            increase,

            page,
            page_size,
            search_key,
        }
    }
});
</script>


<style lang="css">
.icon-label-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 60px;
}

.icon-label-wrapper ion-icon {
  font-size: 24px; /* adjust icon size as needed */
  margin-bottom: 8px; /* adjust margin as needed */
}

.icon-label-wrapper span {
  font-size: 14px; /* adjust label size as needed */
}
</style>