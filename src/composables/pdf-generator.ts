
import jsPDF from 'jspdf';
import { ref } from 'vue';
import { openPDFBasedOnPlatform } from './pdf-opener';
import html2canvas from 'html2canvas';
import { SALES_DTO } from '@/models/sales.model';
import { SALES_ITEM_DTO } from '@/models/sales-item.model';


export async function generateSales(sales: SALES_DTO, sales_items: SALES_ITEM_DTO[]) {
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
    doc.text('SALES', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text(`Terminal: ${sales.terminal_number}`, availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text(sales.sales_number, availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text(sales.sales_date, availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text(sales.sales_time, availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('First Print', availableWidth / 2, marginY, null, null, 'center');
    
    // Table header
    
    const dividingLine1Y = marginY + 5;
    doc.line(0, dividingLine1Y, availableWidth, dividingLine1Y);

    marginY += 10;
    doc.text('Item Desc.', marginX, marginY);
    doc.text('Amount', availableWidth - marginX, marginY, null, null, 'right');
    const dividingLine2Y = marginY + 5;
    doc.line(0, dividingLine2Y, availableWidth, dividingLine2Y);
    
    let y = marginY + 10;

    let _amount = 0;
    let _net_amount = 0;
    let _vatable_sales = 0;
    let _vat_amount = 0;
    let _non_vat_amount = 0;
    let _zero_rated_amount = 0;
    let _vat_exempt = 0;
    
    for (let i = 0; i < sales_items.length; i++) {
        const item = sales_items[i] //items[i];
        const textWidth = availableWidth - (marginX * 10); // available width for text
        const qtyWidth = marginX; // width for quantity

        if (item.tax_rate > 0){
            _vatable_sales += parseFloat((item.tax_amount ?? 0).toFixed(2));
        }else{
            if(item.tax !== undefined){
                if( item.tax.toLowerCase().includes('non')){
                    _non_vat_amount += parseFloat((item.amount ?? 0).toFixed(2));
                }
                if(item.tax.toLowerCase().includes('zero')){
                    _zero_rated_amount += parseFloat((item.amount ?? 0).toFixed(2));
                }
                if(item.discount.toLowerCase().includes('senior') ||
                    item.discount.toLowerCase().includes('pwd')){
                        _vat_exempt += parseFloat((item.amount ?? 0).toFixed(2));
                }
            }
        }
        _vat_amount += parseFloat((item.tax_amount??0).toFixed(2))

        // Split the description text into multiple lines to fit within the available width
        const lines = doc.splitTextToSize(item.item_description, textWidth);
        
        doc.text((item.amount??0).toFixed(2), availableWidth - qtyWidth, y, null, null, 'right');// Print the quantity
        for (let j = 0; j < lines.length; j++) {
            doc.text(lines[j], marginX, y);
            y += 5;
        }

        doc.text(`P${(item.quantity??0).toFixed(2)} ${item.unit_code} ${item.price?.toFixed(2)}`, marginX, y);
        y += 7;

        // Check if the current item will exceed the page height
        if (y > availableHeight) {
            // Add a new page with the same size
            doc.addPage();
            doc.internal.pageSize.width = 80;
            doc.internal.pageSize.height = 100;
            y = marginY;
        }
    }
    
    const dividingLine3Y = y;
    doc.line(0, dividingLine3Y, availableWidth, dividingLine3Y);
    const textWidth = availableWidth - (marginX * 10);
    const leftValueWidth = marginX;
    y += 5;
    doc.text(`Total Sales`, marginX, y); // Total Sales
    doc.text((sales.total_amount ?? 0).toFixed(2), availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales
    y += 5;
    doc.text(`Total Discount`, marginX, y); // Total Discount
    doc.text(sales.discount_amount?.toFixed(2), availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales
    y += 5;
    doc.text(`Net Sales`, marginX, y); // Net Sales
    doc.text((sales.net_amount?? 0).toFixed(2), availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales
    y += 5;
    doc.text(`Total Items`, marginX, y); // Total Items
    doc.text(sales_items.length.toString(), availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales


    const dividingLine4Y = y+5;
    doc.line(0, dividingLine4Y, availableWidth, dividingLine4Y);
    // VAT Analysis
    y = dividingLine4Y +5 ;
    doc.text(`VAT ANALYSIS`, marginX, y); 

    y += 5;
    doc.text(`VAT Sales`, marginX, y); // Total Items
    doc.text(_vatable_sales.toFixed(2), availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales

    y += 5;
    doc.text(`VAT Amount`, marginX, y); // Total Items
    doc.text(_vat_amount.toFixed(2), availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales

    y += 5;
    doc.text(`Non-VAT`, marginX, y); // Total Items
    doc.text(_non_vat_amount.toFixed(2), availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales

    y += 5;
    doc.text(`VAT Exempt`, marginX, y); // Total Items
    doc.text('0', availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales

    y += 5;
    doc.text(`VAT Zero Rated`, marginX, y); // Total Items
    doc.text(_zero_rated_amount.toFixed(2), availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales

    const dividingLine5Y = y+5;
    doc.line(0, dividingLine5Y, availableWidth, dividingLine5Y);

    y = dividingLine5Y + 5;
    doc.text(`Cashier`, marginX, y); // Total Items
    doc.text('admin', availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales

    y += 5;
    doc.text(`Teller`, marginX, y); // Total Items
    doc.text('admin', availableWidth - leftValueWidth, y, null, null, 'right'); // Total Sales

    const dividingLine6Y = y+5;
    doc.line(0, dividingLine6Y, availableWidth, dividingLine6Y);
    
    y = dividingLine6Y + 5;
    const customerText = 'Customer Name';
    const customerUnderline = '_'.repeat(availableWidth); 
    doc.text(`${customerText} ${customerUnderline}`, marginX, y); 

    y +=  5;
    const addressText = 'Address';
    const addressUnderline = '_'.repeat(availableWidth); 
    doc.text(`${addressText} ${addressUnderline}`, marginX, y); 

    y +=  5;
    const tinText = 'TIN';
    const tinUnderline = '_'.repeat(availableWidth); 
    doc.text(`${tinText} ${tinUnderline}`, marginX, y); 

    y +=  5;
    const bsText = 'Business Style';
    const bsUnderline = '_'.repeat(availableWidth); 
    doc.text(`${bsText} ${bsUnderline}`, marginX, y);

    const dividingLine7Y = y+5;
    doc.line(0, dividingLine7Y, availableWidth, dividingLine7Y);

    let remarks = '';
    y = dividingLine7Y + 5;
    doc.text(`Remarks: ${remarks}`, marginX, y);
    
    const dividingLine8Y = y + 5;
    doc.line(0, dividingLine8Y, availableWidth, dividingLine8Y);

    y = dividingLine8Y + 5;
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

    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await openPDFBasedOnPlatform(pdfUrl, pdfBlob)
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
