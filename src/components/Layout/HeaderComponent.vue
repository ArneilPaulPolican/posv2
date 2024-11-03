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
            <ion-icon size="large" :icon="icons.homeOutline"></ion-icon>
            <!-- <ion-avatar style="align-content: center;">
                <img src="../../../public/favicon.png" style="height: 60%; width: 60%; align-self: center; object-fit: contain; margin: auto;"/>
            </ion-avatar> -->
        </router-link>
        <!-- implement logout here -->
         <ion-avatar v-else @click="showPopover($event)" size="large" slot="end"
            style=" display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: center; align-items: center;">
            <ion-icon :icon="icons.peopleCircle" style="width: 50px; height: 50px; align-items: center;"></ion-icon>
          </ion-avatar>
          <ion-popover :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false" size="auto">
            <ion-content class="ion-padding">
              <ion-item>
                <ion-button expand="block" fill="clear" style="margin-right: 10px;" color="primary">
                  <ion-label>Settings&nbsp;</ion-label>
                  <ion-icon :icon="icons.settingsSharp"></ion-icon>
              </ion-button>
              </ion-item>
              <ion-item>
                <ion-button expand="block" fill="clear" style="margin-right: 10px;" @click="logoutAndClosePopover " color="primary">
                  <ion-label>Logout&nbsp;</ion-label>
                  <ion-icon :icon="icons.logOutSharp"></ion-icon>
                </ion-button>
              </ion-item>
              <ion-item>
                <ion-button expand="block" fill="clear" style="margin-right: 10px;" @click="closePopover" color="danger">
                    <ion-label>Dismiss&nbsp;</ion-label>
                    <ion-icon :icon="icons.closeCircle"></ion-icon>
                </ion-button>
              </ion-item>
            </ion-content>
          </ion-popover>
      </ion-toolbar>
    </ion-header>
</template>
  
<script lang="ts">
import { icons } from '@/plugins/icons';
import SidebarMenu from './SidebarMenu.vue';
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { Storage } from '@capacitor/storage';
import { useRouter } from 'vue-router';
import { presentToast } from '@/composables/toast.composables';
import { IonPopover } from '@ionic/vue';
  
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
    const popoverOpen = ref(false);
    const event = ref<Event | null>(null);


    const handleMenuClick = async () => {
        const menu = document.querySelector('ion-menu');
    };

    const showPopover = async (e: Event) => {
      event.value = e;
      popoverOpen.value = true;
    };

    const closePopover =  async() => {  
      popoverOpen.value = false;
     
    };

    const logoutAndClosePopover = async () => {
      await closePopover();
      await logout();
    };
    const handleDismiss = () => {
      console.log("Popover dismissed");
    };
    // function accordionToggle(i: number) {
    //     accordionStates.value[i] = !accordionStates.value[i];
    // }

    async function logout() {
      try {
        await Storage.remove({
          key: 'current_user'
        });
        closePopover();
        await presentToast('Logout successful');
        router.push('/'); 
      } catch (error) {
          await presentToast(`Logout failed: ${error}`);
      }
    }


    onMounted(() => {
      const menu = document.querySelector('ion-menu');
    });
    
    return {
      icons,
      event,
      popoverOpen,
      showPopover,
      closePopover,
      handleDismiss,

      // accordionToggle,
      handleMenuClick,
      logoutAndClosePopover

    }
  }
});

</script>