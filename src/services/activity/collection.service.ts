import { DBConnectionService } from '../database.connection';
import { COLLECTIONS_LINES_TABLE, COLLECTIONS_TABLE, CUSTOMERS_TABLE, DISCOUNTS_TABLE, ITEMS_TABLE, SALES_ITEMS_TABLE, TABLE_GROUP_LINES_TABLE, TABLES_TABLE, UNITS_TABLE, USERS_TABLE } from '@/schema/tables';
import { ref, toRaw } from 'vue';
import { CUSTOMER } from '@/models/customer.model';
import USER from '@/models/user.model';
import { SALES_ITEM_DTO } from '@/models/sales-item.model';
import { addBulkSalesItem } from './sales-item.service';
import { COLLECTIONS, COLLECTIONS_DTO } from '@/models/collections.model';
import { COLLECTIONS_LINES, COLLECTIONS_LINES_DTO } from '@/models/collection-lines.model';

// const db_connection = new DBConnectionService()
const data = ref<COLLECTIONS_DTO[]>([])
interface ResultSet {
  rows: {
    raw: () => any[];
  };
}

export const getCollection = async () => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
        const selectQuery = `
        SELECT ${COLLECTIONS_TABLE}.id,
            ${COLLECTIONS_TABLE}.ci_date,
            ${COLLECTIONS_TABLE}.ci_number,
            ${COLLECTIONS_TABLE}.customer_id,
            ${COLLECTIONS_TABLE}.total_amount,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${CUSTOMERS_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' ||${USERS_TABLE}.last_name AS full_name,
            ${COLLECTIONS_TABLE}.is_locked
        FROM ${COLLECTIONS_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${COLLECTIONS_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${COLLECTIONS_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        GROUP BY ${COLLECTIONS_TABLE}.id
        ORDER BY ${COLLECTIONS_TABLE}.ci_number DESC
        `;
      
      const result = await db.query(selectQuery);
     
        return { success: true, data: result.values as COLLECTIONS_DTO[] };
      
    } catch (error) {
      throw error;
    }
};

export const getCollectionbyId = async (id:number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
        const selectQuery = `
        SELECT ${COLLECTIONS_TABLE}.id,
            ${COLLECTIONS_TABLE}.ci_date,
            ${COLLECTIONS_TABLE}.ci_number,
            ${COLLECTIONS_TABLE}.customer_id,
            ${COLLECTIONS_TABLE}.total_amount,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${CUSTOMERS_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' ||${USERS_TABLE}.last_name AS full_name,
            ${COLLECTIONS_TABLE}.is_locked
        FROM ${COLLECTIONS_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${COLLECTIONS_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${COLLECTIONS_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        LEFT JOIN ${TABLE_GROUP_LINES_TABLE}
        ON ${COLLECTIONS_TABLE}.table_id=${TABLE_GROUP_LINES_TABLE}.id
        LEFT JOIN ${TABLES_TABLE}
        ON ${TABLE_GROUP_LINES_TABLE}.table_id=${TABLES_TABLE}.id
        LEFT JOIN ${SALES_ITEMS_TABLE}
        ON (${COLLECTIONS_TABLE}.id=${SALES_ITEMS_TABLE}.sales_id)
        LEFT JOIN ${ITEMS_TABLE}
        ON ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN ${COLLECTIONS_TABLE}
        ON ${COLLECTIONS_TABLE}.sales_id=${COLLECTIONS_TABLE}.id
        GROUP BY ${COLLECTIONS_TABLE}.id
        WHERE ${COLLECTIONS_TABLE}.id=?
        ORDER BY ${COLLECTIONS_TABLE}.ci_number DESC
        `;
        const params = [id];
      
        const result = await db.query(selectQuery, params);
        const colection = result.values?.map(colection => ({
            id: colection.id,
            user_id: colection.user_id,
            user: colection.user,
            ci_date: colection.ci_date,
            ci_number: colection.ci_number,
            customer_id: colection.customer_id,
            customer_code: colection.customer_code,
            customer: colection.customer,
            customer_address: colection.customer_address,
            customer_tin: colection.customer_tin,
            is_locked: colection.is_locked,
          }))[0];
     
        return { success: true, data: colection };
      
    } catch (error) {
      throw error;
    }
};

export const getLastCollectionNumber = async (): Promise<string> => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      let ci_number = '';
      const query = `SELECT ci_number FROM ${COLLECTIONS_TABLE} ORDER BY id DESC LIMIT 1`;
      const result = await db?.query(query);
      const lastCINumber =result?.values?.[0].ci_number;

      const currentCINumber = parseInt(lastCINumber, 10);
      const nextCINumber = currentCINumber + 1;
      const formattedNextCINumber = nextCINumber.toString().padStart(10, '0');
      
      ci_number = formattedNextCINumber;

      return ci_number;
    } catch (error) {
      return '0000000001';
    }
}


