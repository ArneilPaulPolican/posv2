<template>
    <ion-page>
        <!-- <HeaderComponent :title="header"/> -->
        <ion-content >
            <POSReportTabModule />
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { icons } from '@/plugins/icons';
import POSReportTabModule from '@/components/Reports/POSReport/POSReportTabModule.vue';

export default defineComponent({
    components:{
        POSReportTabModule
    },
    setup(){
        return{
            icons
        }
    }
})
</script>