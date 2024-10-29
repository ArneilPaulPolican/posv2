<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="top" scrollable>
          <ion-tab-button tab="z-reading" href="/Report/POSReport/ZReading">
            <ion-icon :icon="icons.receiptSharp" />
            <ion-label>Z-Reading</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="x-reading" href="/Report/POSReport/XReading">
            <ion-icon :icon="icons.receiptSharp" />
            <ion-label>X-Reading</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="e-sales" href="#">
            <ion-icon :icon="icons.cashOutline" />
            <ion-label>E-sales</ion-label>
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