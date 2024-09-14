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
        <router-link v-if="$route.path.toLowerCase() !== '/dashboard' " to="/"  slot="end" style="margin-right: 10px;">
            <!-- <ion-icon :icon="icons.homeSharp"></ion-icon> -->
            <ion-avatar style="align-content: center;">
                <img src="../../../public/favicon.png" style="height: 60%; width: 60%; align-self: center; object-fit: contain; margin: auto;"/>
                <!-- <ion-icon aria-hidden="true" slot="start" :name="icons.imageOutline"></ion-icon> -->
            </ion-avatar>
        </router-link>
      </ion-toolbar>
    </ion-header>
</template>
  
<script lang="ts">
import { icons } from '@/plugins/icons';
import SidebarMenu from './SidebarMenu.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

  
export default defineComponent({
  props: {
    title: String,
  },
    components: { 
      SidebarMenu
   },
  setup() {
    const isMenuOpen = ref(false);
    const sidebarMenu = ref(null);
    const accordionStates= ref<{ [key: string]: boolean }>({})

    const handleMenuClick = async () => {
        const menu = document.querySelector('ion-menu');
    };

    const selectedIndex = ref(0);
    function accordionToggle(i: number) {
        accordionStates.value[i] = !accordionStates.value[i];
    }

    onMounted(() => {
      const menu = document.querySelector('ion-menu');
    });
    
    return {
      icons,
      labels: ['Sales', 'Item', 'Customer'],
      selectedIndex,
      accordionToggle,
      handleMenuClick
    }
  }
});

</script>