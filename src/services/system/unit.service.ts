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

export const getUnits = async (page = 1, pageSize = 10, search_keyword = '') => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const unitServiceQuery = `SELECT * FROM ${UNITS_TABLE}
    WHERE (
      ${UNITS_TABLE}.unit_code LIKE '%${search_keyword}%' 
      OR ${UNITS_TABLE}.unit LIKE '%${search_keyword}%' 
    )
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
    const res = await db.query(unitServiceQuery);

    return { success: true, data: res.values as UNIT[]};
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

    return { success: true, data: unit};
  } catch (error) {
    throw error;
  } 
};

export const addUnit = async () => {
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
        values: ['NA', 'NA'],
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
      throw new Error("UNIQUE constraint, Please Rename or Remove 'NA' Unit Code");
      
    } else {
      throw error
    }
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
    return { success: true};
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
        statement: `DELETE FROM ${UNITS_TABLE}
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