<template>
    <ion-page>
        <ion-item>
            <ion-button size="medium" expand="block" style="height: 90%"
                @click="handleBack">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                    <ion-label>Back</ion-label>
                </div>
            </ion-button>
            <ion-button size="medium" expand="block" style="height: 90%"
                @click="handleSave">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.saveSharp"></ion-icon>
                    <ion-label>Save</ion-label>
                </div>
            </ion-button>
        </ion-item>
        <ion-content>
            <ion-list :inset="true" style="margin: 5px">
                <div style="height: 100px;width: auto; display: flex;flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center;">
                    <img v-if="company.image" :src="company.image" alt="Image" />
                </div>
                <ion-item >
                    <ion-button @click="captureImage">
                        <ion-icon :icon="icons.camera"></ion-icon>
                    </ion-button>
                    <ion-button @click="retreiveImage">
                        <ion-icon :icon="icons.attachSharp"></ion-icon>
                    </ion-button>
                </ion-item>
                <ion-item >
                    <ion-label position="stacked">Name</ion-label>
                    <ion-input v-model="company.customer" placeholder="Store Name"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Address</ion-label>
                    <ion-textarea v-model="company.customer_address" placeholder="Store Address"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">TIN</ion-label>
                    <ion-textarea v-model="company.customer_tin" placeholder="000 000 000 0000"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Terminal Number</ion-label>
                    <ion-textarea v-model="company.terminal_number" placeholder="001"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">POS Permit Number</ion-label>
                    <ion-textarea v-model="company.pos_permit_number" placeholder="Permit Number"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">POS Accreditation Number</ion-label>
                    <ion-textarea v-model="company.pos_accreditation_number" placeholder="Accreditation Number"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">POS Machine ID Number</ion-label>
                    <ion-textarea v-model="company.pos_machine_identification_number" placeholder="Machine Identification Number"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor</ion-label>
                    <ion-textarea v-model="company.pos_vendor" placeholder="Vendor Name"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor Address</ion-label>
                    <ion-textarea v-model="company.pos_vendor_address" placeholder="Complete Address"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor TIN</ion-label>
                    <ion-textarea v-model="company.pos_vendor_tin" placeholder="000-000-000-0000"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor Accreditation No.</ion-label>
                    <ion-textarea v-model="company.pos_vendor_accreditation_number" placeholder="Accreditation Number"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Vendor Accreditation Ex. Date</ion-label>
                    <ion-textarea v-model="company.pos_vendor_accreditation_expiry_date" placeholder="MM/dd/yyyy"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Remarks</ion-label>
                    <ion-textarea v-model="company.remarks" placeholder="Remarks"></ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-checkbox v-model="company.is_backoffice_enabled" label-placement="start">With Backoffice</ion-checkbox>
                </ion-item>
                <ion-item v-if="company.is_backoffice_enabled">
                    <ion-label position="stacked">Backoffice</ion-label>
                    <ion-input v-model="company.backoffice_domain" placeholder="www.backoffice.com"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Serial No.</ion-label>
                    <ion-input readonly v-model="company.pos_serial_number" placeholder="01ExampleSerial"></ion-input>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>
<script lang="ts">
import { icons } from '../../plugins/icons';
import { presentToast } from '../../composables/toast.composables';
import { SYS_SETTINGS } from '../../models/sys-settings.model';
import { getSystemSettings, updateCompanyLogo, updateSystemSettings } from '../../services/settings/system-settings.service';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { usePhotoGallery } from '../../composables/image.composable';
import { useRouter } from 'vue-router';
import { Storage } from '@capacitor/storage';


export default defineComponent({
    setup(){
        const router = useRouter();
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
            serial_number:'',
            license_key: '',
            image: '',
        });
        const { takePhoto, selectPhoto, loadImageFromFilesystem, savedPhotoPath } = usePhotoGallery();



        // Capture an image and save it
        const captureImage = async () => {
            const dataUrl = await takePhoto();
            console.log(`dataUrl ${JSON.stringify(dataUrl)}`);
            const webPath = dataUrl?.webPath;
            const format = dataUrl?.format;
            // blobUrl.value = dataUrl?.webPath ?? '';
            console.log(`webPath: ${webPath}`);
            console.log(`format: ${format}`);
            await updateImage(webPath) 
        };

        const retreiveImage = async () => {
            const dataUrl = await selectPhoto();
            console.log(`dataUrl ${JSON.stringify(dataUrl)}`);
            const webPath = dataUrl?.webPath;
            const format = dataUrl?.format;
            // blobUrl.value = dataUrl?.webPath ?? '';
            console.log(`webPath: ${webPath}`);
            console.log(`format: ${format}`);
            updateImage(webPath) 
        };

        async function updateImage(webPath: string | undefined) {
            if (webPath){
                try {
                    const result =await updateCompanyLogo(webPath);
                    company.value.image = webPath;
                    await Storage.set({
                        key: 'sysSettings',
                        value: JSON.stringify(company.value) as string
                    });
                    if(result.success){
                        await presentToast(`Image updated successfully`)
                    }
                } catch (error) {
                    await presentToast(`Operation failed ${error}`)
                }
            }
        }

        async function handleBack() {
            router.push('/dashboard')
        }

        async function handleSave() {
            try {
                const result = await updateSystemSettings(company.value)
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }

        async function fetchDetails() {
            try {
                const result = await getSystemSettings()
                if(result.success && result.data){
                    company.value = { ...result.data };
                    // blobUrl.value = result.data.image;
                }
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        onMounted(async ()=>{
            await fetchDetails()
        })
        onIonViewDidEnter(async ()=>{
            await fetchDetails()
        })
        return{
            icons,
            company,
            captureImage,
            retreiveImage,

            handleBack,
            handleSave
        }
    }
});
</script>