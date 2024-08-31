import { inject, provide,ref } from 'vue';
import AlertComponent from '@/components/Modal/AlertComponent.vue';

const ALERT_TOKEN = 'alert';

export function provideAlert() {
  provide(ALERT_TOKEN, new AlertService());
}

export function useAlert() {
  return inject(ALERT_TOKEN) as AlertService;
}

class AlertService {
  private alertComponent: InstanceType<typeof AlertComponent> | null = null;
  async show(title: string, message: string) {
    if (!this.alertComponent) {
      this.alertComponent = new AlertComponent();
    }
    if (this.alertComponent){
        this.alertComponent.$refs.title = ref(title);
        this.alertComponent.$refs.message = ref(message);
        // this.alertComponent.show();

    }
  }

  async hide() {
    if (this.alertComponent) {
    //   this.alertComponent.hide();
    }
  }
}