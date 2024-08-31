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
  
  // SETUP
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
  {
    path: '/setup/items',
    name: 'item_lists',
    component: () => import ('../views/Setup/ItemList.vue'),
    meta: { 
      title: 'Folder' ,
      breadcrumb: 'Items',
    }
  },
  {
    path: '/setup/item/details/:id',
    name: 'ItemDetails',
    component: () => import ('../views/Setup/ItemDetail.vue'),
    props: true
  },
  {
    path: '/setup/tables',
    name: 'table_lists',
    component: () => import ('../views/Setup/TableList.vue'),
  },
  {
    path: '/setup/table/details/:id',
    name: 'table_details',
    component: () => import ('../views/Setup/TableDetail.vue'),
    props: true
  },

  
  // Activities
  {
    path: '/activity/sales',
    name: 'sales',
    component: () => import ('../views/Activity/SalesList.vue'),
    meta: { title: 'Sales' },
    children: [
      {
        path: '',
        redirect: '/Activity/Sales/Open',
      },
      {
        path: 'Open',
        component: () => import('../components/Sales/OpenList.vue'),
      },
      {
        path: 'BilledOut',
        component: () => import('../components/Sales/BilledOutList.vue'),
      },
      {
        path: 'Collected',
        component: () => import('../components/Sales/CollectedList.vue'),
      },
      {
        path: 'Cancelled',
        component: () => import('../components/Sales/CancelledList.vue'),
      },
    ],
  },
  {
    path: '/activity/sales/details/:id',
    component: () => import ('../views/Activity/SalesDetails.vue'),
    meta: { title: 'Sales Detail' },
  },
  
  // System Tables
  {
    path: '/system/units',
    name: 'unit_lists',
    component: () => import ('../views/System/UnitList.vue'),
    meta: { title: 'Unit List' }
  },
  {
    path: '/system/unit/details/:id',
    name: 'unit_details',
    component: () => import ('../views/System/UnitDetail.vue'),
    meta: { title: 'Unit Detail' }
  },
  {
    path: '/system/discounts',
    name: 'discount_lists',
    component: () => import ('../views/System/DiscountList.vue'),
    meta: { title: 'Discount List' }
  },
  {
    path: '/system/discount/details/:id',
    name: 'discount_details',
    component: () => import ('../views/System/DiscountDetail.vue'),
    meta: { title: 'Discount Detail' }
  },
  {
    path: '/system/paytypes',
    name: 'paytype_lists',
    component: () => import ('../views/System/PaytypeList.vue'),
    meta: { title: 'Paytype List' }
  },
  {
    path: '/system/paytype/details/:id',
    name: 'paytype_details',
    component: () => import ('../views/System/PaytypeDetail.vue'),
    meta: { title: 'Paytype List' }
  },
  {
    path: '/system/taxes',
    name: 'tax_lists',
    component: () => import ('../views/System/TaxList.vue'),
    meta: { title: 'Tax' }
  },
  {
    path: '/system/tax/details/:id',
    name: 'tax_details',
    component: () => import ('../views/System/TaxDetail.vue'),
    meta: { title: 'Tax Details' }
  },
  // Settings
  {
    path: '/Settings/company',
    name: 'company_details',
    component: () => import ('../views/settings/CompanyDetails.vue'),
    meta: { title: 'Company Details' }
  },
  {
    path: '/settings/users',
    name: 'user_lists',
    component: () => import ('../views/settings/UserList.vue'),
    meta: { title: 'User List' }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
