<template>
    <ion-page>
        <HeaderComponent :title="header" />
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button size="small" @click="openDetailForm">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-item>
            <!-- Search Input -->
            <ion-searchbar placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        
        <ion-content :fullscreen="true">
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="customer in customers" :key="customer.id" @click="openActionSheet(customer)">
                    <ion-avatar aria-hidden="true" slot="start">
                        <!-- <img alt="" v-if="item.image" :src="item.image" /> -->
                        <ion-icon aria-hidden="true" slot="start" :name="icons.imageOutline"></ion-icon>
                    </ion-avatar>
                    <ion-label>
                        <h2>{{ customer.customer_code }}</h2>
                        <p>{{ customer.customer }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { icons } from '@/plugins/icons';
import { defineComponent, onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { actionSheetController, onIonViewDidEnter } from '@ionic/vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import { CUSTOMER } from '@/models/customer.model';
import { getCustomers } from '@/services/setup/customer.service';

export default defineComponent({
    components: { 
        HeaderComponent
    },
    setup(){
        const router = useRouter();
        const customers = ref<CUSTOMER[]>([])

        
        //#region   Actionsheet
        const actionSheetButtons = (customer:any) => [
            {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                    handleDelete(customer);
                },
                data: {
                    action: 'delete',
                },
            },
            {
                text: 'Edit',
                handler: () => {
                    handleEdit(customer);
                },
                data: {
                    action: 'Edit',
                },
            },
        ];
        const actionSheet = ref(null);
        const _actionSheetController = actionSheetController;// Action Sheet Controller
        // Open Action Sheet Function
        const openActionSheet = async (customer:any) => {
            const actionSheet = await _actionSheetController.create({
                header: `Options for Customer ${customer.customer_code}  ${customer.customer_name}`,
                buttons: actionSheetButtons(customer)
            });
            await actionSheet.present();
        };
        //#endregion
        
        const handleDelete = (customer: any) => {
            throw new Error('Function not implemented.');
        };
        const handleEdit = (customer: any) => {
            router.push(`/Setup/Customer/Details/${customer.id}`);
        };
        
        const openDetailForm = async() => {
            router.push(`/Setup/Customer/Details/0`);
        }
        
        async function fetchList() {
            const response = await getCustomers();
            customers.value = response
        }
        onIonViewDidEnter(async () => {
            await fetchList()
        });
        onMounted(async()=>{
            await fetchList()
        })
        return{
            header:'Customer List',
            icons,
            customers,

            openDetailForm,
            openActionSheet,
            
        }
    }
});
</script>