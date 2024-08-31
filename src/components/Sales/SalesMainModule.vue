<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="top">
          <ion-tab-button tab="open" href="/Activity/Sales/Open">
            <ion-icon :icon="icons.openOutline" />
            <ion-label>Open</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="billedout" href="/Activity/Sales/BilledOut">
            <ion-icon :icon="icons.receiptOutline" />
            <ion-label>Billed Out</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="collected" href="/Activity/Sales/Collected">
            <ion-icon :icon="icons.cashOutline" />
            <ion-label>Collected</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="cancelled" href="/Activity/Sales/Cancelled">
            <ion-icon :icon="icons.closeCircleOutline" />
            <ion-label>Cancelled</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
        icons
    };
  },
});
</script>