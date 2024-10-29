// item.ts
import { CapacitorSQLite, SQLiteConnection, } from '@capacitor-community/sqlite';
import {
  ITEMS_TABLE,
  SALES_ITEMS_TABLE,
  STOCK_IN_ITEMS_TABLE,
  STOCK_OUT_ITEMS_TABLE,
  TAXES_TABLE,
  UNITS_TABLE,
} from '@/schema/tables';
import { Capacitor } from '@capacitor/core';
import ITEM_DTO, { ITEM } from '@/models/item.model';
import { DBConnectionService } from '../database.connection';
import { ref } from 'vue';
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { defineComponent, onMounted, getCurrentInstance } from 'vue';

const app = getCurrentInstance()
const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;

// const db_connection = new DBConnectionService()
const data = ref<ITEM[]>([])
type QueryResult = {
  rows: {
    item: (index: number) => { max_code?: string } | undefined;
    length: number;
  };
};

export const getItems = async (page = 1, pageSize = 10, search_keyword = '') => {
  // const db = await db_connection.getDatabaseConnection(); // get the database connection
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    // const db = await getDBConnection();
    const itemServiceQuery = `
        SELECT ${ITEMS_TABLE}.id,
               ${ITEMS_TABLE}.item_code,
               ${ITEMS_TABLE}.bar_code,
               ${ITEMS_TABLE}.item_description,
               ${ITEMS_TABLE}.alias,
               ${ITEMS_TABLE}.category,
               ${ITEMS_TABLE}.price,
               ${ITEMS_TABLE}.cost,
               0 as quantity,
               ${ITEMS_TABLE}.unit_id,
               ${UNITS_TABLE}.unit_code,
               ${UNITS_TABLE}.unit,
               ${ITEMS_TABLE}.is_inventory,
               ${ITEMS_TABLE}.is_vat_inclusive,
               ${ITEMS_TABLE}.generic_name,
               ${ITEMS_TABLE}.tax_id,
               ${ITEMS_TABLE}.remarks,
               ${ITEMS_TABLE}.image_path,
               ${ITEMS_TABLE}.is_package,
               ${ITEMS_TABLE}.is_locked,
               ${ITEMS_TABLE}.expiry_date,
               ${ITEMS_TABLE}.lot_number,
               ${TAXES_TABLE}.tax,
               ${TAXES_TABLE}.tax_code,
               ${TAXES_TABLE}.rate as tax_rate,
               ${TAXES_TABLE}.is_inclusive as is_tax_rate_inclusive,
               ${TAXES_TABLE}.rate
        FROM ${ITEMS_TABLE}
        LEFT JOIN ${UNITS_TABLE}
        ON ${ITEMS_TABLE}.unit_id = ${UNITS_TABLE}.id
        LEFT JOIN ${TAXES_TABLE}
        ON ${ITEMS_TABLE}.tax_id = ${TAXES_TABLE}.id
        WHERE (
          ${ITEMS_TABLE}.item_code LIKE '%${search_keyword}%' 
          OR ${ITEMS_TABLE}.bar_code LIKE '%${search_keyword}%' 
          OR ${ITEMS_TABLE}.item_description LIKE '%${search_keyword}%' 
          OR ${ITEMS_TABLE}.alias LIKE '%${search_keyword}%' 
          OR ${ITEMS_TABLE}.category LIKE '%${search_keyword}%' 
          OR ${ITEMS_TABLE}.generic_name LIKE '%${search_keyword}%' 
          OR ${ITEMS_TABLE}.remarks LIKE '%${search_keyword}%' 
          OR ${ITEMS_TABLE}.lot_number LIKE '%${search_keyword}%' 
          OR ${UNITS_TABLE}.unit_code LIKE '%${search_keyword}%' 
          OR ${UNITS_TABLE}.unit LIKE '%${search_keyword}%' 
        )
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `;
    // const itemServiceQuery = `SELECT * FROM customer`
    // const result = await db?.execute(itemServiceQuery);
    const res = await db.query(itemServiceQuery);
    if(res.values){
      data.value = res.values as ITEM_DTO[];
    }

    if (res && Array.isArray(res.values)) {
      data.value = res.values as ITEM_DTO[];
    }

    return { success: true, data: data.value }

  } catch (error) {
    console.log(error);
    
    throw error;
  } 
};

