<template>
    <ion-page>
        <DetailedReport />
    </ion-page>
</template>

<script lang="ts">
import DetailedReport from '@/components/Reports/SalesReport/DetailedReport.vue';
import { icons } from '@/plugins/icons';
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
    components:{
        DetailedReport
    },
    setup(){
        return{
            icons,
        }
    }
});
</script>