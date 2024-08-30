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
// import { alterSalesTable } from '@/migration-script/001_add_amounts_to_sales_table';

const app = getCurrentInstance()
const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;

// const db_connection = new DBConnectionService()
const data = ref<MIGRATION[]>([])
type QueryResult = {
  rows: {
    item: (index: number) => { max_code?: string } | undefined;
    length: number;
  };
};

export const getMigrations = async () => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        const customerServiceQuery = `SELECT * FROM ${MIGRATIONS_TABLE}`
        const res = await db.query(customerServiceQuery);
        console.log('query results', res);
        if(res.values){
          data.value = res.values as MIGRATION[];
        }
    
        if (res && Array.isArray(res.values)) {
          data.value = res.values as MIGRATION[];
          console.log(data.value )
        }
        return data.value;
    } catch (error) {
      console.log('get customers error');
      console.log(error);
      throw error;
    }
};

export const runAllMigrations = async (db: SQLiteDBConnection) => {
    // await alterSalesTable(db)
}
  