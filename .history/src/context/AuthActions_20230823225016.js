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

const handleAddComment = (newComment) => {
  dispatch({
    type: "ADD_COMMENT",
    payload: newComment,
  });
};

// ตัวอย่างการเรียกใช้ EDIT_COMMENT หลังจากมีการแก้ไขความคิดเห็น
const handleEditComment = (editedComment) => {
  dispatch({
    type: "EDIT_COMMENT",
    payload: editedComment,
  });
};

export const Logout = () => ({
  type: "LOGOUT",
});
