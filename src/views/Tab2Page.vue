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
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="icons.cameraOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-row>
          <!-- <ion-img :src="getUrl(photo)" /> -->
          <!-- <img :srcObject="blob_url" alt="Photo" /> -->
          <iframe :src="blob_url" width="100%" height="100%" frameborder="0"></iframe>
      </ion-row>
      <iframe v-if="objectUrl" :src="objectUrl" width="100%" height="100%" frameborder="0"></iframe>
      <ExploreContainer name="Tab 2 page" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { defineComponent, onMounted, Ref, ref } from 'vue';
import { usePhotoGallery } from '@/composables/usePhotoGallery';

export default defineComponent({
  setup(){
    // const { photo, takePhoto } = usePhotoGallery();
    const photo = ref([]);
    const blob_url = ref(''); 
    const objectUrl = ref('');

    async function takePhoto () {
      photo.value = await usePhotoGallery();
      console.log('photo', photo.value);
      
    }
    
    // async function takePhoto() {
    //   const blobUrl = await usePhotoGallery();
    //   const response = await fetch(blobUrl);
    //   const blob = await response.blob(); // get the Blob object from the response
    //   const file = new File([blob], 'image.jpg', { type: 'image/jpeg' }); // create a File object from the Blob
    //   // photos.value.push(file); // add the File object to the array
    //   // console.log('photo', file);
    //   await getUrl(file)
    // }

    function getUrl(file: File) {
      blob_url.value = URL.createObjectURL(file.slice());
    }


    onMounted(() => {
      // Create a simple HTML blob
      const blob = new Blob(['<h1>Test Blob Content</h1>'], { type: 'text/html' });
      objectUrl.value = URL.createObjectURL(blob);
    });
    return{
      icons,
      takePhoto,
      photo,
      getUrl
    }
  }
})
</script>
