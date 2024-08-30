// customer.ts
import { CapacitorSQLite, SQLiteConnection, } from '@capacitor-community/sqlite';
import { CUSTOMERS_TABLE } from '@/schema/tables';
import { Capacitor } from '@capacitor/core';
import { DBConnectionService } from '../database.connection';
import { ref } from 'vue';
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import { CUSTOMER } from '@/models/customer.model';

const app = getCurrentInstance()
const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;

// const db_connection = new DBConnectionService()
const data = ref<CUSTOMER[]>([])
type QueryResult = {
  rows: {
    item: (index: number) => { max_code?: string } | undefined;
    length: number;
  };
};

export const getCustomers = async () => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        const customerServiceQuery = `SELECT * FROM ${CUSTOMERS_TABLE}`
        const res = await db.query(customerServiceQuery);
        console.log('query results', res);
        if(res.values){
          data.value = res.values as CUSTOMER[];
        }
    
        if (res && Array.isArray(res.values)) {
          data.value = res.values as CUSTOMER[];
          console.log(data.value )
        }
        return data.value;
    } catch (error) {
      console.log('get customers error');
      console.log(error);
      throw error;
    }
};

export const getCustomerById = async (id:number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
      const query = `SELECT * FROM ${CUSTOMERS_TABLE} WHERE id=?`;
      const params = [id];
      
      const result = await db.query(query, params);
      console.log('Res Values', JSON.stringify(result.values));
      const customer = result.values?.map(customer => ({
        id: customer.id,
        customer_code: customer.customer_code,
        customer: customer.customer,
        contact_number: customer.contact_number,
        contact_person: customer.contact_person,
        credit_limit: customer.credit_limit,
        category: customer.category,
        email: customer.email,
        address: customer.address,
        tin: customer.tin,
        reward_number: customer.reward_number,
        image_path: customer.image_path,
        is_locked: customer.is_locked,
        is_default_value: customer.is_default_value
      }))[0];
      console.log('query results', customer);
     
      return customer;
  } catch (error) {
    console.log('get customers error');
    console.log(error);
    throw error;
  }
};

export const getLastCustomerCode = async (): Promise<string> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `SELECT customer_code FROM ${CUSTOMERS_TABLE} ORDER BY id DESC LIMIT 1`;
    const result = await db?.query(query);
    const lastSalesNumber =result?.values?.[0].sales_number;
    console.log('last customer code',lastSalesNumber)
    return lastSalesNumber || '0000000001';
  } catch (error) {
    console.log(error)
    return '0000000001';
  }
}

export const addCustomers = async (data: CUSTOMER, processedImageSavePath: string) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const customerServiceQuery = 
      `INSERT INTO ${CUSTOMERS_TABLE} (
        customer_code, customer, contact_number,
        contact_person, credit_limit, category,
        email, address, tin,
        reward_number, image_path
      ) VALUES (
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?
      )
      `;
      const values = [
        data.customer_code, data.customer, data.contact_number,
        data.contact_person, data.credit_limit, data.category,
        data.email, data.address, data.tin,
        data.reward_number, processedImageSavePath,
      ];
    const res = await db.query(customerServiceQuery, values);
    console.log('add customer query results', res);
    return true;
  } catch (error) {
    console.log('error adding customer', error);
    return null;
  }
}