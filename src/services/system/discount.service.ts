import { DISCOUNT } from '@/models/discount.model';
import { DBConnectionService } from '../database.connection';
import { DISCOUNTS_TABLE } from '@/schema/tables';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getDiscounts = async (): Promise<DISCOUNT[]> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const discountServiceQuery = `SELECT * FROM ${DISCOUNTS_TABLE}`;
    
    const result = await db.query(discountServiceQuery);
   
    await presentToast('Res Values', JSON.stringify(result.values));
    return result.values as DISCOUNT[];
  } catch (error) {
    await presentToast('get discounts error');
    await presentToast(error);
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
      await presentToast('Res Values', JSON.stringify(result.values));
      const discount = result.values?.map(discount => ({
        id: discount.id,
        discount: discount.discount,
        discount_rate: discount.discount_rate,
        vat_inclusive: discount.vat_inclusive,
        particular: discount.particular,
        is_locked: discount.is_locked,
        image_url: discount.image_url
      }))[0];
      await presentToast('discount', JSON.stringify(discount));
      return discount;
      
    } catch (error) {
      await presentToast('get taxes error');
      await presentToast(error);
      throw error;
    }
};

export const addDiscouunt = async (data: DISCOUNT) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    let transaction;
    try {
      await presentToast('DATA ', data);
      
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
      await presentToast('add discount query results', res);
      return true;
    } catch (error) {
      await presentToast('add discount error:', error);
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
      await presentToast('cancel query response ', res)
      // return true,Id;
      return { success: true};
    } catch (error) {
      return { success: false};
    }
  };