// src/composables/alert.ts
import { ref } from 'vue';

export function useAlert() {
  const open_alert = ref(false);
  const alertTitle = ref('');
  const alertMessage = ref('');
  const alertSubTitle = ref('');
  const confirmHandler = ref<() => void | null>();

  // Removed the explicit type annotation for `subTitle`
  const showAlert = (title: string, message: string, onConfirm: () => void, subTitle = '') => {
    alertTitle.value = title;
    alertMessage.value = message;
    alertSubTitle.value = subTitle;
    confirmHandler.value = onConfirm;
    open_alert.value = true;
  };

  const handleConfirm = () => {
    if (confirmHandler.value) {
      confirmHandler.value();
    }
    open_alert.value = false;
  };

  return {
    open_alert,
    alertTitle,
    alertMessage,
    alertSubTitle,
    showAlert,
    handleConfirm
  };
}
