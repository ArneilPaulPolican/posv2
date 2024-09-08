import ITEM_DTO from "@/models/item.model";
import { DBConnectionService } from "../services/database.connection";
import { ITEMS_TABLE, SALES_ITEMS_TABLE, STOCK_IN_ITEMS_TABLE, STOCK_INS_TABLE, STOCK_OUT_ITEMS_TABLE } from "@/schema/tables";
import { SALES_ITEM_DTO } from "@/models/sales-item.model";
import { ref } from "vue";

export const onLockUpdateItemInventory = async (trx:string, id:number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
  
    try {
        let selectQuery = ``;
        const params = [id];
        let items: any;
        switch (trx) {
            case 'SI':
                selectQuery = `SELECT 
                ${SALES_ITEMS_TABLE}.id,
                ${SALES_ITEMS_TABLE}.sales_id,
                ${SALES_ITEMS_TABLE}.unit_id,
                ${SALES_ITEMS_TABLE}.quantity,
                ${SALES_ITEMS_TABLE}.price,
                ${ITEMS_TABLE}.cost,
                ${ITEMS_TABLE}.quantity as onhand,
                ${ITEMS_TABLE}.is_inventory
                FROM ${SALES_ITEMS_TABLE}
                LEFT JOIN ${ITEMS_TABLE} ON ${SALES_ITEMS_TABLE}.item_id = ${ITEMS_TABLE}.id
                WHERE ${SALES_ITEMS_TABLE}.sales_id=?`;
                
                const params = [id];
                
                const result = await db.query(selectQuery, params);
                result.values ;
                items = result.values;
                break;
            case 'IN':
                selectQuery = `SELECT 
                    ${STOCK_IN_ITEMS_TABLE}.id,
                    ${STOCK_IN_ITEMS_TABLE}.sales_id,
                    ${STOCK_IN_ITEMS_TABLE}.unit_id,
                    ${STOCK_IN_ITEMS_TABLE}.quantity,
                    ${ITEMS_TABLE}.price,
                    ${STOCK_IN_ITEMS_TABLE}.cost,
                    ${ITEMS_TABLE}.quantity as onhand,
                    ${ITEMS_TABLE}.is_inventory
                    FROM ${STOCK_IN_ITEMS_TABLE}
                    LEFT JOIN ${ITEMS_TABLE} ON ${STOCK_IN_ITEMS_TABLE}.item_id = ${ITEMS_TABLE}.id
                    WHERE ${STOCK_IN_ITEMS_TABLE}.in_id=?`;
                break;
            case 'OUT':
                selectQuery = `SELECT 
                    ${STOCK_OUT_ITEMS_TABLE}.id,
                    ${STOCK_OUT_ITEMS_TABLE}.sales_id,
                    ${STOCK_OUT_ITEMS_TABLE}.unit_id,
                    ${STOCK_OUT_ITEMS_TABLE}.quantity,
                    ${ITEMS_TABLE}.price,
                    ${STOCK_OUT_ITEMS_TABLE}.cost,
                    ${ITEMS_TABLE}.quantity as onhand,
                    ${ITEMS_TABLE}.is_inventory
                    FROM ${STOCK_OUT_ITEMS_TABLE}
                    LEFT JOIN ${ITEMS_TABLE} ON ${STOCK_OUT_ITEMS_TABLE}.item_id = ${ITEMS_TABLE}.id
                    WHERE ${STOCK_OUT_ITEMS_TABLE}.in_id=?`;
                break;
            default:
        }
        if(items){
            for (const element of items) {
                if(element.is_inventory){
                    console.log(element)
                    let qty = 0;
                    if(trx == 'SI' || 'OUT') qty = element.onhand - element.quantity;
                    if(trx == 'IN') qty = element.onhand + element.quantity;
                    const transactionStatements = [
                    {
                        statement: `
                        UPDATE ${ITEMS_TABLE} SET
                        price = ?,
                        cost = ?,
                        quantity = ?,
                        is_inventory = ?
                        WHERE id = ?
                        `,
                        values: [
                        element.price,
                        element.cost,
                        qty,
                        element.is_inventory,
                        element.id,
                        ],
                    },
                    ];
                    // Execute the transaction
                    await db.executeTransaction(transactionStatements);
                }
            }
        }
      return true;
    } catch (error) {
        console.log(error)
        throw error;
    }
};


