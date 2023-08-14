const AdminReducer = (state, action) => {
    switch (action.type) {
      case "SET_OPEN":
        return {
          ...state,
          open: action.open,

        };
      default:
        return state;
    }
  };
  
  export default AdminReducer;
  