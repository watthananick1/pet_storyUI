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

export const Messageupdate = (message, severity) => ({
  type: "MESSAGE_UPDATE",
  severity: severity,
  payload: message,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
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

export const Logout = () => ({
  type: "LOGOUT",
});
