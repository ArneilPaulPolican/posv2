import { PAYTYPE } from '@/models/paytype.model';
import { DBConnectionService } from '../database.connection';
import { PAYTYPES_TABLE } from '@/schema/tables';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}
export const getPaytypes = async (page = 1, pageSize = 10, search_keyword = '') => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const taxServiceQuery = `SELECT * FROM ${PAYTYPES_TABLE}
    WHERE (
      ${PAYTYPES_TABLE}.paytype LIKE '%${search_keyword}%' 
    )
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
    
    const result = await db.query(taxServiceQuery);
    
    return { success: true, data: result.values as PAYTYPE[]};
  } catch (error) {
    throw error;
  }
};

export const getPaytypesById = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const query = `SELECT * FROM ${PAYTYPES_TABLE} WHERE id=?`;
    const params = [id];

    
    const result = await db.query(query, params);
    const paytype = result.values?.map(paytype => ({
      id: paytype.id,
      paytype: paytype.paytype,
      is_default_value: paytype.is_default_value,
    }))[0];
    return {success:true, data:paytype};
  } catch (error) {
    throw error;
  }
};

export const addNewPaytype = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  let transaction;
  try {
    const taxServiceQuery = 
    `
    INSERT INTO ${PAYTYPES_TABLE} (
      paytype,
      is_default_value
    ) VALUES (
      ?, ?
    )
    `;

    const transactionStatements = [
      {
        statement: taxServiceQuery,
        values: ['NA', false],
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
  } catch (error: any) {
    if (error.includes('UNIQUE constraint')) {
      throw new Error("UNIQUE constraint, Please Rename or Remove 'NA' Paytype");
      
    } else {
      throw error
    }
  }
};

export const updatePaytype = async (data: PAYTYPE) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${PAYTYPES_TABLE}
          SET paytype=?,
          is_default_value=?
        WHERE id=?
        `,
        values: [
          data.paytype,
          data.is_default_value,
          data.id,
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return {success: true};
  } catch (error) {
    throw error;
  } 
};

export const deletePaytype = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE FROM ${PAYTYPES_TABLE}
        WHERE id=?`,
        values: [ 
          id
        ]
      }
    ]
  
    const res = await db.executeTransaction(transactionStatements);
    return { success: true};
  } catch (error) {
    return { success: false};
  }
};