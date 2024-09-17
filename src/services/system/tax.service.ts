import { DBConnectionService } from '../database.connection';
import { TAXES_TABLE} from '@/schema/tables';
import { TAX } from '@/models/tax.model';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}
export const getTaxes = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const taxServiceQuery = `SELECT * FROM ${TAXES_TABLE}`;
    
    const result = await db.query(taxServiceQuery);
   
    return { success: true, data: result.values as TAX[]};
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
    return { success: true, data: tax};
  } catch (error) {
    throw error;
  }
};

export const addTax = async () => {
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
        values: ['NA', 'NA', 0, false],
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
      throw new Error("UNIQUE constraint, Please Rename or Remove 'NA' Tax Code");
      
    } else {
      throw error
    }
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
    return { success: true};
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
        statement: `DELETE FROM ${TAXES_TABLE}
        WHERE id=?`,
        values: [ 
          id
        ]
      }
    ]
  
    const res = await db.executeTransaction(transactionStatements);
    return { success: true };
  } catch (error) {
    throw error;
  }
};