export const getItemById = async (id: number) => {
  // const db = await db_connection.getDatabaseConnection(); // get the database connection
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();

  try {
    // Prepare the SQL query and parameters
    const query = `
      SELECT 
        ${ITEMS_TABLE}.id,
        ${ITEMS_TABLE}.item_code,
        ${ITEMS_TABLE}.bar_code,
        ${ITEMS_TABLE}.item_description,
        ${ITEMS_TABLE}.alias,
        ${ITEMS_TABLE}.category,
        ${ITEMS_TABLE}.price,
        ${ITEMS_TABLE}.cost,
        ${ITEMS_TABLE}.quantity,
        ${ITEMS_TABLE}.unit_id,
        ${ITEMS_TABLE}.is_inventory,
        ${ITEMS_TABLE}.is_vat_inclusive,
        ${ITEMS_TABLE}.generic_name,
        ${ITEMS_TABLE}.tax_id,
        ${ITEMS_TABLE}.remarks,
        ${ITEMS_TABLE}.image_path,
        ${ITEMS_TABLE}.is_package,
        ${ITEMS_TABLE}.is_locked,
        ${ITEMS_TABLE}.expiry_date,
        ${ITEMS_TABLE}.lot_number,
        ${TAXES_TABLE}.id as tax_id,
        ${TAXES_TABLE}.tax_code,
        ${TAXES_TABLE}.rate as tax_rate,
        ${UNITS_TABLE}.id as unit_id,
        ${UNITS_TABLE}.unit_code
      FROM ${ITEMS_TABLE}
      LEFT JOIN ${UNITS_TABLE} ON ${ITEMS_TABLE}.unit_id = ${UNITS_TABLE}.id
      LEFT JOIN ${TAXES_TABLE} ON ${ITEMS_TABLE}.tax_id = ${TAXES_TABLE}.id
      WHERE ${ITEMS_TABLE}.id = ?
    `;
    const params = [id];

    // Execute the transaction
    // await db.executeTransaction([
    //   {
    //     statement: query,
    //     values: params,
    //   },
    // ]);

    // Retrieve the results after the transaction
    const result = await db.query(query, params);
    const item = result.values?.map(item => ({
      id: item.id,
      item_code: item.item_code,
      item_description: item.item_description,
      bar_code: item.bar_code,
      alias: item.alias,
      category: item.category,
      price: item.price,
      cost: item.cost,
      quantity: item.quantity,
      unit_code: item.unit_code,
      unitId: item.unit_id,
      tax_code: item.tax_code,
      is_inventory: item.is_inventory,
      generic_name: item.generic_name,
      taxId: item.tax_id,
      tax: item.tax_code,
      tax_rate: item.tax_rate,
      remarks: item.remarks,
      image_path: item.image_path,
      is_package: item.is_package,
      is_locked: Boolean(item.is_locked),
      is_vat_inclusive: Boolean(item.is_vat_inclusive),
      expiry_date:  item.expiry_date,
      lot_number:  item.expiry_date,
    }))[0];

    return { success: true , data:item }

  } catch (error) {
    throw error;
  }
};

export const getTransaction = async (id: number)  => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const categoryQuery = `SELECT DISTINCT ${SALES_ITEMS_TABLE}.item_id FROM ${SALES_ITEMS_TABLE} WHERE ${SALES_ITEMS_TABLE}.item_id=? LIMIT 1`;
    const params = [id];
    
    const result = await db.query(categoryQuery, params);
    if (result.values) {
      return { exist: true}; // Return the first record
    } else {
      return { exist: false}; // Handle case where no record is found
    }
  } catch (error) {
    throw error;
  }
};

export const getItemCode = async (): Promise<string> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `SELECT item_code FROM ${ITEMS_TABLE} ORDER BY id DESC LIMIT 1`;
    const result = await db?.query(query);
    console.log(result?.values?.[0])

    let item_code = result?.values?.[0].item_code;
    const currentItemCode = parseInt(item_code, 10);
    const nextItemCode = currentItemCode + 1;
    const formattedNextSalesNumber = nextItemCode.toString().padStart(10, '0');
    item_code = formattedNextSalesNumber;

    return item_code;
  } catch (error) {
    return '0000000001';
  }
}

