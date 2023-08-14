const AdminReducer = (state, action) => {
    switch (action.type) {
      case "AMIN_START":
        return {
          ...state,
          user: null,
          isFetching: true,
          error: false,
        };
      case "SET_OPN":
        return {
          ...state,
          open: action.open,

        };
      default:
        return state;
    }
  };
  
  export default AdminReducer;
  