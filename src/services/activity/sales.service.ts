import { DBConnectionService } from '../database.connection';
import { COLLECTIONS_TABLE, CUSTOMERS_TABLE, DISCOUNTS_TABLE, ITEMS_TABLE, SALES_ITEMS_TABLE, SALES_TABLE, TABLE_GROUP_LINES_TABLE, TABLES_TABLE, UNITS_TABLE, USERS_TABLE } from '@/schema/tables';
import { ref, toRaw } from 'vue';
import { SALES, SALES_DTO } from '@/models/sales.model';
import { CUSTOMER } from '@/models/customer.model';
import USER from '@/models/user.model';
import { SALES_ITEM_DTO } from '@/models/sales-item.model';
import { addBulkSalesItem } from './sales-item.service';

// const db_connection = new DBConnectionService()
const data = ref<SALES[]>([])
interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getSales = async (): Promise<SALES_DTO[]> => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
        const saleServiceQuery = `
        SELECT ${SALES_TABLE}.id,
            ${SALES_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' ||${USERS_TABLE}.last_name AS full_name,
            ${SALES_TABLE}.sales_number,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.terminal_number,
            ${SALES_TABLE}.customer_id,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${SALES_TABLE}.table_id,
            ${TABLES_TABLE}.table_code,
            -- ${TABLES_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.total_amount,
            ${SALES_TABLE}.balance_amount,
            ${SALES_TABLE}.paid_amount,
            ${SALES_TABLE}.discount_amount,
            ${SALES_TABLE}.no_of_pax,
            SUM(${SALES_ITEMS_TABLE}.quantity) AS no_of_items,
            ${ITEMS_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.remarks,
            ${SALES_TABLE}.status,
            ${SALES_TABLE}.is_locked,
            ${SALES_TABLE}.is_billed_out,
            ${SALES_TABLE}.is_cancelled,
            ${COLLECTIONS_TABLE}.id as collection_id
        FROM ${SALES_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${SALES_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${SALES_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        LEFT JOIN ${TABLE_GROUP_LINES_TABLE}
        ON ${SALES_TABLE}.table_id=${TABLE_GROUP_LINES_TABLE}.id
        LEFT JOIN ${TABLES_TABLE}
        ON ${TABLE_GROUP_LINES_TABLE}.table_id=${TABLES_TABLE}.id
        LEFT JOIN ${SALES_ITEMS_TABLE}
        ON (${SALES_TABLE}.id=${SALES_ITEMS_TABLE}.sales_id)
        LEFT JOIN ${ITEMS_TABLE}
        ON ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN ${COLLECTIONS_TABLE}
        ON ${COLLECTIONS_TABLE}.sales_id=${SALES_TABLE}.id
        GROUP BY ${SALES_TABLE}.id
        ORDER BY ${SALES_TABLE}.sales_number DESC
        `;
      
      const result = await db.query(saleServiceQuery);
     
      console.log('sales ', JSON.stringify(result.values));
      return result.values as SALES_DTO[];
    } catch (error) {
      console.log('get sales error');
      console.log(error);
      throw error;
    }
  };

  export const getOpenSales = async (): Promise<SALES_DTO[]> => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        // throw new Error('Database connection not open');
        console.log('Database connection not open OPEN SALES')
      }
  
        const saleServiceQuery = `
        SELECT ${SALES_TABLE}.id,
            ${SALES_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' ||${USERS_TABLE}.last_name AS full_name,
            ${SALES_TABLE}.sales_number,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.terminal_number,
            ${SALES_TABLE}.customer_id,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${SALES_TABLE}.table_id,
            ${TABLES_TABLE}.table_code,
            -- ${TABLES_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.total_amount,
            ${SALES_TABLE}.balance_amount,
            ${SALES_TABLE}.paid_amount,
            ${SALES_TABLE}.discount_amount,
            ${SALES_TABLE}.no_of_pax,
            SUM(${SALES_ITEMS_TABLE}.quantity) AS no_of_items,
            ${ITEMS_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.remarks,
            ${SALES_TABLE}.status,
            ${SALES_TABLE}.is_locked,
            ${SALES_TABLE}.is_billed_out,
            ${SALES_TABLE}.is_cancelled,
            ${COLLECTIONS_TABLE}.id as collection_id
        FROM ${SALES_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${SALES_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${SALES_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        LEFT JOIN ${TABLE_GROUP_LINES_TABLE}
        ON ${SALES_TABLE}.table_id=${TABLE_GROUP_LINES_TABLE}.id
        LEFT JOIN ${TABLES_TABLE}
        ON ${TABLE_GROUP_LINES_TABLE}.table_id=${TABLES_TABLE}.id
        LEFT JOIN ${SALES_ITEMS_TABLE}
        ON (${SALES_TABLE}.id=${SALES_ITEMS_TABLE}.sales_id)
        LEFT JOIN ${ITEMS_TABLE}
        ON ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN ${COLLECTIONS_TABLE}
        ON ${COLLECTIONS_TABLE}.sales_id=${SALES_TABLE}.id
        WHERE ${SALES_TABLE}.is_billed_out = 0 AND ${SALES_TABLE}.is_cancelled = 0
        GROUP BY ${SALES_TABLE}.id
        ORDER BY ${SALES_TABLE}.sales_number DESC
        `;
      
      const result = await db.query(saleServiceQuery);
     
      console.log('sales ', JSON.stringify(result.values));
      return result.values as SALES_DTO[];
    } catch (error) {
      console.log('get sales error');
      console.log(error);
      throw error;
    }
  };

  export const getBilledSales = async (): Promise<SALES_DTO[]> => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
        const saleServiceQuery = `
        SELECT ${SALES_TABLE}.id,
            ${SALES_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' ||${USERS_TABLE}.last_name AS full_name,
            ${SALES_TABLE}.sales_number,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.terminal_number,
            ${SALES_TABLE}.customer_id,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${SALES_TABLE}.table_id,
            ${TABLES_TABLE}.table_code,
            -- ${TABLES_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.total_amount,
            ${SALES_TABLE}.balance_amount,
            ${SALES_TABLE}.paid_amount,
            ${SALES_TABLE}.discount_amount,
            ${SALES_TABLE}.no_of_pax,
            SUM(${SALES_ITEMS_TABLE}.quantity) AS no_of_items,
            ${ITEMS_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.remarks,
            ${SALES_TABLE}.status,
            ${SALES_TABLE}.is_locked,
            ${SALES_TABLE}.is_billed_out,
            ${SALES_TABLE}.is_cancelled,
            ${COLLECTIONS_TABLE}.id as collection_id
        FROM ${SALES_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${SALES_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${SALES_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        LEFT JOIN ${TABLE_GROUP_LINES_TABLE}
        ON ${SALES_TABLE}.table_id=${TABLE_GROUP_LINES_TABLE}.id
        LEFT JOIN ${TABLES_TABLE}
        ON ${TABLE_GROUP_LINES_TABLE}.table_id=${TABLES_TABLE}.id
        LEFT JOIN ${SALES_ITEMS_TABLE}
        ON (${SALES_TABLE}.id=${SALES_ITEMS_TABLE}.sales_id)
        LEFT JOIN ${ITEMS_TABLE}
        ON ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN ${COLLECTIONS_TABLE}
        ON ${COLLECTIONS_TABLE}.sales_id=${SALES_TABLE}.id
        WHERE ${SALES_TABLE}.is_billed_out = 1
        GROUP BY ${SALES_TABLE}.id
        ORDER BY ${SALES_TABLE}.sales_number DESC
        `;
      
      const result = await db.query(saleServiceQuery);
     
      console.log('Bill out ', JSON.stringify(result.values));
      return result.values as SALES_DTO[];
    } catch (error) {
      console.log('get Bill error');
      console.log(error);
      throw error;
    }
  };
  
  export const getCollectedSales = async (): Promise<SALES_DTO[]> => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
        const saleServiceQuery = `
        SELECT ${SALES_TABLE}.id,
            ${SALES_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' ||${USERS_TABLE}.last_name AS full_name,
            ${SALES_TABLE}.sales_number,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.terminal_number,
            ${SALES_TABLE}.customer_id,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${SALES_TABLE}.table_id,
            ${TABLES_TABLE}.table_code,
            -- ${TABLES_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.total_amount,
            ${SALES_TABLE}.balance_amount,
            ${SALES_TABLE}.paid_amount,
            ${SALES_TABLE}.discount_amount,
            ${SALES_TABLE}.no_of_pax,
            SUM(${SALES_ITEMS_TABLE}.quantity) AS no_of_items,
            ${ITEMS_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.remarks,
            ${SALES_TABLE}.status,
            ${SALES_TABLE}.is_locked,
            ${SALES_TABLE}.is_billed_out,
            ${SALES_TABLE}.is_cancelled,
            ${COLLECTIONS_TABLE}.id as collection_id
        FROM ${SALES_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${SALES_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${SALES_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        LEFT JOIN ${TABLE_GROUP_LINES_TABLE}
        ON ${SALES_TABLE}.table_id=${TABLE_GROUP_LINES_TABLE}.id
        LEFT JOIN ${TABLES_TABLE}
        ON ${TABLE_GROUP_LINES_TABLE}.table_id=${TABLES_TABLE}.id
        LEFT JOIN ${SALES_ITEMS_TABLE}
        ON (${SALES_TABLE}.id=${SALES_ITEMS_TABLE}.sales_id)
        LEFT JOIN ${ITEMS_TABLE}
        ON ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN ${COLLECTIONS_TABLE}
        ON ${COLLECTIONS_TABLE}.sales_id=${SALES_TABLE}.id
        WHERE ${SALES_TABLE}.is_locked = 1 AND ${SALES_TABLE}.balance_amount = 0
        GROUP BY ${SALES_TABLE}.id
        ORDER BY ${SALES_TABLE}.sales_number DESC
        `;
      
      const result = await db.query(saleServiceQuery);
     
      console.log('Collected out ', JSON.stringify(result.values));
      return result.values as SALES_DTO[];
    } catch (error) {
      console.log('get Collected error');
      console.log(error);
      throw error;
    }
  };

  export const getCancelledSales = async (): Promise<SALES_DTO[]> => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
        const saleServiceQuery = `
        SELECT ${SALES_TABLE}.id,
            ${SALES_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' ||${USERS_TABLE}.last_name AS full_name,
            ${SALES_TABLE}.sales_number,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.terminal_number,
            ${SALES_TABLE}.customer_id,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${SALES_TABLE}.table_id,
            ${TABLES_TABLE}.table_code,
            -- ${TABLES_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.total_amount,
            ${SALES_TABLE}.balance_amount,
            ${SALES_TABLE}.paid_amount,
            ${SALES_TABLE}.discount_amount,
            ${SALES_TABLE}.no_of_pax,
            SUM(${SALES_ITEMS_TABLE}.quantity) AS no_of_items,
            ${ITEMS_TABLE}.image_path AS table_image_path,
            ${SALES_TABLE}.remarks,
            ${SALES_TABLE}.status,
            ${SALES_TABLE}.is_locked,
            ${SALES_TABLE}.is_billed_out,
            ${SALES_TABLE}.is_cancelled,
            ${COLLECTIONS_TABLE}.id as collection_id
        FROM ${SALES_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${SALES_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${SALES_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        LEFT JOIN ${TABLE_GROUP_LINES_TABLE}
        ON ${SALES_TABLE}.table_id=${TABLE_GROUP_LINES_TABLE}.id
        LEFT JOIN ${TABLES_TABLE}
        ON ${TABLE_GROUP_LINES_TABLE}.table_id=${TABLES_TABLE}.id
        LEFT JOIN ${SALES_ITEMS_TABLE}
        ON (${SALES_TABLE}.id=${SALES_ITEMS_TABLE}.sales_id)
        LEFT JOIN ${ITEMS_TABLE}
        ON ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN ${COLLECTIONS_TABLE}
        ON ${COLLECTIONS_TABLE}.sales_id=${SALES_TABLE}.id
        WHERE ${SALES_TABLE}.is_cancelled = 1
        GROUP BY ${SALES_TABLE}.id
        ORDER BY ${SALES_TABLE}.sales_number DESC
        `;
      
      const result = await db.query(saleServiceQuery);
     
      console.log('Cancelled ', JSON.stringify(result.values));
      return result.values as SALES_DTO[];
    } catch (error) {
      console.log('get Cancelled error');
      console.log(error);
      throw error;
    }
  };
  
