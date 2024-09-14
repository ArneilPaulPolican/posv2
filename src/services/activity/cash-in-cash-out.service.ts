import { CASH_IN_OUTS, CASH_IN_OUTS_DTO } from '@/models/cashin-cashout.model';
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

export const getCashInCashOut = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const unitServiceQuery = `SELECT * FROM ${CASH_IN_OUTS_TABLE}`;
    const res = await db.query(unitServiceQuery);

    return { success: true, data: res.values as CASH_IN_OUTS[]};
  } catch (error) {
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
        user: cashin_cashout.user,
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
        status: cashin_cashout.status,
        is_locked: cashin_cashout.is_locked
      }))[0];
      
      return { success: true, data: cashin_cashout };
    } catch (error) {
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
    
    let cash_incash_out_number = await lastNumber;
    const currentNumber = parseInt(cash_incash_out_number, 10);
    const nextNumber = currentNumber + 1;
    const formattedNextNumber = nextNumber.toString().padStart(10, '0');
    cash_incash_out_number = formattedNextNumber;
  
    return cash_incash_out_number;
  } catch (error) {
    return '0000000001';
  }
}
  

export const addNewCashInCashOut = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {

    const cash_in_out_number = await getLastNumber();
    const _date= new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
      });
    const taxServiceQuery = 
    `
    INSERT INTO ${CASH_IN_OUTS_TABLE} (
      user_id, cash_in_out_number, cash_in_out_date,
      amount, cash_1000, cash_500,
      cash_200, cash_100, cash_50,
      cash_20, cash_10, cash_5,
      cash_1, cash_dot_25, cash_dot_10,
      cash_dot_5, cash_dot_1, type,
      refund_reference_number, remarks, status
    ) VALUES (
      ?, ?, ?, 
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?
    )
    `;

    const transactionStatements = [
      {
        statement: taxServiceQuery,
        values: [
          1, cash_in_out_number, _date,
          0, 0, 0,
          0, 0, 0,
          0, 0, 0,
          0, 0, 0,
          0, 0, '',
          'NA', 'NA', 'NEW'
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
    const lastIdRes = await db.query(getLastIdQuery);
    let Id =  0;
    // const insertedId = lastIdRes.values?[0].values['lastId'];
    if (lastIdRes.values && lastIdRes.values.length > 0) {
      Id =  lastIdRes.values[0].lastId;
    } else {
      Id = 0;
    }
    return { success: true, data:  Id};
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const updateCashInCashOut = async (data: CASH_IN_OUTS_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${CASH_IN_OUTS_TABLE}
          SET 
          user_id=?, 
          amount=?, cash_1000=?, cash_500=?,
          cash_200=?, cash_100=?, cash_50=?,
          cash_20=?, cash_10=?, cash_5=?,
          cash_1=?, cash_dot_25=?, cash_dot_10=?,
          cash_dot_5=?, cash_dot_1=?, type=?,
          refund_reference_number=?, remarks=?, status=?
        WHERE id=?
        `,
        values: [
          1, 
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
    return { success: true };
  } catch (error) {
    throw error;
  } 
};

export const lockCashInCashOut = async (data: CASH_IN_OUTS_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${CASH_IN_OUTS_TABLE}
          SET 
          user_id=?, 
          amount=?, cash_1000=?, cash_500=?,
          cash_200=?, cash_100=?, cash_50=?,
          cash_20=?, cash_10=?, cash_5=?,
          cash_1=?, cash_dot_25=?, cash_dot_10=?,
          cash_dot_5=?, cash_dot_1=?, type=?,
          refund_reference_number=?, remarks=?, status=?,
          is_locked=?
        WHERE id=?
        `,
        values: [
          1, 
          data.amount, data.cash_1000, data.cash_500,
          data.cash_200, data.cash_100, data.cash_50,
          data.cash_20, data.cash_10, data.cash_5,
          data.cash_1, data.cash_dot_25, data.cash_dot_10,
          data.cash_dot_5, data.cash_dot_1, data.type,
          data.refund_reference_number, data.remarks, data.status,
          true, data.id,
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return { success: true };
  } catch (error) {
    throw error;
  } 
};

export const unlockCashInCashOut = async (data: CASH_IN_OUTS_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${CASH_IN_OUTS_TABLE}
          SET  is_locked=?
        WHERE id=?
        `,
        values: [
          false, data.id,
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return { success: true };
  } catch (error) {
    throw error;
  } 
};

export const deleteCashInCashOut = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `DELETE ${CASH_IN_OUTS_TABLE}
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