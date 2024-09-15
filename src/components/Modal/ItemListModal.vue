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
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar>

        </ion-item>

        <ion-content :fullscreen="true">
            <ion-chip>
                Category: &nbsp;
                <ion-label>Category</ion-label>
            </ion-chip>
            <ion-chip>
                Amount: &nbsp;
                <ion-label>{{ total_amount.toFixed(2) }}</ion-label>
            </ion-chip>
            <ion-list :inset="true">
                <!-- List -->
                 <div v-for="item in items" :key="item.id">
                <ion-item >
                    
                    <ion-avatar aria-hidden="true" slot="start">
                        <img alt="" :src="item.image_path" />
                    </ion-avatar>
                    &nbsp;
                    <ion-label>
                        <ion-note>Price:&nbsp;{{ item.price % 1 === 0 ? item.price + '.00' : item.price.toFixed(2) }} </ion-note><br>
                        <ion-note>On Hand:&nbsp;{{ item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(2) }} </ion-note><br>
                        <ion-note>VAT Rate:{{ item.tax_rate }} <div v-if="item.is_vat_inclusive">VAT Inclusive</div><div v-if="!item.is_vat_inclusive">VAT Exclusive</div></ion-note>
                    </ion-label>
                    <ion-label slot="end">
                        <ion-note>Cost:&nbsp;{{ item.cost % 1 === 0 ? item.cost + '.00' : item.cost.toFixed(2) }} </ion-note><br>
                        <ion-note><div v-if="item.is_inventory">Inventory</div><div v-if="!item.is_inventory">Non-inventory</div></ion-note>
                        <ion-note>Disc Rate:&nbsp;{{ sales.discount_rate }}% </ion-note>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <ion-label>
                        <h4>{{ item.item_description }} &nbsp;</h4>
                        <ion-note>Barcode:&nbsp;{{ item.bar_code }}</ion-note><br>
                    </ion-label>
                    <ion-select slot="end" interface="pop-over" placeholder="Qty" v-model="quantity" @ionChange="updateQuantity(quantity, item)">
                        <ion-select-option :value="0">0</ion-select-option>
                        <ion-select-option v-for="n in 500" :value="n" :key="n">{{ n }}</ion-select-option>
                    </ion-select>

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

export default defineComponent({
    components:{
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
                })
            }
            if(trx=='IN'){
                console.log('within IN condition');
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
            if(trx=='OUT'){
                console.log('within OUT condition');
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

        // const netPrice = async (item: ITEM_DTO) => {
        //     const _vat_rate = (item.tax_rate ?? 0) / 100 ;

        //     const _vat_in_net_price = item.price / (1 + _vat_rate); // if vat inclusive

        //     const _vat_ex_net_price = item.price * (1 + _vat_rate); // if vat exclusive
            
        //     let _net_price = 0;
        //     if(item.is_vat_inclusive){
        //         _net_price = item.price;
        //     }else{
        //         _net_price = _vat_ex_net_price;
        //     }

        //     return _net_price;
        // }

        // const computeVAT = async (quantity:number, item: ITEM_DTO) => {
        //     const _vat_rate = (item.tax_rate ?? 0) / 100 ;

        //     const _vat_in_net_price = item.price / (1 + _vat_rate); // if vat inclusive

        //     const _vat_ex_net_price = item.price * (1 + _vat_rate); // if vat exclusive

        //     let _vat_amount = 0

        //     if(item.is_vat_inclusive){
        //         _vat_amount = parseFloat((item.price - _vat_in_net_price).toFixed(2));
        //     }else{
        //         _vat_amount = parseFloat((item.price -_vat_ex_net_price).toFixed(2));
        //     }
        //     console.log(`vat is ${_vat_amount}`)

        //     return _vat_amount
        // }

        // const discountPerQuantity = async (quantity:number, item: ITEM_DTO) => {
        //     let _discount = 0 ;
        //     let _price = item.price;
        //     const _discount_rate = (sales.value.discount_rate / 100);
        //     if(sales.value.discount.toLowerCase().includes('pwd') ||
        //     sales.value.discount.toLowerCase().includes('senior') )
        //     {
        //         // For senior and pwd only
        //         // If item is vat inclusive
        //         if(item.is_vat_inclusive){
        //             const _vat_amount = await computeVAT(quantity, item);
        //             _price = parseFloat((_price - _vat_amount).toFixed(2)); // take out vat first
        //             _discount = parseFloat((_price * _discount_rate).toFixed(2)); // discount per / qty
        //         }else{
        //             _discount = _price * _discount_rate; // discount per / qty
        //         }
        //     }else{
        //         _discount = _price * _discount_rate; // discount per / qty
        //     }
        //     console.log(`price ${_price} by rate ${_discount_rate} is ${_discount} `)
        //     return _discount
        // }

        async function fetchList() {
            try {
                const result = await getItems();
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