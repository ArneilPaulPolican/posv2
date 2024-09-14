<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-button @click="captureImage">Take Photo</ion-button>
      <ion-button @click="retreiveImage">Select Photo</ion-button>
      <img v-if="blobUrl" :src="blobUrl" alt="Image" />

      <!-- <ExploreContainer name="Tab 1 page" /> -->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import ExploreContainer from '@/components/ExploreContainer.vue';
// import { usePhotoGallery } from '@/composables/usePhotoGallery';
import { Preferences } from '@capacitor/preferences';
import { camera, trash, close } from 'ionicons/icons';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { isPlatform } from '@ionic/vue';
import { usePhotoGallery } from '@/composables/image-composable';


export default defineComponent( {
  setup() {
    const photos = ref<any[]>([]);
    const imageSrc = ref<string | null>(null);
    const { takePhoto, selectPhoto, loadImageFromFilesystem, savedPhotoPath } = usePhotoGallery();
    const blobUrl = ref('');
        // Capture an image and save it
    const captureImage = async () => {
      const dataUrl = await takePhoto();
      console.log(`dataUrl ${JSON.stringify(dataUrl)}`);
      const webPath = dataUrl?.webPath;
      const format = dataUrl?.format;
      blobUrl.value = dataUrl?.webPath ?? '';
      console.log(`webPath: ${webPath}`);
      console.log(`format: ${format}`);
      
    };

    const retreiveImage = async () => {
      const dataUrl = await selectPhoto();
      console.log(`dataUrl ${JSON.stringify(dataUrl)}`);
      const webPath = dataUrl?.webPath;
      const format = dataUrl?.format;
      blobUrl.value = dataUrl?.webPath ?? '';
      console.log(`webPath: ${webPath}`);
      console.log(`format: ${format}`);
      
    };

    return {
      icons,
      takePhoto,
      photos,
      imageSrc,
      captureImage,
      retreiveImage,
      savedPhotoPath,
      blobUrl
    }
  }
});
</script>

