import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import DashboardView from '@/views/DashboardView.vue';
import LoginView from '@/views/LoginView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { hideHeaderAndSidebar: true } // Add this meta property
  },
  {
    path: '/',
    redirect: '/login'
  },
  // {
  //   path: '/tabs/',
  //   name: 'tabs',
  //   component: TabsPage,
  //   children: [
  //     {
  //       path: '',
  //       redirect: '/tabs/tab1'
  //     },
  //     {
  //       path: 'tab1',
  //       component: () => import('@/views/Tab1Page.vue')
  //     },
  //     {
  //       path: 'tab2',
  //       component: () => import('@/views/Tab2Page.vue')
  //     },
  //     {
  //       path: 'tab3',
  //       component: () => import('@/views/Tab3Page.vue')
  //     }
  //   ]
  // },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard', breadcrumb: 'Dashboard' }
  },
  
  // SETUP
  {
    path: '/setup/customers',
    name: 'customer_lists',
    component: () => import ('../views/Setup/CustomerList.vue'),
    meta: {  title: 'Customer List' , breadcrumb: 'Customer' }
  },
  {
    path: '/setup/customer/details/:id',
    component: () => import ('../views/Setup/CustomerDetail.vue'),
    meta: { 
      title: 'Customer Details' ,
      breadcrumb: 'Customer',
    }
  },
  {
    path: '/setup/items',
    name: 'item_lists',
    component: () => import ('../views/Setup/ItemList.vue'),
    meta: { 
      title: 'Item List' ,
      breadcrumb: 'Items',
    }
  },
  {
    path: '/setup/item/details/:id',
    name: 'ItemDetails',
    component: () => import ('../views/Setup/ItemDetail.vue'),
    meta: { 
      title: 'Item Details' ,
      breadcrumb: 'Items',
    },
    props: true
  },
  {
    path: '/setup/tables',
    name: 'table_lists',
    component: () => import ('../views/Setup/TableList.vue'),
    meta: { 
      title: 'Table List' ,
      breadcrumb: 'Table',
    }
  },
  {
    path: '/setup/table/details/:id',
    name: 'table_details',
    component: () => import ('../views/Setup/TableDetail.vue'),
    meta: { 
      title: 'Table Details' ,
      breadcrumb: 'Table',
    },
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
    meta: { title: 'Sales Details' },
  },
  {
    path: '/activity/cash-in-cash-outs',
    name: 'cashin_cashout',
    component: () => import ('../views/Activity/CashInCashOutlist.vue'),
    meta: { 
      title: 'Cash In/Out List' ,
    }
  },
  {
    path: '/activity/cash-in-cash-out/details/:id',
    name: 'cashin_cashout_details',
    component: () => import ('../views/Activity/CashInCashOutDetails.vue'),
    meta: { 
      title: 'Cash In/Out Details' ,
    }
  },
  {
    path: '/activity/stock-in',
    name: 'stockin_lists',
    component: () => import ('../views/Activity/StockInList.vue'),
    meta: { 
      title: 'Stock In List' ,
    }
  },
  {
    path: '/activity/stock-in/details/:id',
    name: 'stockin_details',
    component: () => import ('../views/Activity/StockInDetails.vue'),
    meta: { 
      title: 'Stock In Details' ,
    }
  },
  {
    path: '/activity/stock-out',
    name: 'stockout_lists',
    component: () => import ('../views/Activity/StockOutList.vue'),
    meta: { 
      title: 'Stock Out List' ,
    }
  },
  {
    path: '/activity/stock-out/details/:id',
    name: 'stockout_details',
    component: () => import ('../views/Activity/StockOutDetails.vue'),
    meta: { 
      title: 'Stock Out Details' ,
    }
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
    meta: { title: 'Unit Details' }
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
    meta: { title: 'Discount Details' }
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
    meta: { title: 'Paytype Details' }
  },
  {
    path: '/system/taxes',
    name: 'tax_lists',
    component: () => import ('../views/System/TaxList.vue'),
    meta: { title: 'Tax List' }
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
    component: () => import ('../views/Settings/CompanyDetails.vue'),
    meta: { title: 'Company Details' }
  },
  {
    path: '/settings/users',
    name: 'user_lists',
    component: () => import ('../views/Settings/UserList.vue'),
    meta: { title: 'User List' }
  },
  {
    path: '/settings/user/details/:id',
    name: 'user_details',
    component: () => import ('../views/Settings/UserDetails.vue'),
    meta: { title: 'User Details' }
  },

  // REPORT
  {
    path: '/report/SalesReport',
    name: 'sales_report',
    component: () => import ('../views/Report/SalesReport.vue'),
    meta: { title: 'Sales Report' },
    children: [
      {
        path: '',
        redirect: '/Report/SalesReport/SalesSummaryReport',
      },
      {
        path: 'SalesSummaryReport',
        component: () => import('../components/Reports/SalesReport/SummaryReport.vue'),
      },
      {
        path: 'SalesDetailedReport',
        component: () => import('../components/Reports/SalesReport/DetailedReport.vue'),
      },
      // {
      //   path: 'CollectedReport',
      //   component: () => import('../components/Reports/SalesReport/CollectedReport.vue'),
      // },
      {
        path: 'CancelledReport',
        component: () => import('../components/Reports/SalesReport/CancelledReport.vue'),
      },
      {
        path: 'RemittanceReport',
        component: () => import('../components/Reports/SalesReport/RemittanceReport.vue'),
      },
    ],
  },
  {
    path: '/report/POSReport',
    name: 'pos_report',
    component: () => import ('../views/Report/POSReport.vue'),
    meta: { title: 'POS Report' },
    children: [
      {
        path: '',
        redirect: '/Report/POSReport/ZReading',
      },
      {
        path: 'ZReading',
        component: () => import('../components/Reports/POSReport/ZReading.vue'),
      },
      {
        path: 'XReading',
        component: () => import('../components/Reports/POSReport/xReading.vue'),
      },
    ],
  },
  {
    path: '/report/sales-detail-report',
    name: 'sales_detail_report',
    component: () => import ('../views/Report/SalesDetailReport.vue'),
    meta: { title: 'Sales Details Report' }
  },
  {
    path: '/report/z-reading-report',
    name: 'z_reading',
    component: () => import ('../views/Report/ZReadingReport.vue'),
    meta: { title: 'Z Reading Report' }
  },
  {
    path: '/report/inventory',
    name: 'inventory',
    component: () => import ('../views/Report/InventoryReport.vue'),
    meta: { title: 'Inventory Report' }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
