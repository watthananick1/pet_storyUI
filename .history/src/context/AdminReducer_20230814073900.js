const AdminReducer = (state, action) => {
    switch (action.type) {
      case "OPEN":
        return {
          ...state,
          open: action.open,

        };
      default:
        return state;
    }
  };
  
  export default AdminReducer;
  