import { SQLiteDBConnection } from "vue-sqlite-hook";

import {
  USERS_TABLE,
  TAXES_TABLE,
  UNITS_TABLE,
  ITEMS_TABLE,
  ITEM_COMPONENTS_TABLE,
  TABLES_TABLE,
  DISCOUNTS_TABLE,
  PAYTYPES_TABLE,
  CUSTOMERS_TABLE,
  STOCK_INS_TABLE,
  STOCK_IN_ITEMS_TABLE,
  STOCK_OUTS_TABLE,
  STOCK_OUT_ITEMS_TABLE,
  CASH_IN_OUTS_TABLE,
  TABLE_GROUPS_TABLE,
  TABLE_GROUP_LINES_TABLE,
  ITEM_GROUPS_TABLE,
  ITEM_GROUP_LINES_TABLE,
  SALES_TABLE,
  SALES_ITEMS_TABLE,
  COLLECTIONS_TABLE,
  COLLECTIONS_LINES_TABLE,
  Z_READINGS_TABLE,
  SYS_SETTINGS_TABLE,
  MIGRATIONS_TABLE,
  SYS_INVENTORY_TABLE,
  ITEM_PRICE_TABLE,
} from './tables';
import { Capacitor } from "@capacitor/core";
import MIGRATION from "@/models/migration.model";

