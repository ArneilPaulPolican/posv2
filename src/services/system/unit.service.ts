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

    return res.values as UNIT[];
  } catch (error) {
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

    return unit;
  } catch (error) {
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
    return true;
  } catch (error) {
    throw new Error("Add unit error", );
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
    return true;
  } catch (error) {
    throw error;
  }
};

export const deleteUnit = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE ${UNITS_TABLE}
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