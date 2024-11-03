import { CUSTOMERS_TABLE, ITEMS_TABLE } from '@/schema/tables';
import { DBConnectionService } from '../database.connection';


export const getCategory = async ()  => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const categoryQuery = `SELECT DISTINCT ${CUSTOMERS_TABLE}.category 
    FROM ${CUSTOMERS_TABLE}
    ORDER BY ${CUSTOMERS_TABLE}.category DESC`;
    
    const result = await db.query(categoryQuery)  ;
   console.log('Servicces',result.values)
    return { 
      success: true, 
      data: result.values ? result.values.map((row: any) => ({ category: row.category })) : [] 
    };
  } catch (error) {
    throw error;
  }
};
