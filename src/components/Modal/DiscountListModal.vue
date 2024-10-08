<template>
    <ion-page style="margin-top: 65px;">
        
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Cancel</ion-button>
                </ion-buttons>
                <ion-title>Select Discount</ion-title>
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
            
            <ion-list :inset="true">
                <!-- List -->
                 <div v-for="discount in discount_list" :key="discount.id">
                    
                    <ion-item >
                        <!-- <ion-button size="medium" @click="handleDiscountPicked(discount)"> -->
                        <ion-fab-button size="small" @click="handleSelectDiscount(discount)">
                            <ion-icon :icon="icons.addSharp"></ion-icon>
                        </ion-fab-button>
                        &nbsp;
                        <ion-label>
                            <h2>{{ discount.discount }}</h2>
                            <p>{{ discount.discount_rate }}</p>
                        </ion-label>
                    </ion-item>
                    <div v-if="show_disc_info">
                        <ion-item v-if="discount.discount.toLowerCase().includes('senior') || discount.discount.toLowerCase().includes('pwd')">
                            <ion-label position="stacked">Senior / PWD ID No.</ion-label>
                            <ion-input label="" label-placement="floating" fill="solid" v-model="senior_pwd_id" placeholder="0123456789"></ion-input>
                        </ion-item>
                        <ion-item v-if="discount.discount.toLowerCase().includes('senior') || discount.discount.toLowerCase().includes('pwd')">
                            <ion-label position="stacked">Senior / PWD Name</ion-label>
                            <ion-input label="" label-placement="floating" fill="solid" v-model="senior_pwd_name" placeholder="John Doe"></ion-input>
                        </ion-item>
                    </div>
                    <div v-if="show_disc_rate">
                        <ion-item v-if="discount.discount.toLowerCase().includes('variable')">
                            <ion-row>
                                <ion-col size="6">
                                    <ion-label position="stacked">Disc. Rate %</ion-label>
                                    <!-- <ion-input label="" label-placement="floating" fill="solid" v-model="disc_rate" placeholder="0"></ion-input> -->
                                    <InputFloat :amount="disc_rate" @update="(floatValue) => disc_rate = floatValue"></InputFloat>
                                </ion-col>
                                <ion-col size="6">
                                    <ion-label position="stacked">Disc. Amount</ion-label>
                                    <!-- <ion-input label="" label-placement="floating" fill="solid" v-model="disc_amount" placeholder="NEW"></ion-input> -->
                                    <InputFloat :amount="disc_amount" @update="(floatValue) => disc_amount = floatValue"></InputFloat>
                                </ion-col>
                            </ion-row>
                        </ion-item>
                    </div>

                 </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { presentToast } from '@/composables/toast.composables';
import { DISCOUNT, DISCOUNT_DTO } from '@/models/discount.model';
import { TAX } from '@/models/tax.model';
import { icons } from '@/plugins/icons';
import { getDiscounts } from '@/services/system/discount.service';
import { getTaxes } from '@/services/system/tax.service';
import { modalController, onIonViewDidEnter } from '@ionic/vue';
import { book, disc } from 'ionicons/icons';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import InputFloat from '../InputFloat.vue';


export default defineComponent({
    components: { 
        InputFloat
    },
    setup(_, {emit}){
        const discount_list = ref<DISCOUNT[]>([])
        const selected_discount = ref<DISCOUNT_DTO>()
        const disc_rate = ref(0);
        const disc_amount = ref(0);
        const discount_id = ref(0);
        const show_disc_rate = ref(false);
        const show_disc_info = ref(false);
        const senior_pwd_id = ref('');
        const senior_pwd_name = ref('');

        function handleSelectDiscount(discount:DISCOUNT) {
            discount_id.value = discount.id
            selected_discount.value = discount;
            disc_rate.value = discount.discount_rate;
            if(discount.discount.toLowerCase().includes('variable')){
                show_disc_rate.value = true;
                show_disc_info.value = false;
            }
            else if(discount.discount.toLowerCase().includes('senior') || discount.discount.toLowerCase().includes('pwd')){
                show_disc_rate.value = false;
                show_disc_info.value = true;
            }
            else{
                show_disc_rate.value = false;
                show_disc_info.value = false;
            }
        }
        
        const cancel = () => modalController.dismiss('', 'cancel');
        const confirm = () => {
            if(selected_discount.value){
                selected_discount.value.discount_rate = disc_rate.value;
                selected_discount.value.discount_amount = disc_amount.value;
                selected_discount.value.senior_pwd_id = senior_pwd_id.value;
                selected_discount.value.senior_pwd_name = senior_pwd_name.value;
            }
            modalController.dismiss(selected_discount.value , 'confirm');
        }


        async function fetchList() {
            try {
                const result = await getDiscounts();
                if(result.success){
                    discount_list.value = result.data;
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`);
            }
        }
        
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        onMounted(async() =>{
            await fetchList()
        })
        return{
            icons,
            disc_rate,
            disc_amount,
            discount_id,
            senior_pwd_id,
            senior_pwd_name,

            show_disc_rate,
            show_disc_info,

            discount_list,

            selected_discount,

            handleSelectDiscount,
            cancel,
            confirm,
        }
    }
});
</script>