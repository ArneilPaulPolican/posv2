<template>
    <ion-page>
        <!-- <HeaderComponent :title="header" /> -->
        <ion-fab slot="fixed" vertical="bottom" horizontal="end">
            <ion-fab-button size="small" @click="addNewCustomer">
                <ion-icon :icon="icons.addSharp"></ion-icon>
            </ion-fab-button>
        </ion-fab>

        <ion-item>
            <!-- Search Input -->
             <ion-label position="stacked">Search Customer</ion-label>
             <ion-searchbar v-model="search_key" @ionChange="fetchList" placeholder="Enter keyword"></ion-searchbar> 
        </ion-item>
        
        <ion-content :fullscreen="true">
            <ion-list :inset="true">
                <!-- List -->
                <ion-item v-for="customer in customers" :key="customer.id" @click="openActionSheet(customer)">
                    <ion-avatar aria-hidden="true" slot="start">
                        <img alt="" v-if="customer.image_path" :src="customer.image_path" />
                    </ion-avatar>
                    <ion-label>
                        <p>{{ customer.customer_code }}</p>
                        <h2>{{ customer.customer }}</h2>
                        <p v-if="customer.is_locked">Locked</p><p v-else>Unlocked</p>
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
import HeaderComponent from '@/components/Layout/HeaderComponent.vue';
import { CUSTOMER } from '@/models/customer.model';
import { addCustomers, deleteCustomer, getCustomers } from '@/services/setup/customer.service';
import { presentToast } from '@/composables/toast.composables';

export default defineComponent({
    components: { 
        HeaderComponent
    },
    setup(){
        const router = useRouter();
        const customers = ref<CUSTOMER[]>([])
        const customer = ref<CUSTOMER>({
            id: 0,
            customer_code:'NA',
            customer: 'NA',
            contact_number: 'NA',
            contact_person: 'NA',
            credit_limit: 0,
            category: 'NA',
            email: 'NA',
            address: 'NA',
            tin: 'NA',
            reward_number: 'NA',
            image_path: '',
            is_locked: false,
            is_default_value: false,
        });
        const page = ref(1);
        const page_size = ref(10);
        const search_key = ref('');

        
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
        
        const handleDelete = async (customer: any) => {
            // throw new Error('Function not implemented.');
            try {
                const result = await deleteCustomer(customer);
                if(result.success){
                    await presentToast('Customer deleted successfully');
                    await fetchList();
                }
            } catch (error) {
                await presentToast(`Error adding new customer ${error}`)
            }
        };
        const handleEdit = (customer: any) => {
            router.push(`/Setup/Customer/Details/${customer.id}`);
        };

        const addNewCustomer = async() => {
            try {
                const result = await addCustomers(customer.value)
                if(result.success){
                    router.push(`/Setup/Customer/Details/${result.data}`);
                }
            } catch (error) {
                await presentToast(`Error adding new customer ${error}`,'middle', 3000)
            }
        }
        
        async function fetchList() {
            try {
                const response = await getCustomers(page.value, page_size.value, search_key.value);
                if(response.success && response.data){
                    customers.value = response.data
                }
            } catch (error) {
                await presentToast(`Operation failed: ${error}`)
            }
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

            addNewCustomer,
            openActionSheet,
            fetchList,
            
            page,
            page_size,
            search_key,
        }
    }
});
</script>