export const addItem = async (data: ITEM) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    
    const item_code = await getItemCode();

    const transaction: any = [
      {
        statement: `
          INSERT INTO ${ITEMS_TABLE} (
            item_code, bar_code, item_description,
            alias, category, price,
            cost, quantity, unit_id, 
            is_inventory, is_package, is_locked, 
            generic_name, tax_id, remarks, 
            expiry_date, lot_number, is_vat_inclusive
          ) VALUES (
           ?, ?, ?,
           ?, ?, ?, 
           ?, ?, ?, 
           ?, ?, ?, 
           ?, ?, ?, 
           ?, ?, ?
          )
        `,
        values: [
          item_code,  item_code, data.item_description,
          data.alias, data.category, data.price,
          data.cost, data.quantity, data.unit_id, 
          data.is_inventory, data.is_package,data.is_locked,
          data.generic_name, data.tax_id, data.remarks, 
          data.expiry_date, data.lot_number, data.is_vat_inclusive
        ],
      },
    ];

    const res = await db.executeTransaction(transaction);
    const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
    const lastIdRes = await db.query(getLastIdQuery);
    let Id =  0;

    if (lastIdRes.values && lastIdRes.values.length > 0) {
      Id =  lastIdRes.values[0].lastId;
    } else {
      Id = 0;
    }
    return { success: true, data: Id };
  } catch (err: any) {
    throw err;
  }
};

export const updateItem = async (data: ITEM) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();

  try {
    console.log(data.is_inventory)
    const transactionStatements = [
      {
        statement: `
          UPDATE ${ITEMS_TABLE} SET
            bar_code = ?,
            item_description = ?,
            alias = ?,
            category = ?,
            price = ?,
            cost = ?,
            unit_id = ?,
            is_inventory = ?,
            generic_name = ?,
            tax_id = ?,
            remarks = ?,
            image_path = ?,
            is_package = ?,
            is_locked = ?,
            is_vat_inclusive = ?,
            expiry_date = ?,
            lot_number = ?
          WHERE id = ?
        `,
        values: [
          data.bar_code,
          data.item_description,
          data.alias,
          data.category,
          data.price,
          data.cost,
          data.unit_id,
          data.is_inventory,
          data.generic_name,
          data.tax_id,
          data.remarks,
          data.image_path,
          data.is_package,
          data.is_locked,
          data.is_vat_inclusive,
          data.expiry_date,
          data.lot_number,
          data.id,
        ],
      },
      // Add additional statements here if needed
    ];

    // Execute the transaction
    await db.executeTransaction(transactionStatements);
    return { success: true }
  } catch (error) {
    throw error;
  }
};

export const lockItem = async (data: ITEM) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();

  try {
    const transactionStatements = [
      {
        statement: `
          UPDATE ${ITEMS_TABLE} SET
            bar_code = ?,
            item_description = ?,
            alias = ?,
            category = ?,
            price = ?,
            cost = ?,
            unit_id = ?,
            is_inventory = ?,
            generic_name = ?,
            tax_id = ?,
            remarks = ?,
            image_path = ?,
            is_package = ?,
            is_locked = ?,
            is_vat_inclusive =?,
            expiry_date = ?,
            lot_number = ?
          WHERE id = ?
        `,
        values: [
          data.bar_code,
          data.item_description,
          data.alias,
          data.category,
          data.price,
          data.cost,
          data.unit_id,
          data.is_inventory,
          data.generic_name,
          data.tax_id,
          data.remarks,
          data.image_path,
          data.is_package,
          true,
          data.is_vat_inclusive,
          data.expiry_date,
          data.lot_number,
          data.id,
        ],
      },
      // Add additional statements here if needed
    ];

    // Execute the transaction
    await db.executeTransaction(transactionStatements);
    return { success: true }
  } catch (error) {
    throw error;
  }
};

export const unlockItem = async (data: ITEM) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();

  try {
    console.log(data.is_inventory)
    const transactionStatements = [
      {
        statement: `
          UPDATE ${ITEMS_TABLE} SET
            is_locked = ?
          WHERE id = ?
        `,
        values: [
          false,
          data.id
        ],
      },
      // Add additional statements here if needed
    ];

    // Execute the transaction
    await db.executeTransaction(transactionStatements);
    return { success: true }
  } catch (error) {
    throw error;
  }
};

export const deleteItem = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE ${ITEMS_TABLE}
        WHERE id=?`,
        values: [ 
          id
        ]
      }
    ]
  
    const res = await db.executeTransaction(transactionStatements);
    return { success: true};
  } catch (error) {
    return { success: false};
  }
};