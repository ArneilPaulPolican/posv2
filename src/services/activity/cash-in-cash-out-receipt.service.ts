import { openPDFBasedOnPlatform } from "@/composables/pdf-opener";
import { CASH_IN_OUTS_DTO } from "@/models/cashin-cashout.model";
import jsPDF from "jspdf";
import { Storage } from '@capacitor/storage';

export async function generateCashInCashOutReceipt(cash_in_cash_out: CASH_IN_OUTS_DTO) {
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
    // Company Name
    marginY += 5;
    doc.text(sysSettings?.customer ?? "TEST Company", availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(sysSettings?.customer_address ?? "Address", availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(`TIN: ${sysSettings?.customer_tin}`, availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text("Cash In Cash Out receipt", availableWidth / 2, marginY, null, null, 'center');    

    const dividingLine1Y = marginY + 5;
    doc.line(0, dividingLine1Y, availableWidth, dividingLine1Y);

    marginY = dividingLine1Y +5;
    doc.text(`Cash In / Cash Out No.: ${cash_in_cash_out.cash_in_out_number}`, marginX, marginY);
    // doc.text(cash_in_cash_out.cash_in_out_number, availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`Reference No.: ${cash_in_cash_out.refund_reference_number}`, marginX, marginY);
    // doc.text(cash_in_cash_out.refund_reference_number, availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`Status : ${cash_in_cash_out.status}`, marginX, marginY);
    // doc.text(cash_in_cash_out.status, availableWidth - marginX, marginY, null, null, 'right');

    marginY += 5;
    doc.text(`Remarks: ${cash_in_cash_out.remarks}`, marginX, marginY);

    marginY += 10;
    doc.text(`${cash_in_cash_out.cash_1000} pcs 1000 bills`, marginX, marginY);
    doc.text((1000 * cash_in_cash_out.cash_1000).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    

    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_500} pcs 500 bills`, marginX, marginY);
    doc.text((500 * cash_in_cash_out.cash_500).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_200} pcs 200 bills`, marginX, marginY);
    doc.text((200 * cash_in_cash_out.cash_200).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_100} pcs 100 bills`, marginX, marginY);
    doc.text((100 * cash_in_cash_out.cash_100).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_50} pcs 50 bills`, marginX, marginY);
    doc.text((50 * cash_in_cash_out.cash_50).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_20} pcs 20 bills/coins`, marginX, marginY);
    doc.text((20 * cash_in_cash_out.cash_20).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 10;
    doc.text(`${cash_in_cash_out.cash_10} pcs 10 coins`, marginX, marginY);
    doc.text((10 * cash_in_cash_out.cash_10).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_5} pcs 5 coins`, marginX, marginY);
    doc.text((5 * cash_in_cash_out.cash_5).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_1} pcs 1 coins`, marginX, marginY);
    doc.text((1 * cash_in_cash_out.cash_1).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 10;
    doc.text(`${cash_in_cash_out.cash_dot_25} pcs 25 cents`, marginX, marginY);
    doc.text((0.25 * cash_in_cash_out.cash_dot_25).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_dot_10} pcs 10 cents`, marginX, marginY);
    doc.text((0.10 * cash_in_cash_out.cash_dot_10).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_dot_5} pcs 5 cents`, marginX, marginY);
    doc.text((0.05 * cash_in_cash_out.cash_dot_5).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    
    marginY += 5;
    doc.text(`${cash_in_cash_out.cash_dot_1} pcs 1 cents`, marginX, marginY);
    doc.text((0.01 * cash_in_cash_out.cash_dot_1).toFixed(2), availableWidth - marginX, marginY, null, null, 'right');
    


    const dividingLine2Y = marginY + 5;
    doc.line(0, dividingLine2Y, availableWidth, dividingLine2Y);

    marginY = dividingLine2Y + 5;
    doc.text('Amount.', marginX, marginY);
    doc.text(cash_in_cash_out.amount.toFixed(2), availableWidth - marginX, marginY, null, null, 'right');

    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await openPDFBasedOnPlatform(pdfUrl, pdfBlob)
}