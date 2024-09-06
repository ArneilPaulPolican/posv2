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
   
    return result.values as TAX[];
  } catch (error) {
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
    const tax = result.values?.map(tax => ({
      id: tax.id,
      tax_code: tax.tax_code,
      tax: tax.tax,
      rate: tax.rate,
      is_inclusive: tax.is_inclusive,
    }))[0];
    return tax;
    
  } catch (error) {
    throw error;
  }
};

export const addTax = async (data: TAX) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  let transaction;
  try {
    
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
    return true;
  } catch (error) {
    throw error;
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
    return true;
  } catch (error) {
    throw error;
  } 
};

export const deleteTax = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE ${TAXES_TABLE}
        WHERE id=?`,
        values: [ 
          id
        ]
      }
    ]
  
    const res = await db.executeTransaction(transactionStatements);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};