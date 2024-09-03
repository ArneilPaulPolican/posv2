
import jsPDF from 'jspdf';
import { ref } from 'vue';
import { openPDFBasedOnPlatform } from './pdf-opener';
import html2canvas from 'html2canvas';


export async function generateSales() {
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
    const companyNameY = marginY;
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
    doc.text('Terminal: 001', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('0000000001', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('MM/dd/yyyy', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('HH:mm TT', availableWidth / 2, marginY, null, null, 'center');
    
    marginY += 5;
    doc.text('First Print', availableWidth / 2, marginY, null, null, 'center');
    
    // Company Address
    // const companyAddressX = availableWidth / 2;
    // const companyAddressY = companyNameY + 5;
    // doc.text('Company Address', companyAddressX, companyAddressY, null, null, 'center');
    
    // Table header
    
    const dividingLine1Y = marginY + 5;
    doc.line(0, dividingLine1Y, availableWidth, dividingLine1Y);

    marginY += 10;
    doc.text('Item Desc.', marginX, marginY);
    doc.text('Qty', availableWidth - marginX, marginY, null, null, 'right');
    const dividingLine2Y = marginY + 5;
    doc.line(0, dividingLine2Y, availableWidth, dividingLine2Y);
    
    // Table data
    const items = [
        { desc: 'Example First Item and a very long item description of more texts', qty: 1, price: 100.00 },
        { desc: 'Example Second Item', qty: 100, price: 50.00 },
        { desc: 'Example Third Item', qty: 3, price: 75.00 },
        { desc: 'Example Fourth Item', qty: 41000, price: 25.00 },
        // Add more items here...
      ];
    let y = marginY + 10;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const textWidth = availableWidth - (marginX * 10); // available width for text
        const qtyWidth = marginX; // width for quantity

        // Split the description text into multiple lines to fit within the available width
        const lines = doc.splitTextToSize(item.desc, textWidth);
        
        doc.text(item.qty.toString(), availableWidth - qtyWidth, y, null, null, 'right');// Print the quantity
        for (let j = 0; j < lines.length; j++) {
            doc.text(lines[j], marginX, y);
            y += 5;
        }

        // doc.text(item.desc, marginX, y);
        // doc.text(item.qty.toString(), availableWidth - marginX, y, null, null, 'right');
        doc.text(`Pc(s) P${item.price.toFixed(2)}`, marginX, y);
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
    // const dividingLine4Y = y+5;
    // doc.line(0, dividingLine4Y, availableWidth, dividingLine4Y);
    const textWidth = availableWidth - (marginX * 10);
    const qtyWidth = marginX;
    y += 5;
    doc.text(`Total Sales: `, marginX, y); // Total Sales
    doc.text('100,00.00', availableWidth - qtyWidth, y, null, null, 'right'); // Total Sales
    y += 5;
    doc.text(`Total Discount: `, marginX, y); // Total Discount
    doc.text('100,00.00', availableWidth - qtyWidth, y, null, null, 'right'); // Total Sales
    y += 5;
    doc.text(`Net Sales: `, marginX, y); // Net Sales
    doc.text('100,00.00', availableWidth - qtyWidth, y, null, null, 'right'); // Total Sales
    y += 5;
    doc.text(`Total Items:`, marginX, y); // Total Items
    doc.text('100,00.00', availableWidth - qtyWidth, y, null, null, 'right'); // Total Sales

    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    await openPDFBasedOnPlatform(pdfUrl, pdfBlob)
}


function createHTML(){
      // print sales transaction
      let newPrintPayload = `
        <html>
          <head>
            <style>
              @page {
                margin: 0px;
              }
              @media print {
                html, body {
                  page-break-after: avoid;
                  page-break-before: avoid;
                  page-break-inside: avoid;
                }
              }
              body {
                font-size: 9px;
              }
              .headerDetailsContainer {
                display: flex;
                flex-direction: column;
              }
              .centeredLabel {
                display: inline-block;
                width: 100%;
                text-align: center;
              }
              .boldText {
                font-weight: bold;
              },
              .columnContainer {
                display: flex;
                flex-direction: column;
               }
              .spaceBetweenContainer {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding-right: 0.5em;
                padding-left: 0.5em;
              }
              .paddedLabel {
                padding-left: 0.5em;
              }
              .centeringContainer {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin-top: 1em;
                margin-bottom: 1em;
              }
              #barcodeImage {
                height: 12vh;
                width: 100%;
              }
              #qrcodeImage {
                height: 12vh;
                width: 100%;
              }
            </style>
          </head>
          <body>
            <div class="headerDetailsContainer">
              <label class="centeredLabel">customer</label>
              <label class="centeredLabel">TIN: customerTin</label>
              <label class="centeredLabel">SN: posSerialNumber}</label>
              <label class="centeredLabel">PN: posPermitNumber</label>
              <label class="centeredLabel">ACRED No.: posAccreditationNumber</label>
              <label class="centeredLabel">MIN: posMachineIdentificationNumber </label>
              <label class="centeredLabel">BILL</label>
              <label class="centeredLabel">Terminal: 001</label>
              <label class="centeredLabel">0000000001</label>
              <label class="centeredLabel">MM/dd/yyyy</label>
              <label class="centeredLabel">HH:mm TT</label>
              <label class="centeredLabel">Re-print</label>
            <div>
            <hr />
            <div class="spaceBetweenContainer">
              <label class="boldText">ITEM</label>
              <label class="boldText">AMOUNT</label>
            </div>`;

        newPrintPayload += `
          <div class="spaceBetweenContainer">
            <div class="columnContainer">
              <div>
                <label class="boldText">saleItem.itemDescription</label>
              </div>
              <div>
                <label>itemCode</label>
              </div>
              <div>
                <label>1 unitCode - P 0.00</label>
              </div>`;

          newPrintPayload += `<div><label>0.00</label></div>`;

        newPrintPayload += `</div>`;

        newPrintPayload += `<label>0.00</label>`;

        newPrintPayload += `</div>`;
      

      newPrintPayload += `
          <hr />
          <div class="spaceBetweenContainer">
            <label>Total Sales</label>
            <label>0.00</label>
          </div>
          <div class="spaceBetweenContainer">
            <label>Total Discount</label>
            <label>0.00</label>
          </div>
          <div class="spaceBetweenContainer">
            <label>Net Sales</label>
            <label>0.00</label>
          </div>
          <div class="spaceBetweenContainer">
            <label>Total No. of Item(s)</label>
            <label>sale.noOfItems</label>
          </div>
          <hr />`;


      newPrintPayload += `
        </body>
      </html>`;

    return newPrintPayload
}