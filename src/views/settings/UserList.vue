<template>
 <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button  @click="openUserDetailForm">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-item>
            <!-- Search Input -->
             <ion-label position="stacked">Search User</ion-label>
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        
        <ion-content :fullscreen="true">
            
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="user in users" :key="user.id" @click="openActionSheet(user)">
                    <ion-label>
                        <h2>{{ user.first_name }} {{ user.last_name }}</h2>
                        <p>{{ user.email }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import USER from '@/models/user.model';
import { icons } from '@/plugins/icons';
import { getUsers } from '@/services/settings/user.service';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
    setup(){
        const router = useRouter();
        const users = ref<USER[]>([]);
        
        //#region   Actionsheet
        const actionSheetButtons = (user:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(user);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(user);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (user:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Unit ${user.unit_code}  ${user.unit_description}`,
                buttons: actionSheetButtons(user)
            });
            await actionSheet.present();
        };
        //#endregion
        
        const handleDelete = (user: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (user: any) => {
            router.push(`/Settings/User/Details/${user.id}`);
        }
        const openUserDetailForm = async() => {
            router.push(`/Settings/User/Details/0`);
        }

        async function fetchList() {
            const response = await getUsers()
            users.value = response
        }
        onMounted(async () =>{
            await fetchList();
        })
        onIonViewDidEnter(async () =>{
            await fetchList();

        })
        return{
            icons,
            users,

            openUserDetailForm,
            openActionSheet
        }
    }
})
</script>