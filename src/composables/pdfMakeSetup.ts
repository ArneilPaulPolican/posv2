// pdfMakeSetup.ts
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Assign fonts to pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default pdfMake;
