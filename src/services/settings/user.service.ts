import { DBConnectionService } from '../database.connection';
import {  USERS_TABLE} from '@/schema/tables';
import USER from '@/models/user.model';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}
export const getUsers = async (): Promise<USER[]> => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }
    const taxServiceQuery = `SELECT * FROM ${USERS_TABLE}`;
    
    const result = await db.query(taxServiceQuery);
   
    console.log('Res Values', JSON.stringify(result.values));
    return result.values as USER[];
  } catch (error) {
    console.log('get taxes error');
    console.log(error);
    throw error;
  }
};


export const getUserById = async () => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
      const query = `SELECT * FROM ${USERS_TABLE} LIMIT 1`;
    //   const params = [id];
  
      
      const result = await db.query(query);
      console.log('Res Values', JSON.stringify(result.values));
      const user = result.values?.map(user => ({
        id: user.id,
        fullname: user.first_name + ' ' +user.last_name,
        last_name: user.last_name,
        first_name: user.first_name,
        email: user.email,
        user_type: user.user_type,
      }))[0];
      console.log('user', JSON.stringify(user));
      return user;
      
    } catch (error) {
      console.log('get users error');
      console.log(error);
      throw error;
    }
  };
  
  export const updateUser = async (data: USER) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      const transactionStatements = [
        {
          statement: `
          UPDATE ${USERS_TABLE}
            SET first_name=?,
            last_name=?,
            email=?,
            user_type=?
            LIMIT 1`,
          values: [
            data.first_name,
            data.last_name,
            data.email,
            data.user_type
          ],
        },
      ];
      const res = await db.executeTransaction(transactionStatements);
      console.log('add user query results', res);
      return true;
    } catch (error) {
      console.log('add user error:', error);
    } 
  };
  