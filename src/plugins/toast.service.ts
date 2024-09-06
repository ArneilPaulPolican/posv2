import { toastController } from "@ionic/vue";
import { Icon } from "ionicons/dist/types/components/icon/icon";
import { icons } from "./icons";

export async function presentToast(message: string, position: 'top' | 'middle' | 'bottom' = 'bottom', duration: number = 1500) {
    const toast = await toastController.create({
      message: message,
      duration: duration,
      position: position,
    });

    await toast.present();
}

