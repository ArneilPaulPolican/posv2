import { DBConnectionService } from '../database.connection';
import { TABLES_TABLE, TAXES_TABLE} from '@/schema/tables';
import { TAX } from '@/models/tax.model';
import { TABLE } from '@/models/table.model';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}
export const getTables = async (page = 1, pageSize = 10, search_keyword = '')  => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const taxServiceQuery = `SELECT * FROM ${TABLES_TABLE}
    WHERE (
        ${TABLES_TABLE}.table_code LIKE '%${search_keyword}%' 
        OR ${TABLES_TABLE}.table_name LIKE '%${search_keyword}%' 
        OR ${TABLES_TABLE}.category LIKE '%${search_keyword}%' 
        OR ${TABLES_TABLE}.pax LIKE '%${search_keyword}%' 
      )
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `;
    
    const result = await db.query(taxServiceQuery);
   
    return { success: true, data: result.values as TABLE[] };
  } catch (error) {
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
    const table = result.values?.map(table => ({
      id: table.id,
      table_code: table.table_code,
      table_name: table.table_name,
      category: table.category,
      pax: table.pax,
      image_path: table.image_path,
      is_locked: table.is_locked,
    }))[0];
    return { success: true, data: table };
  } catch (error) {
    throw error;
  }
};

export const addTable = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();

  try {
    
    const taxServiceQuery = 
    `
    INSERT INTO ${TABLES_TABLE} (
      table_code,
      table_name,
      category,
      pax,
      image_path,
      is_locked
    ) VALUES (
      ?, ?, ?, ?, ? ,?
    )
    `;

    const transactionStatements = [
      {
        statement: taxServiceQuery,
        values: ['NA', 'NA', 'NA', 0,'', false],
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
    return { success: true, data: Id  };
  } catch (error) {
    console.log(error)
    throw error;
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
          image_path=?
        WHERE id=?
        `,
        values: [
          data.table_code,
          data.table_name,
          data.category,
          data.pax,
          data.image_path,
          data.id
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return { success: true };
  } catch (error) {
    throw error;
  } 
};

export const lockTable = async (data: TABLE) => {
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
          true,
          data.id
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return { success: true };
  } catch (error) {
    throw error;
  } 
};

export const unlockTable = async (data: TABLE) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${TABLES_TABLE}
          SET is_locked=?
        WHERE id=?
        `,
        values: [
          false,
          data.id
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return { success: true };
  } catch (error) {
    throw error;
  } 
};

export const deleteTable = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE FROM ${TABLES_TABLE}
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