export const createTables = async (db: SQLiteDBConnection) => {
    console.log('Create table started')

    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS ${USERS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        user_type TEXT,
        password TEXT NOT NULL
      )
    `;

    const createTaxesTableQuery = `
      CREATE TABLE IF NOT EXISTS ${TAXES_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        tax_code TEXT NOT NULL UNIQUE,
        tax TEXT NOT NULL,
        rate REAL NOT NULL,
        sort_no INTEGER
      )
    `;

    const createUnitsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${UNITS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        unit_code TEXT NOT NULL UNIQUE,
        unit TEXT NOT NULL
      )
    `;

    const createItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${ITEMS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        item_code TEXT NOT NULL UNIQUE,
        bar_code TEXT NOT NULL UNIQUE,
        item_description TEXT NOT NULL,
        alias TEXT,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        cost REAL NOT NULL,
        quantity REAL NOT NULL,
        unit_id INTEGER NOT NULL,
        is_inventory BOOLEAN DEFAULT false,
        generic_name TEXT NOT NULL,
        tax_id INTEGER NOT NULL,
        remarks TEXT,
        image_path TEXT,
        is_package BOOLEAN DEFAULT false,
        is_locked BOOLEAN DEFAULT false,
        is_vat_inclusive BOOLEAN DEFAULT false,
        expiry_date TEXT,
        lot_number TEXT,
        FOREIGN KEY (unit_id)
          REFERENCES ${UNITS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (tax_id)
          REFERENCES ${TAXES_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createItemComponentsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${ITEM_COMPONENTS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        component_id INTEGER NOT NULL,
        particulars TEXT,
        quantity REAL NOT NULL,
        unit_id INTEGER NOT NULL,
        FOREIGN KEY (item_id)
          REFERENCES ${ITEMS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (component_id)
          REFERENCES ${ITEMS_TABLE} (id),
        FOREIGN KEY (unit_id)
          REFERENCES ${UNITS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createItemPriceTableQuery = `
      CREATE TABLE IF NOT EXISTS ${ITEM_PRICE_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        unit_id INTEGER NOT NULL,
        particulars TEXT,
        cost REAL NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (item_id)
          REFERENCES ${ITEMS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (unit_id)
          REFERENCES ${UNITS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
  `;

    const createTablesTableQuery = `
      CREATE TABLE IF NOT EXISTS ${TABLES_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        table_code TEXT NOT NULL,
        table_name TEXT NOT NULL,
        category TEXT NOT NULL,
        pax INTEGER NOT NULL,
        image_path TEXT,
        is_locked BOOLEAN DEFAULT false,
        sort_no INTEGER
      )
    `;

    const createDiscountsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${DISCOUNTS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        discount TEXT NOT NULL UNIQUE,
        discount_rate REAL NOT NULL,
        vat_inclusive BOOLEAN DEFAULT false,
        particular TEXT,
        is_locked BOOLEAN DEFAULT false,
        image_url TEXT,
        sort_no INTEGER
      )
    `;

    const createPaytypesTableQuery = `
      CREATE TABLE IF NOT EXISTS ${PAYTYPES_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        paytype TEXT NOT NULL UNIQUE,
        is_default_value BOOLEAN DEFAULT false,
        sort_no INTEGER
      )
    `;

    const createCustomersTableQuery = `
      CREATE TABLE IF NOT EXISTS ${CUSTOMERS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        customer_code TEXT NOT NULL UNIQUE,
        customer TEXT NOT NULL,
        contact_number TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        credit_limit REAL NOT NULL,
        category TEXT NOT NULL,
        email TEXT,
        address TEXT NOT NULL,
        tin TEXT NOT NULL,
        reward_number TEXT,
        image_path TEXT,
        is_locked BOOLEAN DEFAULT FALSE,
        is_default_value BOOLEAN DEFAULT FALSE
      )
    `;

    const createStockInsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${STOCK_INS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        in_number TEXT NOT NULL,
        in_date TEXT NOT NULL DEFAULT current_timestamp,
        remarks TEXT,
        status TEXT NOT NULL,
        is_locked BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id)
          REFERENCES ${USERS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createStockInItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${STOCK_IN_ITEMS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        in_id INTEGER NOT NULL,
        date_time TEXT NOT NULL DEFAULT current_timestamp,
        item_id INTEGER NOT NULL,
        unit_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        cost REAL NOT NULL,
        amount REAL NOT NULL,
        particulars TEXT,
        FOREIGN KEY (item_id)
          REFERENCES ${ITEMS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (unit_id)
          REFERENCES ${UNITS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createStockOutsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${STOCK_OUTS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        out_number TEXT NOT NULL,
        out_date TEXT NOT NULL DEFAULT current_timestamp,
        remarks TEXT,
        status TEXT NOT NULL,
        is_locked BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id)
          REFERENCES ${USERS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createStockOutItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${STOCK_OUT_ITEMS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        out_id INTEGER NOT NULL,
        date_time TEXT NOT NULL DEFAULT current_timestamp,
        item_id INTEGER NOT NULL,
        unit_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        cost REAL NOT NULL,
        amount REAL NOT NULL,
        particulars TEXT,
        FOREIGN KEY (item_id)
          REFERENCES ${ITEMS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (unit_id)
          REFERENCES ${UNITS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createCashInOutsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${CASH_IN_OUTS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        cash_in_out_number TEXT NOT NULL,
        cash_in_out_date TEXT NOT NULL DEFAULT current_timestamp,
        amount REAL NOT NULL,
        cash_1000 INTEGER NOT NULL DEFAULT 0,
        cash_500 INTEGER NOT NULL DEFAULT 0,
        cash_200 INTEGER NOT NULL DEFAULT 0,
        cash_100 INTEGER NOT NULL DEFAULT 0,
        cash_50 INTEGER NOT NULL DEFAULT 0,
        cash_20 INTEGER NOT NULL DEFAULT 0,
        cash_10 INTEGER NOT NULL DEFAULT 0,
        cash_5 INTEGER NOT NULL DEFAULT 0,
        cash_1 INTEGER NOT NULL DEFAULT 0,
        cash_dot_25 INTEGER NOT NULL DEFAULT 0,
        cash_dot_10 INTEGER NOT NULL DEFAULT 0,
        cash_dot_5 INTEGER NOT NULL DEFAULT 0,
        cash_dot_1 INTEGER NOT NULL DEFAULT 0,
        type TEXT NOT NULL,
        refund_reference_number TEXT,
        remarks TEXT,
        is_locked BOOLEAN DEFAULT FALSE,
        status TEXT NOT NULL,
        FOREIGN KEY (user_id)
          REFERENCES ${USERS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createTableGroupsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${TABLE_GROUPS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        table_group TEXT NOT NULL UNIQUE,
        particulars TEXT,
        status TEXT,
        image_url TEXT,
        is_locked BOOLEAN DEFAULT false,
        sort_no INTEGER NOT NULL
      )
    `;

    const createTableGroupLinesTableQuery = `
      CREATE TABLE IF NOT EXISTS ${TABLE_GROUP_LINES_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        table_group_id INTEGER NOT NULL,
        table_id INTEGER NOT NULL,
        is_shown BOOLEAN DEFAULT false,
        is_default_value BOOLEAN DEFAULT false,
        FOREIGN KEY (table_group_id)
          REFERENCES ${TABLE_GROUPS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (table_id)
          REFERENCES ${TABLES_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createItemGroupsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${ITEM_GROUPS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        item_group TEXT NOT NULL UNIQUE,
        particulars TEXT,
        status TEXT,
        image_url TEXT,
        is_locked BOOLEAN DEFAULT false,
        sort_no INTEGER NOT NULL
      )
    `;

    const createItemGroupLinesTableQuery = `
      CREATE TABLE IF NOT EXISTS ${ITEM_GROUP_LINES_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        item_group_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        sort_no INTEGER NOT NULL,
        is_shown BOOLEAN DEFAULT false,
        is_default_value BOOLEAN DEFAULT false,
        FOREIGN KEY (item_group_id)
          REFERENCES ${ITEM_GROUPS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (item_id)
          REFERENCES ${ITEMS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createSalesTableQuery = `
      CREATE TABLE IF NOT EXISTS ${SALES_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        sales_number TEXT NOT NULL,
        sales_date TEXT NOT NULL DEFAULT current_timestamp,
        sales_time TEXT NOT NULL DEFAULT current_timestamp,
        terminal_number TEXT NOT NULL,
        customer_id INTEGER NOT NULL,
        table_id INTEGER,
        total_amount REAL NOT NULL,
        balance_amount REAL NOT NULL,
        paid_amount REAL NOT NULL,
        discount_id INTEGER NOT NULL,
        discount_rate REAL NOT NULL,
        discount_amount REAL NOT NULL,
        net_amount REAL NOT NULL,
        no_of_pax INTEGER NOT NULL,
        remarks TEXT,
        status TEXT NOT NULL,
        is_locked BOOLEAN DEFAULT false,
        is_billed_out BOOLEAN DEFAULT false,
        is_cancelled BOOLEAN DEFAULT false,
        is_printed BOOLEAN DEFAULT false,
        senior_pwd_id TEXT,
        senior_pwd_name TEXT,
        discounted_pax REAL DEFAULT 0.0,
        FOREIGN KEY (user_id)
          REFERENCES ${USERS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (customer_id)
          REFERENCES ${CUSTOMERS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (table_id)
          REFERENCES ${TABLES_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (discount_id)
          REFERENCES ${DISCOUNTS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createSalesItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${SALES_ITEMS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        sales_id INTEGER NOT NULL,
        date_time TEXT NOT NULL DEFAULT current_timestamp,
        item_id INTEGER NOT NULL,
        unit_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        discount_id INTEGER,
        discount_rate REAL,
        discount_amount REAL,
        net_price REAL NOT NULL,
        amount REAL NOT NULL,
        tax_id INTEGER NOT NULL,
        tax_rate REAL NOT NULL,
        tax_amount REAL NOT NULL,
        particulars TEXT,
        user_id INTEGER NOT NULL,
        backoffice_id TEXT,
        FOREIGN KEY (sales_id)
          REFERENCES ${SALES_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (item_id)
          REFERENCES ${ITEMS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (unit_id)
          REFERENCES ${UNITS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (discount_id)
          REFERENCES ${DISCOUNTS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (tax_id)
          REFERENCES ${TAXES_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (user_id)
          REFERENCES ${USERS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createCollectionsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${COLLECTIONS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        ci_date TEXT NOT NULL DEFAULT current_timestamp,
        ci_number TEXT NOT NULL,
        customer_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        user_id INTERGER NOT NULL,
        is_locked BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (customer_id)
          REFERENCES ${CUSTOMERS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (user_id)
          REFERENCES ${USERS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createCollectionsLinesTableQuery = `
      CREATE TABLE IF NOT EXISTS ${COLLECTIONS_LINES_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        collection_id INTEGER NOT NULL,
        paytype_id INTEGER NOT NULL,
        particulars TEXT,
        amount REAL NOT NULL,
        change REAL NOT NULL,
        sales_id INTEGER NOT NULL,
        FOREIGN KEY (collection_id)
          REFERENCES ${COLLECTIONS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (paytype_id)
          REFERENCES ${PAYTYPES_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (sales_id)
          REFERENCES ${SALES_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createSysSettingsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${SYS_SETTINGS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        customer TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        customer_tin TEXT NOT NULL,
        terminal_number TEXT NOT NULL,
        pos_serial_number TEXT NOT NULL,
        pos_permit_number TEXT NOT NULL,
        pos_accreditation_number TEXT NOT NULL,
        pos_machine_identification_number TEXT NOT NULL,
        pos_vendor TEXT NOT NULL,
        pos_vendor_address TEXT NOT NULL,
        pos_vendor_tin TEXT NOT NULL,
        pos_vendor_accreditation_number TEXT NOT NULL,
        pos_vendor_accreditation_expiry_date TEXT NOT NULL,
        image TEXT,
        remarks TEXT,
        backoffice_domain TEXT,
        backoffice_access_token TEXT,
        is_backoffice_enabled BOOLEAN DEFAULT false,
        serial_number TEXT not null,
        license_key TEXT
      )
    `;

    const createZReadingsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${Z_READINGS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        z_reading_date TEXT NOT NULL DEFAULT current_timestamp,
        gross_sales REAL NOT NULL,
        regular_discount REAL NOT NULL,
        senior_discount REAL NOT NULL,
        pwd_discount REAL NOT NULL,
        sales_return REAL NOT NULL,
        net_sales REAL NOT NULL,
        collections TEXT NOT NULL,
        total_collection REAL NOT NULL,
        vat_sales REAL NOT NULL,
        vat_amount REAL NOT NULL,
        non_vat REAL NOT NULL,
        vat_exempt REAL NOT NULL,
        vat_zero_rated REAL NOT NULL,
        total_vat_analysis REAL NOT NULL,
        counter_id_start TEXT NOT NULL,
        counter_id_end TEXT NOT NULL,
        cancelled_transaction INTEGER NOT NULL,
        cancelled_amount REAL NOT NULL,
        number_of_transaction INTEGER NOT NULL,
        number_of_sku INTEGER NOT NULL,
        total_quantity INTEGER NOT NULL,

        ags_previous_reading REAL NOT NULL,
        ags_gross_sales REAL NOT NULL,
        ags_accumulated_gross_sales REAL NOT NULL,

        ans_previous_reading REAL NOT NULL,
        ans_net_sales REAL NOT NULL,
        ans_accumulated_net_sales REAL NOT NULL,

        print_count INTEGER
      )
    `;

    const createSysInventoryTableQuery = `
      CREATE TABLE IF NOT EXISTS ${SYS_INVENTORY_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        trx_id INTEGER NOT NULL DEFAULT 0,
        trx_date TEXT NOT NULL DEFAULT current_timestamp,
        trx_type TEXT NOT NULL,
        reference TEXT,
        item_id INTEGER NOT NULL,
        unit_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        end_quantity INTEGER NOT NULL,
        cost REAL NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (item_id)
          REFERENCES ${ITEMS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (unit_id)
          REFERENCES ${UNITS_TABLE} (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
      )
    `;

    const createPrinterConfigurationTableQuery = `
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        width TEXT,
        height TEXT,
      )
    `;

    const createMigrationsTableQuery = `
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL UNIQUE,
        date_time TEXT NOT NULL DEFAULT current_timestamp
      )
    `;
  
    try {
        console.log('Create table query execute')
        // Settings module
        await db.execute(createUsersTableQuery);
        // await db.execute(createCategoriesTableQuery);
        await db.execute(createTaxesTableQuery);
        await db.execute(createUnitsTableQuery);
  
        // Setup module
        await db.execute(createItemsTableQuery);
        await db.execute(createItemComponentsTableQuery);
        await db.execute(createItemPriceTableQuery);

        
        await db.execute(createTablesTableQuery);
        await db.execute(createDiscountsTableQuery);
        await db.execute(createPaytypesTableQuery);
        await db.execute(createCustomersTableQuery);
  
        // Restaurant module
        await db.execute(createTableGroupsTableQuery);
        await db.execute(createTableGroupLinesTableQuery);
        await db.execute(createItemGroupsTableQuery);
        await db.execute(createItemGroupLinesTableQuery);
  
        // Activities module
        await db.execute(createSalesTableQuery);
        await db.execute(createSalesItemsTableQuery);
        await db.execute(createCollectionsTableQuery);
        await db.execute(createCollectionsLinesTableQuery);
        await db.execute(createStockInsTableQuery);
        await db.execute(createStockInItemsTableQuery);
        await db.execute(createStockOutsTableQuery);
        await db.execute(createStockOutItemsTableQuery);
        await db.execute(createCashInOutsTableQuery);
  
        // Reports module
        await db.execute(createSysSettingsTableQuery);
        await db.execute(createZReadingsTableQuery);
  
        // Migrations
        
        await db.execute(createSysInventoryTableQuery);
        await db.execute(createMigrationsTableQuery);
  
        let deviceId = Capacitor.getPlatform();
        // const deviceId = await DeviceInfo.getAndroidId();
        deviceId = deviceId.toUpperCase();
  
        // Create sys settings
        const getSysSettingsQuery = `SELECT * FROM ${SYS_SETTINGS_TABLE}`;
        const existingSysSettings = await db.query(getSysSettingsQuery);

        if (!existingSysSettings.values?.length) {
        console.log('Insert Default value')
          const insertSysSettingsQuery = `
            INSERT INTO ${SYS_SETTINGS_TABLE} (
              customer, customer_address, customer_tin,
              terminal_number, pos_serial_number, pos_permit_number,
              pos_accreditation_number, pos_machine_identification_number, pos_vendor,
              pos_vendor_address, pos_vendor_tin, pos_vendor_accreditation_number,
              pos_vendor_accreditation_expiry_date, serial_number
            ) VALUES (
              'Test Company', 'Cebu City', '000-000-000-0000',
              '001', 'G6JY81100KQZ', 'FP082021-0810298152-00001', 
              '000000000000', '21081708162465140', 'Liteclerk Corp',
              '211 V Rama Avenue Cebu City', '010 045 930 000', '0820100459302021061436',
              '', '${deviceId}'
            )`;
          const resSYS_SETTINGS_TABLE = await db.query(insertSysSettingsQuery);

          // Insert Default TAX
          const insertDefaultUserQuery = `
            INSERT OR IGNORE INTO ${USERS_TABLE} 
            (username, email, first_name, last_name, user_type, password)
            VALUES 
            ('Admin', 'user@default.com', 'Admin', 'User', 'Admin', 'password')
          `;

          const resUSERS_TABLE = await db.execute(insertDefaultUserQuery);

            // Insert default paytypes
          const insertPaytypesQuery = `
            INSERT OR IGNORE INTO ${PAYTYPES_TABLE} (paytype, is_default_value, sort_no)
            VALUES
              ('CASH', 1, 1),
              ('GCASH', 0, 2),
              ('MAYA', 0, 3),
              ('CREDITCARD', 0, 4),
              ('CHECK', 0, 5)
          `;
          const resPAYTYPES_TABLE = await db.execute(insertPaytypesQuery);

          // Insert Default Unit
          const insertDefaultUnitQuery = `
            INSERT OR IGNORE INTO ${UNITS_TABLE} (unit_code, unit)
            VALUES ('Pcs', 'Pieces')
          `;
          const resUNITS_TABLE = await db.execute(insertDefaultUnitQuery);

          // Insert Default TAX
          const insertDefaultTaxQuery = `
            INSERT OR IGNORE INTO ${TAXES_TABLE} (tax_code, tax, rate, sort_no)
            VALUES 
            ('NONE VAT 0%', 'None VAT', 0,  1),
            ('VAT 12%', 'Value Added Tax', 12, 2),
            ('VATEXEMPT 0%', 'VAT Exempt', 0,  3)
          `;
          const resTAXES_TABLE = await db.execute(insertDefaultTaxQuery);

          const insertDefaultItemQuery = `
            INSERT OR IGNORE INTO ${ITEMS_TABLE} 
            (item_code, bar_code, item_description,
            alias, category, price, 
            cost, quantity, unit_id, 
            generic_name, tax_id, is_locked, is_inventory )
            VALUES 
            ('0000000001', '0000000001', 'Service Charge',
            'Service Charge', '', 0.0,
            0.0,  0.0, (SELECT id FROM ${UNITS_TABLE} ORDER BY id ASC LIMIT 1),
            'Service Charge', (SELECT id FROM ${TAXES_TABLE} ORDER BY id ASC LIMIT 1)
            , true, true )
          `;
          const resITEMS_TABLE = await db.execute(insertDefaultItemQuery);

          // Insert Discount
          const insertDiscountsQuery = `
            INSERT OR IGNORE INTO ${DISCOUNTS_TABLE} (discount, discount_rate, vat_inclusive, particular, is_locked, image_url, sort_no)
            VALUES
              ('ZERO DISCOUNT', 0, false, 'NA', true, 'NA', 1),
              ('VARIABLE DISCOUNT', 0, false, 'RATE or AMOUNT', true, 'NA', 2),
              ('SENIOR DISCOUNT', 20, false, 'NA', true, 'NA', 3),
              ('PWD DISCOUNT', 20, false, 'NA', true, 'NA', 4)
          `;
          const resDISCOUNTS_TABLE = await db.execute(insertDiscountsQuery);

          // Insert Default Customer
          const insertDefaultCustomerQuery = `
            INSERT OR IGNORE INTO ${CUSTOMERS_TABLE} (
              customer_code, customer, contact_number,
              contact_person, credit_limit, category,
              email, address, tin,
              reward_number, image_path, is_locked, is_default_value
            ) VALUES (
              '0000000001', 'Walk-In', 'NA', 
              'NA', 0.00, 'NA',
              'default@email.test', 'NA', 'NA',
              'NA', '', true, true
            )
          `;

          const resCUSTOMERS_TABLE = await db.execute(insertDefaultCustomerQuery);

          // Insert default tables
          const insertTablespesQuery = `
            INSERT OR IGNORE INTO ${TABLES_TABLE} 
            (table_code, table_name, category, pax, image_path, is_locked)
            VALUES
            ('001', 'Take-out', 'NA', 0, '', 1)
          `;
          const resTABLES_TABLE = await db.execute(insertTablespesQuery);
        console.log('Insert Default value done',)
      }
    } catch (error) {
      console.log('Insert Default value error', error)
      throw error;
    }
};