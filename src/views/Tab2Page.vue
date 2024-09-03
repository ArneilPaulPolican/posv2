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
      <ion-button @click="openPDF">PDF</ion-button>
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
import { generateSales } from '@/composables/pdf-generator';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';

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

    async function takePhoto () {
      const response = await usePhotoGallery();
      // const blob = new Blob(['<h1>Test Blob Content</h1>'], { type: 'text/html' });
      let webviewPath = response[0].webviewPath;
      console.log('webviewPath ',webviewPath)
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

      // await Browser.open({ url: uri });
      if(webviewPath){
        const blob_res = await fetch(webviewPath);

        const blob = await blob_res.blob();

        const base64Data = await blobToBase64Image(blob);

        const { uri } = await Filesystem.writeFile({
          path: 'myimage.png',
          data: base64Data,
          directory: Directory.Documents,
        });
        console.log('uri ', uri)
        imageUri.value = uri; // Set the image URI to display
      }
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

    
    async function openPDF() {
      await generateSales()
      // console.log('pdf response', response)
      // const blob_res = await fetch(response);
      // const blob = await blob_res.blob();


    }

    onMounted(() => {
      // Create a simple HTML blob
    });
    return{
      icons,
      blob_url,
      takePhoto,
      photo,
      openPDF,
      imageUri
    }
  }
})
</script>
