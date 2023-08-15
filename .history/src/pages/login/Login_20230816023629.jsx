import { useState, useContext, forwardRef, useEffect } from "react";
import "./login.css";
import { loginCall, loginGoogleCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useHistory } from "react-router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import firebase from "firebase/compat/app";
import "firebase/auth";
import "firebase/compat/firestore";
import GoogleIcon from "@mui/icons-material/Google";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Pet story
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6309DE",
    },
    secondary: {
      main: "#6309DE",
    },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

export default function SignInSide() {
  const { user, error: isOpen, dispatch } = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({ severity: "success", text: " " });
  const history = useHistory();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // const handleClick = () => {
  //   setOpen(true);
  // };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      setLoading(true);
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      await firebase
        .auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          const user = result.user;
          //console.log("User ID:", user.uid);
          //console.log("User email:", user.email);

          // Call the loginGoogleCall function with the user's UID
          await loginGoogleCall({ uid: user.uid }, dispatch);
        })
        .catch((error) => {
          dispatch({
            type: "LOGIN_FAILURE",
            payload: "Google login error",
          });
        });
    } catch (error) {
      console.error("Google login error:", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Google login error",
      });
    } finally {
      //setLoading(false);
      history.push("/");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      setLoading(true);
      await loginCall(
        { email: data.get("email"), password: data.get("password") },
        dispatch
      );
      setMessage({
        severity: "error",
        text: "Please fill out all fields correctly",
      });
    } catch (error) {
      setMessage({ severity: "error", text: "An error occurred: " + error });
      setOpen(true);
      console.error("Error:", error);
    } finally {
       //setLoading(false);
      if (user.status === "blog") {
        history.push("/loginBlog");
      } e
      history.push("/");
    }
  };

  const handleChangeRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ height: 40 }}>
              <Fade
                in={loading}
                style={{
                  transitionDelay: loading ? "800ms" : "0ms",
                }}
                unmountOnExit
              >
                <CircularProgress />
              </Fade>
            </Box>
          </Box>
        ) : (
          <ThemeProvider theme={theme}>
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleClose}
                severity={message.severity}
                sx={{ width: "100%" }}
              >
                {message.text}
              </Alert>
            </Snackbar>
            <Grid container component="main">
              <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                  backgroundImage:
                    "url(https://firebasestorage.googleapis.com/v0/b/pet-story-f51e3.appspot.com/o/mainData%2FloginImage1.jpg?alt=media&token=4547e22e-e032-4eb9-82fa-84551789d27e)",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: (t) =>
                    t.palette.mode === "light"
                      ? t.palette.grey[50]
                      : t.palette.grey[900],
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
              >
                <Box
                  sx={{
                    my: 8,
                    mx: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      autoComplete="current-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() =>
                                setPasswordVisible(!passwordVisible)
                              }
                              edge="end"
                            >
                              {passwordVisible ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="remember"
                          color="primary"
                          checked={rememberMe}
                          onChange={handleChangeRememberMe}
                        />
                      }
                      label="Remember me"
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>
                    <div className="divider">
                      <hr className="divider-line" />
                      <span className="divider-text">OR</span>
                      <hr className="divider-line" />
                    </div>
                    <Box
                      sx={{ display: { xs: "none", sm: "block", md: "block" } }}
                    >
                      <Button
                        startIcon={<GoogleIcon />}
                        component="a"
                        fullWidth
                        variant="contained"
                        onClick={handleGoogleLogin}
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Login with Google
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        mb: 2,
                        justifyContent: "center",
                        display: { xs: "flex", sm: "none", md: "none" },
                      }}
                    >
                      <IconButton
                        variant="outlined"
                        component="a"
                        onClick={handleGoogleLogin}
                      >
                      <Avatar sx={{ m: 1}} src="../../../../assets/google-icon.svg">
                  </Avatar>
                      </IconButton>
                    </Box>
                    <Grid container>
                      <Grid item xs>
                        <Link to="/reset_password" variant="body2">
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link to="/register" variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </Grid>
                    </Grid>
                    <Copyright sx={{ mt: 5 }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </ThemeProvider>
        )}
      </div>
    </div>
  );
}
