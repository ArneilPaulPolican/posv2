import { DBConnectionService } from '../database.connection';
import { TAXES_TABLE} from '@/schema/tables';
import { TAX } from '@/models/tax.model';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}
export const getTaxes = async (): Promise<TAX[]> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const taxServiceQuery = `SELECT * FROM ${TAXES_TABLE}`;
    
    const result = await db.query(taxServiceQuery);
   
    console.log('Res Values', JSON.stringify(result.values));
    return result.values as TAX[];
  } catch (error) {
    console.log('get taxes error');
    console.log(error);
    throw error;
  }
};

export const getTaxesById = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const query = `SELECT * FROM ${TAXES_TABLE} WHERE id=?`;
    const params = [id];

    
    const result = await db.query(query, params);
    console.log('Res Values', JSON.stringify(result.values));
    const tax = result.values?.map(tax => ({
      id: tax.id,
      tax_code: tax.tax_code,
      tax: tax.tax,
      rate: tax.rate,
      is_inclusive: tax.is_inclusive,
    }))[0];
    console.log('tax', JSON.stringify(tax));
    return tax;
    
  } catch (error) {
    console.log('get taxes error');
    console.log(error);
    throw error;
  }
};

export const addTax = async (data: TAX) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  let transaction;
  try {
    console.log('DATA ', data);
    
    const taxServiceQuery = 
    `
    INSERT INTO ${TAXES_TABLE} (
      tax_code,
      tax,
      rate,
      is_inclusive
    ) VALUES (
      ?, ?, ?, ?
    )
    `;

    const transactionStatements = [
      {
        statement: taxServiceQuery,
        values: [data.tax_code, data.tax, data.rate, data.is_inclusive],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    console.log('add tax query results', res);
    return true;
  } catch (error) {
    console.log('add tax error:', error);
  }
};

export const updateTax = async (data: TAX) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${TAXES_TABLE}
          SET tax_code=?,
          tax=?,
          rate=?,
          is_inclusive=?
        WHERE id=?
        `,
        values: [
          data.tax_code,
          data.tax,
          data.rate,
          data.is_inclusive,
          data.id,
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    console.log('add tax query results', res);
    return true;
  } catch (error) {
    console.log('add tax error:', error);
  } 
};