import { DBConnectionService } from '../database.connection';
import { COLLECTIONS_TABLE, CUSTOMERS_TABLE, DISCOUNTS_TABLE, ITEMS_TABLE, SALES_ITEMS_TABLE, SALES_TABLE, TABLE_GROUP_LINES_TABLE, TABLES_TABLE, UNITS_TABLE, USERS_TABLE } from '@/schema/tables';
import { ref, toRaw } from 'vue';
import { SALES, SALES_DTO } from '@/models/sales.model';
import { CUSTOMER } from '@/models/customer.model';
import USER from '@/models/user.model';
import { SALES_ITEM_DTO } from '@/models/sales-item.model';
import { addBulkSalesItem, getSalesItemBySalesId } from './sales-item.service';
import { onLockUpdateItemInventory, onUnlockUpdateItemInventory } from '../../composables/inventory';

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
     
      return result.values as SALES_DTO[];
    } catch (error) {
      throw error;
    }
};

export const getOpenSales = async () => {
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
          ${SALES_TABLE}.net_amount,
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
    
    return { success: true, data: result.values as SALES_DTO[] };
  } catch (error) {
    throw error;
  }
};

export const getBilledSales = async () => {
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
          ${SALES_TABLE}.net_amount,
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
      WHERE ${SALES_TABLE}.is_billed_out = 1 AND ${SALES_TABLE}.is_cancelled = 0
      AND ${SALES_TABLE}.status <> 'paid'
      GROUP BY ${SALES_TABLE}.id
      ORDER BY ${SALES_TABLE}.sales_number DESC
      `;
    
    const result = await db.query(saleServiceQuery);
    
    return { success: true, data: result.values as SALES_DTO[] };
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const getCollectedSales = async () => {
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
    return { success: true, data: result.values as SALES_DTO[] };
  } catch (error) {
    throw error;
  }
};

export const getCancelledSales = async () => {
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
    
    return { success: true, data: result.values as SALES_DTO[] };
  } catch (error) {
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
        ${SALES_TABLE}.sales_time,
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
        ${SALES_TABLE}.net_amount,
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
        ${SALES_TABLE}.is_printed,
        ${SALES_TABLE}.discounted_pax,
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
  const sales = result.values?.map(sales => ({
    id: sales.id,
    user_id: sales.user_id,
    user: sales.user,
    sales_number: sales.sales_number,
    sales_date: sales.sales_date,
    sales_time: sales.sales_time,
    terminal_number: sales.terminal_number,
    customer_id: sales.customer_id,
    customer_code: sales.customer_code,
    customer: sales.customer,
    customer_address: sales.customer_address,
    customer_tin: sales.customer_tin,
    table_id: sales.table_id,
    table: sales.table,
    total_amount: sales.total_amount,
    net_amount: sales.net_amount,
    balance_amount: sales.balance_amount?? 0,
    paid_amount:sales.paid_amount,
    discount_amount: sales.discount_amount,
    no_of_pax: sales.no_of_pax,
    remarks: sales.remarks,
    status: sales.status,
    is_locked: sales.is_locked,
    is_billed_out: sales.is_billed_out,
    is_cancelled: sales.is_cancelled,
    is_printed: sales.is_printed,
    discount_id: sales.discount_id,
    discount: sales.discount,
    discount_rate: sales.discount_rate,
    senior_pwd_name: sales.senior_pwd_name,
    senior_pwd_age_disability: sales.senior_pwd_age_disability,
    senior_pwd_id: sales.senior_pwd_id,
    discounted_pax: sales.discounted_pax,
  }))[0];
  
    return { success: true, data: sales };
} catch (error) {
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
    return lastSalesNumber || '0000000000';
  } catch (error) {
    return '0000000000';
  }
}

export const newSales = async () => {
const dbConnectionService = await DBConnectionService.getInstance();
const db = await dbConnectionService.getDatabaseConnection();
try {

  let sales_number = await getLastSalesNumber();
  const currentSalesNumber = parseInt(sales_number, 10);
  const nextSalesNumber = currentSalesNumber + 1;
  const formattedNextSalesNumber = nextSalesNumber.toString().padStart(10, '0');
  sales_number = formattedNextSalesNumber;
  const data = 
  {
    id: undefined,
    user_id: 1,
    sales_number: sales_number,
    sales_date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
      }),
    sales_time : new Date().toLocaleTimeString('en-US', {
      hour:  '2-digit',
      minute: '2-digit',
      second: '2-digit'
      }),
    terminal_number: '001',
    customer_id: 1,
    table_id: 1,
    table: '',
    total_amount: 0,
    balance_amount: 0,
    paid_amount: 0,
    discount_amount: 0,
    net_amount: 0,
    no_of_pax: 0,
    remarks: 'NA',
    status: 'NEW',
    is_locked: false,
    is_billed_out: false,
    is_cancelled: false,
    is_printed: false,
    discount_id: 1,
    discount_rate: 0,
    senior_pwd_name:'NA',
    senior_pwd_id: 'NA'
}

  const query = `INSERT INTO ${SALES_TABLE} (
    user_id,          sales_date, sales_time,          sales_number,
    terminal_number,      customer_id,        table_id,
    total_amount,     balance_amount,         paid_amount,
    discount_amount,    net_amount,      no_of_pax,          remarks,
    status, discount_id, discount_rate
  ) VALUES (
    ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?
  )`;

  const transactionStatements = [
    {
      statement: query,
      values: [1 , data.sales_date, data.sales_time, data.sales_number, 
        data.terminal_number, data.customer_id, data.table_id,
        data.total_amount, data.balance_amount, data.paid_amount,
        data.discount_amount, data.net_amount, data.no_of_pax, data.remarks,
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
    Id =  lastIdRes.values[0].lastId;
  } else {
    Id = 0;
  }
  // return true,Id;
  return { success: true, data: Id };
} catch (error) {
  throw error
}
};

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

      // call here add sales line
      await addBulkSalesItem(Id, data_line)
      
    } else {
      Id = 0;
    }
    // return true,Id;
    return { success: true, data: Id };
  } catch (error) {
    throw error; 
  }
};

export const updateSales = async (data: SALES) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    const transactionStatements = [
      {
        statement: `UPDATE ${SALES_TABLE}
          SET customer_id=?,
          table_id=?,
          total_amount=?,
          net_amount=?,
          balance_amount=?,
          paid_amount=?,
          discount_amount=?,
          no_of_pax=?,
          remarks=?,
          status=?,
          discount_id=?,
          discount_rate=?,
          is_locked =?,
          is_billed_out=?,
          senior_pwd_id=?,
          senior_pwd_name=?
        WHERE id=?`,
        values: [
          data.customer_id,
          data.table_id,
          data.total_amount,
          data.net_amount,
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
          data.senior_pwd_id ?? '',
          data.senior_pwd_name ?? '',
          data.id
        ]
      }
    ]

    const res = await db.executeTransaction(transactionStatements);
    // const res = await db.query(query,transactionStatements[0].values );
    // return true,Id;
    return { success: true, data: data.id };
  } catch (error) {
    throw error;
  }
};

export const lockSales = async (data: SALES_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    // if(data.net_amount == 0){
    //   throw new Error(`Amount is zero ( ${data.net_amount.toFixed(2) } )`);
    // }
  
    const transactionStatements = [
      {
        statement: `UPDATE ${SALES_TABLE}
          SET customer_id=?,
          table_id=?,
          total_amount=?,
          net_amount=?,
          balance_amount=?,
          paid_amount=?,
          discount_amount=?,
          no_of_pax=?,
          remarks=?,
          status=?,
          discount_id=?,
          discount_rate=?,
          is_locked =?,
          is_billed_out=?,
          senior_pwd_id=?,
          senior_pwd_name=?
        WHERE id=?`,
        values: [
          data.customer_id,
          data.table_id,
          data.total_amount,
          data.net_amount,
          data.balance_amount,
          data.paid_amount,
          data.discount_amount,
          data.no_of_pax,
          data.remarks,
          data.status,
          data.discount_id ?? 1,
          data.discount_rate ?? 0,
          true,
          data.is_billed_out ?? false,
          data.senior_pwd_id ?? '',
          data.senior_pwd_name ?? '',
          data.id
        ]
      }
    ]
    try {
      const sales_items_list = await getSalesItemBySalesId(data.id??0)
      await onLockUpdateItemInventory('SI', data.id??0, data.sales_date, data.sales_number)
    } catch (error) {
      throw error;
    }
  
    const res = await db.executeTransaction(transactionStatements);
    

    return { success: true, data: data.id };
  } catch (error) {
    throw error;
  }
};

export const unlockSales = async (data: SALES_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `UPDATE ${SALES_TABLE}
          SET 
          is_locked =?
        WHERE id=?`,
        values: [
          false,
          data.id
        ]
      }
    ]

    
    try {
      await onUnlockUpdateItemInventory('SI', data.id??0, data.sales_date, data.sales_number)
    } catch (error) {
      throw error;
    }
  
    const res = await db.executeTransaction(transactionStatements);
    

    return { success: true, data: data.id };
  } catch (error) {
    throw error;
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

  const res = await db.executeTransaction(transactionStatements);
  // const res = await db.query(query,transactionStatements[0].values );
  // return true,Id;
  return { success: true, data: data.id };
} catch (error) {
  throw error;
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
    return { success: true, data: data.id };
  } catch (error) {
    throw error;
  }
};

export const deleteSales = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    const transactionStatements = [
      {
        statement: `DELETE FROM ${SALES_TABLE}
        WHERE id=?`,
        values: [ 
          id
        ]
      }
    ]

    const res = await db.executeTransaction(transactionStatements);
    return { success: true};
  } catch (error) {
    throw error;
  }
};