<template>
  <ion-alert
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
    isOpen: Boolean
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
          emit('cancel');
        }
      },
      {
        text: 'Confirm',
        role: 'confirm',
        handler: () => {
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