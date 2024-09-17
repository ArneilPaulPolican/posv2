
import jsPDF from 'jspdf';
import { ref } from 'vue';
import { openPDFBasedOnPlatform } from '../../composables/pdf-opener';
import html2canvas from 'html2canvas';
import { SALES_DTO } from '@/models/sales.model';
import { SALES_ITEM_DTO } from '@/models/sales-item.model';
import { Storage } from '@capacitor/storage';
import { getSystemSettings } from '@/services/settings/system-settings.service';
import { SYS_SETTINGS } from '@/models/system-settings.model';


export async function generateSales(sales: SALES_DTO, sales_items: SALES_ITEM_DTO[]) {
    const doc = new jsPDF();

    const { value } = await Storage.get({ key: 'sysSettings' });
    const sysSettings = JSON.parse(value as string);
    
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
    doc.text(sysSettings?.customer ?? "TEST Company", availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(sysSettings?.customer_address ?? "Address", availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(`TIN: ${sysSettings?.customer_tin}`, availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(`SN: ${sysSettings?.pos_serial_number}`, availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text(`PN: ${sysSettings?.pos_permit_number}`, availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(`ACRED No.: ${sysSettings?.pos_accreditation_number}`, availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(`MIN: ${sysSettings?.pos_machine_identification_number}`, availableWidth / 2, marginY, null, null, 'center');

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
    if(sales.is_printed){
        doc.text('Reprint', availableWidth / 2, marginY, null, null, 'center');
    }else{
        doc.text('First Print', availableWidth / 2, marginY, null, null, 'center');
    }
    
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

        doc.text(`${(item.quantity??0).toFixed(2)} ${item.unit_code}  P ${item.price?.toFixed(2)}`, marginX, y);
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
    doc.text(`POS VENDOR: ${sysSettings?.pos_vendor}`, availableWidth / 2, y, null, null, 'center');

    y += 5;
    doc.text(`${sysSettings?.pos_vendor_address}`, availableWidth / 2, y, null, null, 'center');

    y += 5;
    doc.text(`VAT REG TIN: ${sysSettings?.pos_vendor_tin}`, availableWidth / 2, y, null, null, 'center');

    y += 10;
    doc.text(`ACRED No.: ${sysSettings?.pos_vendor_accreditation_number}`, availableWidth / 2, y, null, null, 'center');

    y += 5;
    doc.text('Date Issued: ', availableWidth / 2, y, null, null, 'center');

    y += 5;
    doc.text('Valid Until: ', availableWidth / 2, y, null, null, 'center');

    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await openPDFBasedOnPlatform(pdfUrl, pdfBlob)
}