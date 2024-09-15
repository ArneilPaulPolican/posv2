<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->

        <ion-item>
            <ion-icon :ios="icons.arrowBackOutline" :md="icons.arrowBackSharp" @click="handleReturn"></ion-icon>
            <ion-button slot="end" size="medium" expand="block" style="height: 90%"
                @click="handleSave()">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.saveSharp"></ion-icon>
                    <ion-label>Save</ion-label>
                </div>
            </ion-button>
        </ion-item>
        
        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    <ion-item>
                        <ion-label position="stacked">Discount :</ion-label>
                        <ion-input v-model="discount.discount" placeholder="Discount name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col>
                                <ion-label position="stacked">Rate :</ion-label>
                                <!-- <ion-input v-model="discount.discount_rate"  type="number" placeholder="0.00"></ion-input> -->
                                <InputFloat :amount="discount.discount_rate" @update="(floatValue) => discount.discount_rate = floatValue"></InputFloat>
                            </ion-col>
                            <ion-col>
                                <!-- <ion-label position="stacked">Is Vat Inclusive  :</ion-label>&nbsp; -->
                                <!-- <ion-checkbox v-model="discount.vat_inclusive" label-placement="start"></ion-checkbox> -->
                                <ion-checkbox v-model="discount.vat_inclusive" label-placement="start">Is Inclusive</ion-checkbox>
                            </ion-col>
                        </ion-row></ion-item>
                    <ion-item>
                        <ion-label position="stacked">Particulars :</ion-label>
                        <ion-input v-model="discount.particular" placeholder="Rate"></ion-input>
                    </ion-item>
                    <ion-item>
                        <img v-if="discount.image_url" :src="discount.image_url" >
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>

    </ion-page>
</template>
<script lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent, onMounted, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { actionSheetController } from '@ionic/vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { DISCOUNT } from '@/models/discount.model';
import { Lock } from '@/services/lock';
import { presentToast } from '@/composables/toast.composables';
import InputFloat from '@/components/InputFloat.vue';


export default defineComponent({
    components:{
        // HeaderComponent
        InputFloat
    },
    setup(){
        const router = useRouter();
        const route = useRoute();
        const dbLock = new Lock(); // Create a new lock
        const discount = ref<DISCOUNT>({
            id:0,
            discount: 'NA',
            discount_rate: 0,
            vat_inclusive: false,
            particular: 'NA',
            is_locked: false,
            image_url:''
        });
        let discount_id = 0 ;
        const open_alert = ref(false);
        const alertTitle = ref('');
        const alertSubTitle = ref('');
        const alertMessage = ref('');

                    // BACK
        function handleReturn(){
            router.push(`/System/Discounts`);
        }
        const handleSave = async () => {
            setTimeout(async () => {
                try {
                    if(discount_id == 0){
                        const response = discount.value; //await addTax(tax.value);
                        if(response){
                            // trigger here to open the alert component
                            await presentToast('Discount successfully created')
                        }else{
                            await presentToast('Failed to create item')
                        }
                    }else{
                        const response = discount.value ;//await updateTax(tax.value);
                        alertSubTitle.value = 'Updating Discount'
                        if(response){
                            await presentToast('Discount successfully updated')
                        }else{
                            await presentToast('Failed to update Discount')
                        }
                    }
                    open_alert.value = true; // Open the alert
                } catch (err) {
                    dbLock.release(); // Release the lock after the operation
                    await presentToast('Error adding data:')
                }
            }, 500);
        }
        onMounted(async() => {
            setTimeout(() => {
                const routeParams = +route.params.id;
                discount_id = routeParams ; 
                const discountResult= {
                        id:0,
                        discount: 'NA',
                        discount_rate: 0,
                        vat_inclusive: false,
                        particular: 'NA',
                        is_locked: false,
                        image_url:''
                    }

                if(discountResult){
                    discount.value = {
                        id: discountResult.id,
                        discount: discountResult.discount,
                        discount_rate: discountResult.discount_rate,
                        vat_inclusive: discountResult.vat_inclusive,
                        particular: discountResult.particular,
                        is_locked: discountResult.is_locked,
                        image_url:discountResult.image_url
                    }
                }else{
                    if(routeParams !=0 ){
                        
                        alertTitle.value = 'Not Found';
                        alertSubTitle.value = 'TAX Not Found'
                        alertMessage.value = 'No tax exist';
                        open_alert.value = true; // Open the alert
                    }else{
                        discount.value ={
                            id: 0,
                            discount: 'NA',
                            discount_rate: 0,
                            vat_inclusive: false,
                            particular: 'NA',
                            is_locked: false,
                            image_url:''
                        }
                    }
                }
            }, 500);

        });
        return{
            header: 'Discount Detail',
            icons,
            discount,


            handleSave,
            handleReturn
        }
    }
})
</script>