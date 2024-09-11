// item.ts
import { CapacitorSQLite, SQLiteConnection, } from '@capacitor-community/sqlite';
import {
  ITEMS_TABLE,
  SYS_INVENTORY_TABLE,
  TAXES_TABLE,
  UNITS_TABLE,
} from '@/schema/tables';
import { Capacitor } from '@capacitor/core';
import ITEM_DTO, { ITEM } from '@/models/item.model';
import { ref } from 'vue';
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import { DBConnectionService } from './database.connection';
import { SYS_INVENTORY, SYS_INVENTORY_DTO } from '@/models/sys-inventory.model';

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

export const getInventoryReport = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
      if (!db) {
          throw new Error('Database connection not open');
      }
    
      const saleServiceQuery = 
      `SELECT ${SYS_INVENTORY_TABLE}.id,
              ${SYS_INVENTORY_TABLE}.trx_id,
              ${SYS_INVENTORY_TABLE}.trx_date,
              ${SYS_INVENTORY_TABLE}.trx_type,
              ${SYS_INVENTORY_TABLE}.reference,
              ${SYS_INVENTORY_TABLE}.item_id,
              ${ITEMS_TABLE}.item_code,
              ${ITEMS_TABLE}.bar_code as item_barcode,
              ${ITEMS_TABLE}.item_description,
              ${ITEMS_TABLE}.image_path as item_image_path,
              ${ITEMS_TABLE}.category as item_category,
              ${ITEMS_TABLE}.is_inventory,
              ${ITEMS_TABLE}.quantity,
              ${SYS_INVENTORY_TABLE}.unit_id,
              ${UNITS_TABLE}.unit_code,
              ${UNITS_TABLE}.unit,
              ${SYS_INVENTORY_TABLE}.cost,
              ${SYS_INVENTORY_TABLE}.price
        FROM ${SYS_INVENTORY_TABLE}
        LEFT JOIN ${ITEMS_TABLE}
        ON ${SYS_INVENTORY_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN ${UNITS_TABLE}
        ON ${ITEMS_TABLE}.unit_id=${UNITS_TABLE}.id`;
      
      const result = await db.query(saleServiceQuery);
   
    return result.values as SYS_INVENTORY_DTO[];
  } catch (error) {
    throw error;
  }
};

export async function updateItemInventory(item_id:number,unit_id:number) {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    let quantity = 0;
    const statement = `
      SELECT 
        ${SYS_INVENTORY_TABLE}.item_id, 
        ${SYS_INVENTORY_TABLE}.unit_id, 
        Sum(${SYS_INVENTORY_TABLE}.quantity) AS SumOfquantity
      FROM ${SYS_INVENTORY_TABLE}
      GROUP BY ${SYS_INVENTORY_TABLE}.item_id, ${SYS_INVENTORY_TABLE}.unit_id
      HAVING ${SYS_INVENTORY_TABLE}.item_id = ? AND ${SYS_INVENTORY_TABLE}.unit_id = ?
    `;
      const values = [item_id,unit_id]
    // }];
    const result = await db.query(statement, values);
    const data = result.values?.map(item => ({
      item_id: item.id,
      unit_code: item.unit_code,
      quantity: item.SumOfquantity,
    }))[0];
    if(data){
      quantity = data.quantity;
    }



    try {
      const update_statement = `
        UPDATE ${ITEMS_TABLE} SET
        quantity = ?
        WHERE id = ? AND unit_id=?
      `;
      const update_values = [
        quantity,
        item_id,
        unit_id
      ];

      // Execute the transaction
      await db.query(update_statement, update_values);
    } catch (error) {
      console.log(`update_statement ${error}`)
      throw error;
    }
    console.log('success updateItemInventory')

    return { success: true };
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const addInventory = async (items: SYS_INVENTORY[]) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    for (const data of items){
      
      const transaction: any = [
        {
          statement: `
            INSERT INTO ${SYS_INVENTORY_TABLE} (
              trx_id, trx_date, trx_type, reference,
              item_id, unit_id, quantity,
              end_quantity, cost, price
            ) VALUES (
            ?, ?, ?,
            ?, ?, ?, 
            ?, ?, ?, ?
            )
          `,
          values: [
            data.trx_id,  data.trx_date, data.trx_type,
            data.item_id, data.unit_id, data.quantity,
            data.end_quantity, data.cost, data.price
          ],
        },
      ];
      try {
        const res = await db.executeTransaction(transaction);
      } catch (error) {
        throw error;
      }

    }
    return { success: true };
  } catch (err) {
    throw err;
  }
};

export const addBulkInventory = async (items: SYS_INVENTORY[]) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const statements = items.map((data) => ({
      statement: `
        INSERT INTO ${SYS_INVENTORY_TABLE} (
          trx_id, trx_date, trx_type, reference,
          item_id, unit_id, quantity,
          end_quantity, cost, price
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `,
      values: [
        data.trx_id,  data.trx_date, data.trx_type, data.reference,
        data.item_id, data.unit_id, data.quantity,
        0, data.cost, data.price
      ]
    }));
    const res = await db.executeTransaction(statements);

    console.log(`success addBulkInventory`)
    return { success: true };
  } catch (err) {
    console.log(err)
    throw err;
  }
};

export const deleteInventory = async (items: SYS_INVENTORY[]) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    for (const data of items){
      const transactionStatements = [
        {
          statement: `DELETE FROM ${SYS_INVENTORY_TABLE}
          WHERE trx_id=? AND trx_type=?`,
          values: [ 
            data.trx_id,
            data.trx_type
          ]
        }
      ]

      try {
        const res = await db.executeTransaction(transactionStatements);
      } catch (error) {
        throw error;
      }
    }
  
    return { success: true};
  } catch (error) {
    console.log(`deleteInventory ${error}`)
    throw error;
  }
};