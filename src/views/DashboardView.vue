<template>
    <ion-page>
        <!-- <HeaderComponent :title="header"/> -->
        <ion-router-outlet></ion-router-outlet>
        <ion-content >
            <ion-grid style="width: 100%;">
                <ion-row>
                    <ion-col size="8" size-md="8" size-lg="8">
                        <ion-button size="medium" expand="block" style="height: 100%" :router-link="'/Activity/Sales'" color="success">
                            <div class="icon-label-wrapper">
                            <ion-icon slot="start" :ios="icons.basketOutline" :md="icons.basketSharp"></ion-icon>
                            <span>Sales</span>
                            </div>
                        </ion-button>
                    </ion-col>
                    <ion-col size="4" size-md="4" size-lg="4">
                        <ion-button size="medium" expand="block" style="height: 100%"  :router-link="'/Activity/Cash-In-Cash-outs'" color="success">
                            <div class="icon-label-wrapper">
                            <ion-icon  :ios="icons.cashOutline" :md="icons.cashSharp"></ion-icon>
                            <span style="text-wrap:wrap;">In/Out</span>
                            </div>
                        </ion-button>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="6" size-md="6" size-lg="6">
                        <ion-button size="medium" expand="block" style="height: 100%" :router-link="'/Activity/Stock-In'" color="success">
                            <div class="icon-label-wrapper">
                            <ion-icon slot="start" :ios="icons.logInOutline" :md="icons.logInSharp"></ion-icon>
                            <span>Stock In</span>
                            </div>
                        </ion-button>
                    </ion-col>
                    <ion-col size="6" size-md="6" size-lg="6">
                        <ion-button size="medium" expand="block" style="height: 100%" :router-link="'/Activity/Stock-Out'" color="success">
                            <div class="icon-label-wrapper">
                            <ion-icon slot="start" :ios="icons.logOutOutline" :md="icons.logOutSharp"></ion-icon>
                            <span>Stock Out</span>
                            </div>
                        </ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <br>           
            <ion-grid style="width: 100%">
                <ion-row>
                    <ion-col size="4" size-md="4" size-lg="4">
                        <router-link :to="{ name: 'item_lists' }">
                        <ion-button size="medium" expand="block" style="height: 100%;" color="danger">
                            <div class="icon-label-wrapper">
                                <ion-icon slot="start" :ios="icons.fileTrayStackedOutline" :md="icons.fileTrayStackedSharp"></ion-icon>
                                <span>item</span>
                            </div>
                        </ion-button>
                        </router-link>
                    </ion-col>
                    <ion-col size="4" size-md="4" size-lg="4">
                        <router-link :to="{ name: 'customer_lists' }">
                            <ion-button size="medium" expand="block" style="height: 100%" color="danger">
                                <div class="icon-label-wrapper">
                                    <ion-icon slot="start" :ios="icons.peopleCircleOutline" :md="icons.peopleSharp"></ion-icon>
                                    <span>Customer</span>
                                </div>
                            </ion-button>
                        </router-link>
                    </ion-col>
                    <ion-col size="4" size-md="4" size-lg="4">
                        <router-link :to="{ name: 'table_lists' }">
                            <ion-button size="medium" expand="block" style="height: 100%" color="danger">
                                <div class="icon-label-wrapper">
                                    <ion-icon slot="start" :ios="icons.restaurantOutline" :md="icons.restaurantSharp"></ion-icon>
                                    <span>Table</span>
                                </div>
                            </ion-button>
                        </router-link>
                    </ion-col>
                </ion-row>
                <br>
                <ion-row>
                    <ion-col size="3" size-md="3" size-lg="3">
                        <router-link :to="{ name: 'unit_lists' }">
                            <ion-button size="medium" expand="block" style="height: 100%" color="danger">
                                <div class="icon-label-wrapper">
                                    <ion-icon :ios="icons.scaleOutline" :md="icons.scaleSharp"></ion-icon>
                                    <span>Unit</span>
                                </div>
                            </ion-button>
                        </router-link>
                    </ion-col>
                    <ion-col size="3" size-md="3" size-lg="3">
                        <router-link :to="{ name: 'discount_lists' }">
                            <ion-button size="medium" expand="block" style="height: 100%" color="danger">
                                <div class="icon-label-wrapper">
                                    <ion-icon :ios="icons.discOutline" :md="icons.discSharp"></ion-icon>
                                    <span>Discount</span>
                                </div>
                            </ion-button>
                        </router-link>
                    </ion-col>
                    <ion-col size="3" size-md="3" size-lg="3">
                        <router-link :to="{ name: 'tax_lists' }">
                            <ion-button size="medium" expand="block" style="height: 100%" color="danger">
                                <div class="icon-label-wrapper">
                                    <ion-icon :ios="icons.pieChartOutline" :md="icons.pieChartSharp"></ion-icon>
                                    <span>Tax</span>
                                </div>
                            </ion-button>
                        </router-link>
                    </ion-col>
                    <ion-col size="3" size-md="3" size-lg="3">
                        <router-link :to="{ name: 'paytype_lists' }">
                            <ion-button size="medium" expand="block" style="height: 100%" color="danger">
                                <div class="icon-label-wrapper">
                                    <ion-icon :ios="icons.walletOutline" :md="icons.walletSharp"></ion-icon>
                                    <span>Paytype</span>
                                </div>
                            </ion-button>
                        </router-link>
                    </ion-col>
                </ion-row>
                
                <ion-row>
                    <ion-col size="6" size-md="6" size-lg="6">
                        <router-link :to="{ name: 'company_details' }">
                            <ion-button size="medium" expand="block" style="height: 100%" color="danger">
                                <div class="icon-label-wrapper">
                                    <ion-icon :ios="icons.storefrontOutline" :md="icons.storefrontSharp"></ion-icon>
                                    <span>Company</span>
                                </div>
                            </ion-button>
                        </router-link>
                    </ion-col>
                    <ion-col size="6" size-md="6" size-lg="6">
                        <router-link :to="{ name: 'user_lists' }">
                            <ion-button size="medium" expand="block" style="height: 100%" color="danger">
                                <div class="icon-label-wrapper">
                                    <ion-icon :ios="icons.peopleCircleOutline" :md="icons.peopleCircleSharp"></ion-icon>
                                    <span>Users</span>
                                </div>
                            </ion-button>
                        </router-link>
                    </ion-col>
                </ion-row>
            </ion-grid>
            
            <br>           
            <ion-grid style="width: 100%">
                <ion-row>
                    <ion-col size="6" size-md="6" size-lg="6">
                        <router-link :to="{ name: 'sales_report' }">
                        <ion-button size="medium" expand="block" style="height: 100%" >
                            <div class="icon-label-wrapper">
                                <ion-icon slot="start" :ios="icons.receiptOutline" :md="icons.receiptSharp"></ion-icon>
                                <span>SALES REPORT</span>
                            </div>
                        </ion-button>
                        </router-link>
                    </ion-col>
                    <ion-col size="6" size-md="6" size-lg="6">
                        <router-link :to="{ name: 'item_lists' }">
                        <ion-button size="medium" expand="block" style="height: 100%" >
                            <div class="icon-label-wrapper">
                                <ion-icon slot="start" :ios="icons.receiptOutline" :md="icons.receiptSharp"></ion-icon>
                                <span>Inventory</span>
                            </div>
                        </ion-button>
                        </router-link>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col >
                        <router-link :to="{ name: 'pos_report' }">
                        <ion-button size="medium" expand="block" style="height: 100%" >
                            <div class="icon-label-wrapper">
                                <ion-icon slot="start" :ios="icons.receiptOutline" :md="icons.receiptSharp"></ion-icon>
                                <span>POS Reprot</span>
                            </div>
                        </ion-button>
                        </router-link>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>


<script lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent } from 'vue';
// import HeaderComponent from '@/components/Layout/HeaderComponent.vue';

const header = 'DASHBOARD';
export default defineComponent({
    setup(){
        return{
            icons
        }
    }
})
</script>




<!-- <style lang="css">
.icon-label-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 60px;
}

.icon-label-wrapper ion-icon {
  font-size: 24px; /* adjust icon size as needed */
  margin-bottom: 8px; /* adjust margin as needed */
}

.icon-label-wrapper span {
  font-size: 14px; /* adjust label size as needed */
}
</style> -->