export const getSalesById = async (id:number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }
    
      const saleServiceQuery = `
      SELECT ${SALES_TABLE}.id,
          ${SALES_TABLE}.user_id,
          ${USERS_TABLE}.first_name || ' ' ||${USERS_TABLE}.last_name AS full_name,
          ${SALES_TABLE}.sales_number,
          ${SALES_TABLE}.sales_date,
          ${SALES_TABLE}.terminal_number,
          ${SALES_TABLE}.customer_id,
          ${CUSTOMERS_TABLE}.customer_code,
          ${CUSTOMERS_TABLE}.customer,
          ${CUSTOMERS_TABLE}.address AS customer_address,
          ${CUSTOMERS_TABLE}.tin AS customer_tin,
          ${SALES_TABLE}.table_id,
          ${TABLES_TABLE}.table_code,
          -- ${TABLES_TABLE}.image_path AS table_image_path,
          ${SALES_TABLE}.total_amount,
          ${SALES_TABLE}.balance_amount,
          ${SALES_TABLE}.paid_amount,
          ${SALES_TABLE}.discount_id,
          ${DISCOUNTS_TABLE}.discount,
          ${SALES_TABLE}.discount_rate,
          ${SALES_TABLE}.discount_amount,
          ${SALES_TABLE}.no_of_pax,
          ${SALES_TABLE}.remarks,
          ${SALES_TABLE}.status,
          ${SALES_TABLE}.is_locked,
          ${SALES_TABLE}.is_billed_out,
          ${SALES_TABLE}.is_cancelled,
          ${COLLECTIONS_TABLE}.id as collection_id
      FROM ${SALES_TABLE}
      LEFT JOIN ${USERS_TABLE}
      ON ${SALES_TABLE}.user_id=${USERS_TABLE}.id
      LEFT JOIN ${CUSTOMERS_TABLE}
      ON ${SALES_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
      LEFT JOIN ${TABLE_GROUP_LINES_TABLE}
      ON ${SALES_TABLE}.table_id=${TABLE_GROUP_LINES_TABLE}.id
      LEFT JOIN ${TABLES_TABLE}
      ON ${TABLE_GROUP_LINES_TABLE}.table_id=${TABLES_TABLE}.id
      LEFT JOIN ${SALES_ITEMS_TABLE}
      ON (${SALES_TABLE}.id=${SALES_ITEMS_TABLE}.sales_id)
      LEFT JOIN ${ITEMS_TABLE}
      ON ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
      LEFT JOIN ${COLLECTIONS_TABLE}
      ON ${COLLECTIONS_TABLE}.sales_id=${SALES_TABLE}.id
      LEFT JOIN ${DISCOUNTS_TABLE}
      ON ${SALES_TABLE}.discount_id=${DISCOUNTS_TABLE}.id
      WHERE ${SALES_TABLE}.id=?
      ORDER BY ${SALES_TABLE}.sales_number DESC
      `;
    const params = [id];
    
    const result = await db.query(saleServiceQuery,params);
    console.log('query results', result);
    const sales = result.values?.map(sales => ({
      id: sales.id,
      user_id: sales.user_id,
      user: sales.user,
      sales_number: sales.sales_number,
      sales_date: sales.sales_date,
      terminal_number: sales.terminal_number,
      customer_id: sales.customer_id,
      customer_code: sales.customer_code,
      customer: sales.customer,
      customer_address: sales.customer_address,
      customer_tin: sales.customer_tin,
      table_id: sales.table_id,
      table: sales.table,
      total_amount: sales.total_amount,
      balance_amount: sales.balance_amount?? 0,
      paid_amount:sales.paid_amount,
      discount_amount: sales.discount_amount,
      no_of_pax: sales.no_of_pax,
      remarks: sales.remarks,
      status: sales.status,
      is_locked: sales.is_locked,
      is_billed_out: sales.is_billed_out,
      is_cancelled: sales.is_cancelled,
      discount_id: sales.discount_id,
      discount: sales.discount,
      discount_rate: sales.discount_rate,
      senior_pwd_name: sales.senior_pwd_name,
      senior_pwd_age_disability: sales.senior_pwd_age_disability,
      senior_pwd_id: sales.senior_pwd_id
    }))[0];
    console.log('sales detail', sales);
   
    return sales;
  } catch (error) {
    console.log('get sales error');
    console.log(error);
    throw error;
  }
};

