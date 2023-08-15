import { useState, useContext, forwardRef, useEffect } from "react";
import "./loginBlog.css";
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
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
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

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#C51605",
    },
    secondary: {
      main: "#C51605",
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
                    width:
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{ m: 1, bgcolor: "red", width: 100, height: 100 }}
                  >
                    <NoAccountsIcon sx={{ width: 100, height: 100 }} />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    ผู้ใช้ถูกบล็อกจากระบบ
                  </Typography>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                  >
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
