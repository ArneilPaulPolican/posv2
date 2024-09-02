import { STOCK_IN } from '@/models/stock-in.model';
import { DBConnectionService } from '../database.connection';
import { ref } from 'vue';
import { STOCK_INS_TABLE } from '@/schema/tables';

// const db_connection = new DBConnectionService()
const data = ref<STOCK_IN[]>([])
interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getStockIn = async (): Promise<STOCK_IN[]> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const unitServiceQuery = `SELECT * FROM ${STOCK_INS_TABLE}`;
    const res = await db.query(unitServiceQuery);

    console.log('Res Values', JSON.stringify(res.values));
    return res.values as STOCK_IN[];
  } catch (error) {
    console.error('get stock-in error', error);
    throw error;
  } 
};


export const getStockInById = async (id:number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
      const query = `SELECT * FROM ${STOCK_INS_TABLE} WHERE id=?`;
      const params = [id];
  
      const result = await db.query(query, params);
      const stock_in = result.values?.map(stock_in => ({
        id: stock_in.id ?? 0,
        user_id: stock_in.user_id,
        in_number: stock_in.in_number,
        in_date: stock_in.in_date,
        remarks: stock_in.remarks ?? '',
        status: stock_in.status
      }))[0];
  
      console.log('Res Values', JSON.stringify(stock_in));
      return stock_in;
    } catch (error) {
      console.error('get stock-in error', error);
      throw error;
    } 
};


export const getLastINNumber = async (): Promise<string> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `SELECT in_number FROM ${STOCK_INS_TABLE} ORDER BY id DESC LIMIT 1`;
    const result = await db?.query(query);
    const lastinNumber =result?.values?.[0].in_number;
    console.log('lastinNumber',lastinNumber)
    return lastinNumber || '0000000000';
  } catch (error) {
    console.log(error)
    return '0000000000';
  }
}

export const addStockIn = async (data: STOCK_IN) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  let transaction;
  try {
    console.log('addStockIn ', data);
    
    const taxServiceQuery = 
    `
    INSERT INTO ${STOCK_INS_TABLE} (
      user_id,
      in_number,
      in_date,
      remarks,
      status
    ) VALUES (
      ?, ?, ?, ?, ?
    )
    `;

    const transactionStatements = [
      {
        statement: taxServiceQuery,
        values: [1, data.in_number, data.in_date, data.remarks, data.status],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
    const lastIdRes = await db.query(getLastIdQuery);
    let Id =  0;
    // const insertedId = lastIdRes.values?[0].values['lastId'];
    if (lastIdRes.values && lastIdRes.values.length > 0) {
      Id =  lastIdRes.values[0].lastId
      console.log('Inserted ID:', lastIdRes.values[0].lastId);
      
    } else {
      Id = 0;
      console.log('No inserted ID found');
    }
    console.log('add STOCK_INS_TABLE query results', res);
    return { success: true, insertedId: Id };
  } catch (error) {
    return { success: false, insertedId: 0 };
    console.log('add STOCK_INS_TABLE error:', error);
  }
};

export const updateStockIn = async (data: STOCK_IN) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${STOCK_INS_TABLE}
          SET remarks=?,
          status=?
        WHERE id=?
        `,
        values: [
          data.remarks,
          data.status,
          data.id,
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    console.log('add STOCK_INS_TABLE query results', res);
    return { success: true, insertedId: data.id };
  } catch (error) {
    return { success: false, insertedId: 0 };
    console.log('add STOCK_INS_TABLE error:', error);
  } 
};

  