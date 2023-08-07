import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";
import Cookies from "js-cookie";
import axios from "axios";
import { useHistory } from "react-router";

const dataUser = JSON.parse(localStorage.getItem("user")) || null;
const path = process.env.REACT_APP_PATH_ID;
const INITIAL_STATE = {
  user: dataUser,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    //console.log("Store user=", state.user);
    const expirationTime = new Date().getTime() + 3600000;
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("expirationTime", expirationTime.toString());

    if (state.user && state.user.token) {
      Cookies.set("token", state.user.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("expirationTime");
      Cookies.remove("token");
    }
  }, [state]);

  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (expirationTime) {
      const currentTime = new Date().getTime();
      //console.log(Date(expirationTime));
      if (currentTime > parseInt(expirationTime)) {
        localStorage.removeItem("user");
        localStorage.removeItem("expirationTime");
        Cookies.remove("token");
        dispatch({ type: "TIMEOUT" });
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state?.user,
        isFetching: state?.isFetching,
        error: state?.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const fetchUserData = async (userId, token, dispatch) => {
  try {
    //console.log("Fetching user", userId);
    const res = await axios.get(`${path}/api/users/GETuser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = { ...res.data[0], token: token };
    //console.log("UserData=", userData);
    // Dispatch action to update user data in the state
    Cookies.set("token", token, { expires: 1 / 24 });
    dispatch({ type: "LOGIN_SUCCESS", payload: userData });
  } catch (err) {
    // Handle error
    console.error("Failed to fetch user data:", err);
  }
};
export const fetchSignUpData = async (userId, token, dispatch) => {
  try {
    //console.log("Fetching user", userId);
    const res = await axios.get(`${path}/api/users/GETuser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = { ...res.data[0], token: token };
    //console.log("UserData=", userData);
    localStorage.setItem("Uid", userId);
    Cookies.set("token", token, { expires: 1 / 24 });
    dispatch({ type: "SIGNUP_SUCCESS", payload: userData });
  } catch (err) {
    console.error("Failed to fetch user data:", err);
  }
};