export const getLastSalesNumber = async (): Promise<string> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `SELECT sales_number FROM ${SALES_TABLE} ORDER BY id DESC LIMIT 1`;
    const result = await db?.query(query);
    const lastSalesNumber =result?.values?.[0].sales_number;
    console.log('lastSalesNumber',lastSalesNumber)
    return lastSalesNumber || '0000000000';
  } catch (error) {
    console.log(error)
    return '0000000000';
  }
}

export const addSales = async (data: SALES_DTO, data_line: SALES_ITEM_DTO[]) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `INSERT INTO ${SALES_TABLE} (
      user_id,          sales_date,          sales_number,
      terminal_number,      customer_id,        table_id,
      total_amount,     balance_amount,         paid_amount,
      discount_amount,      no_of_pax,          remarks,
      status, discount_id, discount_rate
    ) VALUES (
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?
    )`;

    const transactionStatements = [
      {
        statement: query,
        values: [1 , data.sales_date, data.sales_number, 
          data.terminal_number, data.customer_id, data.table_id,
          data.total_amount, data.balance_amount, data.paid_amount,
          data.discount_amount, data.no_of_pax, data.remarks,
          data.status, data.discount_id, data.discount_rate
        ],
      },
    ];

    const res = await db.query(query,transactionStatements[0].values );
    const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
    const lastIdRes = await db.query(getLastIdQuery);
    let Id =  0;
    // const insertedId = lastIdRes.values?[0].values['lastId'];
    if (lastIdRes.values && lastIdRes.values.length > 0) {
      Id =  lastIdRes.values[0].lastId
      console.log('Inserted ID:', lastIdRes.values[0].lastId);

      // call here add sales line
      await addBulkSalesItem(Id, data_line)
      
    } else {
      Id = 0;
      console.log('No inserted ID found');
    }
    // return true,Id;
    return { success: true, insertedId: Id };
  } catch (error) {
    console.log('add sales error:', error);
    return { success: false, insertedId: 0 };
  }
};

