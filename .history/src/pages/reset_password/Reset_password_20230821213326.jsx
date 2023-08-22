import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useHistory } from "react-router";
import LockResetIcon from "@mui/icons-material/LockReset";
import SendIcon from "@mui/icons-material/Send";
import Swal from "sweetalert2";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material";

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

theme = responsiveFontSizes(theme);

export default function Reset_password() {
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    
    if (!email) {
      Swal.fire(
        "กรุณากรอก Email",
        "กรุณากรอก Email ก่อนที่จะกดส่งใหม่",
        "warning"
      );
      return;
    }
    
    try {
      await firebase.auth().sendPasswordResetEmail(email);

      Swal.fire({
        title: "สำเร็จ!",
        text: "ทางเราได้ทำการส่ง Email สำหรับรีเซ็ตรหัสผ่านให้ท่านแล้ว กรุณาตรวจสอบ Email ของท่าน",
        icon: "success",
        confirmButtonText: "รับทราบ",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/setting/reset_password");
        }
      });
    } catch (error) {
      console.error("Reset password failed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "เกิดปัญหาขึ้นระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง!",
      });
    } finally {
      Swal.fire({
        title: "สำเร็จ!",
        text: "ทางเราได้ทำการส่ง Email สำหรับรีเซ็ตรหัสผ่านให้ท่านแล้ว กรุณาตรวจสอบ",
        icon: "success",
        confirmButtonText: "รับทราบ",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/");
        }
      });
    }
    //console.log(passwordError);
  };

  return (
    <div className="rs">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockResetIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                endIcon={<SendIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                Send
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" variant="body2">
                    go back Sign in?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}