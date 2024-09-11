import { DBConnectionService } from '../database.connection';
import { COLLECTIONS_TABLE, CUSTOMERS_TABLE, DISCOUNTS_TABLE, ITEMS_TABLE, SALES_ITEMS_TABLE, SALES_TABLE, TABLE_GROUP_LINES_TABLE, TABLES_TABLE, TAXES_TABLE, UNITS_TABLE, USERS_TABLE } from '@/schema/tables';
import { ref } from 'vue';
import { SALES, SALES_DTO } from '@/models/sales.model';
import { CUSTOMER } from '@/models/customer.model';
import USER from '@/models/user.model';
import { SALES_ITEM, SALES_ITEM_DTO } from '@/models/sales-item.model';

// const db_connection = new DBConnectionService()
const data = ref<SALES_ITEM[]>([])
interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getSalesItemBySalesId = async (sales_id:number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        if (!db) {
            throw new Error('Database connection not open');
        }
      
        const saleServiceQuery = 
        `SELECT ${SALES_ITEMS_TABLE}.id,
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
                ${SALES_ITEMS_TABLE}.particulars,
                ${SALES_ITEMS_TABLE}.user_id
          FROM ${SALES_ITEMS_TABLE}
          LEFT JOIN ${ITEMS_TABLE}
          ON ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
          LEFT JOIN ${UNITS_TABLE}
          ON ${ITEMS_TABLE}.unit_id=${UNITS_TABLE}.id
          LEFT JOIN ${TAXES_TABLE}
          ON ${SALES_ITEMS_TABLE}.tax_id=${TAXES_TABLE}.id
          LEFT JOIN ${DISCOUNTS_TABLE}
          ON ${SALES_ITEMS_TABLE}.discount_id=${DISCOUNTS_TABLE}.id
          WHERE ${SALES_ITEMS_TABLE}.sales_id=?`;
        const params = [sales_id];
        
        const result = await db.query(saleServiceQuery,params);
     
      return result.values as SALES_ITEM_DTO[];
    } catch (error) {
      throw error;
    }
};

export const getSalesItemById = async (id:number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
      if (!db) {
          throw new Error('Database connection not open');
      }
    
      const saleServiceQuery = 
      `SELECT 
        ${SALES_ITEMS_TABLE}.id,
        ${SALES_ITEMS_TABLE}.sales_id,
        ${SALES_ITEMS_TABLE}.date_time,
        ${SALES_ITEMS_TABLE}.item_id,
        ${ITEMS_TABLE}.item_code,
        ${ITEMS_TABLE}.bar_code as item_barcode,
        ${ITEMS_TABLE}.item_description,
        ${ITEMS_TABLE}.image_path as item_image_path,
        ${ITEMS_TABLE}.category as item_category,
        ${ITEMS_TABLE}.is_inventory,
        ${ITEMS_TABLE}.is_vat_inclusive,
        ${SALES_ITEMS_TABLE}.unit_id,
        ${UNITS_TABLE}.unit_code,
        ${UNITS_TABLE}.unit,
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
        ${SALES_ITEMS_TABLE}.particulars,
        ${SALES_ITEMS_TABLE}.user_id
      FROM ${SALES_ITEMS_TABLE}
      LEFT JOIN ${ITEMS_TABLE} ON ${SALES_ITEMS_TABLE}.item_id = ${ITEMS_TABLE}.id
      LEFT JOIN ${UNITS_TABLE} ON ${SALES_ITEMS_TABLE}.unit_id = ${UNITS_TABLE}.id
      LEFT JOIN ${TAXES_TABLE} ON ${SALES_ITEMS_TABLE}.tax_id = ${TAXES_TABLE}.id
      LEFT JOIN ${DISCOUNTS_TABLE} ON ${SALES_ITEMS_TABLE}.discount_id=${DISCOUNTS_TABLE}.id
      WHERE ${SALES_ITEMS_TABLE}.id=?`;
      const params = [id];
      
      const result = await db.query(saleServiceQuery,params);
      const sales_item = result.values?.map(sales_item => ({
        id: sales_item.id,
        sales_id: sales_item.sales_id,
        date_time: sales_item.date_time,
        item_id: sales_item.item_id,
        item_code: sales_item?.item_code || '',
        item_barcode: sales_item?.item_barcode || '',
        item_description: sales_item?.item_description || '',
        item_alias: sales_item?.item_alias || '',
        item_category: sales_item?.item_category || '',
        item_cost: sales_item?.item_cost || 0,
        is_vat_inclusive: sales_item?.is_vat_inclusive || 0,
        unit_id: sales_item.unit_id,
        unit: sales_item.unit,
        unit_code: sales_item.unit_code,
        quantity: sales_item.quantity,
        price: sales_item.price,
        discount_id: sales_item.discount_id,
        discount: sales_item.discount,
        discount_rate: sales_item.discount_rate,
        discount_amount: sales_item.discount_amount,
        net_price: sales_item.net_price,
        amount: sales_item.amount,
        tax_id: sales_item.tax_id,
        tax: sales_item.tax,
        tax_code: sales_item.tax_code,
        tax_rate: sales_item.tax_rate,
        tax_amount: sales_item.tax_amount,
        particulars: sales_item.particulars,
        user_id: sales_item.user_id,
        user: '',
      }))[0];
   
    return sales_item;
  } catch (error) {
    throw error;
  }
};

