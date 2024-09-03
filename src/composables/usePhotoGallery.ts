import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { savePicture } from './file-system-function';

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

export const usePhotoGallery = async () => {
    const photos = ref<UserPhoto[]>([]);

    const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
    });
    // const fileName = Date.now() + '.jpeg';
    // const savedFileImage = {
    //     filepath: fileName,
    //     webviewPath: photo.webPath,
    // };
    
    const fileName = Date.now() + '.jpeg';
    const savedFileImage = await savePicture(photo, fileName);
    
    photos.value = [savedFileImage, ...photos.value];
    console.log('phptos value ', photos.value);
    
        
    return photos.value;
}

