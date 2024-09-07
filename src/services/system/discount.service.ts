import { DISCOUNT } from '@/models/discount.model';
import { DBConnectionService } from '../database.connection';
import { DISCOUNTS_TABLE } from '@/schema/tables';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getDiscounts = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const discountServiceQuery = `SELECT * FROM ${DISCOUNTS_TABLE}`;
    
    const result = await db.query(discountServiceQuery);
   
    return { success: true, data: result.values as DISCOUNT[]};
  } catch (error) {
    throw error;
  }
};

export const getDiscountById = async (id: number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
      const query = `SELECT * FROM ${DISCOUNTS_TABLE} WHERE id=?`;
      const params = [id];
  
      
      const result = await db.query(query, params);
      const discount = result.values?.map(discount => ({
        id: discount.id,
        discount: discount.discount,
        discount_rate: discount.discount_rate,
        vat_inclusive: discount.vat_inclusive,
        particular: discount.particular,
        is_locked: discount.is_locked,
        image_url: discount.image_url
      }))[0];
      return { success: true, data: discount};
    } catch (error) {
      throw error;
    }
};

export const addDiscouunt = async (data: DISCOUNT) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    let transaction;
    try {
      const taxServiceQuery = 
      `
      INSERT INTO ${DISCOUNTS_TABLE} (
        discount,        discount_rate,        vat_inclusive,
        particular,        is_locked,        image_url
      ) VALUES (
        ?, ?, ?, 
        ?, ?, ?
      )
      `;
  
      const transactionStatements = [
        {
          statement: taxServiceQuery,
          values: [data.discount, data.discount_rate, data.vat_inclusive, 
                data.particular, data.is_locked, data.image_url],
        },
      ];
      const res = await db.executeTransaction(transactionStatements);
      return { success: true};
    } catch (error) {
      throw error;
    }
  };

  export const deleteDiscount = async (id: number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
    
      const transactionStatements = [
        {
          statement: `DELETE ${DISCOUNTS_TABLE}
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