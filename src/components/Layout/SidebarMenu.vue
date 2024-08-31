<template>
    <ion-page>
        <ion-content>
          <ion-list id="inbox-list">
            <!-- <img src="/public/favicon.png" style="justify-self: center;"> -->
            <ion-item>
                <h1>Company</h1>
            </ion-item>
            <ion-item>
                <ion-note>test@example.user.com</ion-note>
            </ion-item>

            <ion-item slot="header" router-direction="root" :router-link="'/Dashboard'" lines="none" :detail="false" class="hydrated" >
                  <ion-icon slot="start" :ios="icons.homeOutline" :md="icons.homeSharp"></ion-icon>
                  <ion-label>Dashboard</ion-label>
            </ion-item>
            <ion-accordion-group>
              <ion-accordion v-for="(p, i) in appPages" :key="i">
                <ion-item slot="header" @click="p.subitems ? accordionToggle(i) : selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" :detail="false" class="hydrated" :class="{ selected: p.subitems ? false : selectedIndex === i }">
                  <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                  <ion-label>{{ p.title }}</ion-label>
                </ion-item>
                <ion-list slot="content" v-if="p.subitems">
                  <ion-item v-for="(subitem, j) in p.subitems" :key="j" @click="selectedIndex = j" router-direction="root" 
                    :router-link="subitem.url" lines="none" :detail="false" class="hydrated" :class="{ selected: selectedIndex === j }">
                    <ion-icon aria-hidden="true" slot="start" :ios="subitem.iosIcon" :md="subitem.mdIcon"></ion-icon>
                    <ion-label>{{ subitem.title }}</ion-label>
                  </ion-item>
                </ion-list>
              </ion-accordion>
            </ion-accordion-group>
            <ion-item slot="header" router-direction="root" :router-link="'/tabs/tab1'" lines="none" :detail="false" class="hydrated" >
                  <ion-label>Test</ion-label>
            </ion-item>
          </ion-list>

          <ion-list id="labels-list">
            <ion-list-header>Widget</ion-list-header>

            <ion-item v-for="(label, index) in labels" lines="none" :key="index">
              <ion-icon aria-hidden="true" slot="start" :ios="icons.bookmarkOutline" :md="icons.bookmarkSharp"></ion-icon>
              <ion-label>{{ label }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
    </ion-page>
</template>


<script lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';

export default defineComponent({
    setup(){
        const accordionStates= ref<{ [key: string]: boolean }>({})
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
                        url: '/Setup/Tables',
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
                            title: 'Discounts',
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
                        title: 'Users',
                        url: '/Settings/Users',
                        iosIcon: icons.cogOutline,
                        mdIcon: icons.cogSharp,
                    },
                    ]
                },
        ]
            
        const selectedIndex = ref(0);
        function accordionToggle(i: number) {
            accordionStates.value[i] = !accordionStates.value[i];
        }
        onMounted(() =>{
            console.log('Sidebar onMounted')
        })
        return{
            icons,
            appPages,
            labels: ['Sales', 'Item', 'Customer'],
            selectedIndex,
            accordionToggle
        }
    }
});
</script>