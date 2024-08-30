import { DBConnectionService } from '../database.connection';
import { UNITS_TABLE } from '@/schema/tables';
import { ref } from 'vue';
import { UNIT } from '@/models/unit.model';

// const db_connection = new DBConnectionService()
const data = ref<UNIT[]>([])
interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getUnits = async (): Promise<UNIT[]> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const unitServiceQuery = `SELECT * FROM ${UNITS_TABLE}`;
    const res = await db.query(unitServiceQuery);

    console.log('Res Values', JSON.stringify(res.values));
    return res.values as UNIT[];
  } catch (error) {
    console.error('get units error', error);
    throw error;
  } 
};


export const getUnitsById = async (id:number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const query = `SELECT * FROM ${UNITS_TABLE} WHERE id=?`;
    const params = [id];

    const result = await db.query(query, params);
    const unit = result.values?.map(unit => ({
      id: unit.id,
      unit_code: unit.unit_code,
      unit: unit.unit,
    }))[0];

    console.log('Res Values', JSON.stringify(unit));
    return unit;
  } catch (error) {
    console.error('get units error', error);
    throw error;
  } 
};

export const addUnit = async (data: UNIT) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const unitServiceQuery = `
      INSERT INTO ${UNITS_TABLE} (
        unit_code,
        unit
      ) VALUES (?, ?)
    `;
    
    const transactionStatements = [
      {
        statement: unitServiceQuery,
        values: [data.unit_code, data.unit],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    console.log('add unit query results', res);
    return true;
  } catch (error) {
    console.log('add unit error:', error);
  }
};

export const updateUnit = async (data: UNIT) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const transactionStatements = [
      {
        statement: `
        UPDATE ${UNITS_TABLE}
          SET unit_code=?,
          unit=?
        WHERE id=?
        `,
        values: [
          data.unit_code,
          data.unit,
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
