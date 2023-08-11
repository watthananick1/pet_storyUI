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

const theme = createTheme();

export default function SignInSide() {
  const { error: isOpen, dispatch } = useContext(AuthContext);
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
        .then((result) => {
          const user = result.user;
          //console.log("User ID:", user.uid);
          //console.log("User email:", user.email);

          // Call the loginGoogleCall function with the user's UID
          loginGoogleCall({ uid: user.uid }, dispatch);
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
      setLoading(false);
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
      setLoading(false);
      history.push("/");
    }
  };

  const handleChangeRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <ThemeProvider theme={theme}>
        (loading ? (
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
          
        ));
          
          
        </ThemeProvider>
      </div>
    </div>
  );
}
