<template>
    <ion-alert :is-open="isOpen" :header="header" :message="message" :buttons="buttons" @didDismiss="closeAlert"></ion-alert>
</template>
  
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'globalAlert',
    props: {
      header: {
        type: String,
        required: false,
        default: 'Alert',
      },
      message: {
        type: String,
        required: false,
        default: '',
      },
      buttons: {
        type: Array,
        required: true,
      },
    },
    setup(_, { expose }) {
      const isOpen = ref(false);
  
      const openAlert = () => {
        isOpen.value = true;
      };
  
      const closeAlert = () => {
        isOpen.value = false;
      };
  
      expose({
        openAlert,
      });
  
      return { isOpen, openAlert, closeAlert };
    },
  });
</script>
  