import { createContext, useEffect, useReducer } from "react";
import AdminReducer from "./AdminReducer";
import Cookies from "js-cookie";
import axios from "axios";

const dataUser = JSON.parse(localStorage.getItem("user")) || null;
const path = process.env.REACT_APP_PATH_ID;
const INITIAL_STATE = {
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


