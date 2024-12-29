import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';

const platform = Capacitor.getPlatform();

export async function openPDFBasedOnPlatform(pdfUrl:string , pdfBlob:Blob) {
    
    if(platform === 'web'){
        window.open(pdfUrl); // for web 
    }else{
        // // Convert the Blob to a base64 string
        const base64Data = await blobToBase64PDF(pdfBlob);
        // Now use a local file URI or open with FileOpener if necessary
         await openPDFWithFileOpener(base64Data);

        // // Write the file to the filesystem
        // const fileName = "myfile.pdf";
        // // const { uri } = await Filesystem.writeFile({
        // //     path: fileName,
        // //     data: base64Data,
        // //     directory: Directory.Documents,
        // // });

        // // Get the file URI
        // const fileUriResult = await Filesystem.getUri({
        //     directory: Directory.Documents,
        //     path: pdfUrl,
        // });
        // // Convert file URI for Android
        // const filePath = Capacitor.convertFileSrc(fileUriResult.uri);

        // // const fileUri = `file://${uri}`;
        
        // await FileOpener.openFile({
        //     path: filePath,
        // });
    }
}


async function blobToBase64PDF(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove the Data URL prefix to keep the pure base64 string
        resolve(base64data.split(',')[1]);
      };
      reader.onerror = reject;
    });
}

async function openPDFWithFileOpener(base64Data: string) {
    // Write the file to temporary storage, open with FileOpener
    const tempFilePath = 'temp/file.pdf';

    // Check if the directory exists
    const directoryExists = await checkIfDirectoryExists('temp');
    // If the directory doesn't exist, create it
    if (!directoryExists) {
        await Filesystem.mkdir({
          path: 'temp', // Create the 'temp' folder inside the Cache directory
          directory: Directory.Cache,
          recursive: true,  // Create the directory if it doesn't exist
        });
    }
    
    // You may need to save the file to the filesystem in some cases on Android/iOS
    // This is a workaround for opening a PDF file from base64 data
    const { uri } = await Filesystem.writeFile({
      path: tempFilePath,
      data: base64Data,
      directory: Directory.Cache,  // Store temporarily in Cache
    });
  
    // Convert the uri to the correct file path format (file://)
    const filePath = `file://${uri}`; // Convert to file:// path manually

    // Open the file using FileOpener or any native PDF viewer
    await FileOpener.openFile({
      path: filePath, // Convert to file path
    });
}

async function checkIfDirectoryExists(path: string): Promise<boolean> {
    try {
      await Filesystem.readdir({
        path: path,
        directory: Directory.Cache,
      });
      return true; // Directory exists
    } catch (error) {
      return false; // Directory doesn't exist
    }
  }