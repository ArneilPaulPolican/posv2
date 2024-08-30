import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import DashboardView from '@/views/DashboardView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/tabs/',
    name: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { title: 'Folder',
      breadcrumb: 'Dashboard',
     }
  },
  
  {
    path: '/setup/customers',
    name: 'customer_lists',
    component: () => import ('../views/Setup/CustomerList.vue'),
    meta: { 
      title: 'Folder' ,
      breadcrumb: 'Customer',
    }
  },
  {
    path: '/setup/customer/details/:id',
    component: () => import ('../views/Setup/CustomerDetail.vue'),
    meta: { 
      title: 'Folder' ,
      breadcrumb: 'Customer',
    }
  },
  // {
  //   path: '/setup/items',
  //   name: 'item_lists',
  //   component: () => import ('../views/Setup/ItemList.vue'),
  //   meta: { 
  //     title: 'Folder' ,
  //     breadcrumb: 'Items',
  //   }
  // },
  // {
  //   path: '/setup/item/details/:id',
  //   name: 'ItemDetails',
  //   component: () => import ('../views/Setup/ItemDetail.vue'),
  //   props: true
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
