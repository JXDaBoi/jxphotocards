import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdROiuLAw7NLSNeGh8xUPjjIfJfgpXtzo",
  authDomain: "jxphotocards.firebaseapp.com",
  projectId: "jxphotocards",
  storageBucket: "jxphotocards.firebasestorage.app",
  messagingSenderId: "27862905279",
  appId: "1:27862905279:web:99fbc63026b1a772b6310a",
  measurementId: "G-XTPE2GPLDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
