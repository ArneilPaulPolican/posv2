import { SQLiteDBConnection } from "vue-sqlite-hook";
import { MIGRATIONS_TABLE, SALES_TABLE } from "@/schema/tables";

const migration_description = 'Additional field for paid amount, balance amount and total discount amount in Sales Table';
const now: Date = new Date();
const migration_script = `
ALTER TABLE ${SALES_TABLE} ADD COLUMN balance_amount REAL DEFAULT 0;
ALTER TABLE ${SALES_TABLE} ADD COLUMN paid_amount REAL DEFAULT 0;
ALTER TABLE ${SALES_TABLE} ADD COLUMN discount_amount REAL DEFAULT 0;
`;


export const alterSalesTable = async (db: SQLiteDBConnection) => {
    try {
      // Check if the columns already exist
      const pragmaScript = `PRAGMA table_info(${SALES_TABLE})`;
      const pragmaResult = await db.query(pragmaScript);

      const columns = pragmaResult.values;
      const columnNames = columns ? columns.map((column) => column.name) : [];

      if (!columnNames.includes('balance_amount')) {
        await db.execute(migration_script); // execute alter table
        
        const migrationServiceQuery = 
        `INSERT INTO ${MIGRATIONS_TABLE} (
            description,
            date_time
          ) VALUES (
            ?, ?
          )`;
    
        const transactionStatements = [
          {
            statement: migrationServiceQuery,
            values: [migration_description, now],
          },
        ];
        const res = await db.executeTransaction(transactionStatements); // record this event
      }else{
        console.log('column exist')
      }
    } catch (error) {
      console.log(error);
    }
};