export const onUnlockUpdateItemInventory = async (trx:string, id:number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
  
    try {
        let selectQuery = ``;
        const params = [id];
        let items: any;
        switch (trx) {
            case 'SI':
                selectQuery = `SELECT 
                ${SALES_ITEMS_TABLE}.id,
                ${SALES_ITEMS_TABLE}.sales_id,
                ${SALES_ITEMS_TABLE}.unit_id,
                ${SALES_ITEMS_TABLE}.quantity,
                ${SALES_ITEMS_TABLE}.price,
                ${ITEMS_TABLE}.cost,
                ${ITEMS_TABLE}.quantity as onhand,
                ${ITEMS_TABLE}.is_inventory
                FROM ${SALES_ITEMS_TABLE}
                LEFT JOIN ${ITEMS_TABLE} ON ${SALES_ITEMS_TABLE}.item_id = ${ITEMS_TABLE}.id
                WHERE ${SALES_ITEMS_TABLE}.sales_id=?`;
                
                const params = [id];
                
                const result = await db.query(selectQuery, params);
                result.values ;
                items = result.values;
                break;
            case 'IN':
                selectQuery = `SELECT 
                    ${STOCK_IN_ITEMS_TABLE}.id,
                    ${STOCK_IN_ITEMS_TABLE}.sales_id,
                    ${STOCK_IN_ITEMS_TABLE}.unit_id,
                    ${STOCK_IN_ITEMS_TABLE}.quantity,
                    ${ITEMS_TABLE}.price,
                    ${STOCK_IN_ITEMS_TABLE}.cost,
                    ${ITEMS_TABLE}.quantity as onhand,
                    ${ITEMS_TABLE}.is_inventory
                    FROM ${STOCK_IN_ITEMS_TABLE}
                    LEFT JOIN ${ITEMS_TABLE} ON ${STOCK_IN_ITEMS_TABLE}.item_id = ${ITEMS_TABLE}.id
                    WHERE ${STOCK_IN_ITEMS_TABLE}.in_id=?`;
                break;
            case 'OUT':
                selectQuery = `SELECT 
                    ${STOCK_OUT_ITEMS_TABLE}.id,
                    ${STOCK_OUT_ITEMS_TABLE}.sales_id,
                    ${STOCK_OUT_ITEMS_TABLE}.unit_id,
                    ${STOCK_OUT_ITEMS_TABLE}.quantity,
                    ${ITEMS_TABLE}.price,
                    ${STOCK_OUT_ITEMS_TABLE}.cost,
                    ${ITEMS_TABLE}.quantity as onhand,
                    ${ITEMS_TABLE}.is_inventory
                    FROM ${STOCK_OUT_ITEMS_TABLE}
                    LEFT JOIN ${ITEMS_TABLE} ON ${STOCK_OUT_ITEMS_TABLE}.item_id = ${ITEMS_TABLE}.id
                    WHERE ${STOCK_OUT_ITEMS_TABLE}.in_id=?`;
                break;
            default:
        }
        if(items){
            for (const element of items) {
                if(element.is_inventory){
                    console.log(element)
                    let qty = 0;
                    if(trx == 'SI' || 'OUT') qty = element.onhand + element.quantity;
                    if(trx == 'IN') qty = element.onhand - element.quantity;
                    const transactionStatements = [
                    {
                        statement: `
                        UPDATE ${ITEMS_TABLE} SET
                        price = ?,
                        cost = ?,
                        quantity = ?,
                        is_inventory = ?
                        WHERE id = ?
                        `,
                        values: [
                        element.price,
                        element.cost,
                        qty,
                        element.is_inventory,
                        element.id,
                        ],
                    },
                    ];
                    // Execute the transaction
                    await db.executeTransaction(transactionStatements);
                }
            }
        }
      return true;
    } catch (error) {
        console.log(error)
        throw error;
    }
};