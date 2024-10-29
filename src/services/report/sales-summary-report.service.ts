import jsPDF from "jspdf";
import { Storage } from '@capacitor/storage';
import { getInventoryReport } from "../sys-inventory.service";
import { openPDFBasedOnPlatform } from "@/composables/pdf-opener";
import { DBConnectionService } from "../database.connection";
import { SALES_DETAILS_REPORT_DTO } from "@/models/sales-detail-report.model";
import { CUSTOMERS_TABLE, DISCOUNTS_TABLE, ITEMS_TABLE, SALES_ITEMS_TABLE, SALES_TABLE, TABLES_TABLE, COLLECTIONS_TABLE, USERS_TABLE, TABLE_GROUP_LINES_TABLE } from "@/schema/tables";
import { SALES_SUMMARY_REPORT_DTO } from "@/models/sales-summary-report.model";


export async function generateSalesSummaryReport(start_date:string, end_date:string) {
    const doc = new jsPDF();

    const sales_detail_report = await getSalesSummaryReport(start_date,end_date);
    const sales_report = sales_detail_report.data;
    console.log(sales_report);
    
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
    doc.text("Sales Summary Report", availableWidth / 2, marginY, null, null, 'center');


    const dividingLine1Y = marginY + 5;
    doc.line(0, dividingLine1Y, availableWidth, dividingLine1Y);

    sales_report.forEach((row) => {
        marginY = dividingLine1Y + 5;
        doc.text(`SI-${row.sales_number} Date: ${row.sales_date}`, marginX, marginY);
        marginY += 5;
        doc.text(row.customer, marginX, marginY);
        marginY += 5;
        doc.text(`Remarks: ${row.remarks}`, marginX, marginY);
        marginY += 5;
        doc.text(`Total Amount: ${row.total_amount}`, marginX, marginY);
        marginY += 5;
        doc.text(`Balance Amount: ${row.balance_amount}`, marginX, marginY);
        marginY += 5;
        // doc.text(`Price: ${row.price}`, marginX, marginY);
        
        const dividingLine2Y = marginY + 5;
        doc.line(0, dividingLine2Y, availableWidth, dividingLine2Y);
    });

    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await openPDFBasedOnPlatform(pdfUrl, pdfBlob)
}

export const getSalesSummaryReport = async (start_date:string, end_date:string) => {
    const dbConnectionService = await DBConnectionService.getInstance();
    const db = await dbConnectionService.getDatabaseConnection();
    try {
      if (!db) {
        throw new Error('Database connection not open');
      }
  
        const saleServiceQuery = `
        SELECT ${SALES_TABLE}.id,
            ${SALES_TABLE}.user_id,
            ${USERS_TABLE}.first_name || ' ' ||${USERS_TABLE}.last_name AS user,
            ${SALES_TABLE}.sales_number,
            ${SALES_TABLE}.sales_date,
            ${SALES_TABLE}.terminal_number,
            ${SALES_TABLE}.customer_id,
            ${CUSTOMERS_TABLE}.customer_code,
            ${CUSTOMERS_TABLE}.customer,
            ${CUSTOMERS_TABLE}.address AS customer_address,
            ${CUSTOMERS_TABLE}.tin AS customer_tin,
            ${SALES_TABLE}.table_id,
            ${TABLES_TABLE}.table_code,
            ${SALES_TABLE}.total_amount,
            ${SALES_TABLE}.net_amount,
            ${SALES_TABLE}.balance_amount,
            ${SALES_TABLE}.paid_amount,
            ${SALES_TABLE}.discount_amount,
            ${SALES_TABLE}.no_of_pax,
            ${SALES_TABLE}.remarks,
            ${SALES_TABLE}.status,
            ${SALES_TABLE}.is_locked,
            ${SALES_TABLE}.is_billed_out,
            ${SALES_TABLE}.is_cancelled,
            ${SALES_TABLE}.senior_pwd_id,
            ${SALES_TABLE}.senior_pwd_name,
            ${COLLECTIONS_TABLE}.id as collection_id
        FROM ${SALES_TABLE}
        LEFT JOIN ${USERS_TABLE}
        ON ${SALES_TABLE}.user_id=${USERS_TABLE}.id
        LEFT JOIN ${CUSTOMERS_TABLE}
        ON ${SALES_TABLE}.customer_id=${CUSTOMERS_TABLE}.id
        LEFT JOIN ${TABLE_GROUP_LINES_TABLE}
        ON ${SALES_TABLE}.table_id=${TABLE_GROUP_LINES_TABLE}.id
        LEFT JOIN ${TABLES_TABLE}
        ON ${TABLE_GROUP_LINES_TABLE}.table_id=${TABLES_TABLE}.id
        LEFT JOIN ${SALES_ITEMS_TABLE}
        ON (${SALES_TABLE}.id=${SALES_ITEMS_TABLE}.sales_id)
        LEFT JOIN ${ITEMS_TABLE}
        ON ${SALES_ITEMS_TABLE}.item_id=${ITEMS_TABLE}.id
        LEFT JOIN ${COLLECTIONS_TABLE}
        ON ${COLLECTIONS_TABLE}.sales_id=${SALES_TABLE}.id
        WHERE ${SALES_TABLE}.sales_date >= ? AND ${SALES_TABLE}.sales_date <= ?
        `;
        const params = [start_date, end_date];
      
      const result = await db.query(saleServiceQuery,params);
      console.log(result)
      return { success: true, data: result.values as SALES_SUMMARY_REPORT_DTO[] };
    } catch (error) {
      throw error;
    }
};
