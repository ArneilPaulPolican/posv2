<template>
    <ion-menu content-id="main-content" menu-id="my-menu">
      <!-- <SidebarMenu ref="sidebarMenu"/> -->
    </ion-menu>
    <!-- <SidebarMenu ref="sidebarMenu"/> -->
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button @click="handleMenuClick" color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
        <router-link v-if="$route.path.toLowerCase() !== '/dashboard' " to="/"  slot="end" style="margin-right: 10px;">
          <ion-buttons size="large">
            <ion-icon :icon="icons.homeSharp"></ion-icon>
          </ion-buttons>
        </router-link>
      </ion-toolbar>
    </ion-header>
</template>
  
<script setup lang="ts">
import { icons } from '@/plugins/icons';
// import SidebarMenu from './SidebarMenu.vue';
import { defineComponent, onMounted, ref } from 'vue';
import { Icon } from 'ionicons/dist/types/components/icon/icon';

  
const isMenuOpen = ref(false);
    const sidebarMenu = ref(null);
    const appPages = [
                {
                    title: 'Setup',
                    url: '',
                    iosIcon: icons.folderOpenOutline,
                    mdIcon: icons.folderOpenSharp,
                    subitems: [
                    {
                        title: 'Item',
                        url: '/Setup/Items',
                        iosIcon: icons.fileTrayStackedOutline,
                        mdIcon: icons.fileTrayStackedSharp,
                    },
                    {
                        title: 'Customers',
                        url: '/Setup/Customers',
                        iosIcon: icons.peopleCircleOutline,
                        mdIcon: icons.peopleSharp,
                    },
                    {
                        title: 'Category',
                        url: '/Setup/Category',
                        iosIcon: icons.documentOutline,
                        mdIcon: icons.documentSharp,
                    },
                    {
                        title: 'Table',
                        url: '/Setup/Table',
                        iosIcon: icons.restaurantOutline,
                        mdIcon: icons.restaurantSharp,
                    },
                    ],
                },
                {
                    title: 'Activity',
                    iosIcon: icons.businessOutline,
                    mdIcon: icons.businessSharp,
                    subitems: [
                    {
                        title: 'Sales',
                        url: '/Activity/Sales',
                        iosIcon: icons.basketOutline,
                        mdIcon: icons.basketSharp,
                    },
                    {
                        title: 'Cash-in / Cash-out',
                        url: '/Activity/CashInCashOut',
                        iosIcon: icons.bookOutline,
                        mdIcon: icons.bookSharp,
                    },
                    {
                        title: 'Stock In',
                        url: '/Activity/StockIn',
                        iosIcon: icons.logInOutline,
                        mdIcon: icons.logInSharp,
                    },
                    {
                        title: 'Stock Out',
                        url: '/Activity/StockOut',
                        iosIcon: icons.logOutOutline,
                        mdIcon: icons.logOutSharp,
                    },
                    ],
                },
                {
                    title: 'Report',
                    iosIcon: icons.readerOutline,
                    mdIcon: icons.readerSharp,
                    subitems: [
                    {
                        title: 'Z-Reading',
                        url: '/Report/ZReading',
                        iosIcon: icons.readerOutline,
                        mdIcon: icons.readerSharp,
                    },
                    {
                        title: 'X-Reading',
                        url: '/Report/XReading',
                        iosIcon: icons.readerOutline,
                        mdIcon: icons.readerSharp,
                    },
                    ]
                },
                {
                    title: 'System',
                    iosIcon: icons.appsOutline,
                    mdIcon: icons.appsSharp,
                    subitems: [
                        {
                            title: 'Unit',
                            url: '/System/Units',
                            iosIcon: icons.scaleOutline,
                            mdIcon: icons.scaleSharp,
                        },
                        {
                            title: 'Tax',
                            url: '/System/Taxes',
                            iosIcon: icons.pieChartOutline,
                            mdIcon: icons.pieChartSharp,
                        },
                        {
                            title: 'Discount',
                            url: '/System/Discounts',
                            iosIcon: icons.discOutline,
                            mdIcon: icons.discSharp,
                        },
                        {
                            title: 'Paytype',
                            url: '/System/Paytypes',
                            iosIcon: icons.walletOutline,
                            mdIcon: icons.walletSharp,
                        },
                    ],
                },
                {
                    title: 'Settings',
                    iosIcon: icons.settingsOutline,
                    mdIcon: icons.settingsSharp,
                    subitems: [
                    {
                        title: 'Company',
                        url: '/Settings/Company',
                        iosIcon: icons.storefrontOutline,
                        mdIcon: icons.storefrontSharp,
                    },
                    {
                        title: 'System',
                        url: '/Settings/System',
                        iosIcon: icons.cogOutline,
                        mdIcon: icons.cogSharp,
                    },
                    ]
                },
        ]
    const accordionStates= ref<{ [key: string]: boolean }>({})

    
    const handleMenuClick = async () => {
      // try {
      //   console.log('menu button')
        const menu = document.querySelector('ion-menu');
        console.log('menu ',menu)
      //   if (menu) {
      //     if (await menu.isOpen()) {
      //       menu.close();
      //     } else {
      //       menu.open();
      //     }
      //   }
      // } catch (error) {
      //   console.log('error ',error)
      // }
    };

    const selectedIndex = ref(0);
    function accordionToggle(i: number) {
        accordionStates.value[i] = !accordionStates.value[i];
    }
    

    onMounted(() => {
      const menu = document.querySelector('ion-menu');
    });

</script>