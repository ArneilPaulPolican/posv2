import { STOCK_OUT } from '@/models/stock-out.model';
import { DBConnectionService } from '../database.connection';
import { ref } from 'vue';
import { STOCK_OUTS_TABLE } from '@/schema/tables';

// const db_connection = new DBConnectionService()
const data = ref<STOCK_OUT[]>([])
interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getStockOut = async (): Promise<STOCK_OUT[]> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const unitServiceQuery = `SELECT * FROM ${STOCK_OUTS_TABLE}`;
    const res = await db.query(unitServiceQuery);

    return res.values as STOCK_OUT[];
  } catch (error) {
    await presentToast('get stock-in error', error);
    throw error;
  } 
};


export const getStockOutById = async (id:number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
      const query = `SELECT * FROM ${STOCK_OUTS_TABLE} WHERE id=?`;
      const params = [id];
  
      const result = await db.query(query, params);
      const stock_in = result.values?.map(stock_in => ({
        id: stock_in.id,
        user_id: stock_in.user_id,
        out_number: stock_in.in_number,
        out_date: stock_in.in_date,
        remarks: stock_in.remarks,
        status: stock_in.status
      }))[0];
  
      return stock_in;
    } catch (error) {
      await presentToast('get stock-in error', error);
      throw error;
    } 
};


export const getLastOTNumber = async (): Promise<string> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `SELECT out_number FROM ${STOCK_OUTS_TABLE} ORDER BY id DESC LIMIT 1`;
    const result = await db?.query(query);
    const lastOutNumber =result?.values?.[0].out_number;
    return lastOutNumber || '0000000000';
  } catch (error) {
    return '0000000000';
  }
}
  

export const addStockOut = async (data: STOCK_OUT) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  let transaction;
  try {
    
    const taxServiceQuery = 
    `
    INSERT INTO ${STOCK_OUTS_TABLE} (
      user_id,
      out_number,
      out_date,
      remarks,
      status
    ) VALUES (
      ?, ?, ?, ?, ?
    )
    `;

    const transactionStatements = [
      {
        statement: taxServiceQuery,
        values: [1, data.out_number, data.out_date, data.remarks, data.status],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
    const lastIdRes = await db.query(getLastIdQuery);
    let Id =  0;
    // const insertedId = lastIdRes.values?[0].values['lastId'];
    if (lastIdRes.values && lastIdRes.values.length > 0) {
      Id =  lastIdRes.values[0].lastId      
    } else {
      Id = 0;
    }

    return { success: true, insertedId: Id };
  } catch (error) {
    return { success: false, insertedId: 0 };
  }
};

export const updateStockOut = async (data: STOCK_OUT) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${STOCK_OUTS_TABLE}
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
    return { success: true, insertedId: data.id };
  } catch (error) {
    return { success: false, insertedId: 0 };
  } 
};

  
export const deleteStockOut = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE ${STOCK_OUTS_TABLE}
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