// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBtbGbFBlhT0-nDJBxt3nNVEEUgpAeKn5k",
  authDomain: "taskboard-b9d14.firebaseapp.com",
  projectId: "taskboard-b9d14",
  storageBucket: "taskboard-b9d14.firebasestorage.app",
  messagingSenderId: "1083747561234",
  appId: "1:1083747561234:web:4fb3477d8279316a0ccdcb"
};

const app = initializeApp(firebaseConfig);

export default app;
