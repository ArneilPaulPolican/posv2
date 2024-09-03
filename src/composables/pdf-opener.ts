import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';

const platform = Capacitor.getPlatform();

export async function openPDFBasedOnPlatform(pdfUrl:string , pdfBlob:Blob) {
    
    console.log('platform', platform)
    if(platform === 'web'){
        window.open(pdfUrl); // for web 
    }else{
        // // Convert the Blob to a base64 string
        const base64Data = await blobToBase64PDF(pdfBlob);

        // Write the file to the filesystem
        const { uri } = await Filesystem.writeFile({
            path: 'myfile.pdf',
            data: base64Data,
            directory: Directory.Documents,
        });

        const fileUri = `file://${uri}`;
        console.log('fileUri',fileUri);
        await FileOpener.openFile({
            path: fileUri,
        });
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