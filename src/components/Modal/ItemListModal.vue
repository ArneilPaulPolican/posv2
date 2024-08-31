<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-title>Select Item</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-item>
            <!-- Search Input -->
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar>
            
            <ion-button @click="handlePickedItem" size="medium" expand="block" >
                <ion-label>Submit</ion-label>
            </ion-button>
            <ion-button @click="$emit('close')" size="medium" expand="block" fill="outline">
                <ion-label>Close</ion-label>
            </ion-button>
        </ion-item>
        
        <ion-content :fullscreen="true">
            <ion-chip>
                Category: &nbsp;
                <ion-label>Category</ion-label>
            </ion-chip> 
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="item in items" :key="item.id">
                    <img alt="" :src="'data:image/jpeg;base64,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'" />
                    &nbsp;
                    <ion-label>
                        <h4>Barcode:&nbsp;{{ item.bar_code }} &nbsp;</h4>
                        <h3>{{ item.item_description }} </h3>
                        <ion-note><p> Cost:&nbsp;{{ item.cost }}</p></ion-note>
                        <ion-note><p> Price:&nbsp;{{ item.price }}</p></ion-note>
                    </ion-label>
                    <ion-select interface="pop-over" placeholder="Qty" v-model="quantity" @ionChange="updateQuantity(quantity, item)">
                        <ion-select-option :value="0">0</ion-select-option>
                        <ion-select-option v-for="n in 500" :value="n" :key="n">{{ n }}</ion-select-option>
                    </ion-select>
                </ion-item>
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
import { Storage } from '@ionic/storage';
import { SALES_ITEM_DTO } from '@/models/sales-item.model';

export default defineComponent({
    props: {
        sales: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props, {emit}){
        // const sales = props.sales
        // const reactiveProps = reactive(props);
        // const sales = reactiveProps.sales;
        const { sales } = toRefs(props); 
        const store = new Storage();
        const items = ref<ITEM_DTO[]>([
            {
                id: 1,
                item_code: "ABC123",
                bar_code: "1234567890",
                item_description: "Apple iPhone 12 asd asd asd asd asdasd asd",
                alias: "iPhone 12",
                category: "Electronics",
                price: 999.99,
                cost: 800.00,
                quantity: 10,
                unit_id: 1,
                is_inventory: true,
                generic_name: "Smartphone",
                tax_id: 1,
                remarks: "Latest model",
                image_path: "/path/to/image.jpg",
                is_package: false,
                is_locked: false,
                expiry_date:'',
                lot_number:''
            },
            {
                id: 2,
                item_code: "DEF456",
                item_description: "Samsung TV 4K",
                bar_code: "9876543210",
                alias: "Samsung TV",
                category: "Electronics",
                price: 1299.99,
                cost: 1000.00,
                quantity: 5,
                unit_id: 2,
                is_inventory: true,
                generic_name: "Television",
                tax_id: 2,
                remarks: "4K resolution",
                image_path: "/path/to/image2.jpg",
                is_package: false,
                is_locked: false,
                expiry_date:'',
                lot_number:''
            },
            {
                id: 3,
                item_code: "GHI789",
                item_description: "Nike Shoes",
                bar_code: "1111111111",
                alias: "Nike Shoes",
                category: "Clothing",
                price: 99.99,
                cost: 80.00,
                quantity: 20,
                unit_id: 3,
                is_inventory: true,
                generic_name: "Shoes",
                tax_id: 3,
                remarks: "Running shoes",
                image_path: "/path/to/image3.jpg",
                is_package: false,
                is_locked: false,
                expiry_date:'',
                lot_number:''
            }
        ])
        const sales_items = ref<SALES_ITEM_DTO[]>([]);
        const quantity = 0;

        const handlePickedItem = async () =>{
            // return to the ItemDetail.vue the unit.id, unit.unit_code and unit.unit_description
            console.log("Selected item ",sales_items)
            emit('item-picked', sales_items);
            emit('close'); 
        }

        const updateQuantity = async (qty : number, item: ITEM_DTO) =>{
            console.log("props sales ",props.sales)
            sales_items.value.push({
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
                quantity: qty,
                price: item.price,
                discount_id: sales.value.discount_id ?? 1,
                discount: sales.value.discount ?? '',
                discount_rate: sales.value.discount_rate ?? 0,
                discount_amount: sales.value.discount_amount ?? 0,
                net_price: item.price,
                amount: parseFloat((item.price * qty).toFixed(2)),
                tax_id: item.tax_id,
                tax: item.tax ?? '',
                tax_rate: item.tax_rate ?? 0,
                tax_amount: 0,
                particulars:'',
                user_id:1,
                user:''
            })
            console.log("Selected item ",sales_items.value)

            // emit('item-picked', qty);
            // emit('close'); 
            // await store.set('selected_item', item);

        }

        onMounted(async () => {
            // console.log("selected Items",await store.get('selected_item'))
            setTimeout(async () => {
                const unitsData = items.value; //await getUnits();
                items.value = unitsData;
            }, 500);
        });
        return{
            icons,
            items,
            quantity,
            store,

            handlePickedItem,
            updateQuantity
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