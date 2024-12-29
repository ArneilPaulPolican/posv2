import { DBConnectionService } from '../database.connection';
import { COLLECTIONS_LINES_TABLE,  PAYTYPES_TABLE, SALES_TABLE, USERS_TABLE } from '@/schema/tables';
import { ref, toRaw } from 'vue';
import USER from '@/models/user.model';
import { COLLECTIONS_LINES_DTO } from '@/models/collection-lines.model';

// const db_connection = new DBConnectionService()
const data = ref<COLLECTIONS_LINES_DTO[]>([])
interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getCollectionLineByCollectionId = async (id:number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
        const selectQuery = `
        SELECT ${COLLECTIONS_LINES_TABLE}.id,
            ${COLLECTIONS_LINES_TABLE}.collection_id,
            ${COLLECTIONS_LINES_TABLE}.particulars,
            ${COLLECTIONS_LINES_TABLE}.amount,
            ${COLLECTIONS_LINES_TABLE}.change,
            ${COLLECTIONS_LINES_TABLE}.paytype_id,
            ${PAYTYPES_TABLE}.paytype,
            ${PAYTYPES_TABLE}.is_default_value,
            ${COLLECTIONS_LINES_TABLE}.sales_id,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.sales_number
        FROM ${COLLECTIONS_LINES_TABLE}
        LEFT JOIN ${PAYTYPES_TABLE}
        ON ${COLLECTIONS_LINES_TABLE}.paytype_id=${PAYTYPES_TABLE}.id
        LEFT JOIN ${SALES_TABLE}
        ON ${COLLECTIONS_LINES_TABLE}.sales_id=${SALES_TABLE}.id
        WHERE ${COLLECTIONS_LINES_TABLE}.collection_id=?`;
        const params = [id];

      const result = await db.query(selectQuery,params);
     
        return { success: true, data: result.values as COLLECTIONS_LINES_DTO[] };
      
    } catch (error) {
      throw error;
    }
};

export const getCollectionLineById = async (id:number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
        const selectQuery = `
        SELECT ${COLLECTIONS_LINES_TABLE}.id,
            ${COLLECTIONS_LINES_TABLE}.collection_id,
            ${COLLECTIONS_LINES_TABLE}.particulars,
            ${COLLECTIONS_LINES_TABLE}.amount,
            ${COLLECTIONS_LINES_TABLE}.change,
            ${COLLECTIONS_LINES_TABLE}.paytype_id,
            ${PAYTYPES_TABLE}.paytype,
            ${PAYTYPES_TABLE}.is_default_value,
            ${COLLECTIONS_LINES_TABLE}.sales_id,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.sales_number
        FROM ${COLLECTIONS_LINES_TABLE}
        LEFT JOIN ${PAYTYPES_TABLE}
        ON ${COLLECTIONS_LINES_TABLE}.user_id=${PAYTYPES_TABLE}.id
        LEFT JOIN ${SALES_TABLE}
        ON ${COLLECTIONS_LINES_TABLE}.sales_id=${SALES_TABLE}.id
        WHERE ${COLLECTIONS_LINES_TABLE}.id=?`;
        const params = [id];

        const result = await db.query(selectQuery,params);
        const collection_line = result.values?.map(collection_line => ({
            id: collection_line.id,
            collection_line: collection_line.collection_line,
            paytype_id: collection_line.paytype_id,
            paytype: collection_line.paytype,
            is_default_value: collection_line.is_default_value,
            particulars: collection_line.particulars,
            amount: collection_line.amount,
            change: collection_line.change
          }))[0];

        return { success: true, data: collection_line};
      
    } catch (error) {
      throw error;
    }
};

export const getCollectionLineBySalesId = async (sales_id:number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }
      const selectQuery = `
      SELECT ${COLLECTIONS_LINES_TABLE}.id,
          ${COLLECTIONS_LINES_TABLE}.collection_id,
          ${COLLECTIONS_LINES_TABLE}.particulars,
          ${COLLECTIONS_LINES_TABLE}.amount,
          ${COLLECTIONS_LINES_TABLE}.change,
          ${COLLECTIONS_LINES_TABLE}.paytype_id,
          ${PAYTYPES_TABLE}.paytype,
          ${PAYTYPES_TABLE}.is_default_value,
          ${COLLECTIONS_LINES_TABLE}.sales_id,
          ${SALES_TABLE}.sales_date,
          ${SALES_TABLE}.sales_number
      FROM ${COLLECTIONS_LINES_TABLE}
      LEFT JOIN ${PAYTYPES_TABLE}
      ON ${COLLECTIONS_LINES_TABLE}.user_id=${PAYTYPES_TABLE}.id
      LEFT JOIN ${SALES_TABLE}
      ON ${COLLECTIONS_LINES_TABLE}.sales_id=${SALES_TABLE}.id
      WHERE ${COLLECTIONS_LINES_TABLE}.id=?`;
      const params = [sales_id];

      const result = await db.query(selectQuery,params);
      const collection_line = result.values?.map(collection_line => ({
          id: collection_line.id,
          collection_line: collection_line.collection_line,
          paytype_id: collection_line.paytype_id,
          paytype: collection_line.paytype,
          is_default_value: collection_line.is_default_value,
          particulars: collection_line.particulars,
          amount: collection_line.amount,
          change: collection_line.change
        }))[0];

      return { success: true, data: collection_line};
    
  } catch (error) {
    throw error;
  }
};

export const addCollectionLine = async (data: COLLECTIONS_LINES_DTO) => {
    
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        const query =
        `INSERT INTO ${COLLECTIONS_LINES_TABLE} (
            collection_id,
            paytype_id,
            particulars,
            amount,
            change,
            sales_id
        ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )`
        const transactionStatements = [
            {
              statement: query,
              values: [
                data.collection_id,
                data.paytype_id,
                data.particulars,
                data.amount,
                data.particulars,
                data.sales_id
              ],
            },
        ];
          
        const res = await db.executeTransaction(transactionStatements );

        return { success: true};
    } catch (error) {
        throw error;
    }
};


export const updateCollectionLine = async (data: COLLECTIONS_LINES_DTO) => {
    
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        const query =
        `UPDATE ${COLLECTIONS_LINES_TABLE} 
        SET
            paytype_id,
            particulars,
            amount,
            change
        WHERE id=?`
        const transactionStatements = [
            {
              statement: query,
              values: [
                data.paytype_id,
                data.particulars,
                data.amount,
                data.particulars,
                data.id
              ],
            },
        ];
          
        const res = await db.executeTransaction(transactionStatements );

        return { success: true};
    } catch (error) {
        throw error;
    }
};

export const deleteCollectionLine = async (id: number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
  
      const transactionStatements = [
        {
          statement: `DELETE ${COLLECTIONS_LINES_TABLE}
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
