<template>
    <ion-page>
        <ion-item style="position: relative;">
            <div style="display: flex; overflow-x: auto; white-space: nowrap; width: 100%; padding-right: 10px;height: 100%; align-items: center;">
                <ion-button @click="handleReturn()" size="medium" expand="block" style="height: 90%">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                        <ion-label>Back</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked" :disabled="is_locked" size="medium" expand="block" style="height: 90%" @click="handleSave()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.saveSharp"></ion-icon>
                        <ion-label>Save</ion-label>
                    </div>
                </ion-button>
                <ion-button v-if="!is_locked"  size="medium" expand="block" style="height: 90%" @click="handleLock()">
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
                <ion-button v-if="is_locked" size="medium" expand="block" style="height: 90%" @click="handlePrint()">
                    <div class="icon-label-wrapper">
                        <ion-icon :icon="icons.printSharp"></ion-icon>
                        <ion-label>Print</ion-label>
                    </div>
                </ion-button>
            </div>
        </ion-item>
        <ion-item>
            <h1 slot="end">₱&nbsp;{{ cash_in_cash_out.amount.toFixed(2) }}</h1>
        </ion-item>
        <ion-item>
            
            <ion-row>
                <ion-col size="6">
                    <!-- <ion-label position="stacked">Date</ion-label> -->
                    <ion-input label="Date" label-placement="floating" fill="solid" :readonly="true" v-model="cash_in_cash_out.cash_in_out_date" placeholder="MM/dd/yyyy"></ion-input>
                </ion-col>
                <ion-col size="6">
                    <!-- <ion-label position="stacked">Number</ion-label> -->
                    <ion-input label="Number" label-placement="floating" fill="solid" :readonly="true" v-model="cash_in_cash_out.cash_in_out_number" placeholder="0000000001"></ion-input>
                </ion-col>
            </ion-row>
        </ion-item>
        <ion-content :fullscreen="true">
            <div style="padding: 5px;">
                <ion-item>
                    <!-- <ion-label position="stacked">Reference No.</ion-label> -->
                    <ion-input label="Reference No." label-placement="floating" fill="solid" :disabled="is_locked" v-model="cash_in_cash_out.refund_reference_number" placeholder="0000000001"></ion-input>
                </ion-item>
                <ion-item>
                    <!-- <ion-label position="stacked">Remarks</ion-label> -->
                    <ion-textarea label="Remarks" label-placement="floating" fill="solid" auto-grow="true" :disabled="is_locked" v-model="cash_in_cash_out.remarks" placeholder="NA"></ion-textarea>
                </ion-item>
                <ion-item>
                    <!-- <ion-label position="stacked">Type</ion-label>
                    <ion-textarea fill="solid" :disabled="is_locked" v-model="cash_in_cash_out.type" placeholder="Cash Count"></ion-textarea> -->
                    <!-- <ion-label position="stacked">Select an option</ion-label> -->
                    <ion-select label="Select type" label-placement="floating"  fill="solid" :disabled="is_locked" v-model="cash_in_cash_out.type" interface="action-sheet">
                        <ion-select-option value="Debit">Debit</ion-select-option>
                        <ion-select-option value="Credit">Credit</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item>
                    <ion-grid style="padding: 0px;">
                        <ion-row style="padding: 0px;">
                            <ion-col size="6" style="padding: 0px;">
                                <!-- <ion-label position="stacked">1000 bill</ion-label> -->
                                <ion-input label="1000 bill" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_1000" placeholder="0"></ion-input>
                            </ion-col>
                            <ion-col size="6" style="padding: 0px;">
                                <!-- <ion-label position="stacked">Status</ion-label> -->
                                <ion-input label="Status" label-placement="floating" fill="solid" :disabled="is_locked" readonly v-model="cash_in_cash_out.status" placeholder="0"></ion-input>
                                
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
                <ion-item style="padding: 0px;">
                    <ion-grid style="padding: 0px;">
                        <ion-row style="padding: 0px;">
                            <ion-col size="4" style="padding-left: 0px;">
                                <!-- <ion-label position="stacked">500 bill</ion-label> -->
                                <ion-input label="500 bill" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_500" placeholder="0"></ion-input>
                            </ion-col>
                            <ion-col size="4">
                                <!-- <ion-label position="stacked">200 bill</ion-label> -->
                                <ion-input label="200 bill" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_200" placeholder="0"></ion-input>
                            </ion-col>
                            <ion-col size="4">
                                <!-- <ion-label position="stacked">100 bill</ion-label> -->
                                <ion-input label="100 bill" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_100" placeholder="0"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
                <ion-item style="padding: 0px;">
                    <ion-grid style="padding: 0px;">
                        <ion-row style="padding: 0px;">
                            <ion-col size="6" style="padding-left: 0px;">
                                <!-- <ion-label position="stacked">50 bill</ion-label> -->
                                <ion-input label="50 bill" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_50" placeholder="0"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <!-- <ion-label position="stacked">20 bill(s)/coin(s) </ion-label> -->
                                <ion-input label="20 bill(s)/coin(s)" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_20" placeholder="0"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
                <h3>Peso</h3>
                <ion-item>
                    <ion-grid style="padding: 0px;">
                        <ion-row style="padding: 0px;">
                            <ion-col size="6" style="padding-left: 0px;">
                                <!-- <ion-label position="stacked">10 coin(s):</ion-label> -->
                                <ion-input label="10 coin(s)" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_10" placeholder="0"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <!-- <ion-label position="stacked">5 coin(s)</ion-label> -->
                                <ion-input label="5 coin(s)" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_5" placeholder="0"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
                <ion-item>
                    <!-- <ion-label position="stacked">1 coin(s)</ion-label> -->
                    <ion-input label="1 coin(s)" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_1" placeholder="0"></ion-input>
                </ion-item>
                <h3>Centavo</h3>
                <ion-item>
                    <ion-grid style="padding: 0px;">
                        <ion-row style="padding: 0px;">
                            <ion-col size="6" style="padding-left: 0px;">
                                <!-- <ion-label position="stacked">25 cent(s)</ion-label> -->
                                <ion-input label="25 cent(s)" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_dot_25" placeholder="0"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <!-- <ion-label position="stacked">10 cent(s)</ion-label> -->
                                <ion-input label="10 cent(s)" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_dot_10" placeholder="0"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
                <ion-item>
                    <ion-grid>
                        <ion-row>
                            <ion-col size="6">
                                <!-- <ion-label position="stacked">5 cent(s)</ion-label> -->
                                <ion-input label="5 cent(s)" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_dot_5" placeholder="0"></ion-input>
                            </ion-col>
                            <ion-col size="6">
                                <!-- <ion-label position="stacked">1 cent(s)</ion-label> -->
                                <ion-input label="1 cent(s)" label-placement="floating" fill="solid" :disabled="is_locked" @ionInput="updateAmount" v-model="cash_in_cash_out.cash_dot_1" placeholder="0"></ion-input>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { presentToast } from '@/composables/toast.composables';
