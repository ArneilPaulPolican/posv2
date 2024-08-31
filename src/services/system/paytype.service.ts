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
   
    console.log('Res Values', JSON.stringify(result.values));
    return result.values as PAYTYPE[];
  } catch (error) {
    console.log('get paytype error');
    console.log(error);
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
    console.log('Res Values', JSON.stringify(result.values));
    const paytype = result.values?.map(paytype => ({
      id: paytype.id,
      paytype: paytype.paytype,
      is_default_value: paytype.is_default_value,
    }))[0];
    console.log('paytype', JSON.stringify(paytype));
    return paytype;
    
  } catch (error) {
    console.log('get paytype error');
    console.log(error);
    throw error;
  }
};

export const addPaytype = async (data: PAYTYPE) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  let transaction;
  try {
    console.log('DATA ', data);
    
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
    console.log('add paytype query results', res);
    return true;
  } catch (error) {
    console.log('add paytype error:', error);
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
    console.log('add paytype query results', res);
    return true;
  } catch (error) {
    console.log('add tax error:', error);
  } 
};
