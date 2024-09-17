<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->

        <ion-item>
            <ion-button size="medium" expand="block" style="height: 90%"
                @click="handleReturn()" >
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                    <ion-label>Back</ion-label>
                </div>
            </ion-button>
            <ion-button v-if="!is_locked" size="medium" expand="block" style="height: 90%"
                @click="handleSave()">
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
        </ion-item>
        
        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    <ion-item>
                        <ion-label position="stacked">Discount :</ion-label>
                        <ion-input :disabled="is_locked" v-model="discount.discount" placeholder="Discount name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-row>
                            <ion-col>
                                <ion-label position="stacked">Rate :</ion-label>
                                <!-- <ion-input v-model="discount.discount_rate"  type="number" placeholder="0.00"></ion-input> -->
                                <InputFloat :disabled="is_locked" :amount="discount.discount_rate" @update="(floatValue) => discount.discount_rate = floatValue"></InputFloat>
                            </ion-col>
                            <ion-col>
                                <!-- <ion-label position="stacked">Is Vat Inclusive  :</ion-label>&nbsp; -->
                                <!-- <ion-checkbox v-model="discount.vat_inclusive" label-placement="start"></ion-checkbox> -->
                                <ion-checkbox :disabled="is_locked" v-model="discount.vat_inclusive" label-placement="start">Is Inclusive</ion-checkbox>
                            </ion-col>
                        </ion-row></ion-item>
                    <ion-item>
                        <ion-label position="stacked">Particulars :</ion-label>
                        <ion-input :disabled="is_locked" v-model="discount.particular" placeholder="Rate"></ion-input>
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
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { DISCOUNT } from '@/models/discount.model';
import { Lock } from '@/services/lock';
import { presentToast } from '@/composables/toast.composables';
import InputFloat from '@/components/InputFloat.vue';
import { getDiscountById, lockDiscount, unlockDiscount, updateDiscount } from '@/services/system/discount.service';


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
        const is_locked = ref(false)

                    // BACK
        function handleReturn(){
            router.push(`/System/Discounts`);
        }
        const handleSave = async () => {
            try {
                const result = await updateDiscount(discount.value);
                if(result.success){
                    await presentToast('Discount successfully updated')
                }else{
                    await presentToast('Failed to update Discount')
                }
            } catch (err) {
                await presentToast(`Operation failed ${err}`)
            }
        }
        const handleUnlock = async () => {
            try {
                const result = await unlockDiscount(discount.value);
                if(result.success){
                    is_locked.value = false;
                    await presentToast('Discount successfully unlocked')
                }else{
                    await presentToast('Failed to unlock Discount')
                }
            } catch (err) {
                await presentToast(`Operation failed ${err}`)
            }
        }
        const handleLock = async () => {
            try {
                const result = await lockDiscount(discount.value);
                if(result.success){
                    is_locked.value = true;
                    await presentToast('Discount successfully locked')
                }else{
                    await presentToast('Failed to lock Discount')
                }
            } catch (err) {
                await presentToast(`Operation failed ${err}`)
            }
        }
        async function fetchDetails() {
            const routeParams = +route.params.id;
            discount_id = routeParams ;
            try {
                const result = await getDiscountById(routeParams)
                if(result.success && result.data){
                    is_locked.value = result.data.is_locked;
                    discount.value = { ... result.data }
                }else{
                    handleReturn();
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
                handleReturn();
            }
        }
        onMounted(async() => {
            await fetchDetails()
        });
        onIonViewDidEnter(async () => {
            await fetchDetails()
        });
        return{
            header: 'Discount Detail',
            icons,
            discount,
            is_locked,


            handleSave,
            handleUnlock,
            handleLock,
            handleReturn
        }
    }
})
</script>