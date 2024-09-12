import { STOCK_IN_ITEMS, STOCK_IN_ITEMS_DTO } from "@/models/stock-in-item.model";
import { DBConnectionService } from "../database.connection";
import { ITEMS_TABLE, STOCK_IN_ITEMS_TABLE, STOCK_INS_TABLE, UNITS_TABLE, USERS_TABLE } from "@/schema/tables";

export const getStockInItemsByINId = async (id: number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        if (!db) {
            throw new Error('Database connection not open');
        }
        const selectQuery = 
        `SELECT ${STOCK_IN_ITEMS_TABLE}.id,
                ${STOCK_IN_ITEMS_TABLE}.in_id,
                ${STOCK_IN_ITEMS_TABLE}.quantity,
                ${STOCK_IN_ITEMS_TABLE}.cost,
                ${STOCK_IN_ITEMS_TABLE}.amount,
                ${STOCK_IN_ITEMS_TABLE}.particulars,
                ${STOCK_IN_ITEMS_TABLE}.item_id,
                ${ITEMS_TABLE}.image_path AS item_image_path,
                ${ITEMS_TABLE}.item_code,
                ${ITEMS_TABLE}.bar_code as item_barcode,
                ${ITEMS_TABLE}.item_description,
                ${STOCK_IN_ITEMS_TABLE}.unit_id,
                ${UNITS_TABLE}.unit_code,
                ${UNITS_TABLE}.unit,
                ${USERS_TABLE}.first_name || ' ' || ${USERS_TABLE}.last_name AS user_full_name
         FROM ${STOCK_IN_ITEMS_TABLE}
         LEFT JOIN ${STOCK_INS_TABLE}
         ON ${STOCK_IN_ITEMS_TABLE}.in_id=${STOCK_INS_TABLE}.id
         LEFT JOIN ${USERS_TABLE}
         ON ${STOCK_INS_TABLE}.user_id=${USERS_TABLE}.id
         LEFT JOIN ${ITEMS_TABLE}
         ON ${STOCK_IN_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
         LEFT JOIN ${UNITS_TABLE}
         ON ${ITEMS_TABLE}.unit_id=${UNITS_TABLE}.id
         WHERE ${STOCK_IN_ITEMS_TABLE}.in_id=?
        `;
        const params = [id];
        const result = await db.query(selectQuery,params);
     
      return { success: true, data: result.values as STOCK_IN_ITEMS_DTO[] };
    } catch (error) {
      throw error;
    }
};

export const getStockInItemsById = async (id: number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        if (!db) {
            throw new Error('Database connection not open');
        }
        const selectQuery = 
        `SELECT ${STOCK_IN_ITEMS_TABLE}.id,
                ${STOCK_IN_ITEMS_TABLE}.in_id,
                ${STOCK_IN_ITEMS_TABLE}.date_time,
                ${STOCK_IN_ITEMS_TABLE}.quantity,
                ${STOCK_IN_ITEMS_TABLE}.cost,
                ${STOCK_IN_ITEMS_TABLE}.amount,
                ${STOCK_IN_ITEMS_TABLE}.particulars,
                ${STOCK_IN_ITEMS_TABLE}.item_id,
                ${ITEMS_TABLE}.image_path AS item_image_path,
                ${ITEMS_TABLE}.item_code,
                ${ITEMS_TABLE}.bar_code as item_barcode,
                ${ITEMS_TABLE}.item_description,
                ${STOCK_IN_ITEMS_TABLE}.unit_id,
                ${UNITS_TABLE}.unit_code,
                ${UNITS_TABLE}.unit,
                ${USERS_TABLE}.first_name || ' ' || ${USERS_TABLE}.last_name AS user_full_name
         FROM ${STOCK_IN_ITEMS_TABLE}
         LEFT JOIN ${STOCK_INS_TABLE}
         ON ${STOCK_IN_ITEMS_TABLE}.in_id=${STOCK_INS_TABLE}.id
         LEFT JOIN ${USERS_TABLE}
         ON ${STOCK_INS_TABLE}.user_id=${USERS_TABLE}.id
         LEFT JOIN ${ITEMS_TABLE}
         ON ${STOCK_IN_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
         LEFT JOIN ${UNITS_TABLE}
         ON ${ITEMS_TABLE}.unit_id=${UNITS_TABLE}.id
         WHERE ${STOCK_IN_ITEMS_TABLE}.id=?
         `;
         const params = [id];
         const result = await db.query(selectQuery,params);
         const stockin_items = result.values?.map(stockin_item => ({
            id: stockin_item.id,
            in_id: stockin_item.in_id,
            date_time: stockin_item.date_time,
            item_id: stockin_item.item_id,
            item_code: stockin_item.item_code,
            item_barcode: stockin_item.item_barcode,
            item_description: stockin_item.item_description,
            item_image_path: stockin_item.item_image_path,
            unit_id: stockin_item.unit_id,
            unit_code: stockin_item.unit_code,
            unit: stockin_item.unit,
            quantity: stockin_item.quantity,
            cost: stockin_item.cost,
            amount: stockin_item.amount,
            particulars: stockin_item.particulars,
          }))[0];
        return { success: true, data: stockin_items };
    } catch (error) {
      throw error;
    }
};

export const addBulkStockInItem = async (stock_in_id:number, data: STOCK_IN_ITEMS[])=> {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
  
    try {
        console.log(stock_in_id, data);
        
        for (const item of data) {
            const query =
            `
            INSERT INTO ${STOCK_IN_ITEMS_TABLE} (
              in_id,
              item_id,
              unit_id,
              quantity,
              cost,
              amount,
              particulars
            ) VALUES (
              ?, ?, ?,
              ?, ?, ?,
              ?
            )`;
            const values = [
                stock_in_id,
                item.item_id,
                item.unit_id,
                item.quantity,
                item.cost,
                item.amount,
                item.particulars,
            ];
            
            try {
                const res = await db.query(query, values);
            } catch (error) {
                throw error;
            }
        }
        console.log(`success`)
        return { success: true };
    } catch (error) {
        throw error;
    }
}

export const updateBulkStockInItem = async ( data: STOCK_IN_ITEMS[])=> {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
  
    try {
        for (const item of data) {
            const transactionStatements = [
                {
                    statement: `UPDATE  ${STOCK_IN_ITEMS_TABLE} 
                    SET
                      item_id =?,
                      unit_id =?,
                      quantity =?,
                      cost =?,
                      amount =?,
                      particulars
                    WHERE id=?`,
                    values: [
                        item.item_id,
                        item.unit_id,
                        item.quantity,
                        item.cost,
                        item.amount,
                        item.particulars,
                    ]
                }
            ]
            const res = await db.executeTransaction(transactionStatements);
        }
        return { success: true };
    } catch (error) {
        throw error;
    }
}

export const updateStockInItem = async ( data: STOCK_IN_ITEMS_DTO)=> {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        const transactionStatements = [
            {
                statement: `UPDATE  ${STOCK_IN_ITEMS_TABLE} 
                SET unit_id =?,
                    quantity =?,
                    cost =?,
                    amount =?,
                    particulars =?
                WHERE id=?`,
                values: [
                    data.unit_id,
                    data.quantity,
                    data.cost,
                    data.amount,
                    data.particulars,
                    data.id
                ]
            }
        ]
        const res = await db.executeTransaction(transactionStatements);
        return { success: true };
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const deleteStockInItem = async (id: number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
    
      const transactionStatements = [
        {
          statement: `DELETE FROM ${STOCK_IN_ITEMS_TABLE}
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