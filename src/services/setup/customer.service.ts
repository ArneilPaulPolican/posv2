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
      if (!db) {
        throw new Error('Database connection not open');
      }
      const customerServiceQuery = `SELECT * FROM ${CUSTOMERS_TABLE}`
      const res = await db.query(customerServiceQuery);
      console.log(res)
      if(res.values){
        data.value = res.values as CUSTOMER[];
      }
  
      if (res && Array.isArray(res.values)) {
        data.value = res.values as CUSTOMER[];
      }
      return { success: true, data: data }
    } catch (error) {
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
     
      return { success: true, data: customer }
  } catch (error) {
    throw error;
  }
};

export const getLastCustomerCode = async (): Promise<string> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `SELECT customer_code FROM ${CUSTOMERS_TABLE} ORDER BY id DESC LIMIT 1`;
    const result = await db?.query(query);
    const lastCustomerCode =result?.values?.[0].customer_code;
    return lastCustomerCode || '0000000001';
  } catch (error) {
    return '0000000001';
  }
}

export const addCustomers = async (data: CUSTOMER, processedImageSavePath: string) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    let customer_code = await getLastCustomerCode();
    const currentCustomerCode = parseInt(customer_code, 10);
    const nextCustomerCode = currentCustomerCode + 1;
    const formattedNextSalesNumber = nextCustomerCode.toString().padStart(10, '0');
    customer_code = formattedNextSalesNumber;



    const customerServiceQuery = 
      `INSERT INTO ${CUSTOMERS_TABLE} (
        customer_code, customer, contact_number,
        contact_person, credit_limit, category,
        address, tin,
        reward_number, image_path
      ) VALUES (
        ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?
      )
      `;
      const values = [
        customer_code, data.customer, data.contact_number,
        data.contact_person, data.credit_limit, data.category,
        data.address, data.tin,
        data.reward_number, processedImageSavePath,
      ];
    const res = await db.query(customerServiceQuery, values);
    const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
    const lastIdRes = await db.query(getLastIdQuery);
    let Id =  0;

    if (lastIdRes.values && lastIdRes.values.length > 0) {
      Id =  lastIdRes.values[0].lastId;
    } else {
      Id = 0;
    }

    return { success: true, data: Id }
  } catch (error) {
    throw error;
  }
}

export const updateCustomers = async (data: CUSTOMER) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    let customer_code = await getLastCustomerCode();
    const currentCustomerCode = parseInt(customer_code, 10);
    const nextCustomerCode = currentCustomerCode + 1;
    const formattedNextSalesNumber = nextCustomerCode.toString().padStart(10, '0');
    customer_code = formattedNextSalesNumber;

    const transactionStatements = [
      {
        statement :
        `UPDATE ${CUSTOMERS_TABLE} SET
          customer =?, 
          contact_number =?,
          contact_person =?, 
          credit_limit =?, 
          category =?,
          address =?, 
          tin =?, 
          reward_number =?,
          image_path =?
          WHERE id = ?
          `,
          
        values: [
          data.customer, 
          data.contact_number,
          data.contact_person, 
          data.credit_limit, 
          data.category,
          data.address, 
          data.tin,
          data.reward_number, 
          data.image_path,
          data.id
        ],
      }
    ];
    await db.executeTransaction(transactionStatements);

    return { success: true }
  } catch (error) {
    throw error;
  }
}

export const lockCustomers = async (data: CUSTOMER) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    let customer_code = await getLastCustomerCode();
    const currentCustomerCode = parseInt(customer_code, 10);
    const nextCustomerCode = currentCustomerCode + 1;
    const formattedNextSalesNumber = nextCustomerCode.toString().padStart(10, '0');
    customer_code = formattedNextSalesNumber;

    const transactionStatements = [
      {
        statement :
        `UPDATE ${CUSTOMERS_TABLE} SET
          customer =?, 
          contact_number =?,
          contact_person =?, 
          credit_limit =?, 
          category =?,
          address =?, 
          tin =?, 
          reward_number =?,
          image_path =?,
          is_locked
          WHERE id = ?
          `,
          
        values: [
          data.customer, 
          data.contact_number,
          data.contact_person, 
          data.credit_limit, 
          data.category,
          data.address, 
          data.tin,
          data.reward_number, 
          data.image_path,
          true,
          data.id
        ],
      }
    ];
    await db.executeTransaction(transactionStatements);

    return { success: true }
  } catch (error) {
    throw error;
  }
}

export const unlockCustomers = async (data: CUSTOMER) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    let customer_code = await getLastCustomerCode();
    const currentCustomerCode = parseInt(customer_code, 10);
    const nextCustomerCode = currentCustomerCode + 1;
    const formattedNextSalesNumber = nextCustomerCode.toString().padStart(10, '0');
    customer_code = formattedNextSalesNumber;

    const transactionStatements = [
      {
        statement :
        `UPDATE ${CUSTOMERS_TABLE} SET
          is_locked
          WHERE id = ?
          `,
          
        values: [
          false,
          data.id
        ],
      }
    ];
    await db.executeTransaction(transactionStatements);

    return { success: true }
  } catch (error) {
    throw error;
  }
}

export const deleteCustomer = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE ${CUSTOMERS_TABLE}
        WHERE id=?`,
        values: [ 
          id
        ]
      }
    ]
  
    const res = await db.executeTransaction(transactionStatements);
    // return true,Id;
    return { success: true};
  } catch (error) {
    throw error;
  }
};