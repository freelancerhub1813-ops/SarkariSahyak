import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyBIPYXof2crgjhBGpmSvPnEyEnRl-6pcZY",
  authDomain: "sarkari-sahayk.firebaseapp.com",
  projectId: "sarkari-sahayk",
  storageBucket: "sarkari-sahayk.firebasestorage.app",
  messagingSenderId: "441354922660",
  appId: "1:441354922660:web:3865a493b51465a2155431"
};


const app = initializeApp(firebaseConfig);
export default app;