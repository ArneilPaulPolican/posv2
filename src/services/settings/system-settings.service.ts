// customer.ts
import { CapacitorSQLite, SQLiteConnection, } from '@capacitor-community/sqlite';
import {  SYS_SETTINGS_TABLE } from '@/schema/tables';
import { Capacitor } from '@capacitor/core';
import { DBConnectionService } from '../database.connection';
import { ref } from 'vue';
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import { CUSTOMER } from '@/models/customer.model';
import { SYS_SETTINGS } from '@/models/system-settings.model';

const app = getCurrentInstance()
const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;

// const db_connection = new DBConnectionService()
const data = ref<SYS_SETTINGS[]>([])
type QueryResult = {
  rows: {
    item: (index: number) => { max_code?: string } | undefined;
    length: number;
  };
};

export const getSystemSettings = async () => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        if (!db) {
            throw new Error('Database connection not open');
        }
        const customerServiceQuery = `SELECT * FROM ${SYS_SETTINGS_TABLE}`
        const result = await db.query(customerServiceQuery);

        const sys_settings = result.values?.map(sys_settings=>({
            id: sys_settings.id,
            customer: sys_settings.customer,
            customer_address: sys_settings.customer_address,
            customer_tin: sys_settings.customer_tin,
            terminal_number: sys_settings.terminal_number,
            pos_serial_number: sys_settings.pos_serial_number,
            pos_permit_number: sys_settings.pos_permit_number,
            pos_accreditation_number: sys_settings.pos_accreditation_number,
            pos_machine_identification_number: sys_settings.pos_machine_identification_number,
            pos_vendor: sys_settings.pos_vendor,
            pos_vendor_address: sys_settings.pos_vendor_address,
            pos_vendor_tin: sys_settings.pos_vendor_tin,
            pos_vendor_accreditation_number: sys_settings.pos_vendor_accreditation_number,
            pos_vendor_accreditation_expiry_date: sys_settings.pos_vendor_accreditation_expiry_date,
            remarks: sys_settings.remarks,
            backoffice_domain: sys_settings.backoffice_domain,
            backoffice_access_token: sys_settings.backoffice_access_token,
            is_backoffice_enabled: sys_settings.is_backoffice_enabled,
            license_key: sys_settings.license_key
        }))[0];



        return sys_settings;
    } catch (error) {
      console.log('get customers error');
      console.log(error);
      throw error;
    }
};
  