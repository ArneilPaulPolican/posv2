<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-button @click="printSales">Sales</ion-button>
      <ion-button @click="InventoryReport">Inventory</ion-button>
      <ion-button @click="printZReading">Z-Reading</ion-button>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="icons.cameraOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-row>
          <!-- <ion-img :src="getUrl(photo)" /> -->
          <img v-if="imageUri" :src="imageUri" alt="Image" />
      </ion-row>
      <ExploreContainer name="Tab 2 page" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { defineComponent, onMounted, Ref, ref } from 'vue';
import { usePhotoGallery } from '@/composables/usePhotoGallery';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { Directory, Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
import { generateSales } from '@/services/receipt/sales-receipt.service';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { SALES_DTO } from '@/models/sales.model';
import { SALES_ITEM_DTO } from '@/models/sales-item.model';
import { presentToast } from '@/composables/toast.composables';
import { getInventoryReport } from '@/services/sys-inventory.service';
import { generateInventoryReport } from '@/services/report/sys-inventory-report.service';

const options: DocumentViewerOptions = {
  title: 'My PDF'
};

export default defineComponent({
  components:{
    ExploreContainer
  },
  setup(){
    // const { photo, takePhoto } = usePhotoGallery();
    const photo = ref([]);
    const blob_url = ref(new Blob());
    const imageUri = ref('')
        const sales =  ref<SALES_DTO>({
            id: undefined,
            user_id: 0,
            user: '',
            sales_number: '0000000001',
            sales_date: '',
            sales_time: '',
            terminal_number: '001',
            customer_id: 0,
            customer_code:'',
            customer: '',
            customer_address: '',
            customer_tin: '',
            table_id: 1,
            table: '',
            total_amount: 0,
            net_amount:0,
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
            senior_pwd_id: 'NA',
            discounted_pax: 0
        });
        const sales_item_list = ref<SALES_ITEM_DTO[]>([]);

    async function takePhoto () {
      const response = await usePhotoGallery();
      // const blob = new Blob(['<h1>Test Blob Content</h1>'], { type: 'text/html' });
      // let webviewPath = response[0].webviewPath;
      await presentToast('webviewPath ')
      // blob_res = await fetch(blobUrl);
      // const blob = await webviewPath.blob();
      // const base64Data = await blobToBase64(blob);

      // // Write the file to the filesystem
      // const { uri } = await Filesystem.writeFile({
      //   path: 'myfile.pdf',
      //   data: base64Data,
      //   directory: Directory.Documents,
      //   encoding: Filesystem.Encoding.UTF8, // Base64 is the default encoding
      // });

      // // await Browser.open({ url: uri });
      // if(webviewPath){
      //   const blob_res = await fetch(webviewPath);

      //   const blob = await blob_res.blob();

      //   const base64Data = await blobToBase64Image(blob);

      //   const { uri } = await Filesystem.writeFile({
      //     path: 'myimage.png',
      //     data: base64Data,
      //     directory: Directory.Documents,
      //   });
      //   imageUri.value = uri; // Set the image URI to display
      // }
    }

    async function blobToBase64Image(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Remove the Data URL prefix to keep the pure base64 string
          resolve(base64data.split(',')[1]);
        };
        reader.onerror = reject;
      });
    }

    
    async function printZReading() {
      // await generateZReading()
    }
    async function printSales() {
      await generateSales(sales.value,sales_item_list.value)
    }
    async function InventoryReport() {
      try {
        await generateInventoryReport();
      } catch (error) {
        await presentToast(`Operation failed ${error}`)
      }
    }

    onMounted(() => {
      // Create a simple HTML blob
    });
    return{
      icons,
      blob_url,
      takePhoto,
      photo,
      printSales,
      printZReading,
      imageUri,
      InventoryReport
    }
  }
})
</script>
