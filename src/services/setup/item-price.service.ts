
import { ITEM_PRICE, ITEM_PRICE_DTO } from '@/models/item-price.model';
import { DBConnectionService } from '../database.connection';
import { ITEM_PRICE_TABLE, ITEMS_TABLE, UNITS_TABLE } from '@/schema/tables';

export const getItemPrices = async (page = 1, pageSize = 10, item_id: number)  => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const componentQuery = `SELECT 
      ${ITEM_PRICE_TABLE}.id,
      ${ITEM_PRICE_TABLE}.item_id,
      ${ITEMS_TABLE}.item_code,
      ${ITEMS_TABLE}.bar_code as item_barcode,
      ${ITEMS_TABLE}.item_description,
      ${ITEM_PRICE_TABLE}.unit_id,
      ${UNITS_TABLE}.unit_code,
      ${UNITS_TABLE}.unit,
      ${ITEM_PRICE_TABLE}.particulars,
      ${ITEM_PRICE_TABLE}.cost,
      ${ITEM_PRICE_TABLE}.price
    FROM ${ITEM_PRICE_TABLE}
      LEFT JOIN ${ITEMS_TABLE} ON ${ITEM_PRICE_TABLE}.item_id = ${ITEMS_TABLE}.id
      LEFT JOIN ${UNITS_TABLE} ON ${ITEM_PRICE_TABLE}.unit_id = ${UNITS_TABLE}.id
    WHERE ${ITEM_PRICE_TABLE}.item_id = ?
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `;
    const params = [item_id];
    const result = await db.query(componentQuery, params);
   
    return { success: true, data: result.values as ITEM_PRICE_DTO[] };
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const getItemPriceById = async (id: number)  => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
      const componentQuery = `SELECT 
        ${ITEM_PRICE_TABLE}.id,
        ${ITEM_PRICE_TABLE}.item_id,
        ${ITEMS_TABLE}.item_code,
        ${ITEMS_TABLE}.bar_code as item_barcode,
        ${ITEMS_TABLE}.item_description,
        ${ITEM_PRICE_TABLE}.unit_id,
        ${UNITS_TABLE}.unit_code,
        ${UNITS_TABLE}.unit,
        ${ITEM_PRICE_TABLE}.cost,
        ${ITEM_PRICE_TABLE}.price
      FROM ${ITEM_PRICE_TABLE}
        LEFT JOIN ${ITEMS_TABLE} ON ${ITEM_PRICE_TABLE}.item_id = ${ITEMS_TABLE}.id
        LEFT JOIN ${UNITS_TABLE} ON ${ITEM_PRICE_TABLE}.unit_id = ${UNITS_TABLE}.id
      WHERE ${ITEM_PRICE_TABLE}.id = ?`;
      const params = [id];
      const result = await db.query(componentQuery, params);
      const item = result.values?.map(item => ({
        id: item.id,
        item_id: item.item_id,
        item_code: item.item_code,
        item_barcode: item.item_barcode,
        item_description:item.item_description,
        unit_id: item.unit_id,
        unit_code: item.unit_code,
        unit: item.unit,
        cost: item.cost,
        price: item.price,
      }))[0];
      console.log(item)
      return { success: true, data: result.values as ITEM_PRICE_DTO[] };
    } catch (error) {
      console.log(error)
      throw error;
    }
};

  
export const addItemPrice = async (data: ITEM_PRICE) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    console.log(data)
    const itemPriceQuery = `
      INSERT INTO ${ITEM_PRICE_TABLE} (
        item_id,
        unit_id,
        particulars,
        cost,
        price
      ) VALUES (?, ?, ?, ?, ?)
    `;
    
    const transactionStatements = [
      {
        statement: itemPriceQuery,
        values: [
          data.item_id, 
          data.unit_id,
          data.particulars,
          data.cost,
          data.price
        ],
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
    console.log(error)
    throw error
  }
};

export const updateItemPrice = async (data: ITEM_PRICE) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    console.log(data)
    const transactionStatements = [
      {
        statement: `
        UPDATE ${ITEM_PRICE_TABLE}
          SET item_id=?,
          unit_id=?,
          particulars=?,
          cost=?,
          price=?
        WHERE id=?
        `,
        values: [
          data.item_id,
          data.unit_id,
          data.particulars,
          data.cost,
          data.price,
          data.id
        ],
      },
    ];
    const res = await db.executeTransaction(transactionStatements);
    return { success: true};
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const deleteItemPrice = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE FROM ${ITEM_PRICE_TABLE}
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

