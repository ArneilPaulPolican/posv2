import { openPDFBasedOnPlatform } from "@/composables/pdf-opener";
import { STOCK_IN_ITEMS_DTO } from "@/models/stock-in-item.model";
import { STOCK_IN_DTO } from "@/models/stock-in.model";
import jsPDF from "jspdf";

export async function generateStockInReceipt(stock_in:STOCK_IN_DTO, stock_in_items:STOCK_IN_ITEMS_DTO[]) {
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
    
    marginY += 5;
    doc.text("Stock In Receipt", availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(`IN-${stock_in.in_number}`, availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(`${stock_in.in_date}`, availableWidth / 2, marginY, null, null, 'center');

    marginY += 5;
    doc.text(`${stock_in.remarks}`, availableWidth / 2, marginY, null, null, 'center');

    const dividingLine1Y = marginY + 5;
    doc.line(0, dividingLine1Y, availableWidth, dividingLine1Y);

    // stock_in_items.forEach((row) => {
    //     marginY = dividingLine1Y + 5;
    //     doc.text(row.item_description, marginX, marginY);

    //     marginY += 5;
    //     doc.text(`Quantity: ${row.quantity}`, marginX, marginY);
    //     marginY += 5;
    //     doc.text(`Cost: ${row.cost}`, marginX, marginY);
        
    //     const dividingLine2Y = marginY + 5;
    //     doc.line(0, dividingLine2Y, availableWidth, dividingLine2Y);
    // });

    
    marginY += 10;
    doc.text('Item Description,\nQuantity, Unit and Cost', marginX, marginY);
    doc.text('Amount', availableWidth - marginX, marginY, null, null, 'right');
    const dividingLine2Y = marginY + 5;
    doc.line(0, dividingLine2Y, availableWidth, dividingLine2Y);
    
    let y = marginY + 10;

    for (let i = 0; i < stock_in_items.length; i++) {
        const item = stock_in_items[i] //items[i];
        const textWidth = availableWidth - (marginX * 10); // available width for text
        const qtyWidth = marginX; // width for quantity

        // Split the description text into multiple lines to fit within the available width
        const lines = doc.splitTextToSize(item.item_description, textWidth);
        
        doc.text((item.amount??0).toFixed(2), availableWidth - qtyWidth, y, null, null, 'right');// Print the quantity
        for (let j = 0; j < lines.length; j++) {
            doc.text(lines[j], marginX, y);
            y += 5;
        }

        doc.text(`${(item.quantity??0).toFixed(2)} ${item.unit_code}  P ${item.cost?.toFixed(2)}`, marginX, y);
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

    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await openPDFBasedOnPlatform(pdfUrl, pdfBlob)
}