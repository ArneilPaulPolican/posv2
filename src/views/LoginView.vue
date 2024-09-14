<template>
    <ion-page>
        <ion-content >
            <div style="height: 100px; width: 100%; display: flex; align-items: center; justify-content: center;">
                <img src="../../public/favicon.png" />
            </div>
            <div style="padding: 5px;">
                <ion-item >
                    <ion-label position="stacked">Username: &nbsp;</ion-label>
                    <ion-input v-model="username" placeholder="admin" ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="stacked">Password: &nbsp;</ion-label>
                    <ion-input v-model="password" type="password" placeholder="********"></ion-input>
                </ion-item>
                <ion-item>
                    <div style="width: 100%;">
                        <ion-button shape="round" size="medium" expand="block" @click="submitLogin()">
                            <ion-icon>Login</ion-icon>
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
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { presentToast } from '@/composables/toast.service';
import USER from '@/models/user.model';
import { authenticateUser } from '@/services/settings/user.service';
import { defineComponent, ref } from 'vue';
import { Storage } from '@capacitor/storage';
import { useRouter } from 'vue-router';


export default defineComponent({
    setup(){
        const current_user = ref<USER>();
        const username = ref('');
        const password = ref('');
        const router = useRouter();

        async function submitLogin() {
            try {
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
            } catch (error) {
                await presentToast(`Login failed: ${error}`);
            }
        }

        return{
            icons,
            username,
            password,

            submitLogin
        }
    }
})
</script>