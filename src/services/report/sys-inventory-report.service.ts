import jsPDF from "jspdf";
import { Storage } from '@capacitor/storage';
import { getInventoryReport } from "../sys-inventory.service";
import { openPDFBasedOnPlatform } from "@/composables/pdf-opener";

export async function generateInventoryReport() {
    const doc = new jsPDF();

    // const { value } = await Storage.get({ key: 'sysSettings' });
    // const sysSettings = JSON.parse(value as string);
    const item_inventory = await getInventoryReport()
    
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
    doc.text("Inventory Report", availableWidth / 2, marginY, null, null, 'center');


    item_inventory.forEach((row) => {
        const dividingLine1Y = marginY + 5;
        doc.line(0, dividingLine1Y, availableWidth, dividingLine1Y);
    
        marginY = dividingLine1Y + 5;
        doc.text(row.item_description, marginX, marginY);
        marginY += 5;
        doc.text(`Transaction: ${row.trx_type}-${row.reference} Date: ${row.trx_date}`, marginX, marginY);
        marginY += 5;
        doc.text(`Quantity: ${row.quantity}`, marginX, marginY);
        marginY += 5;
        doc.text(`Cost: ${row.cost}`, marginX, marginY);
        marginY += 5;
        doc.text(`Price: ${row.price}`, marginX, marginY);
    });

    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await openPDFBasedOnPlatform(pdfUrl, pdfBlob)
}