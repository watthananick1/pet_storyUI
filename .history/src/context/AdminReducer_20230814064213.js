const AdminReducer = (state, action) => {
    switch (action.type) {
      case "AMIN_START":
        return {
          ...state,
          user: null,
          isFetching: true,
          error: false,
        };
      case "SET_OPRN":
        return {
          ...state,
          isOpen: a,

        };
      default:
        return state;
    }
  };
  
  export default AdminReducer;
  