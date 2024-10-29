import { ITEMS_TABLE } from '@/schema/tables';
import { DBConnectionService } from '../database.connection';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}
export const getCategory = async ()  => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const categoryQuery = `SELECT DISTINCT ${ITEMS_TABLE}.category FROM ${ITEMS_TABLE}`;
    
    const result = await db.query(categoryQuery);
   
    return { success: true, data: result.values };
  } catch (error) {
    throw error;
  }
};
