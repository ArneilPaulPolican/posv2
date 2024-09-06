import { DBConnectionService } from '../database.connection';
import {  USERS_TABLE} from '@/schema/tables';
import USER from '@/models/user.model';
import { presentToast } from '@/plugins/toast.service';

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
    const userQuery = `SELECT * FROM ${USERS_TABLE}`;
    
    const result = await db.query(userQuery);
   
    return result.values as USER[];
  } catch (error) {
    await presentToast('Get Users failed');
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
      const user = result.values?.map(user => ({
        id: user.id,
        username: user.username,
        fullname: user.first_name + ' ' +user.last_name,
        last_name: user.last_name,
        first_name: user.first_name,
        email: user.email,
        user_type: user.user_type,
      }))[0];
      return user;
      
    } catch (error) {
      await presentToast('Get User failed');
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
      return true;
    } catch (error) {
      await presentToast('Add User failed');
      throw error;
    } 
  };
  
export const deleteUser = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE ${USERS_TABLE}
        WHERE id=?`,
        values: [ 
          id
        ]
      }
    ]
  
    const res = await db.executeTransaction(transactionStatements);
    // return true,Id;
    return { success: true};
  } catch (error) {
    return { success: false};
  }
};