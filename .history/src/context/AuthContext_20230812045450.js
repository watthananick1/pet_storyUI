import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";
import Cookies from "js-cookie";
import axios from "axios";

const dataUser = JSON.parse(localStorage.getItem("user")) || null;
const path = process.env.REACT_APP_PATH_ID;
const initialState = {
  posts: [], // ข้อมูลโพสต์
  loading: false, // สถานะการโหลด
  snackbar: {
    open: false, // สถานะการแสดง Snackbar
    message: "",
    severity: "info", // ระดับความรุนแรงของ Snackbar (info, success, error)
  },
};
const INITIAL_STATE = {
  user: dataUser,
  isFetching: false,
  error: false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
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
      if (currentTime > parseInt(expirationTime)) {
        localStorage.removeItem("user");
        localStorage.removeItem("expirationTime");
        Cookies.remove("token");
        dispatch({ type: "TIMEOUT" });
        dispatch({ type: "MESSAGE_UPDATE", message: "Failed time out", open: true, severity: "error"});
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state?.user,
        isFetching: state?.isFetching,
        error: state?.error,
        message: state?.message,
        open: state?.open,
        severity: state?.severity,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const fetchUserData = async (userId, token, dispatch) => {
  try {
    console.log("User ID:", userId);
    console.log("User token:", token);
    const res = await axios.get(`${path}/api/users/GETuser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = { ...res.data[0], token: token };
    Cookies.set("token", token, { expires: 1 / 24 });
    dispatch({ type: "LOGIN_SUCCESS", payload: userData });
  } catch (err) {
    dispatch({ type: "MESSAGE_UPDATE", message: "Failed to fetch user data:" + err, open: true, severity: "error" });
    console.error("Failed to fetch user data:", err);
  }
};

exportconst postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_POSTS_START":
      return { ...state, loading: true };
    case "FETCH_POSTS_SUCCESS":
      return { ...state, loading: false, posts: action.payload };
    case "FETCH_POSTS_ERROR":
      return {
        ...state,
        loading: false,
        snackbar: {
          open: true,
          message: "Failed to fetch posts.",
          severity: "error",
        },
      };
    case "CLOSE_SNACKBAR":
      return { ...state, snackbar: { ...state.snackbar, open: false } };
    default:
      return state;
  }
};