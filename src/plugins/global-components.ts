// src/global-components.ts
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonApp,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonRouterOutlet,
    IonSplitPane,
    IonAccordion,
    IonAccordionGroup,
    IonButtons,  
    IonMenuButton, 
    IonSearchbar,
    IonTabs,
    IonTabBar, 
    IonTabButton, 
    IonActionSheet,
    actionSheetController,
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardSubtitle, 
    IonCardTitle,
    IonDatetime,
    IonDatetimeButton,
    IonChip,
    IonBackButton,
    IonItemDivider, 
    IonItemGroup,
    IonNav,
    IonToast,
    IonTextarea,
    IonInput,
    // IonInputPasswordToggle,
    IonFab,
    IonFabButton,
    IonCol, IonGrid, IonRow,
    IonAvatar, IonModal,
    IonCheckbox, 
    IonAlert,
    IonSelect, IonSelectOption,
    IonPopover,
    IonNavLink,
    toastController 
    // ... add other Ionic components you need
  } from '@ionic/vue';
  import { App } from 'vue';
  
  const GlobalComponents = {
    install(app: App) {
      app.component('IonPage', IonPage);
      app.component('IonHeader', IonHeader);
      app.component('IonToolbar', IonToolbar);
      app.component('IonTitle', IonTitle);
      app.component('IonContent', IonContent);
      app.component('IonButton', IonButton);
      app.component('IonApp', IonApp);
      app.component('IonIcon', IonIcon);
      app.component('IonItem', IonItem);
      app.component('IonLabel', IonLabel);
      app.component('IonList', IonList);
      app.component('IonListHeader', IonListHeader);
      app.component('IonMenu', IonMenu);
      app.component('IonMenuToggle', IonMenuToggle);
      app.component('IonNote', IonNote);
      app.component('IonRouterOutlet', IonRouterOutlet);
      app.component('IonSplitPane', IonSplitPane);
      app.component('IonAccordion', IonAccordion);
      app.component('IonAccordionGroup', IonAccordionGroup);
      app.component('IonButtons', IonButtons);
      app.component('IonMenuButton', IonMenuButton);
      app.component('IonSearchbar', IonSearchbar);
      app.component('IonTabs', IonTabs);
      app.component('IonTabBar', IonTabBar);
      app.component('IonTabButton', IonTabButton);
      app.component('IonActionSheet', IonActionSheet);
      app.component('actionSheetController', actionSheetController);
      app.component('IonCard', IonCard);
      app.component('IonCardContent', IonCardContent);
      app.component('IonCardHeader', IonCardHeader);
      app.component('IonCardSubtitle', IonCardSubtitle);
      app.component('IonCardTitle', IonCardTitle);
      app.component('IonDatetime', IonDatetime);
      app.component('IonDatetimeButton', IonDatetimeButton);
      app.component('IonChip', IonChip);
      app.component('IonBackButton', IonBackButton);
      app.component('IonItemDivider', IonItemDivider);
      app.component('IonItemGroup', IonItemGroup);
      app.component('IonNav', IonNav);
      app.component('IonToast', IonToast);
      
      app.component('IonTextarea', IonTextarea);
      app.component('IonInput', IonInput);
      // app.component('IonInputPasswordToggle', IonInputPasswordToggle);
      app.component('IonFab', IonFab);
      app.component('IonFabButton', IonFabButton);

      app.component('IonCol', IonCol);
      app.component('IonGrid', IonGrid);
      app.component('IonRow', IonRow);
      app.component('IonAvatar', IonAvatar);
      app.component('IonModal', IonModal);
      app.component('IonCheckbox', IonCheckbox);
      app.component('IonAlert', IonAlert);

      app.component('IonSelectOption', IonSelectOption);
      app.component('IonSelect', IonSelect);
      app.component('IonPopover', IonPopover);
      app.component('IonNavLink', IonNavLink);
      app.component('toastController', toastController);
      
      
    // ... register other Ionic components here
    
    }
  };
  
  export default GlobalComponents;
  