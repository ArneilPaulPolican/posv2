<template>
    <ion-menu content-id="main-content" menu-id="my-menu">
      <SidebarMenu ref="sidebarMenu"/>
    </ion-menu>
    <!-- <SidebarMenu ref="sidebarMenu"/> -->
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button @click="handleMenuClick" color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.meta.title }}</ion-title>
        <router-link v-if="$route.path.toLowerCase() !== '/dashboard' " to="/dashboard"  slot="end" style="margin-right: 10px;">
            <ion-icon size="large" :icon="icons.homeSharp"></ion-icon>
            <!-- <ion-avatar style="align-content: center;">
                <img src="../../../public/favicon.png" style="height: 60%; width: 60%; align-self: center; object-fit: contain; margin: auto;"/>
            </ion-avatar> -->
        </router-link>
        <!-- implement logout here -->
        <ion-button v-else  size="small" expand="block" slot="end" style="margin-right: 10px;" @click="logout" color="secondary">
            <ion-icon :icon="icons.logOutOutline"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-header>
</template>
  
<script lang="ts">
import { icons } from '@/plugins/icons';
import SidebarMenu from './SidebarMenu.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { Storage } from '@capacitor/storage';
import { useRouter } from 'vue-router';
import { presentToast } from '@/composables/toast.composables';
  
export default defineComponent({
  props: {
    title: String,
  },
    components: { 
      SidebarMenu
   },
  setup() {
    const router = useRouter(); 
    const isMenuOpen = ref(false);
    const sidebarMenu = ref(null);
    const accordionStates= ref<{ [key: string]: boolean }>({});

    const handleMenuClick = async () => {
        const menu = document.querySelector('ion-menu');
    };

    const selectedIndex = ref(0);
    function accordionToggle(i: number) {
        accordionStates.value[i] = !accordionStates.value[i];
    }

    async function logout() {
      try {
        await Storage.remove({
          key: 'current_user'
        });
          
        // Optionally, present a toast message to confirm logout
        await presentToast('Logout successful');
          
        // Redirect to the login page
        router.push('/'); // Adjust the path as necessary
      } catch (error) {
          await presentToast(`Logout failed: ${error}`);
      }
    }


    onMounted(() => {
      const menu = document.querySelector('ion-menu');
    });
    
    return {
      icons,
      labels: ['Sales', 'Item', 'Customer'],
      selectedIndex,
      accordionToggle,
      handleMenuClick,
      logout,
    }
  }
});

</script>