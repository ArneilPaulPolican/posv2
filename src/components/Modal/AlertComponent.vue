<template>
  <ion-alert
    trigger="present-alert"
    :header="title"
    :message="message"
    :buttons="alertButtons"
  ></ion-alert>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
  props: {
    title: String,
    sub_title: String,
    message: String,
  },
    components: { 
   },
  setup(_, {emit}) {
    // const alertButtons = ['Confirm'];
    const alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel button clicked');
          emit('cancel');
        }
      },
      {
        text: 'Confirm',
        role: 'confirm',
        handler: () => {
          console.log('Confirm button clicked');
          emit('confirm');
        }
      }
    ];
   
    return {
        alertButtons,
    }
  }
});
</script>