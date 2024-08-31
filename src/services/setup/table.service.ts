import { DBConnectionService } from '../database.connection';
import { TABLES_TABLE, TAXES_TABLE} from '@/schema/tables';
import { TAX } from '@/models/tax.model';
import { TABLE } from '@/models/table.model';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}
export const getTables = async (): Promise<TABLE[]> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const taxServiceQuery = `SELECT * FROM ${TABLES_TABLE}`;
    
    const result = await db.query(taxServiceQuery);
   
    console.log('Res Values', JSON.stringify(result.values));
    return result.values as TABLE[];
  } catch (error) {
    console.log('get tables error');
    console.log(error);
    throw error;
  }
};

export const getTableById = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const query = `SELECT * FROM ${TABLES_TABLE} WHERE id=?`;
    const params = [id];

    
    const result = await db.query(query, params);
    console.log('Res Values', JSON.stringify(result.values));
    const table = result.values?.map(table => ({
      id: table.id,
      table_code: table.table_code,
      table_name: table.table_name,
      category: table.category,
      pax: table.pax,
      image_path: table.image_path,
      is_locked: table.is_locked,
    }))[0];
    console.log('table', JSON.stringify(table));
    return table;
    
  } catch (error) {
    console.log('get table error');
    console.log(error);
    throw error;
  }
};

export const addTable = async (data: TABLE) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  let transaction;
  try {
    console.log('DATA ', data);
    
    const taxServiceQuery = 
    `
    INSERT INTO ${TABLES_TABLE} (
      table_code,
      table_name,
      category,
      pax,
      image_path,
      is_locked,
    ) VALUES (
      ?, ?, ?, ?, ? ,?
    )
    `;

    const transactionStatements = [
      {
        statement: taxServiceQuery,
        values: [data.table_code, data.table_name, data.category, data.is_locked],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    console.log('add table query results', res);
    return true;
  } catch (error) {
    console.log('add table error:', error);
  }
};

export const updateTable = async (data: TABLE) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${TABLES_TABLE}
          SET table_code=?,
          table_name=?,
          category=?,
          pax=?,
          image_path=?,
          is_locked=?
        WHERE id=?
        `,
        values: [
          data.table_code,
          data.table_name,
          data.category,
          data.pax,
          data.image_path,
          data.is_locked,
          data.id
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    console.log('add table query results', res);
    return true;
  } catch (error) {
    console.log('add table error:', error);
  } 
};
