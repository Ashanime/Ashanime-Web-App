import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";
import { setUser } from "../redux/google-slice";
import { firebaseConfig } from "./firebaseConfig";

const envValue = process.env.REACT_APP_FIREBASE_CONFIG;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const SignInWithGoogle = (dispatch) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
    })
    .catch((error) => {
      // Handle Errors here.
      console.log(error);
    });
};

export const SignInAnonymously = (dispatch) => {
  signInAnonymously(auth)
    .then((result) => {
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
    })
    .catch((error) => {
      // Handle Errors here.
      console.log(error);
    });
};
