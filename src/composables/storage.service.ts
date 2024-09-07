import { Storage } from '@capacitor/storage';

class StorageService {
  async getData(key:any) {
    const { value } = await Storage.get({ key });
    return value;
  }

  async storeData(key:any, value:any) {
    await Storage.set({ key, value });
  }
}

export default StorageService;