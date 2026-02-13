
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB6pKj12RxMBFqr12grl5Jg-rWoBXPB8Yg",
  authDomain: "omnicalc-pro-71f65.firebaseapp.com",
  projectId: "omnicalc-pro-71f65",
  storageBucket: "omnicalc-pro-71f65.firebasestorage.app",
  messagingSenderId: "903618392884",
  appId: "1:903618392884:web:aa4e32007692e3e4046b61",
  measurementId: "G-Y9DDM4XEKC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export default app;
