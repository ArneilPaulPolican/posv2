<template>
    <ion-page>
        <ZReading />
    </ion-page>
</template>

<script lang="ts">
import ZReading from '@/components/Reports/POSReport/ZReading.vue';
import { icons } from '@/plugins/icons';
import { defineComponent, onMounted, ref } from 'vue';



export default defineComponent({
    components:{
        ZReading
    },
    setup(){
        return{
            icons,
        }
    }
})
</script>