import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyArOu-BCbMKebQ_z_rn3gHECceOm9C8Jhg",
  authDomain: "chat-app-a5dbb.firebaseapp.com",
  projectId: "chat-app-a5dbb",
  storageBucket: "chat-app-a5dbb.appspot.com",
  messagingSenderId: "623285688060",
  appId: "1:623285688060:web:9a125fbf2b5e9265706979",
  measurementId: "G-T8QQMWEP4K",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
