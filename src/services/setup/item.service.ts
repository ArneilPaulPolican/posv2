// item.ts
import { CapacitorSQLite, SQLiteConnection, } from '@capacitor-community/sqlite';
import {
  ITEMS_TABLE,
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

export const getItems = async () => {
  // const db = await db_connection.getDatabaseConnection(); // get the database connection
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    await presentToast('Query string');
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
               ${ITEMS_TABLE}.quantity,
               ${ITEMS_TABLE}.unit_id,
               ${ITEMS_TABLE}.is_inventory,
               ${ITEMS_TABLE}.generic_name,
               ${ITEMS_TABLE}.tax_id,
               ${ITEMS_TABLE}.remarks,
               ${ITEMS_TABLE}.image_path,
               ${ITEMS_TABLE}.is_package,
               ${ITEMS_TABLE}.is_locked,
               ${ITEMS_TABLE}.expiry_date,
               ${ITEMS_TABLE}.lot_number,
               ${TAXES_TABLE}.tax,
               ${TAXES_TABLE}.rate as tax_rate,
               ${TAXES_TABLE}.is_inclusive as is_tax_rate_inclusive,
               ${TAXES_TABLE}.rate,
               ${UNITS_TABLE}.unit_code as unit
        FROM ${ITEMS_TABLE}
        LEFT JOIN ${UNITS_TABLE}
        ON ${ITEMS_TABLE}.unit_id = ${UNITS_TABLE}.id
        LEFT JOIN ${TAXES_TABLE}
        ON ${ITEMS_TABLE}.tax_id = ${TAXES_TABLE}.id
      `;
    // const itemServiceQuery = `SELECT * FROM customer`
    // const result = await db?.execute(itemServiceQuery);
    const res = await db.query(itemServiceQuery);
    await presentToast('item query results', res);
    if(res.values){
      data.value = res.values as ITEM_DTO[];
    }

    if (res && Array.isArray(res.values)) {
      data.value = res.values as ITEM_DTO[];
      await presentToast(data.value )
    }

    return data.value;

  } catch (error) {
    await presentToast('get items error');
    await presentToast(error);
    throw error;
  } finally {
    // await db.close(); // Close the database connection
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
        ${UNITS_TABLE}.id as unit_id,
        ${UNITS_TABLE}.unit_code
      FROM ${ITEMS_TABLE}
      LEFT JOIN ${UNITS_TABLE} ON ${ITEMS_TABLE}.unit_id = ${UNITS_TABLE}.id
      LEFT JOIN ${TAXES_TABLE} ON ${ITEMS_TABLE}.tax_id = ${TAXES_TABLE}.id
      WHERE ${ITEMS_TABLE}.id = ?
    `;
    const params = [id];

    // Execute the transaction
    await db.executeTransaction([
      {
        statement: query,
        values: params,
      },
    ]);

    // Retrieve the results after the transaction
    const result = await db.query(query, params);
    await presentToast('get item by id result:',result);
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
      tax: item.tax_code,
      taxId: item.tax_id,
      remarks: item.remarks,
      image_path: item.image_path,
      is_package: item.is_package,
      is_locked: Boolean(item.is_locked),
      expiry_date:  item.expiry_date,
      lot_number:  item.expiry_date,
    }))[0];

    return item;

  } catch (error) {
    await presentToast('get item by id transaction error:');
    await presentToast(error);
    return null;
  }
};

export const getLastItemCode = async (): Promise<string> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `SELECT item_code FROM ${ITEMS_TABLE} ORDER BY id DESC LIMIT 1`;
    const result = await db?.query(query);
    const last_code =result?.values?.[0].sales_number;
    await presentToast('last code',last_code)
    return last_code || '0000000001';
  } catch (error) {
    await presentToast(error)
    return '0000000001';
  }
}

export const addItem = async (data: ITEM, processedImageSavePath: string): Promise<boolean> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    const transaction: any = [
      {
        statement: `
          INSERT INTO ${ITEMS_TABLE} (
            item_code, bar_code, item_description,
            alias, category, price,
            cost, quantity, unit_id, 
            is_inventory, is_package, is_locked, 
            generic_name, tax_id, remarks, 
            image_path, expiry_date, lot_number
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
          data.item_code,  data.bar_code, data.item_description,
          data.alias, data.category, data.price,
          data.cost, data.quantity, data.unit_id, 
          data.is_inventory, data.is_package,data.is_locked,
          data.generic_name, data.tax_id, data.remarks, 
          processedImageSavePath, data.expiry_date, data.lot_number,
        ],
      },
    ];

    await db.executeTransaction(transaction);

    return true;
  } catch (err: any) {
    await presentToast('Error in addItem transaction:', err);
    return false;
  }
};

export const updateItem = async (data: ITEM, processedImageSavePath: string) => {

  // if (data.image_path) {
  //   try {
  //     processedImageSavePath = await saveImage(
  //       data.image_path,
  //       data.file_extension as string,
  //       'item-image',
  //       data.item_code,
  //     );
  //   } catch (error) {
  //     await presentToast('add item: error trying to save image');
  //     await presentToast(error);
  //     throw error;
  //   }
  // }
  // const db = await db_connection.getDatabaseConnection(); // get the database connection
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();

  try {
    await presentToast(data)        

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
            quantity = ?,
            unit_id = ?,
            is_inventory = ?,
            generic_name = ?,
            tax_id = ?,
            remarks = ?,
            image_path = ?,
            is_package = ?,
            is_locked = ?,
            expiry_date = ?,
            lot_number = ?
          WHERE id = ?
        `,
        values: [
          data.item_description,
          data.bar_code,
          data.alias,
          data.category,
          data.price,
          data.cost,
          data.quantity,
          data.unit_id,
          data.is_inventory,
          data.generic_name,
          data.tax_id,
          data.remarks,
          processedImageSavePath,
          data.is_package,
          data.is_locked,
          data.expiry_date,
          data.lot_number,
          data.id,
        ],
      },
      // Add additional statements here if needed
    ];

    await presentToast(transactionStatements.values);
    // Execute the transaction
    await db.executeTransaction(transactionStatements);
    await presentToast('Execute the transaction:');
    return true;
  } catch (error) {
    await presentToast('update item transaction error:');
    await presentToast(error);
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
    await presentToast('cancel query response ', res)
    // return true,Id;
    return { success: true};
  } catch (error) {
    return { success: false};
  }
};