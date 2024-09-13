import ITEM_DTO from "@/models/item.model";
import { DBConnectionService } from "../services/database.connection";
import { ITEMS_TABLE, SALES_ITEMS_TABLE, STOCK_IN_ITEMS_TABLE, STOCK_INS_TABLE, STOCK_OUT_ITEMS_TABLE } from "@/schema/tables";
import { SALES_ITEM_DTO } from "@/models/sales-item.model";
import { ref } from "vue";
import { addBulkInventory, addInventory, deleteInventory, updateItemInventory } from "@/services/sys-inventory.service";
import { SYS_INVENTORY } from "@/models/sys-inventory.model";
import { getSalesItemBySalesId } from "@/services/activity/sales-item.service";

export const onLockRecordInventory = async (items:any[], id:number, trx:string, trx_date:string, trx_ref:string) => {
    try {
        if(items){
            console.log(`items ${JSON.stringify(items)}`)
            const sys_inventory = <SYS_INVENTORY[]>([]);
            items.forEach((element) => {
                if(element.is_inventory){
                    let quantity = 0;
                    if(trx == 'SI') quantity = 0 - element.quantity;
                    if(trx == 'OUT') quantity = 0 - element.quantity; 
                    if(trx == 'IN') quantity = element.quantity; 
                    console.log(`trx ${trx} date ${trx_date} number ${trx_ref}`);
                    sys_inventory.push({
                        id:0,
                        trx_id: id,
                        trx_date: trx_date,
                        trx_type: trx,
                        reference: trx_ref,
                        item_id: element.item_id,
                        unit_id: element.unit_id,
                        quantity: quantity,
                        end_quantity: 0,
                        cost: element.cost ?? 0,
                        price: element.price ?? 0,
                    })
                }
            });
                
            console.log(sys_inventory)
            await addBulkInventory(sys_inventory);

            const duplicatedItems: any[] = [];
            const sysInventoryValues = [...sys_inventory.values()];
            sysInventoryValues.forEach((row) => {
                if (duplicatedItems[row.item_id]) {
                    duplicatedItems[row.item_id].quantity += row.quantity;
                } else {
                    duplicatedItems[row.item_id] = row;
                }
            });
            const filteredResults = Object.values(duplicatedItems);

            filteredResults.forEach(async (item) => {
                try {
                    await updateItemInventory(item.item_id, item.unit_id);
                } catch (error) {
                    console.log(error)
                    throw error;
                }
            });

        }
        return { success: true };
    } catch (error) {
        throw error;
    }
}

export const onUnlockUpdateItemInventory = async (trx:string, id:number, trx_date:string, trx_ref:string) => {
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
                ${SALES_ITEMS_TABLE}.item_id,
                ${SALES_ITEMS_TABLE}.sales_id as trx_id,
                'SI' as trx_type,
                ${SALES_ITEMS_TABLE}.unit_id,
                ${SALES_ITEMS_TABLE}.quantity,
                ${SALES_ITEMS_TABLE}.price,
                ${ITEMS_TABLE}.cost,
                ${ITEMS_TABLE}.quantity as onhand,
                ${ITEMS_TABLE}.is_inventory,
                ${ITEMS_TABLE}.item_description
                FROM ${SALES_ITEMS_TABLE}
                LEFT JOIN ${ITEMS_TABLE} ON ${SALES_ITEMS_TABLE}.item_id = ${ITEMS_TABLE}.id
                WHERE ${SALES_ITEMS_TABLE}.sales_id=?`;
                break;
            case 'IN':
                selectQuery = `SELECT 
                    ${STOCK_IN_ITEMS_TABLE}.id,
                    ${STOCK_IN_ITEMS_TABLE}.item_id,
                    ${STOCK_IN_ITEMS_TABLE}.in_id as trx_id,
                    'IN' as trx_type,
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
                    ${STOCK_OUT_ITEMS_TABLE}.out_id as trx_id,
                    'OUT' as trx_type,
                    ${STOCK_OUT_ITEMS_TABLE}.unit_id,
                    ${STOCK_OUT_ITEMS_TABLE}.quantity,
                    ${ITEMS_TABLE}.price,
                    ${STOCK_OUT_ITEMS_TABLE}.cost,
                    ${ITEMS_TABLE}.quantity as onhand,
                    ${ITEMS_TABLE}.is_inventory
                    FROM ${STOCK_OUT_ITEMS_TABLE}
                    LEFT JOIN ${ITEMS_TABLE} ON ${STOCK_OUT_ITEMS_TABLE}.item_id = ${ITEMS_TABLE}.id
                    WHERE ${STOCK_OUT_ITEMS_TABLE}.out_id=?`;
                break;
            default:
        }
                
        const result = await db.query(selectQuery, params);
        if (result.values) {
            items = result.values;
        } else {
            items = [];
        }
        
        if(items){
            const sys_inventory = <SYS_INVENTORY[]>([]);
            for (const element of items ) {
                if(element.is_inventory){
                    sys_inventory.push({
                        id:0,
                        trx_id: element.trx_id,
                        trx_date: trx_date,
                        trx_type: element.trx_type,
                        reference: trx_ref,
                        item_id: element.item_id,
                        unit_id: element.unit_id,
                        quantity: element.quantity,
                        end_quantity: element.end_quantity,
                        cost: element.cost,
                        price: element.price,
                    })
                }
            }
            console.log(sys_inventory)
            await deleteInventory(sys_inventory);

            const duplicatedItems: any[] = [];
            const sysInventoryValues = [...sys_inventory.values()];
            sysInventoryValues.forEach((row) => {
                if (duplicatedItems[row.item_id]) {
                    duplicatedItems[row.item_id].quantity += row.quantity;
                } else {
                    duplicatedItems[row.item_id] = row;
                }
            });
            const filteredResults = Object.values(duplicatedItems);

            filteredResults.forEach(async (item) => {
                // update the quantity of each item based on the unlock transaction
                try {
                    await updateItemInventory(item.item_id, item.unit_id);
                } catch (error) {
                    console.log(`updateItemInventory ${error}`)
                    throw error;
                }
            });

        }
        console.log(`update succesfully`)
        return { success: true };
    } catch (error) {
        console.log(error)
        throw error;
    }
};
