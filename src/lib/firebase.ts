import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC3JZvNYZL24MF0eJv25vEPTfA0UMUG6Wk",
  authDomain: "cloud-brust-prediction.firebaseapp.com",
  databaseURL: "https://cloud-brust-prediction-default-rtdb.firebaseio.com",
  projectId: "cloud-brust-prediction",
  storageBucket: "cloud-brust-prediction.firebasestorage.app",
  messagingSenderId: "531451672234",
  appId: "1:531451672234:web:31cd9c254ada46e2d242d3",
  measurementId: "G-LR6HH05D5F"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);