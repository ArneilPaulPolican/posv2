import { PAYTYPE } from '@/models/paytype.model';
import { DBConnectionService } from '../database.connection';
import { PAYTYPES_TABLE } from '@/schema/tables';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}
export const getPaytypes = async (): Promise<PAYTYPE[]> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const taxServiceQuery = `SELECT * FROM ${PAYTYPES_TABLE}`;
    
    const result = await db.query(taxServiceQuery);
   
    return result.values as PAYTYPE[];
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
    return paytype;
    
  } catch (error) {
    throw error;
  }
};

export const addPaytype = async (data: PAYTYPE) => {
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
        values: [data.paytype, data.is_default_value],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateTax = async (data: PAYTYPE) => {
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
    return true;
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
        statement: `DELETE ${PAYTYPES_TABLE}
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