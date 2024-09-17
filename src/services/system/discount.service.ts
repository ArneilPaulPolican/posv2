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

export const addDiscouunt = async () => {
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
          values: ['NA', 0, false, 
                'NA', false, ''],
        },
      ];
      const res = await db.executeTransaction(transactionStatements);
      const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
      const lastIdRes = await db.query(getLastIdQuery);
      let Id =  0;

      if (lastIdRes.values && lastIdRes.values.length > 0) {
        Id =  lastIdRes.values[0].lastId;
      } else {
        Id = 0;
      }
      return { success: true, data: Id };
    } catch (error:any) {
      // throw error;
      if (error.includes('UNIQUE constraint')) {
        throw new Error("UNIQUE constraint, Please Rename or Remove 'NA' Discount");
        
      } else {
        throw error
      }
    }
  };

  
export const updateDiscount = async (data: DISCOUNT) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${DISCOUNTS_TABLE}
          SET discount=?,
          discount_rate=?,
          vat_inclusive=?,
          particular=?,
          image_url=?
        WHERE id=?
        `,
        values: [
          data.discount,
          data.discount_rate,
          data.vat_inclusive,
          data.particular,
          data.image_url,
          data.id
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return {success: true};
  } catch (error) {
    throw error;
  } 
};

export const lockDiscount = async (data: DISCOUNT) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${DISCOUNTS_TABLE}
          SET discount=?,
          discount_rate=?,
          vat_inclusive=?,
          particular=?,
          is_locked=?,
          image_url=?
        WHERE id=?
        `,
        values: [
          data.discount,
          data.discount_rate,
          data.vat_inclusive,
          data.particular,
          true,
          data.image_url,
          data.id
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return {success: true};
  } catch (error) {
    throw error;
  } 
};

export const unlockDiscount = async (data: DISCOUNT) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${DISCOUNTS_TABLE}
          SET  is_locked=?
        WHERE id=?
        `,
        values: [
          true,
          data.id
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return {success: true};
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
          statement: `DELETE FROM ${DISCOUNTS_TABLE}
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