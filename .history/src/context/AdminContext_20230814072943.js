import { createContext, useReducer } from "react";
import AdminReducer from "./AdminReducer";

const INITIAL_STATE = {
  open: false
};

export const AdminContext = createContext(INITIAL_STATE);

export const AdminContextProvider = ({ children }) => {
  const [open, dispatch] = useReducer(AdminReducer, INITIAL_STATE);


  return (
    <AdminContext.Provider
      value={{
        open,
        dispatch,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};


