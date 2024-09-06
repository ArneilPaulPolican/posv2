// customer.ts
import { CapacitorSQLite, SQLiteConnection, } from '@capacitor-community/sqlite';
import { CUSTOMERS_TABLE, MIGRATIONS_TABLE } from '@/schema/tables';
import { Capacitor } from '@capacitor/core';
import { DBConnectionService } from './database.connection';
import { ref } from 'vue';
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import MIGRATION from '@/models/migration.model';
import { sync } from 'ionicons/icons';
import { alterSalesTable } from '@/components/migration/001_add_amounts_to_sales_table';

const app = getCurrentInstance()
const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
