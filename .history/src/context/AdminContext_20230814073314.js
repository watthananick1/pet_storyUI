import { createContext, useReducer } from "react";
import AdminReducer from "./AdminReducer";

const INITIAL_STATE = {
  open: null
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


