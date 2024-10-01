import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAyXsU9ml6MwNtN10shOrjsKIiN-nEG5ao",
  authDomain: "rolereact-f4a63.firebaseapp.com",
  databaseURL: "https://rolereact-f4a63-default-rtdb.firebaseio.com",
  projectId: "rolereact-f4a63",
  storageBucket: "rolereact-f4a63.appspot.com",
  messagingSenderId: "795815226109",
  appId: "1:795815226109:web:26ecf2760ea251e2c46c94"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { database, auth, createUserWithEmailAndPassword };
