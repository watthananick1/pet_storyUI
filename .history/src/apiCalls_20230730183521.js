import axios from "axios";
import {fetchUserData, fetchSignUpData} from "./context/AuthContext";

const path = process.env.REACT_APP_PATH_ID;

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });

  try {
    const res = await axios.post(`${path}/api/auth/Login`, userCredential);
    const user = res?.data;
    const data = user?.userId;
    const token = user?.token;

    fetchUserData(data, token, dispatch);
  } catch (err) {
    // Dispatch LOGIN_FAILURE action with the error
    dispatch({ type: "LOGIN_FAILURE", payload: err.response.data.error });
  }
};
export const signUpCall = async (userCredential, dispatch) => {
  dispatch({ type: "SIGNUP_START" });
  
  console.log(userCredential);

  try {
    const res = await axios.post(`${path}/api/auth/register`, userCredential);
    const user = res?.data;
    const data = user?.userId;
    const token = user?.token;

    fetchSignUpData(data, token, dispatch);
    
  } catch (err) {
    dispatch({ type: "SIGNUP_FAILURE", payload: err.response.data.error });
  }
};
