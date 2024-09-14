import jsPDF from "jspdf";
import { Storage } from '@capacitor/storage';
import { getInventoryReport } from "../sys-inventory.service";
import { openPDFBasedOnPlatform } from "@/composables/pdf-opener";
import { DBConnectionService } from "../database.connection";
import { SALES_DETAILS_REPORT_DTO } from "@/models/sales-detail-report.model";
import { CUSTOMERS_TABLE, DISCOUNTS_TABLE, ITEMS_TABLE, SALES_ITEMS_TABLE, SALES_TABLE, TAXES_TABLE, UNITS_TABLE, USERS_TABLE } from "@/schema/tables";

export async function generateSalesDetailReport(start_date:string, end_date:string) {
    const doc = new jsPDF();

    const sales_detail_report = await getSalesDetailReport(start_date,end_date);
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
    doc.text("Sales Detail Report", availableWidth / 2, marginY, null, null, 'center');


    const dividingLine1Y = marginY + 5;
    doc.line(0, dividingLine1Y, availableWidth, dividingLine1Y);

    sales_report.forEach((row) => {
        marginY = dividingLine1Y + 5;
        doc.text(`SI-${row.sales_number} Date: ${row.sales_date}`, marginX, marginY);
        marginY += 5;
        doc.text(row.item_description, marginX, marginY);
        marginY += 5;
        doc.text(`Quantity: ${row.quantity}`, marginX, marginY);
        marginY += 5;
        doc.text(`Cost: ${row.item_cost}`, marginX, marginY);
        marginY += 5;
        doc.text(`Price: ${row.price}`, marginX, marginY);
        
        const dividingLine2Y = marginY + 5;
        doc.line(0, dividingLine2Y, availableWidth, dividingLine2Y);
    });

    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await openPDFBasedOnPlatform(pdfUrl, pdfBlob)
}

export const getSalesDetailReport = async (start_date:string, end_date:string) => {
  const dbConnectionService = await DBConnectionService.getInstance();
  const db = await dbConnectionService.getDatabaseConnection();
  try {
    if (!db) {
        throw new Error('Database connection not open');
    }

    // const start_date = new Date().toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit'
    //     });
    // const end_date = new Date().toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit'
    //     })
    
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
  ${SALES_TABLE}.sales_date >= ? AND ${SALES_TABLE}.sales_date <= ?`;
    const params = [start_date, end_date];
    
    const result = await db.query(saleServiceQuery,params);
    console.log(result)
    return { success: true, data: result.values as SALES_DETAILS_REPORT_DTO[] }
  } catch (error) {
    console.log(error)
    throw error;
  }
}