export const addPayment = async (data: COLLECTIONS, data_line: COLLECTIONS_LINES[]) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    const query = `INSERT INTO ${COLLECTIONS_TABLE} (
      user_id,          ci_date,          ci_number,
      customer_id,       sales_id,        total_amount,
      is_locked
    ) VALUES (
      ?, ?, ?,
      ?, ?, ?,
      ?
    )`;
  
    const transactionStatements = [
      {
        statement: query,
        values: [
          1 , data.ci_date, data.ci_number, 
          data.customer_id, data.sales_id, data.total_amount,
          true
        ],
      },
    ];
  
    const res = await db.query(query,transactionStatements[0].values );
    const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
    const lastIdRes = await db.query(getLastIdQuery);
    let Id =  0;
    // const insertedId = lastIdRes.values?[0].values['lastId'];
    if (lastIdRes.values && lastIdRes.values.length > 0) {
      Id =  lastIdRes.values[0].lastId

      for (const line of data_line) {
        const query =
        `INSERT INTO ${COLLECTIONS_LINES_TABLE} (
            collection_id,
            paytype_id,
            particulars,
            amount,
            change
        ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?
        )`
        const transactionStatements = [
            {
              statement: query,
              values: [
                Id,
                line.paytype_id,
                line.particulars,
                line.amount,
                line.particulars
              ],
            },
        ];
        try {
          const res = await db.executeTransaction(transactionStatements );
        } catch (error) {
          throw error;
        }
          
      }
      
    } else {
      Id = 0;
    }
    // return true,Id;
    return { success: true };
  } catch (error) {
    console.log(error)
      throw error;
  }
};

export const addCollection = async (data: COLLECTIONS_DTO) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      const query = `INSERT INTO ${COLLECTIONS_TABLE} (
        user_id,          ci_date,          ci_number,
        customer_id,       sales_id,        total_amount,
        is_locked
      ) VALUES (
        ?, ?, ?,
        ?, ?, ?,
        ?
      )`;
    
      const transactionStatements = [
        {
          statement: query,
          values: [
            1 , data.ci_date, data.ci_number, 
            data.customer_id, data.sales_id, data.total_amount,
            false
          ],
        },
      ];
    
      const res = await db.query(query,transactionStatements[0].values );
      const getLastIdQuery = 'SELECT last_insert_rowid() AS lastId';
      const lastIdRes = await db.query(getLastIdQuery);
      let Id =  0;
      // const insertedId = lastIdRes.values?[0].values['lastId'];
      if (lastIdRes.values && lastIdRes.values.length > 0) {
        Id =  lastIdRes.values[0].lastId
        
      } else {
        Id = 0;
      }
      // return true,Id;
      return { success: true, insertedId: Id };
    } catch (error) {
        throw error;
    }
};

export const updateCollection = async (data: COLLECTIONS_DTO, data_line: COLLECTIONS_LINES_DTO[]) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      
        const transactionStatements = [
            {
            statement: `UPDATE  ${COLLECTIONS_TABLE} 
            SET
            user_id =?,
            ci_date =?,
            ci_number =?,
            customer_id =?,
            sales_id =?,
            total_amount =?,
            is_locked =?
            WHERE id=?`,
            values: [
                1 , data.ci_date, data.ci_number, 
                data.customer_id, data.sales_id, data.total_amount,
                false, data.id
            ],
            },
        ];
    
        const res = await db.executeTransaction(transactionStatements);
        
        return { success: true, data: data.id };
    } catch (error) {
        throw error;
    }
};

export const lockCollection = async (data: COLLECTIONS_DTO, data_line: COLLECTIONS_LINES_DTO[]) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      
        const transactionStatements = [
            {
            statement: `UPDATE  ${COLLECTIONS_TABLE} 
            SET
            user_id =?,
            ci_date =?,
            ci_number =?,
            customer_id =?,
            sales_id =?,
            total_amount =?,
            is_locked =?
            WHERE id=?`,
            values: [
                1 , data.ci_date, data.ci_number, 
                data.customer_id, data.sales_id, data.total_amount,
                true, data.id
            ],
            },
        ];
    
        const res = await db.executeTransaction(transactionStatements);
        
        return { success: true, data: data.id };
    } catch (error) {
        throw error;
    }
};


export const unlockCollection = async (data: COLLECTIONS_DTO, data_line: COLLECTIONS_LINES_DTO[]) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      
        const transactionStatements = [
            {
            statement: `UPDATE  ${COLLECTIONS_TABLE} 
            SET
            is_locked =?
            WHERE id=?`,
            values: [
                false, data.id
            ],
            },
        ];
    
        const res = await db.executeTransaction(transactionStatements);
        
        return { success: true, data: data.id };
    } catch (error) {
        throw error;
    }
};

export const deleteCollection = async (id: number) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
  
      const transactionStatements = [
        {
          statement: `DELETE ${COLLECTIONS_TABLE}
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