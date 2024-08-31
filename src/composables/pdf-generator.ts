import jsPDF from 'jspdf';
import { ref } from 'vue';

export async function generatePDF(): Promise<string> {
    const doc = new jsPDF();
    const pdf_src = ref('');

    // import('jspdf').then(module => {
    //     const { jsPDF } = module;
    //     const doc = new jsPDF();
    //     // Use jsPDF here
    // });
    // Add a title to the PDF
    doc.text('My PDF Document', 10, 10);
    // Add some text to the PDF
    doc.text('This is a sample PDF document generated using jsPDF.', 10, 20);

    // Get the PDF data as a blob
    const pdfBlob = doc.output('blob');
    // console.log('Blob ',pdfBlob)
    // // Create a blob URL for the PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);
    pdf_src.value = pdfUrl
    // console.log('URL ', pdf_src.value)
    // window.open(pdfUrl); // for web 
    return pdfUrl
}