export const updateSales = async (data: SALES_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    const transactionStatements = [
      {
        statement: `UPDATE ${SALES_TABLE}
          SET customer_id=?,
          table_id=?,
          total_amount=?,
          balance_amount=?,
          paid_amount=?,
          discount_amount=?,
          no_of_pax=?,
          remarks=?,
          status=?,
          discount_id=?,
          discount_rate=?,
          is_locked =?,
          is_billed_out=?
        WHERE id=?`,
        values: [
          data.customer_id,
          data.table_id,
          data.total_amount,
          data.balance_amount,
          data.paid_amount,
          data.discount_amount,
          data.no_of_pax,
          data.remarks,
          data.status,
          data.discount_id ?? 1,
          data.discount_rate ?? 0,
          data.is_locked ?? false,
          data.is_billed_out ?? false,
          data.id
        ]
      }
    ]
    console.log('query response ', transactionStatements[0].values)

    const res = await db.executeTransaction(transactionStatements);
    // const res = await db.query(query,transactionStatements[0].values );
    console.log('query response ', res)
    // return true,Id;
    return { success: true, insertedId: data.id };
  } catch (error) {
    console.log('update sales error:', error);
    return { success: false, insertedId: 0 };
  }
};

export const billOutSales = async (data: SALES_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    const transactionStatements = [
      {
        statement: `UPDATE ${SALES_TABLE}
          SET customer_id=?,
          table_id=?,
          total_amount=?,
          balance_amount=?,
          paid_amount=?,
          discount_amount=?,
          no_of_pax=?,
          remarks=?,
          status=?,
          discount_id=?,
          discount_rate=?,
          is_locked =?,
          is_billed_out=?
        WHERE id=?`,
        values: [
          data.customer_id,
          data.table_id,
          data.total_amount,
          data.balance_amount,
          data.paid_amount,
          data.discount_amount,
          data.no_of_pax,
          data.remarks,
          data.status,
          data.discount_id ?? 1,
          data.discount_rate ?? 0,
          true,
          true,
          data.id
        ]
      }
    ]
    console.log('query response ', transactionStatements[0].values)

    const res = await db.executeTransaction(transactionStatements);
    // const res = await db.query(query,transactionStatements[0].values );
    console.log('query response ', res)
    // return true,Id;
    return { success: true, insertedId: data.id };
  } catch (error) {
    console.log('update sales error:', error);
    return { success: false, insertedId: 0 };
  }
};

export const cancelSales = async (data: SALES_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    const transactionStatements = [
      {
        statement: `UPDATE ${SALES_TABLE}
          SET is_locked =?,
          is_cancelled=?
        WHERE id=?`,
        values: [ true,
          true,
          data.id
        ]
      }
    ]

    const res = await db.executeTransaction(transactionStatements);
    console.log('cancel query response ', res)
    // return true,Id;
    return { success: true, insertedId: data.id };
  } catch (error) {
    console.log('cancel sales error:', error);
    return { success: false, insertedId: 0 };
  }
};

