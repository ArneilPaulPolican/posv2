
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import { useSQLite } from 'vue-sqlite-hook';
import { useState } from './composables/state';
import { defineCustomElements } from "jeep-sqlite/loader";
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Lock } from './services/lock';
import { createTables } from './schema/database_scripts';
import { runAllMigrations } from './services/migration.service';
import GlobalComponents from './plugins/global-components';
import { provideAlert } from './services/alert.service';

import HeaderComponent from './components/Layout/HeaderComponent.vue'
import SidebarComponent from './components/Layout/SidebarMenu.vue'

// const app = createApp(App)
//   .use(IonicVue)
//   .use(router);

// router.isReady().then(() => {
//   app.mount('#app');
// });

// applyPolyfills().then(() => {
//   jeepSqlite(window);
// });
// Correctly initialize the Jeep Sqlite custom elements
defineCustomElements(window);

window.addEventListener('DOMContentLoaded', async () => {
  const dbLock = new Lock(); // Create a new lock
  const platform = Capacitor.getPlatform();
  const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)

  const app = createApp(App)
    .use(IonicVue)
    .use(router)
    .use(GlobalComponents);
  
  app.component('Header', HeaderComponent)
  app.component('Sidebar', SidebarComponent)
  provideAlert();
  /* SQLite Global Variables*/

  // Only if you want to use the onProgressImport/Export events
  // const [jsonListeners, setJsonListeners] = useState(false);
  // const [isModal, setIsModal] = useState(false);
  // const [message, setMessage] = useState("");
  // app.config.globalProperties.$isModalOpen = {isModal: isModal, setIsModal: setIsModal};
  // app.config.globalProperties.$isJsonListeners = {jsonListeners: jsonListeners, setJsonListeners: setJsonListeners};
  // app.config.globalProperties.$messageContent = {message: message, setMessage: setMessage};

  //  Existing Connections Store
  // const [existConn, setExistConn] = useState(false);
  // app.config.globalProperties.$existingConn = {existConn: existConn, setExistConn: setExistConn};
  let db: SQLiteDBConnection | null = null;
  try {
    await dbLock.acquire(); // Acquire the lock
    if(platform === "web") {
      // Create the 'jeep-sqlite' Stencil component
      const jeepSqlite = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepSqlite);
      await customElements.whenDefined('jeep-sqlite');
      // Initialize the Web store
      await sqlite.initWebStore();
    }
    // here you can initialize some database schema if required

    // example: database creation with standard SQLite statements 
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection("pos_db", false)).result;
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection("pos_db", false);
    } else {
      db = await sqlite.createConnection("pos_db", false, "no-encryption", 1, false);
    }
    await db.open();
    
    // Create initial tables
    await createTables(db);

    // migrations
    await runAllMigrations(db);

    router.isReady().then(() => {
      app.mount('#app');
    });
  } catch (err) {
    throw new Error(`Error: ${err}`)
  }finally{
    dbLock.release()
  }
});