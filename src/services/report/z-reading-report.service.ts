import { COLLECTIONS_TABLE, CUSTOMERS_TABLE, DISCOUNTS_TABLE, ITEMS_TABLE, SALES_ITEMS_TABLE, SALES_TABLE, TAXES_TABLE, UNITS_TABLE, USERS_TABLE, Z_READINGS_TABLE } from "@/schema/tables";
import { DBConnectionService } from "../database.connection";
import { Z_READINGS } from "@/models/z-reading.model";
import { SALES_DETAILS_REPORT_DTO } from "@/models/sales-detail-report.model";
import jsPDF from "jspdf";
import { openPDFBasedOnPlatform } from "@/composables/pdf-opener";

export const getZReding = async (z_read_date:string) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
        
        const selectQuery = `
            SELECT 
                ${COLLECTIONS_TABLE}.id,
                ${COLLECTIONS_TABLE}.ci_date,
                ${COLLECTIONS_TABLE}.ci_number,
                ${COLLECTIONS_TABLE}.customer_id,
                ${COLLECTIONS_TABLE}.total_amount,
                ${CUSTOMERS_TABLE}.customer_code,
                ${CUSTOMERS_TABLE}.customer,
                ${CUSTOMERS_TABLE}.address AS customer_address,
                ${CUSTOMERS_TABLE}.tin AS customer_tin,
                ${COLLECTIONS_TABLE}.user_id,
                ${USERS_TABLE}.first_name || ' ' || ${USERS_TABLE}.last_name AS full_name,
                ${COLLECTIONS_TABLE}.is_locked,
                ${SALES_TABLE}.sales_number,
                ${SALES_TABLE}.sales_date,
                ${SALES_TABLE}.total_amount AS sales_total_amount,
                ${SALES_TABLE}.balance_amount,
                ${SALES_TABLE}.paid_amount,
                ${SALES_TABLE}.discount_id,
                ${SALES_TABLE}.discount_rate,
                ${SALES_TABLE}.discount_amount,
                ${SALES_TABLE}.net_amount,
                ${SALES_TABLE}.no_of_pax,
                ${SALES_TABLE}.remarks,
                ${SALES_TABLE}.status
            FROM 
                ${COLLECTIONS_TABLE}
                LEFT JOIN ${USERS_TABLE}
                ON ${COLLECTIONS_TABLE}.user_id = ${USERS_TABLE}.id
                LEFT JOIN ${CUSTOMERS_TABLE}
                ON ${COLLECTIONS_TABLE}.customer_id = ${CUSTOMERS_TABLE}.id
                LEFT JOIN ${SALES_TABLE}
                ON ${COLLECTIONS_TABLE}.sales_id = ${SALES_TABLE}.id
            WHERE 
                ${COLLECTIONS_TABLE}.ci_date=?
            GROUP BY 
                ${COLLECTIONS_TABLE}.id
            ORDER BY 
                ${COLLECTIONS_TABLE}.ci_number DESC
        `;
        const params = [z_read_date]
        const result = await db.query(selectQuery, params);
        console.log(result.values)
        return { success: true, data: result.values };
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getCollectionForZRead = async (z_read_date:string) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {

    const selectQuery = `
        SELECT ${COLLECTIONS_TABLE}.id,
            ${COLLECTIONS_TABLE}.ci_date,
            ${COLLECTIONS_TABLE}.ci_number,
            ${COLLECTIONS_TABLE}.customer_id,
            ${COLLECTIONS_TABLE}.sales_id,
            ${COLLECTIONS_TABLE}.total_amount,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${COLLECTIONS_TABLE}.is_locked
        FROM ${COLLECTIONS_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${COLLECTIONS_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${COLLECTIONS_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        WHERE ${COLLECTIONS_TABLE}.ci_date = ? AND ${COLLECTIONS_TABLE}.is_locked = 1
        GROUP BY ${COLLECTIONS_TABLE}.id
        ORDER BY ${COLLECTIONS_TABLE}.ci_number DESC
        `;
        const params = [z_read_date]
        const result = await db.query(selectQuery, params);
        console.log(result.values)

        return { success: true, data: result.values };
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const getSalesForZRead = async (id:string) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
          throw new Error('Database connection not open');
      }
      const saleServiceQuery = `SELECT 
            ${SALES_ITEMS_TABLE}.id,
            ${SALES_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' || ${USERS_TABLE}.last_name AS full_name,
            ${SALES_TABLE}.sales_number,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.terminal_number,
            ${SALES_TABLE}.customer_id,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${SALES_TABLE}.total_amount,
            ${SALES_TABLE}.balance_amount,
            ${SALES_TABLE}.paid_amount,
            ${SALES_TABLE}.discount_amount,
            ${SALES_TABLE}.remarks,
            ${SALES_TABLE}.status,
        
            ${SALES_ITEMS_TABLE}.sales_id,
            ${SALES_ITEMS_TABLE}.date_time,
            ${SALES_ITEMS_TABLE}.item_id,
            ${ITEMS_TABLE}.quantity as onhand,
            ${ITEMS_TABLE}.item_code,
            ${ITEMS_TABLE}.bar_code as item_barcode,
            ${ITEMS_TABLE}.item_description,
            ${ITEMS_TABLE}.image_path as item_image_path,
            ${ITEMS_TABLE}.category as item_category,
            ${ITEMS_TABLE}.is_inventory,
            ${ITEMS_TABLE}.is_vat_inclusive,
            ${SALES_ITEMS_TABLE}.unit_id,
            ${UNITS_TABLE}.unit_code,
            ${SALES_ITEMS_TABLE}.quantity,
            ${SALES_ITEMS_TABLE}.price,
            ${SALES_ITEMS_TABLE}.discount_id,
            ${DISCOUNTS_TABLE}.discount,
            ${SALES_ITEMS_TABLE}.discount_rate,
            ${SALES_ITEMS_TABLE}.discount_amount,
            ${SALES_ITEMS_TABLE}.net_price,
            ${SALES_ITEMS_TABLE}.amount,
            ${SALES_ITEMS_TABLE}.tax_id,
            ${SALES_ITEMS_TABLE}.tax_rate,
            ${SALES_ITEMS_TABLE}.tax_amount,
            ${TAXES_TABLE}.tax,
            ${TAXES_TABLE}.tax_code,
            ${TAXES_TABLE}.is_inclusive,
            ${SALES_ITEMS_TABLE}.particulars
        FROM 
            ${SALES_ITEMS_TABLE}
        LEFT JOIN 
            ${ITEMS_TABLE}
        ON 
            ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN 
            ${UNITS_TABLE}
        ON 
            ${ITEMS_TABLE}.unit_id=${UNITS_TABLE}.id
        LEFT JOIN 
            ${TAXES_TABLE}
        ON 
            ${SALES_ITEMS_TABLE}.tax_id=${TAXES_TABLE}.id
        LEFT JOIN 
            ${DISCOUNTS_TABLE}
        ON 
            ${SALES_ITEMS_TABLE}.discount_id=${DISCOUNTS_TABLE}.id
        LEFT JOIN 
            ${SALES_TABLE}
        ON 
            ${SALES_ITEMS_TABLE}.sales_id=${SALES_TABLE}.id
        LEFT JOIN 
            ${CUSTOMERS_TABLE}
        ON 
            ${SALES_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        LEFT JOIN 
            ${USERS_TABLE}
        ON 
            ${SALES_TABLE}.user_id=${USERS_TABLE}.id
        WHERE 
            ${SALES_TABLE}.id = ?`;

        const params = [id];
        
        const result = await db.query(saleServiceQuery,params);
        return { success: true, data: result.values as SALES_DETAILS_REPORT_DTO[] }
    } catch (error) {
      throw error;
    }
}