import { CASH_IN_OUTS_DTO } from '@/models/cashin-cashout.model';
import { icons } from '@/plugins/icons';
import { generateCashInCashOutReceipt } from '@/services/receipt/cash-in-cash-out-receipt.service';
import { getCashInCashOutById, lockCashInCashOut, unlockCashInCashOut, updateCashInCashOut } from '@/services/activity/cash-in-cash-out.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


export default defineComponent({
    setup(){
        const router = useRouter();
        const route = useRoute();
        const is_locked = ref(false);
        const cash_in_cash_out = ref<CASH_IN_OUTS_DTO>({
            id: 0,
            user_id: 0,
            user:  '',
            cash_in_out_number: '',
            cash_in_out_date: '',
            amount: 0,
            cash_1000: 0,
            cash_500: 0,
            cash_200: 0,
            cash_100: 0,
            cash_50: 0,
            cash_20: 0,
            cash_10: 0,
            cash_5: 0,
            cash_1: 0,
            cash_dot_25: 0,
            cash_dot_10: 0,
            cash_dot_5: 0,
            cash_dot_1: 0,
            type:  '',
            refund_reference_number:  '',
            remarks: '',
            is_locked: false,
            status:  '',
        });
        const _id = ref(0);

        async function updateAmount() {
            let one_thousands = 1000 * cash_in_cash_out.value.cash_1000;
            let five_hundreds = 500 * cash_in_cash_out.value.cash_500;
            let two_hundreds = 200 * cash_in_cash_out.value.cash_200;
            let one_hundreds = 100 * cash_in_cash_out.value.cash_100;
            let fifties = 50 * cash_in_cash_out.value.cash_50;
            let twenties = 20 * cash_in_cash_out.value.cash_20;
            let tens = 10 * cash_in_cash_out.value.cash_10;
            let fives = 5 * cash_in_cash_out.value.cash_5;
            let ones = 1 * cash_in_cash_out.value.cash_1;
            let twenty_five_cents = 0.25 * cash_in_cash_out.value.cash_dot_25;
            let ten_cents = 0.10 * cash_in_cash_out.value.cash_dot_10;
            let five_cents = 0.05 * cash_in_cash_out.value.cash_dot_5;
            let one_cents = 0.01 * cash_in_cash_out.value.cash_dot_1;

            cash_in_cash_out.value.amount = one_thousands + five_hundreds + two_hundreds +
                                            one_hundreds + fifties + twenties + tens + fives+
                                            ones + twenty_five_cents + ten_cents + five_cents + one_cents;
        }

        async function handleReturn() {
            router.push('/activity/cash-in-cash-outs')
        }
        async function handleSave() {
            try {
                const result = await updateCashInCashOut(cash_in_cash_out.value);
                if(result.success){
                    await presentToast(`Update successfully`)
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        async function handleUnlock() {
            try {
                const result = await unlockCashInCashOut(cash_in_cash_out.value);
                if(result.success){
                    is_locked.value = false;
                    await presentToast(`Unlock successfully`)
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        async function handleLock() {
            try {
                const result = await lockCashInCashOut(cash_in_cash_out.value);
                if(result.success){
                    is_locked.value = true;
                    await presentToast(`Lock successfully`)
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        async function handlePrint() {
            try {
                await generateCashInCashOutReceipt(cash_in_cash_out.value)
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        async function fetchList() {
            try {
                const routeParams = +route.params.id;
                _id.value = routeParams; 
                const result = await getCashInCashOutById(routeParams)
                if(result.success){
                    if(result.data) cash_in_cash_out.value = { ... result.data}
                    console.log(result.data);
                    
                    is_locked.value = cash_in_cash_out.value.is_locked;
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`);
                await handleReturn()
            }
        }
        onMounted(async()=>{
            await fetchList()
        })
        onIonViewDidEnter(async()=>{
            await fetchList()
        })
        return{
            icons,
            cash_in_cash_out,
            is_locked,

            handleReturn,
            handleSave,
            handleUnlock,
            handleLock,
            handlePrint,
            updateAmount
        }
    }
})
</script>