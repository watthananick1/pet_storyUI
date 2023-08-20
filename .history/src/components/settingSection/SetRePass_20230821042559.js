import React, { useContext, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useHistory } from "react-router";
import LockResetIcon from "@mui/icons-material/LockReset";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "../../context/AuthContext";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

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

const firestore = firebase.firestore();

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

export default function SetRePass() {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState(
    dayjs(currentUser.dateOfBirth) ?? null
  );

  useEffect(() => {
    //console.log(dayjs(currentUser.dateOfBirth).format('DD/MM/YYYY'));
  }, [currentUser.dateOfBirth]);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้ใหม่จาก Firestore
    const fetchData = async () => {
      try {
        const userDoc = await firestore
          .collection("Users")
          .doc(currentUser.member_id)
          .get();

        if (userDoc.exists) {
          //const userData = userDoc.data();
          //console.log(userData);
        }
      } catch (error) {
        console.error("Error fetching updated user data:", error);
      }
    };

    fetchData();
  }, [currentUser.member_id]);

  const handleDateChange = (date) => {
    setSelectedDate(formatDate(date));
  };
  const formatDate = (date) => {
    if (date) {
      return dayjs(date).format("YYYY-MM-DD");
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    try {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
        
    } catch (error) {
      console.error("Reset password failed:", error);
    } finally {
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'ทางเราได้ทำการส่ง Email สำหรับรีเซ็ตรหัสผ่านให้ท่านแล้ว กรุณาตรวจสอบ',
        icon: 'success',
        confirmButtonText: 'รับทราบ',
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/");
        }
      });
      
    }
    //console.log(passwordError);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              <Grid container spacing={1}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockResetIcon />
            </Avatar>
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

                <Grid item xs={12} md={12} lg={12}>
                  <Typography
                    variant="h6"
                    sx={{ m: 1, color: "secondary.main" }}
                  >
                    Reset Password
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="lastName"
                    name="lastName"
                    sx={{ mt: 1 }}
                    defaultValue={currentUser.lastName ?? ""}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      fullWidth
                      format="DD/MM/YYYY"
                      value={selectedDate}
                      onChange={handleDateChange}
                      defaultValue={formatDate(currentUser.dateOfBirth) ?? null}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                endIcon={<SendIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                Send
              </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
