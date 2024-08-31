<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
            <ion-title>PDF</ion-title>
            </ion-toolbar>
            <ion-button slot="end" @click="$emit('close')" size="medium" expand="block" fill="outline">
                <ion-label>Close</ion-label>
            </ion-button>
        </ion-header>
        <iframe v-bind:src="local_src" type="application/pdf" width="100%" height="500" ref="iframeRef"></iframe>
    </ion-page>
</template>

<script lang="ts">
import { generatePDF } from '@/composables/pdf-generator';
import { Capacitor } from '@capacitor/core';
import { onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, ref, computed, toRefs, onMounted } from 'vue';

export default defineComponent({
    props: {
        pdf_source: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const platform = Capacitor.getPlatform();
        
        // const { pdf_source } = toRefs(props);
        const local_src = ref(''); 
        onMounted(async () =>{
            console.log(platform);
            if(platform == 'web'){
                // local_src.value = await generatePDF()
            }
            console.log('onMounted pdf template source', local_src.value);
        })
        return {
            local_src
        };
    }
});
</script>