import axios from "axios";
import { useHistory } from "react-router-dom";
import { fetchUserData } from "./context/AuthContext";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

const path = process.env.REACT_APP_PATH_ID;

export const loginGoogleCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    //console.log(userCredential);
    const res = await axios.post(
      `${path}/api/auth/loginGoogle`,
      userCredential
    );
    const user = res?.data;
    const data = user?.userId;
    const token = user?.token;
    //console.log(token);

    if (user === "blog") {
      await firestore.collection("Users").doc(data).update({
        Online_Friends: true,
      });
    }

    fetchUserData(data, token, dispatch);
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err.response.data.error });
  }
};

export const loginCall = async (userCredential, dispatch, history) => {
  dispatch({ type: "LOGIN_START" });

  try {
    const res = await axios.post(`${path}/api/auth/Login`, userCredential);
    const user = res?.data;
    const data = user?.userId;
    const token = user?.token;

    if (user === "blog") {
      await firestore.collection("Users").doc(data).update({
        Online_Friends: true,
      });
    }

    fetchUserData(data, token, dispatch, history);
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err.response.data.error });
  }
};

export const signUpCall = async (userCredential, dispatch, history) => {
  dispatch({ type: "SIGNUP_START" });

  console.log(userCredential);

  try {
    const res = await axios.post(`${path}/api/auth/register`, userCredential);
    const userLogin = {
      emailuserCredential.
    }
    if (res) {
      const reslogin = await axios.post(
        `${path}/api/auth/Login`,
        userLogin
      );
      const user = reslogin?.data;
      const data = user?.userId;
      const token = user?.token;

      fetchUserData(data, token, dispatch, history);
    }
  } catch (err) {
    dispatch({ type: "SIGNUP_FAILURE", payload: err.response.data.error });
  }
};