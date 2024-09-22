import { DBConnectionService } from '../database.connection';
import {  USERS_TABLE} from '@/schema/tables';
import USER from '@/models/user.model';

interface ResultSet {
  rows: {
    raw: () => any[];
  };
}
export const getUsers = async () => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }
    const userQuery = `SELECT * FROM ${USERS_TABLE}`;
    
    const result = await db.query(userQuery);
   
    return { success: true, data: result.values as USER[]};
  } catch (error) {
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
      return { success: true, data: user};
    } catch (error) {
      throw error;
    }
};

export const authenticateUser = async (username:string, password:string) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }
    if(username == '' || username == undefined){
      throw new Error('Username is null');
    }
    if(password == '' || password == undefined){
      throw new Error('Password is null');
    }

    const query = `SELECT * FROM ${USERS_TABLE} 
                  WHERE username = ? AND password = ?`;
      
    const params = [username, password];
    
    const result = await db.query(query,params);
    const user = result.values?.map(user => ({
      id: user.id,
      username: user.username,
      fullname: user.first_name + ' ' +user.last_name,
      last_name: user.last_name,
      first_name: user.first_name,
      email: user.email,
      user_type: user.user_type,
    }))[0];
    console.log(user);
    
    if(!user){
      throw new Error('User does not exist');
    }

    return { success: true, data: user};
  } catch (error) {
    console.log(error)
    throw error;
  }
}
  
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
      return { success: true};
    } catch (error) {
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
    return { success: true};
  } catch (error) {
    throw error;
  }
};