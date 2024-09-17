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

export const getStockOut = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const unitServiceQuery = `SELECT * FROM ${STOCK_OUTS_TABLE}`;
    const res = await db.query(unitServiceQuery);

    return { success: true, data: res.values as STOCK_OUT[] };
  } catch (error) {
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
      const stock_out = result.values?.map(stock_out => ({
        id: stock_out.id,
        user_id: stock_out.user_id,
        out_number: stock_out.out_number,
        out_date: stock_out.out_date,
        remarks: stock_out.remarks,
        status: stock_out.status,
        is_locked: stock_out.is_locked
      }))[0];
  
      return { success: true, data: stock_out };
    } catch (error) {
      throw error;
    } 
};


export const getOUTNumber = async (): Promise<string> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `SELECT out_number FROM ${STOCK_OUTS_TABLE} ORDER BY id DESC LIMIT 1`;
    const result = await db?.query(query);
    console.log(result)

    let out_number = await result?.values?.[0].out_number;
    console.log(out_number)

    const currentNumber = parseInt(out_number, 10);
    const nextNumber = currentNumber + 1;
    const formattedNextNumber = nextNumber.toString().padStart(10, '0');
    out_number = formattedNextNumber;

    return out_number || '0000000001';
  } catch (error) {
    console.log(error)
    return '0000000001';
  }
}
  

export const addStockOut = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  let transaction;
  try {
    const out_number = await getOUTNumber();
    console.log(out_number)
    const out_date = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'});
    
    const taxServiceQuery = 
    `
    INSERT INTO ${STOCK_OUTS_TABLE} (
      user_id,
      out_number,
      out_date,
      remarks,
      status,
      is_locked
    ) VALUES (
      ?, ?, ?, ?, ?, ?
    )
    `;

    const transactionStatements = [
      {
        statement: taxServiceQuery,
        values: [1, out_number, out_date, 'NA', 'NEW', false],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
    const lastIdRes = await db.query(getLastIdQuery);
    let Id =  0;
    if (lastIdRes.values && lastIdRes.values.length > 0) {
      Id =  lastIdRes.values[0].lastId      
    } else {
      Id = 0;
    }

    return { success: true, data: Id };
  } catch (error) {
    throw error;
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
    return { success: true };
  } catch (error) {
    throw error;
  } 
};

export const lockStockOut = async (data: STOCK_OUT) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${STOCK_OUTS_TABLE}
          SET remarks=?,
          is_locked =?,
          status=?
        WHERE id=?
        `,
        values: [
          data.remarks,
          true,
          data.status,
          data.id,
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return { success: true };
  } catch (error) {
    throw error;
  } 
};


export const unlockStockOut = async (data: STOCK_OUT) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${STOCK_OUTS_TABLE}
        SET is_locked =?
        WHERE id=?
        `,
        values: [
          false,
          data.id,
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return { success: true };
  } catch (error) {
    throw error;
  } 
};
  
export const deleteStockOut = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE FROM ${STOCK_OUTS_TABLE}
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