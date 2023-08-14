const AdminReducer = (state, action) => {
    switch (action.type) {
      case "AMIN_START":
        return {
          ...state,
          user: null,
          isFetching: true,
          error: false,
        };
      case "SET_":
        return {
          ...state,
          user: null,
          isFetching: true,
          error: false,
        };
      default:
        return state;
    }
  };
  
  export default AdminReducer;
  