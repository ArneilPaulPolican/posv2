// src/global.d.ts
import { IconSet } from './plugins/icons';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $icons: IconSet;
  }
}
