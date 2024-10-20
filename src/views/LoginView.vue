<template>
    <ion-page>
        <ion-content >
            <div style="height: 100px; width: 100%; display: flex; align-items: center; justify-content: center;">
                <img src="../../public/favicon.png" />
            </div>
            <form @submit.prevent="submitLogin">
                <div style="padding: 5px;">
                    <ion-item >
                        <ion-input label="Username" label-placement="stacked" fill="solid" v-model="username"  ></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-input label="Password" label-placement="stacked" fill="solid" v-model="password" type="password" >
                            <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                        </ion-input>
                    </ion-item>
                    <ion-item>
                        <div style="width: 100%;">
                            <ion-button shape="round" size="medium" expand="block" type="submit">
                                <ion-icon :icon="icons.logInSharp"></ion-icon>&nbsp;
                                <ion-label>Login</ion-label>
                            </ion-button>
                            <!-- <ion-button shape="round" size="medium" expand="block">
                                <ion-label >Register</ion-label>
                            </ion-button> -->
                        </div>
                    </ion-item>
                    <ion-item>
                    </ion-item>
                </div>
            </form>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.composables';
import USER from '@/models/user.model';
import { authenticateUser } from '@/services/settings/user.service';
import { defineComponent, onMounted, ref } from 'vue';
import { Storage } from '@capacitor/storage';
import { useRouter } from 'vue-router';
import { onIonViewDidEnter } from '@ionic/vue';


export default defineComponent({
    setup(){
        const current_user = ref<USER>();
        const username = ref('');
        const password = ref('');
        const router = useRouter();

        async function submitLogin() {
            try {
                if(username.value != '' || password.value != ''){
                const result = await authenticateUser(username.value, password.value)
                    if(result.success){
                        await presentToast('Login successful')
                        await Storage.set({
                            key: 'current_user',
                            value: JSON.stringify(result.data) as string
                        });
                        router.push('/dashboard')
                    }else{
                        await presentToast('Login failed')
                    }
                }
            } catch (error) {
                await presentToast(`Login failed: ${error}`);
            }
        }
        async function fetchUser() {
            const { value } = await Storage.get({ key: 'current_user' });
            const current_user = JSON.parse(value as string);
            console.log(current_user);
            
        }
        onIonViewDidEnter(async () => {
            await fetchUser()
        });
        onMounted(async () => {
            await fetchUser()
        });
        return{
            icons,
            username,
            password,

            submitLogin
        }
    }
})
</script>