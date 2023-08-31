import { initializeApp } from "firebase/app";
// const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";

const prodFirebaseConfig = {
  apiKey: process.env.VUE_APP_PROD_API_KEY,
  authDomain: process.env.VUE_APP_PROD_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_PROD_DATABASE_URL,
  projectId: process.env.VUE_APP_PROD_PROJECT_ID,
  storageBucket: process.env.VUE_APP_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_PROD_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_PROD_APP_ID,
  measurementId: process.env.VUE_APP_PROD_ANALYTICS
};

const devFirebaseConfig = {
  apiKey: process.env.VUE_APP_DEV_API_KEY,
  authDomain: process.env.VUE_APP_DEV_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DEV_DATABASE_URL,
  projectId: process.env.VUE_APP_DEV_PROJECT_ID,
  storageBucket: process.env.VUE_APP_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_DEV_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_DEV_APP_ID,
  measurementId: process.env.VUE_APP_DEV_ANALYTICS
};

const app = initializeApp(process.env.NODE_ENV === "development" ? devFirebaseConfig : prodFirebaseConfig);
// const analytics = getAnalytics(app);

// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider('6LcO-d0cAAAAACBYR6YPuaQzNL-vj2STm07tyGLk'),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true
// });

const database = getDatabase(app);

export default database;