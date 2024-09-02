import { CASH_IN_OUTS } from '@/models/cashin-cashout.model';
import { DBConnectionService } from '../database.connection';
import { ref } from 'vue';
import { CASH_IN_OUTS_TABLE } from '@/schema/tables';

// const db_connection = new DBConnectionService()
const data = ref<CASH_IN_OUTS[]>([])
interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getCashInCashOut = async (): Promise<CASH_IN_OUTS[]> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const unitServiceQuery = `SELECT * FROM ${CASH_IN_OUTS_TABLE}`;
    const res = await db.query(unitServiceQuery);

    console.log('Res Values', JSON.stringify(res.values));
    return res.values as CASH_IN_OUTS[];
  } catch (error) {
    console.error('get cashin cashout error', error);
    throw error;
  } 
};


export const getCashInCashOutById = async (id:number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
      const query = `SELECT * FROM ${CASH_IN_OUTS_TABLE} WHERE id=?`;
      const params = [id];
  
      const result = await db.query(query, params);
      const cashin_cashout = result.values?.map(cashin_cashout => ({
        id: cashin_cashout.id,
        user_id: cashin_cashout.user_id,
        cash_in_out_number: cashin_cashout.cash_in_out_number,
        cash_in_out_date: cashin_cashout.cash_in_out_date,
        amount: cashin_cashout.amount,
        cash_1000: cashin_cashout.cash_1000,
        cash_500: cashin_cashout.cash_500,
        cash_200: cashin_cashout.cash_200,
        cash_100: cashin_cashout.cash_100,
        cash_50: cashin_cashout.cash_50,
        cash_20: cashin_cashout.cash_20,
        cash_10: cashin_cashout.cash_10,
        cash_5: cashin_cashout.cash_5,
        cash_1: cashin_cashout.cash_1,
        cash_dot_25: cashin_cashout.cash_dot_25,
        cash_dot_10: cashin_cashout.cash_dot_10,
        cash_dot_5: cashin_cashout.cash_dot_5,
        cash_dot_1: cashin_cashout.cash_dot_1,
        type: cashin_cashout.type,
        refund_reference_number: cashin_cashout.refund_reference_number,
        remarks: cashin_cashout.remarks,
        status: cashin_cashout.status
      }))[0];
  
      console.log('Res Values', JSON.stringify(cashin_cashout));
      return cashin_cashout;
    } catch (error) {
      console.error('get cashin cashout error', error);
      throw error;
    } 
};


export const getLastNumber = async (): Promise<string> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `SELECT cash_in_out_number FROM ${CASH_IN_OUTS_TABLE} ORDER BY id DESC LIMIT 1`;
    const result = await db?.query(query);
    const lastNumber =result?.values?.[0].cash_in_out_number;
    console.log('cash_in_out_number ',lastNumber)
    return lastNumber || '0000000001';
  } catch (error) {
    console.log(error)
    return '0000000001';
  }
}
  

export const addCashInCashOut = async (data: CASH_IN_OUTS) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  let transaction;
  try {
    console.log('DATA ', data);
    
    const taxServiceQuery = 
    `
    INSERT INTO ${CASH_IN_OUTS_TABLE} (
      user_id, cash_in_out_number, cash_in_out_date,
      amount, cash_1000, cash_500,
      cash_200, cash_100, cash_50,
      cash_20, cash_10, cash_5,
      cash_1, cash_dot_25, cash_dot_10,
      cash_dot_5, cash_dot_1, type,
      refund_reference_number, remarks, status, 
    ) VALUES (
      ?, ?, ?, 
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
    )
    `;

    const transactionStatements = [
      {
        statement: taxServiceQuery,
        values: [
          1, data.cash_in_out_number, data.cash_in_out_date,
          data.amount, data.cash_1000, data.cash_500,
          data.cash_200, data.cash_100, data.cash_50,
          data.cash_20, data.cash_10, data.cash_5,
          data.cash_1, data.cash_dot_25, data.cash_dot_10,
          data.cash_dot_5, data.cash_dot_1, data.type,
          data.refund_reference_number, data.remarks, data.status
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    console.log('add STOCK_OUTS_TABLE query results', res);
    return true;
  } catch (error) {
    console.log('add STOCK_OUTS_TABLE error:', error);
  }
};

export const updateCashInCashOut = async (data: CASH_IN_OUTS) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${CASH_IN_OUTS_TABLE}
          SET 
          user_id=?, cash_in_out_number=?, cash_in_out_date=?,
          amount=?, cash_1000=?, cash_500=?,
          cash_200=?, cash_100=?, cash_50=?,
          cash_20=?, cash_10=?, cash_5=?,
          cash_1=?, cash_dot_25=?, cash_dot_10=?,
          cash_dot_5=?, cash_dot_1=?, type=?,
          refund_reference_number, remarks=?, status=?
        WHERE id=?
        `,
        values: [
          1, data.cash_in_out_number, data.cash_in_out_date,
          data.amount, data.cash_1000, data.cash_500,
          data.cash_200, data.cash_100, data.cash_50,
          data.cash_20, data.cash_10, data.cash_5,
          data.cash_1, data.cash_dot_25, data.cash_dot_10,
          data.cash_dot_5, data.cash_dot_1, data.type,
          data.refund_reference_number, data.remarks, data.status,
          data.id,
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    console.log('add STOCK_OUTS_TABLE query results', res);
    return true;
  } catch (error) {
    console.log('add STOCK_OUTS_TABLE error:', error);
  } 
};

  