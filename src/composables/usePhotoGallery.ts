// usePhotoGallery.ts
import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { savePicture } from './file-system-function';
import { Storage } from '@capacitor/storage';

export const usePhotoGallery = () => {
  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    // return photo.dataUrl;
    await storeImage(photo);
  };

  async function loadImageFromFilesystem() {
    const result = await Filesystem.readFile({
      path: 'path/to/image.jpg',
      directory: Directory.Data
    });
  
    const blob = new Blob([result.data], { type: 'image/jpeg' });
    const objectUrl = URL.createObjectURL(blob);
    return objectUrl;
  }

  const storeImage = async (photo: Photo) => {
    const fileName = Date.now() + '.jpeg';
    const savedFileImage = {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
    
    if (photo.webPath) {
        const res = await Filesystem.writeFile({
            path: `${Directory.Documents}/${fileName}`,
            data: await fetch(photo.webPath).then(response => response.blob()),
            directory: Directory.Documents,
        });
        console.log('storeImage',res);
        return `${Directory.Documents}/${fileName}`; 
    }
  };

  return {
    takePhoto
  };
};