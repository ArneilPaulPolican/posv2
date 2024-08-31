<template>
    <ion-page>
        <!-- <HeaderComponent :title="header"/> -->
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button size="small" @click="openDetailForm">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-content >
            <SalesMainModule />
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import SalesMainModule from '@/components/Sales/SalesMainModule.vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    components:{
        // HeaderComponent,
        SalesMainModule
    },
    setup(){
        const router = useRouter();

        const openDetailForm = async() => {
            router.push(`/Activity/Sales/Details/0`);
        }
        return{
            header:'Sales',
            icons,

            openDetailForm
        }
    }
})
</script>