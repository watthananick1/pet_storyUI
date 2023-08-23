const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "SIGNUP_START":
      return {
        ...state,
        user: null,
        isFetching: true,
        error: false,
      };
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "OPEN":
      return {
        ...state,
        open: action.open,
      };
    case "BLOG":
      return {
        ...state,
        blockReason: action.blockReason,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "MESSAGE_UPDATE":
      return {
        ...state,
        message: action.payload,
        isFetching: false,
        error: false,
        open: action.open,
        severity: action.severity,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isFetching: false,
        error: true,
      };
    case "SIGNUP_FAILURE":
      return {
        ...state,
        user: null,
        isFetching: false,
        error: true,
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    case "TIMEOUT":
      return {
        ...state,
        user: null,
        isFetching: false,
        error: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isFetching: false,
        error: false,
      };
    // ในไฟล์ AuthReducer
    case "ADD_COMMENT":
      return {
        ...state,
        post: {
          ...state.post,
          comments: [...state.user.comments, action.payload],
        },
      };
    case "EDIT_COMMENT":
      const { commentId, updatedText } = action.payload;
      const updatedComments = state.user.comments.map((comment) =>
        comment.id === commentId ? { ...comment, text: updatedText } : comment
      );
      return {
        ...state,
        user: {
          ...state.user,
          comments: updatedComments,
        },
      };

    default:
      return state;
  }
};

export default AuthReducer;
