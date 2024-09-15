// usePhotoGallery.ts
import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { savePicture } from './file-system-function';

export const usePhotoGallery = () => {
  // State to store the path of the saved photo
  const savedPhotoPath = ref<string | null>(null);

  // Function to take a photo
  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      
      // await savePicture(photo,'sample.jpg'); // Store the photo in the filesystem
      return photo; // Return data URL for immediate display
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  };

  const selectPhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        quality: 100,
      });

      
      await savePicture(photo,'sample.jpg'); // Store the photo in the filesystem
      return photo; // Return data URL for immediate display
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  };


  // Function to load an image from the filesystem
  const loadImageFromFilesystem = async (filePath: string) => {
    try {
      console.log('loadImageFromFilesystem')

      const result = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Documents,
      });

      const blob = new Blob([result.data], { type: 'image/jpeg' });
      const objectUrl = URL.createObjectURL(blob);
      return objectUrl; // Return object URL for displaying
    } catch (error) {
      console.error('Error loading image from filesystem:', error);
      return null;
    }
  };

  return {
    takePhoto,
    selectPhoto,
    loadImageFromFilesystem,
    savedPhotoPath, // Expose saved photo path for tracking
  };
};
