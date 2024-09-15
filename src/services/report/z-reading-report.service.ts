import { COLLECTIONS_TABLE, CUSTOMERS_TABLE, DISCOUNTS_TABLE, ITEMS_TABLE, SALES_ITEMS_TABLE, SALES_TABLE, TAXES_TABLE, UNITS_TABLE, USERS_TABLE, Z_READINGS_TABLE } from "@/schema/tables";
import { DBConnectionService } from "../database.connection";
import { Z_READINGS } from "@/models/z-reading.model";
import { SALES_DETAILS_REPORT_DTO } from "@/models/sales-detail-report.model";

export const getZReding = async (z_read_date:string) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        
        const selectQuery = `
            SELECT 
                ${COLLECTIONS_TABLE}.id,
                ${COLLECTIONS_TABLE}.ci_date,
                ${COLLECTIONS_TABLE}.ci_number,
                ${COLLECTIONS_TABLE}.customer_id,
                ${COLLECTIONS_TABLE}.total_amount,
                ${CUSTOMERS_TABLE}.customer_code,
                ${CUSTOMERS_TABLE}.customer,
                ${CUSTOMERS_TABLE}.address AS customer_address,
                ${CUSTOMERS_TABLE}.tin AS customer_tin,
                ${COLLECTIONS_TABLE}.user_id,
                ${USERS_TABLE}.first_name || ' ' || ${USERS_TABLE}.last_name AS full_name,
                ${COLLECTIONS_TABLE}.is_locked,
                ${SALES_TABLE}.sales_number,
                ${SALES_TABLE}.sales_date,
                ${SALES_TABLE}.total_amount AS sales_total_amount,
                ${SALES_TABLE}.balance_amount,
                ${SALES_TABLE}.paid_amount,
                ${SALES_TABLE}.discount_id,
                ${SALES_TABLE}.discount_rate,
                ${SALES_TABLE}.discount_amount,
                ${SALES_TABLE}.net_amount,
                ${SALES_TABLE}.no_of_pax,
                ${SALES_TABLE}.remarks,
                ${SALES_TABLE}.status
            FROM 
                ${COLLECTIONS_TABLE}
                LEFT JOIN ${USERS_TABLE}
                ON ${COLLECTIONS_TABLE}.user_id = ${USERS_TABLE}.id
                LEFT JOIN ${CUSTOMERS_TABLE}
                ON ${COLLECTIONS_TABLE}.customer_id = ${CUSTOMERS_TABLE}.id
                LEFT JOIN ${SALES_TABLE}
                ON ${COLLECTIONS_TABLE}.sales_id = ${SALES_TABLE}.id
            WHERE 
                ${COLLECTIONS_TABLE}.ci_date=?
            GROUP BY 
                ${COLLECTIONS_TABLE}.id
            ORDER BY 
                ${COLLECTIONS_TABLE}.ci_number DESC
        `;
        const params = [z_read_date]
        const result = await db.query(selectQuery, params);
        console.log(result.values)
        return { success: true, data: result.values };
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getCollectionForZRead = async (z_read_date:string) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {

    const selectQuery = `
        SELECT ${COLLECTIONS_TABLE}.id,
            ${COLLECTIONS_TABLE}.ci_date,
            ${COLLECTIONS_TABLE}.ci_number,
            ${COLLECTIONS_TABLE}.customer_id,
            ${COLLECTIONS_TABLE}.sales_id,
            ${COLLECTIONS_TABLE}.total_amount,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${COLLECTIONS_TABLE}.is_locked
        FROM ${COLLECTIONS_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${COLLECTIONS_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${COLLECTIONS_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        WHERE ${COLLECTIONS_TABLE}.ci_date = ? AND ${COLLECTIONS_TABLE}.is_locked = 1
        GROUP BY ${COLLECTIONS_TABLE}.id
        ORDER BY ${COLLECTIONS_TABLE}.ci_number DESC
        `;
        const params = [z_read_date]
        const result = await db.query(selectQuery, params);
        console.log(result.values)

        return { success: true, data: result.values };
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getSalesForZRead = async (id:string) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
          throw new Error('Database connection not open');
      }
      const saleServiceQuery = `SELECT 
            ${SALES_ITEMS_TABLE}.id,
            ${SALES_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' || ${USERS_TABLE}.last_name AS full_name,
            ${SALES_TABLE}.sales_number,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.terminal_number,
            ${SALES_TABLE}.customer_id,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${SALES_TABLE}.total_amount,
            ${SALES_TABLE}.balance_amount,
            ${SALES_TABLE}.paid_amount,
            ${SALES_TABLE}.discount_amount,
            ${SALES_TABLE}.remarks,
            ${SALES_TABLE}.status,
        
            ${SALES_ITEMS_TABLE}.sales_id,
            ${SALES_ITEMS_TABLE}.date_time,
            ${SALES_ITEMS_TABLE}.item_id,
            ${ITEMS_TABLE}.quantity as onhand,
            ${ITEMS_TABLE}.item_code,
            ${ITEMS_TABLE}.bar_code as item_barcode,
            ${ITEMS_TABLE}.item_description,
            ${ITEMS_TABLE}.image_path as item_image_path,
            ${ITEMS_TABLE}.category as item_category,
            ${ITEMS_TABLE}.is_inventory,
            ${ITEMS_TABLE}.is_vat_inclusive,
            ${SALES_ITEMS_TABLE}.unit_id,
            ${UNITS_TABLE}.unit_code,
            ${SALES_ITEMS_TABLE}.quantity,
            ${SALES_ITEMS_TABLE}.price,
            ${SALES_ITEMS_TABLE}.discount_id,
            ${DISCOUNTS_TABLE}.discount,
            ${SALES_ITEMS_TABLE}.discount_rate,
            ${SALES_ITEMS_TABLE}.discount_amount,
            ${SALES_ITEMS_TABLE}.net_price,
            ${SALES_ITEMS_TABLE}.amount,
            ${SALES_ITEMS_TABLE}.tax_id,
            ${SALES_ITEMS_TABLE}.tax_rate,
            ${SALES_ITEMS_TABLE}.tax_amount,
            ${TAXES_TABLE}.tax,
            ${TAXES_TABLE}.tax_code,
            ${TAXES_TABLE}.is_inclusive,
            ${SALES_ITEMS_TABLE}.particulars
        FROM 
            ${SALES_ITEMS_TABLE}
        LEFT JOIN 
            ${ITEMS_TABLE}
        ON 
            ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN 
            ${UNITS_TABLE}
        ON 
            ${ITEMS_TABLE}.unit_id=${UNITS_TABLE}.id
        LEFT JOIN 
            ${TAXES_TABLE}
        ON 
            ${SALES_ITEMS_TABLE}.tax_id=${TAXES_TABLE}.id
        LEFT JOIN 
            ${DISCOUNTS_TABLE}
        ON 
            ${SALES_ITEMS_TABLE}.discount_id=${DISCOUNTS_TABLE}.id
        LEFT JOIN 
            ${SALES_TABLE}
        ON 
            ${SALES_ITEMS_TABLE}.sales_id=${SALES_TABLE}.id
        LEFT JOIN 
            ${CUSTOMERS_TABLE}
        ON 
            ${SALES_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        LEFT JOIN 
            ${USERS_TABLE}
        ON 
            ${SALES_TABLE}.user_id=${USERS_TABLE}.id
        WHERE 
            ${SALES_TABLE}.id = ?`;

        const params = [id];
        
        const result = await db.query(saleServiceQuery,params);
        return { success: true, data: result.values as SALES_DETAILS_REPORT_DTO[] }
    } catch (error) {
      throw error;
    }
}

export const getPreviousReading = async () => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {

        const query = `SELECT * 
                FROM ${Z_READINGS_TABLE} 
                ORDER BY id DESC 
                LIMIT 1`;


        const result = await db.query(query);
        const data = (result.values ?? [])[0] as Z_READINGS;
        if (!data) {
          return { success: false, message: 'No previous reading found' };
        }
        return { success: true, data: data };
    } catch (error) {
        throw error;
    }
}