export const addBulkSalesItem = async(sales_id:number, data: SALES_ITEM_DTO[]) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        for (const item of data) {
            const query = `
              INSERT INTO ${SALES_ITEMS_TABLE} (
                sales_id, item_id, unit_id, 
                quantity, price, net_price,
                discount_id, discount_rate, discount_amount,
                net_price, amount, tax_id,
                tax_rate, tax_amount, particulars,
                user_id
              ) VALUES (
                ?, ?, ?,
                ?, ?, ?, 
                ?, ?, ?, 
                ?, ?, ?, 
                ?, ?, ?,
                ? 
              )
            `;
            const values = [
              sales_id, item.item_id, item.unit_id, 
              item.quantity, item.price, item.net_price,
              item.discount_id, item.discount_rate, item.discount_amount,
              item.net_price, item.amount, item.tax_id,
              item.tax_rate, item.tax_amount, item.particulars,
              item.user_id
            ];
          
          
            try {
              const res = await db.query(query, values);
            } catch (error) {
              throw error;
            }
          }
    } catch (error) {
      throw error;
    }
}

export const updatebULKSalesItem = async (items: SALES_ITEM_DTO[]) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    for (const data of items) {
      
      const transactionStatements = [
        {
          statement: `UPDATE ${SALES_ITEMS_TABLE}
            SET unit_id=?,
            quantity=?,
            price=?,
            discount_id=?,
            discount_rate=?,
            discount_amount=?,
            net_price=?,
            amount=?,
            tax_id=?,
            tax_rate=?,
            tax_amount=?,
            particulars =?
          WHERE id=?`,
          values: [
            data.unit_id,
            data.quantity,
            data.price,
            data.discount_id,
            data.discount_rate,
            data.discount_amount,
            data.net_price,
            data.amount,
            data.tax_id,
            data.tax_rate,
            data.tax_amount,
            data.particulars,
            data.id
          ]
        }
      ]
      const res = await db.executeTransaction(transactionStatements);
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateSalesItem = async (data: SALES_ITEM_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `UPDATE ${SALES_ITEMS_TABLE}
          SET unit_id=?,
          quantity=?,
          price=?,
          discount_id=?,
          discount_rate=?,
          discount_amount=?,
          net_price=?,
          amount=?,
          tax_id=?,
          tax_rate=?,
          tax_amount=?,
          particulars =?
        WHERE id=?`,
        values: [
          data.unit_id,
          data.quantity,
          data.price,
          data.discount_id,
          data.discount_rate,
          data.discount_amount,
          data.net_price,
          data.amount,
          data.tax_id,
          data.tax_rate,
          data.tax_amount,
          data.particulars,
          data.id
        ]
      }
    ]
    const res = await db.executeTransaction(transactionStatements);
    return { success: true, insertedId: data.id };
  } catch (error) {
    // return { success: false, insertedId: 0 };
    throw error;
  }
};


export const deleteSalesItem = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE FROM ${SALES_ITEMS_TABLE}
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
    // return { success: false};
    throw error;
  }
};