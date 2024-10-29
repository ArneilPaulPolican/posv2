<template>
    <ion-page>
        <!-- <HeaderComponent :title="header"/> -->
        <ion-content >
            <SalesReportTabModule />
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SalesReportTabModule from '@/components/Reports/SalesReport/SalesReportTabModule.vue';
import { icons } from '@/plugins/icons';

export default defineComponent({
    components:{
        SalesReportTabModule
    },
    setup(){
        return{
            icons
        }
    }
})
</script>