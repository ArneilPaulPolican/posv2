// database.connection.ts
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Lock } from '@/services/lock';


export class DBConnectionService {
    private static instance: DBConnectionService | null = null;
    private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
    private dbLock = new Lock(); // Create a new lock
    private dbConnection: SQLiteDBConnection | null = null;

    private constructor() {
        // Add any necessary initialization logic here
        this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }

    public static async getInstance(): Promise<DBConnectionService> {
        if (!this.instance) {
            this.instance = new DBConnectionService();
            await this.instance.initializeConnection();
        }else if (!this.instance.dbConnection || !(await this.instance.dbConnection.isDBOpen())) {
            await this.instance.initializeConnection();
        }
        return this.instance;
    }
    
    private async initializeConnection() {
        await this.dbLock.acquire(); // Acquire the lock
        try {
            const ret = await this.sqlite.checkConnectionsConsistency();
            const isConn = (await this.sqlite.isConnection("pos_db", false)).result;

            if (ret.result && isConn) {
                this.dbConnection = await this.sqlite.retrieveConnection("pos_db", false);
                if (Capacitor.getPlatform() === 'web') {
                    await this.dbConnection.open(); // Open database only on web platform
                }
            } else {
                this.dbConnection = await this.sqlite.createConnection("pos_db", false, "no-encryption", 1, false);
                await this.dbConnection.open();
            }
        } catch (error) {
            throw error;
        } finally {
            this.dbLock.release(); // Release the lock after initializing
        }
    }

    public async getDatabaseConnection(): Promise<SQLiteDBConnection> {
        // if (!this.dbConnection) {
        //     throw new Error('Database connection is not initialized');
        // }
        // return this.dbConnection;
        await this.dbLock.acquire(); // Acquire the lock
        try {
            if (!this.dbConnection) {
                // If connection is not initialized, reinitialize it
                await this.initializeConnection();
            }
            return this.dbConnection!;
        } catch (error) {
            throw error;
        } finally {
            this.dbLock.release(); // Release the lock
        }
    }

    public async closeConnection(): Promise<void> {
        if (this.dbConnection) {
            try {
                await this.dbConnection.close(); // Close the connection
            } catch (error) {
                throw error
            } finally {
                this.dbConnection = null; // Set the connection to null after closing
            }
        }
    }
}



// export class DBConnectionService {
//     private promise: Promise<void> = Promise.resolve();
//     private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
//     private dbLock = new Lock(); // Create a new lock
//     private static dbConnection: SQLiteDBConnection;
//     private static instance: DBConnectionService | null = null;

//     public static async getInstance(): Promise<DBConnectionService> {
//         if (!this.instance) {
//             this.instance = new DBConnectionService();
//         }
//         return this.instance;
//     }
    
//     public getDatabaseConnection = async (): Promise<SQLiteDBConnection> => {
//         await this.dbLock.acquire(); // Acquire the lock
//         try{
//             if (!DBConnectionService.dbConnection) {
//                 const ret = await this.sqlite.checkConnectionsConsistency();
//                 const isConn = (await this.sqlite.isConnection("pos_db", false)).result;
//                 let db: SQLiteDBConnection
//                 if (ret.result && isConn) {
//                     db = await this.sqlite.retrieveConnection("pos_db", false);
//                     if (Capacitor.getPlatform() === 'web') {
//                         await db.open(); // Open database only on web platform
//                     }
//                 } else {
//                     db = await this.sqlite.createConnection("pos_db", false, "no-encryption", 1, false);
//                     await db.open()
//                 }
//                 DBConnectionService.dbConnection = db; 
//                 // this.dbLock.release(); // Release the lock after successful connection
//                 // return db
//             }
//             this.dbLock.release(); // Release the lock after successful connection
//             return DBConnectionService.dbConnection;
//         }catch(error){
//             this.dbLock.release(); // Release the lock on error
//             await presentToast('Error getting database connection:', error);
//             throw error;
//         }
//     }
// }
  