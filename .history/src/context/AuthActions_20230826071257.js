export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const SignUpStart = (userCredentials) => ({
  type: "SIGNUP_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const SignUpSuccess = (user) => ({
  type: "SIGNUP_SUCCESS",
  payload: user,
});

export const Userupdate = (user) => ({
  type: "UPDATE_USER",
  payload: user,
});

export const Messageupdate = (message, open, severity) => ({
  type: "MESSAGE_UPDATE",
  payload: message,
  open: open,
  severity: severity,
});

export const Messageupdate = (so, open, severity) => ({
  type: "MESSAGE_UPDATE",
  payload: message,
  open: open,
  severity: severity,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const SetOpen = ( open ) => ({
  type: "OPEN",
  open: open
});

export const SetblockReason = ( blockReason ) => ({
  type: "BLOG",
  blockReason: blockReason
});

export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});

export const Timeout = () => ({
  type: "TIMEOUT",
});

// export const AddComment = (comment) => ({
//   type: "ADD_COMMENT",
//   payload: comment,
// });

// export const EditComment = (commentId, updatedText) => ({
//   type:" EDIT_COMMENT",
//   payload: { commentId, updatedText },
// });

export const Logout = () => ({
  type: "LOGOUT",
});
