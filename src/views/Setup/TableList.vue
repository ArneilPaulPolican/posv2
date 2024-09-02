<template>

    <ion-page>
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-nav-link router-direction="forward">
                <ion-fab-button size="small" @click="openItemDetailForm">
                    <ion-icon :icon="icons.addSharp"></ion-icon>
                </ion-fab-button>
            </ion-nav-link>
        </ion-fab>
        
        <ion-item>
            <!-- Search Input -->
             <ion-label position="stacked">Search Table</ion-label>
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        <ion-content :fullscreen="true">
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="table in tables" :key="table.id" @click="openActionSheet(table)">
                    <ion-label>
                        <h2>{{ table.table_name }}</h2>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { TABLE } from '@/models/table.model';
import { icons } from '@/plugins/icons';
import router from '@/router';
import { getTables } from '@/services/setup/table.service';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import { defineComponent, markRaw, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
    components:{

    },
    setup() {
        const tables = ref<TABLE[]>([])
        const router = useRouter();

        //#region   Actionsheet
        const actionSheetButtons = (table:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(table);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(table);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (table:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Unit ${table.table_name}`,
                buttons: actionSheetButtons(table)
            });
            await actionSheet.present();
        };
        //#endregion

        const handleDelete = (table: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (table: any) => {
            router.push(`/Setup/Table/Details/${table.id}`);
        };
        
        const openItemDetailForm = async() => {
            router.push(`/Setup/Table/Details/0`);
        }
        
        async function fetchList() {
            const response = await getTables()
            tables.value = response
        }
        onMounted(async () => {
          await fetchList()
        })
        onIonViewDidEnter(async () => {
            await fetchList()
        })
        return{
            icons,
            tables,

            openItemDetailForm,
            openActionSheet
        }
    },
});
</script>