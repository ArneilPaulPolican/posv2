<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="top" scrollable>
          <ion-tab-button tab="summary" href="/report/SalesReport/SalesSummaryReport">
            <ion-icon :icon="icons.receiptSharp" />
            <ion-label>Sales Summary</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="detail" href="/report/SalesReport/SalesDetailedReport">
            <ion-icon :icon="icons.receiptSharp" />
            <ion-label>Sales Detail</ion-label>
          </ion-tab-button>
  
          <!-- <ion-tab-button tab="collected" href="/report/SalesReport/CollectedReport">
            <ion-icon :icon="icons.cashOutline" />
            <ion-label>Collected</ion-label>
          </ion-tab-button> -->
  
          <ion-tab-button tab="cancelled" href="/report/SalesReport/CancelledReport">
            <ion-icon :icon="icons.receiptSharp" />
            <ion-label>Cancelled</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="remittance" href="/report/SalesReport/CancelledReport">
            <ion-icon :icon="icons.receiptSharp" />
            <ion-label>Remittance</ion-label>
          </ion-tab-button>
          
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent } from 'vue';

export default defineComponent({
    data(){
        return {
            icons
        };
    }
});
</script>