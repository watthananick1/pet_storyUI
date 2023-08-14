import { createContext, useEffect, useReducer } from "react";
import AdminReducer from "./AdminReducer";
import Cookies from "js-cookie";
import axios from "axios";

const dataUser = JSON.parse(localStorage.getItem("user")) || null;
const path = process.env.REACT_APP_PATH_ID;
const INITIAL_STATE = {
  user: dataUser,
  isFetching: false,
  open: false
};

export const AdminContext = createContext(INITIAL_STATE);

export const AdminContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AdminReducer, INITIAL_STATE);


  return (
    <AdminContext.Provider
      value={{
        open: state?.open,
        dispatch,
      }}
    >
      {children}
    </AdminContext.Provider>
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