export const getPreviousReading = async () => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {

        const query = `SELECT * 
                FROM ${Z_READINGS_TABLE} 
                ORDER BY id DESC 
                LIMIT 1`;


        const result = await db.query(query);
        const data = (result.values ?? [])[0] as Z_READINGS;
        if (!data) {
          return { success: false, message: 'No previous reading found' };
        }
        return { success: true, data: data };
    } catch (error) {
        throw error;
    }
}


export async function generateZReading() {
    const doc = new jsPDF();
  
    // // Add some text to the PDF
    doc.internal.pageSize.width = 80;
    doc.internal.pageSize.height = 1000;
    
    // Set the font and font size
    doc.setFont('Arial');
    doc.setFontSize(10);
    
    // Calculate the margins
    let marginX = 2;
    let marginY = 10;
    
    // Calculate the available width and height
    const availableWidth = doc.internal.pageSize.width;
    const availableHeight = doc.internal.pageSize.height - (marginY * 2);
    
    // Company Name
  
    marginY += 5;
    doc.text('COMPANY NAME', availableWidth / 2, marginY, null, null, 'center');
  
    marginY += 5;
    doc.text('Compnay full address', availableWidth / 2, marginY, null, null, 'center');
  
    marginY += 5;
    doc.text('TIN: Customer TIN', availableWidth / 2, marginY, null, null, 'center');
  
    marginY += 5;
    doc.text('SN: POS Serial Number', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('PN: Permit No.', availableWidth / 2, marginY, null, null, 'center');
  
    marginY += 5;
    doc.text('ACRED No.: Accreditation Number', availableWidth / 2, marginY, null, null, 'center');
  
    marginY += 5;
    doc.text('MIN: Accreditation Number', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('Terminal: 001', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('SALES', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('MM/dd/yyyy', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('Print Count', marginX, marginY);
    doc.text('1', availableWidth - marginX, marginY, null, null, 'right');
  
    // Table header
    const dividingLine1Y = marginY + 3;
    doc.line(0, dividingLine1Y, availableWidth, dividingLine1Y);
  
    marginY += 10;
    doc.text('Gross Sales (Net of VAT)', marginX, marginY);
    doc.text('0.00', availableWidth - marginX, marginY, null, null, 'right');
  
    marginY += 5;
    doc.text('Regular Discount', marginX, marginY);
    doc.text('0.00', availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text('Senior Discount', marginX, marginY);
    doc.text('0.00', availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text('PWD Discount', marginX, marginY);
    doc.text('0.00', availableWidth - marginX, marginY, null, null, 'right');
  
    marginY += 5;
    doc.text('Sales Return', marginX, marginY);
    doc.text('0.00', availableWidth - marginX, marginY, null, null, 'right');
  
    marginY += 5;
    doc.text('Net Sales', marginX, marginY);
    doc.text('0.00', availableWidth - marginX, marginY, null, null, 'right');
  
    const dividingLine2Y = marginY + 5;
    doc.line(0, dividingLine2Y, availableWidth, dividingLine2Y);
  
    let y = dividingLine2Y + 5; // initialized y
  
    doc.text('Cash', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('Refund', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    const dividingLine3Y = y + 3;
    doc.line(0, dividingLine3Y, availableWidth, dividingLine3Y);
  
    y = dividingLine3Y + 5;
    doc.text('Total Collection', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    const dividingLine4Y = y + 3;
    doc.line(0, dividingLine4Y, availableWidth, dividingLine4Y);
  
    y = dividingLine4Y + 5;
    doc.text('VAT Sales', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('VAT Sales', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
    
    y += 5;
    doc.text('VAT Amount', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('Non-VAT', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('VAT Exempt', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('VAT Zero Rated', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    const dividingLine5Y = y + 3;
    doc.line(0, dividingLine5Y, availableWidth, dividingLine5Y);
  
    y = dividingLine5Y + 5;
    doc.text('Total', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
    
    const dividingLine6Y = y + 3;
    doc.line(0, dividingLine6Y, availableWidth, dividingLine6Y);
  
    y = dividingLine6Y + 5;
    doc.text('Counter ID Start', marginX, y);
    doc.text('0000000001', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('Counter ID End', marginX, y);
    doc.text('0000000002', availableWidth - marginX, y, null, null, 'right');
  
    const dividingLine7Y = y + 3;
    doc.line(0, dividingLine7Y, availableWidth, dividingLine7Y);
  
    y = dividingLine7Y + 5;
    doc.text('Cancelled Tx.', marginX, y);
    doc.text('0', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('Cancelled Amount', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    const dividingLine8Y = y + 3;
    doc.line(0, dividingLine8Y, availableWidth, dividingLine8Y);
  
    y = dividingLine8Y + 5;
    doc.text('No. of Transactions', marginX, y);
    doc.text('2', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('No. of SKU', marginX, y);
    doc.text('2', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('Total Quantity', marginX, y);
    doc.text('2', availableWidth - marginX, y, null, null, 'right');
  
    const dividingLine9Y = y + 3;
    doc.line(0, dividingLine9Y, availableWidth, dividingLine9Y);
  
    y = dividingLine9Y + 5;
    doc.text('Accumulated Gross Sales (Net of VAT)', marginX, y);
    
    y += 10;
    doc.text('Previous Reading', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('Gross Sales (Net of Vat)', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('Accum. Gross Sales', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    
    const dividingLine10Y = y + 3;
    doc.line(0, dividingLine10Y, availableWidth, dividingLine10Y);
  
    y = dividingLine10Y + 5;
    doc.text('Accumulated Net Sales', marginX, y);
    
    y += 10;
    doc.text('Previous Reading', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('Net Sales', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    y += 5;
    doc.text('Accum. Net Sales', marginX, y);
    doc.text('0.00', availableWidth - marginX, y, null, null, 'right');
  
    
    const dividingLine11Y = y + 3;
    doc.line(0, dividingLine11Y, availableWidth, dividingLine11Y);
  
    y = dividingLine11Y + 5;
    doc.text('Z-Reading Counter', marginX, y);
    doc.text('1', availableWidth - marginX, y, null, null, 'right');
  
    const user = 'admin'
    const date_time = new Date().toLocaleString()
  
    y += 5;
    doc.text(`Printed By: ${user}`, marginX, y);
    
    y += 5;
    doc.text(`Printed Date/Time: ${date_time}`, marginX, y);
  
    const dividingLine12Y = y + 5;
    doc.line(0, dividingLine12Y, availableWidth, dividingLine12Y);
  
    y = dividingLine12Y + 5;
    doc.text('POS VENDOR:', availableWidth / 2, y, null, null, 'center');
  
    y += 5;
    doc.text('Vendor Address', availableWidth / 2, y, null, null, 'center');
  
    y += 5;
    doc.text('VAT REG TIN: ', availableWidth / 2, y, null, null, 'center');
  
    y += 10;
    doc.text('ACRED No.: Accreditation Number: ', availableWidth / 2, y, null, null, 'center');
  
    y += 5;
    doc.text('Date Issued: ', availableWidth / 2, y, null, null, 'center');
  
    y += 5;
    doc.text('Valid Until: ', availableWidth / 2, y, null, null, 'center');
  
    y += 10;
    doc.text('PTU No: ', availableWidth / 2, y, null, null, 'center');
    
    y += 5;
    doc.text('Date Issued: ', availableWidth / 2, y, null, null, 'center');
    
    y += 5;
    doc.text('Valid Until: ', availableWidth / 2, y, null, null, 'center');
  
    const footer_text1 = 'THIS INVOICE SHALL BE VALID FOR FIVE'
    const footer_text2 = '(5) YEARS FROM THE DATE OF THE'
    const footer_text3 = 'PERMIT TO USE'
  
    y += 10;
    doc.text(footer_text1, availableWidth / 2, y, null, null, 'center');
    y += 5;
    doc.text(footer_text2, availableWidth / 2, y, null, null, 'center');
    y += 5;
    doc.text(footer_text3, availableWidth / 2, y, null, null, 'center');
    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await openPDFBasedOnPlatform(pdfUrl, pdfBlob)
  }