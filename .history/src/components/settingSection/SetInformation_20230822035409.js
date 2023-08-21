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
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useHistory } from "react-router";
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

export default function SetInformation() {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState(
    dayjs(currentUser.dateOfBirth) ?? null
  );
  const [dataUser, setDataUser] = useState(currentUser);

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
          const userData = userDoc.data();
          setDataUser(userData);
        }
      } catch (error) {
        console.error("Error fetching updated user data:", error);
      }
    };

    fetchData();
    console.log(dataUser);
  }, []);

  useEffect(() => {
    console.log("123: ", dataUser);
  }, [dataUser]);

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
    const newFirstName = data.get("firstName");
    const newLastName = data.get("lastName");
    const newDateOfBirth = formatDate(selectedDate);

    const hasChanges =
      currentUser.firstName !== newFirstName ||
      currentUser.lastName !== newLastName ||
      formatDate(currentUser.dateOfBirth) !== newDateOfBirth;

    if (hasChanges) {
      try {
        const usersRef = firestore.collection("Users");
        await usersRef.doc(currentUser.member_id).update({
          firstName: newFirstName,
          lastName: newLastName,
          dateOfBirth: newDateOfBirth,
          updatedAt: new Date(),
        });

        const updatedDataUser = {
          ...dataUser,
          firstName: newFirstName,
          lastName: newLastName,
          dateOfBirth: newDateOfBirth,
          updatedAt: new Date(),
        };

        localStorage.setItem("user", JSON.stringify(updatedDataUser));
        dispatch({ type: "UPDATE_USER", payload: { ...updatedDataUser, token: currentUser.token } });

        Cookies.set("token", currentUser.token);
        Swal.fire({
          title: "บันทึกสำเร็จ!",
          text: "ท่านได้บันทึกข้อมูลเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonText: "รับทราบ",
        }).then((result) => {
          if (result.isConfirmed) {
            history.push("/setting/information");
          }
        });
      } catch (error) {
        console.error("failed:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `เกิดปัญหาขึ้นระหว่างบันทึก กรุณาลองใหม่!`,
        });
      }
    } else {
      Swal.fire(
        "ท่านไม่ได้แก้ไขข้อมูล?",
        "กรุณาแก้ไขข้อมูล แล้วจึงกดบันทึกใหม่อีกครั้ง",
        "question"
      );
    }
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
                <Grid item xs={12} md={12} lg={12}>
                  <Typography
                    variant="h6"
                    sx={{ m: 1, color: "secondary.main" }}
                  >
                    Basic details
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Avatar
                    sx={{ ml: 2, width: 69, height: 69 }}
                    alt="Remy Sharp"
                    src={
                      currentUser.profilePicture ||
                      "/assets/person/noAvatar.png"
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="firstName"
                    name="firstName"
                    sx={{ mt: 1 }}
                    defaultValue={currentUser.firstName ?? dataUser.firstName}
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
                    defaultValue={currentUser.lastName ?? dataUser.lastName}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      fullWidth
                      format="DD/MM/YYYY"
                      value={selectedDate}
                      onChange={handleDateChange}
                      defaultValue={
                        formatDate(currentUser.dateOfBirth) ??
                        formatDate(dataUser.dateOfBirth)
                      }
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Button type="submit" size="medium">
                    Save
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
