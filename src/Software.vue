<template>
    <HeaderComponent :title="header"/>
  
    <ion-app>
      <ion-split-pane content-id="main-content" style="margin-top: 65px;">
        <ion-router-outlet id="main-content" >
          <router-view :key="$route.fullPath"/>
        </ion-router-outlet>
      </ion-split-pane>
    </ion-app>
</template>
<script lang="ts">
import { IonApp, IonRouterOutlet, onIonViewDidEnter } from '@ionic/vue';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { computed, defineComponent, getCurrentInstance, onMounted } from 'vue';
import { getSystemSettings } from './services/settings/system-settings.service';
import { Storage } from '@capacitor/storage';
import { useRoute } from 'vue-router';

export default defineComponent({
  components:{
    HeaderComponent,
  },
  setup(){// Create a storage instance
    const route = useRoute();
    const showHeader = computed(() => route.name !== 'LoginView');
    // Store a value

    async function fetchSettings() {
      console.log(showHeader.value);
      const result = await getSystemSettings()
      await Storage.set({
        key: 'sysSettings',
        value: JSON.stringify(result) as string
      });    }
    onIonViewDidEnter(async () => {
        await fetchSettings()
    });
    onMounted(async () => {
        await fetchSettings()
    });
    return{
      header: '',
      showHeader
    }
  }
})
</script>
