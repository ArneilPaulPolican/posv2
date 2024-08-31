<template>
    <ion-page>
        <ion-list :inset="true" style="margin: 10px">
            <div style="padding: 10px;">
                <ion-item >
                    <ion-label position="stacked">Name</ion-label>
                    <ion-input v-model="company.customer" placeholder="012345678912"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Address</ion-label>
                    <ion-textarea v-model="company.customer_address" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">TIN</ion-label>
                    <ion-textarea v-model="company.customer_tin" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Terminal Number</ion-label>
                    <ion-textarea v-model="company.terminal_number" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">POS Serial Number</ion-label>
                    <ion-textarea v-model="company.pos_serial_number" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">POS Permit Number</ion-label>
                    <ion-textarea v-model="company.pos_permit_number" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">POS Accreditation Number</ion-label>
                    <ion-textarea v-model="company.pos_accreditation_number" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">POS Machine ID Number</ion-label>
                    <ion-textarea v-model="company.pos_machine_identification_number" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor</ion-label>
                    <ion-textarea v-model="company.pos_vendor" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor Address</ion-label>
                    <ion-textarea v-model="company.pos_vendor_address" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor TIN</ion-label>
                    <ion-textarea v-model="company.pos_vendor_tin" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor Accreditation No.</ion-label>
                    <ion-textarea v-model="company.pos_vendor_accreditation_number" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor Accreditation Ex. Date</ion-label>
                    <ion-textarea v-model="company.pos_vendor_accreditation_expiry_date" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Remarks</ion-label>
                    <ion-textarea v-model="company.remarks" placeholder="Item Description"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Backoffice</ion-label>
                    <ion-textarea v-model="company.backoffice_domain" placeholder="Item Description"></ion-textarea>
                </ion-item>
            </div>
        </ion-list>
    </ion-page>
</template>
<script lang="ts">
import { SYS_SETTINGS } from '@/models/system-settings.model';
import { icons } from '@/plugins/icons';
import { getSystemSettings } from '@/services/settings/system-settings.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';


export default defineComponent({
    setup(){
        const company = ref<SYS_SETTINGS>({
            id: 0,
            customer: '',
            customer_address: '',
            customer_tin: '',
            terminal_number: '',
            pos_serial_number: '',
            pos_permit_number: '',
            pos_accreditation_number: '',
            pos_machine_identification_number: '',
            pos_vendor: '',
            pos_vendor_address: '',
            pos_vendor_tin: '',
            pos_vendor_accreditation_number: '',
            pos_vendor_accreditation_expiry_date: '',
            remarks: '',
            backoffice_domain: '',
            backoffice_access_token: '',
            is_backoffice_enabled: false,
            license_key: '',
        });

        async function fetchDetails() {
            const result = await getSystemSettings()
            if(result){
                company.value = {
                    id: result.id,
                    customer: result.customer,
                    customer_address: result.customer_address,
                    customer_tin: result.customer_tin,
                    terminal_number: result.terminal_number,
                    pos_serial_number: result.pos_serial_number,
                    pos_permit_number: result.pos_permit_number,
                    pos_accreditation_number: result.pos_accreditation_number,
                    pos_machine_identification_number: result.pos_machine_identification_number,
                    pos_vendor: result.pos_vendor,
                    pos_vendor_address: result.pos_vendor_address,
                    pos_vendor_tin: result.pos_vendor_tin,
                    pos_vendor_accreditation_number: result.pos_vendor_accreditation_number,
                    pos_vendor_accreditation_expiry_date: result.pos_vendor_accreditation_expiry_date,
                    remarks: result.remarks,
                    backoffice_domain: result.backoffice_domain,
                    backoffice_access_token: result.backoffice_access_token,
                    is_backoffice_enabled: result.is_backoffice_enabled,
                    license_key: result.license_key
                }
            }
            console.log('company ',company.value)
        }
        onMounted(async ()=>{
            await fetchDetails()
        })
        onIonViewDidEnter(async ()=>{
            await fetchDetails()
        })
        return{
            icons,
            company
        }
    }
});
</script>