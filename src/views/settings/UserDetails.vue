<template>
    <ion-page>
        
        <ion-item>
            <ion-button size="medium" expand="block" style="height: 90%"
                @click="handleReturn">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.arrowBackSharp"></ion-icon>
                    <ion-label>Back</ion-label>
                </div>
            </ion-button>
            <ion-button size="medium" expand="block" style="height: 90%"
                @click="">
                <div class="icon-label-wrapper">
                    <ion-icon :icon="icons.saveSharp"></ion-icon>
                    <ion-label>Save</ion-label>
                </div>
            </ion-button>
        </ion-item>

        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true" style="margin: 10px">
                <div style="padding: 10px;">
                    <ion-item>
                        <!-- <ion-label position="stacked">Firstname</ion-label> -->
                        <ion-input label="Firstname" label-placement="floating" fill="solid" v-model="user.first_name" placeholder="Enter Tax Code"></ion-input>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">Lastname</ion-label> -->
                        <ion-input label="Lastname" label-placement="floating" fill="solid" v-model="user.last_name" placeholder="Tax Name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">Username</ion-label> -->
                        <ion-input label="Username" label-placement="floating" fill="solid" v-model="user.username" placeholder="Tax Name"></ion-input>
                    </ion-item>
                    <ion-item>
                        <!-- <ion-label position="stacked">Email</ion-label> -->
                        <ion-input label="Email" label-placement="floating" fill="solid" v-model="user.email" placeholder="Tax Name"></ion-input>
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import USER from '../../models/user.model';
import { icons } from '../../plugins/icons';
import { getUserById, getUsers } from '../../services/settings/user.service';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
    setup(){
        const router = useRouter();
        const user = ref<USER>({});
        

        async function handleReturn() {
            router.push(`/Settings/Users`);
        }
        async function fetchList() {
            const result = await getUserById();
            if(result.success && result.data){
                user.value = { ... result.data }
            }
        }
        onMounted(async () =>{
            await fetchList();
        })
        onIonViewDidEnter(async () =>{
            await fetchList();

        })
        return{
            icons,
            user,

            handleReturn
        }
    }
})
</script>