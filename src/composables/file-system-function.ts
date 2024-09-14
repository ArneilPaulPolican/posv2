import { Photo } from "@capacitor/camera";
// import { UserPhoto } from "./usePhotoGallery";
import { Directory, Filesystem } from "@capacitor/filesystem";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: string;
  
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    base64Data = (await convertBlobToBase64(blob)) as string;
  
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });
  
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    }
  );
