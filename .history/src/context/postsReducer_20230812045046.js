const initialState = {
    posts: [],
    loading: false,
    snackbar: {
      open: false,
      message: "",
      severity: "info",
    },
  };
  
  const postsReducer = (state = initialState, action) => {
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
  
  export default postsReducer;