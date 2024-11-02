
import { DBConnectionService } from '../database.connection';
import { ITEM_COMPONENTS_TABLE, ITEMS_TABLE, UNITS_TABLE } from '@/schema/tables';
import { ITEM_COMPONENT, ITEM_COMPONENT_DTO } from '@/models/item-component.model';

export const getItemComponents = async (page = 1, pageSize = 10, item_id: number)  => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
      throw new Error('Database connection not open');
    }

    const componentQuery = `SELECT 
        ${ITEM_COMPONENTS_TABLE}.id,
        ${ITEM_COMPONENTS_TABLE}.item_id,
        i1.item_code AS item_code,
        i1.bar_code AS item_barcode,
        i1.item_description AS item_description,
        ${ITEM_COMPONENTS_TABLE}.component_id,
        i2.item_code AS component_code,
        i2.bar_code AS component_barcode,
        i2.item_description AS component_description,
        ${ITEM_COMPONENTS_TABLE}.unit_id,
        u.unit_code,
        u.unit,
        ${ITEM_COMPONENTS_TABLE}.quantity
    FROM ${ITEM_COMPONENTS_TABLE}
      LEFT JOIN ${ITEMS_TABLE} i1 ON ${ITEM_COMPONENTS_TABLE}.item_id = i1.id
      LEFT JOIN ${ITEMS_TABLE} i2 ON ${ITEM_COMPONENTS_TABLE}.component_id = i2.id
      LEFT JOIN ${UNITS_TABLE} u ON ${ITEM_COMPONENTS_TABLE}.unit_id = u.id
    WHERE ${ITEM_COMPONENTS_TABLE}.item_id = ?
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `;
    const params = [item_id];
    const result = await db.query(componentQuery, params);
    console.log(result.values)
   
    return { success: true, data: result.values as ITEM_COMPONENT_DTO[] };
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const getItemComponentById = async (id: number)  => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
      const componentQuery = `SELECT 
          ${ITEM_COMPONENTS_TABLE}.id,
          ${ITEM_COMPONENTS_TABLE}.item_id,
          i1.item_code AS item_code,
          i1.bar_code AS item_barcode,
          i1.item_description AS item_description,
          ${ITEM_COMPONENTS_TABLE}.component_id,
          i2.item_code AS component_code,
          i2.bar_code AS component_barcode,
          i2.item_description AS component_description,
          ${ITEM_COMPONENTS_TABLE}.unit_id,
          u.unit_code,
          u.unit,
          ${ITEM_COMPONENTS_TABLE}.quantity
      FROM ${ITEM_COMPONENTS_TABLE}
        LEFT JOIN ${ITEMS_TABLE} i1 ON ${ITEM_COMPONENTS_TABLE}.item_id = i1.id
        LEFT JOIN ${ITEMS_TABLE} i2 ON ${ITEM_COMPONENTS_TABLE}.component_id = i2.id
        LEFT JOIN ${UNITS_TABLE} u ON ${ITEM_COMPONENTS_TABLE}.unit_id = u.id
      WHERE ${ITEM_COMPONENTS_TABLE}.id = ?`;
      const params = [id];
      const result = await db.query(componentQuery, params);
      const item = result.values?.map(item => ({
        id: item.id,
        item_id: item.item_id,
        item_code: item.item_code,
        item_barcode: item.item_barcode,
        item_description:item.item_description,
        component_id: item.component_id,
        component_code: item.component_code,
        component_barcode: item.component_barcode,
        component_description: item.component_description,
        unit_id: item.unit_id,
        unit_code: item.unit_code,
        unit: item.unit,
        quantity: item.quantity
      }))[0];
      console.log(item)
      return { success: true, data: result.values as ITEM_COMPONENT_DTO[] };
    } catch (error) {
      console.log(error)
      throw error;
    }
};

export const addItemComponent = async (data: ITEM_COMPONENT_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    console.log(data)
    const itemPriceQuery = `
      INSERT INTO ${ITEM_COMPONENTS_TABLE} (
        item_id,
        component_id,
        particulars,
        quantity,
        unit_id
      ) VALUES (?, ?, ?, ?, ?)
    `;
    
    const transactionStatements = [
      {
        statement: itemPriceQuery,
        values: [
          data.item_id, 
          data.component_id,
          data.particulars,
          data.quantity,
          data.unit_id
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

export const updateItemComponent = async (data: ITEM_COMPONENT_DTO) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    console.log(data)
    const transactionStatements = [
      {
        statement: `
        UPDATE ${ITEM_COMPONENTS_TABLE}
          SET item_id=?,
          component_id=?,
          particulars=?,
          quantity=?,
          unit_id=?
        WHERE id=?
        `,
        values: [
          data.item_id,
          data.component_id,
          data.particulars,
          data.quantity,
          data.unit_id,
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

export const deleteItemComponent = async (id: number) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
  
    const transactionStatements = [
      {
        statement: `DELETE FROM ${ITEM_COMPONENTS_TABLE}
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
