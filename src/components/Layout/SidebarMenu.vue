<template>
    <ion-page>
        <ion-content>
          <ion-list id="inbox-list">
            <ion-item>
                <div style="height: 50px;width: auto; display: flex;flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center;">
                    <img v-if="company_image" :src="company_image" alt="Image" />
                </div>
            </ion-item>
            <ion-item>
                <h1>{{ sysSettings?.customer }}</h1>
            </ion-item>
            <ion-item>
                {{ current_user?.fullname }} 
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
                        <div style="margin-left: 15px;">
                            <ion-item v-for="(subitem, j) in p.subitems" :key="j" @click="selectedIndex = j" router-direction="root" 
                                :router-link="subitem.url" lines="none" :detail="false" class="hydrated" :class="{ selected: selectedIndex === j }">
                                <ion-icon aria-hidden="true" slot="start" :ios="subitem.iosIcon" :md="subitem.mdIcon"></ion-icon>
                                <ion-label>{{ subitem.title }}</ion-label>
                            </ion-item>
                        </div>
                    </ion-list>
              </ion-accordion>
            </ion-accordion-group>
            <ion-item slot="header" router-direction="root" @click="logout" lines="none" :detail="false" class="hydrated" >
                  <ion-icon slot="start" :ios="icons.logOutOutline" :md="icons.logOutSharp"></ion-icon>
                  <ion-label>Logout</ion-label>
            </ion-item>
          </ion-list>

          <!-- <ion-list id="labels-list">
            <ion-list-header>Widget</ion-list-header>

            <ion-item v-for="(label, index) in labels" lines="none" :key="index">
              <ion-icon aria-hidden="true" slot="start" :ios="icons.bookmarkOutline" :md="icons.bookmarkSharp"></ion-icon>
              <ion-label>{{ label }}</ion-label>
            </ion-item>
          </ion-list> -->
        </ion-content>
    </ion-page>
</template>


<script lang="ts">
import { presentToast } from '@/composables/toast.composables';
import { SYS_SETTINGS } from '@/models/system-settings.model';
import { icons } from '@/plugins/icons';
import { defineComponent, onBeforeMount, onMounted, ref, toRaw } from 'vue';
import { Storage } from '@capacitor/storage';
import { onIonViewDidEnter } from '@ionic/vue';
import USER from '@/models/user.model';
import { generateInventoryReport } from '@/services/report/sys-inventory-report.service';
import { getSystemSettings } from '@/services/settings/system-settings.service';
import { getUserById } from '@/services/settings/user.service';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup(){
        const router = useRouter();
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
                        url: '/Activity/Cash-In-Cash-Outs',
                        iosIcon: icons.bookOutline,
                        mdIcon: icons.bookSharp,
                    },
                    {
                        title: 'Stock In',
                        url: '/Activity/Stock-In',
                        iosIcon: icons.logInOutline,
                        mdIcon: icons.logInSharp,
                    },
                    {
                        title: 'Stock Out',
                        url: '/Activity/Stock-Out',
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
                            url: '/report/z-reading-report',
                            iosIcon: icons.readerOutline,
                            mdIcon: icons.readerSharp,
                        },
                        {
                            title: 'X-Reading',
                            url: '/Report/XReading',
                            iosIcon: icons.readerOutline,
                            mdIcon: icons.readerSharp,
                        },
                        {
                            title: 'Sales Details Report',
                            url: '/report/sales-detail-report',
                            iosIcon: icons.readerOutline,
                            mdIcon: icons.readerSharp,
                        },
                        {
                            title: 'Inventory',
                            url: '/report/inventory',
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
                        iosIcon: icons.peopleCircleOutline,
                        mdIcon: icons.peopleCircleSharp,
                    },
                    ]
                },
        ];
        const sysSettings = ref<SYS_SETTINGS>();
        const current_user = ref<USER>();
        const company_image =ref();
            
        const selectedIndex = ref(0);
        function accordionToggle(i: number) {
            accordionStates.value[i] = !accordionStates.value[i];
        }
        async function fetchCurrentSettings() {
            try {
                
                const { value } = await Storage.get({ key: 'sysSettings' });
                sysSettings.value = JSON.parse(value as string);
                    
                company_image.value = sysSettings.value?.image;
               
                const  data = await Storage.get({ key: 'current_user' });
                console.log(JSON.parse(data.value as string));
                current_user.value = JSON.parse(data.value as string);
                
            } catch (error) {
                await presentToast(`Operation failed: ${error}`);
            }
        }
        async function InventoryReport() {
            try {
                await generateInventoryReport();
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        async function logout() {
            try {
                await Storage.remove({ key: 'current_user' });
                router.push(`/Login`);
            } catch (error) {
                await presentToast(`Operation failed ${error}`)
            }
        }
        onMounted(async () =>{
            await fetchCurrentSettings();
        });
        onIonViewDidEnter(async () => {
            await fetchCurrentSettings();
        });
        return{
            icons,
            appPages,
            labels: ['Sales', 'Item', 'Customer'],
            sysSettings,
            company_image,
            current_user,
            selectedIndex,
            accordionToggle,
            InventoryReport,
            logout
        }
    }
});
</script>