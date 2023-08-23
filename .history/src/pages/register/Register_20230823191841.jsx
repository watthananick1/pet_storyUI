import React, { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { signUpCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router";
import Swal from "sweetalert2";

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

const defaultTheme = createTheme();

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [email, setIsEmail] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState(true);
  const [passwordError, setPasswordError] = useState(true);
  const [emailError, setEmailError] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    console.log(passwordError);
  }, [passwordError]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const formatDate = (date) => {
    if (date) {
      return dayjs(date).format("YYYY-MM-DD");
    }
    return "";
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~\-=`{}[\]:;"'<>,.?/])(?!.*\s).{6,16}$/;
    return passwordRegex.test(password);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPasswordConfirm = (confirmedpassword) => {
    setPasswordConfirmation(confirmedpassword);
    if (password !== confirmedpassword) {
      setPasswordConfirmError(false);
    } else {
      setPasswordConfirmError(true);
    }
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
    setPasswordError(isValidPassword(password));
  };
  const handleEmailChange = (email) => {
    setIsEmail(email);
    setEmailError(isValidEmail(email));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // const email = data.get("email");
    // const password = data.get("password");
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const confirmedPassword = data.get("passwordConfirmation");
    if (
      email.trim() &&
      password.trim() &&
      firstName.trim() &&
      lastName.trim() &&
      selectedDate !== null && si
    ) {
      Swal.fire(
        "กรุณากรอกข้อมูล",
        "กรุณากรอกข้อมูลให้ครบถ้วนก่อน แล้วดำเนินการใหม่อีกครั้ง",
        "warning"
      );
      return;
    }

    if (!firstName || !lastName) {
      Swal.fire(
        "กรุณากรอกชื่อหรือนามสกุล",
        "กรุณากรอกชื่อหรือนามสกุลให้ครบถ้วน ก่อน แล้วดำเนินการใหม่อีกครั้ง",
        "warning"
      );
      return;
    }

    if (!email) {
      Swal.fire(
        "กรุณากรอก Email",
        "กรุณากรอก Email ก่อน แล้วดำเนินการใหม่อีกครั้ง",
        "warning"
      );
      return;
    }
    if (!password) {
      Swal.fire(
        "กรุณากรอก Password",
        "กรุณากรอก Password ก่อน แล้วดำเนินการใหม่อีกครั้ง",
        "warning"
      );
      return;
    }

    if (password !== confirmedPassword) {
      setPasswordConfirmError(false);
    } else {
      setPasswordConfirmError(true);
      const userData = {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: email,
        password: password,
        dateOfBirth: formatDate(selectedDate),
        status: "active",
        statusUser: "USER",
        typePets: [],
        profilePicture: "",
        coverPicture: "",
        followings: [],
        followers: [],
      };
      
      console.log(userData)
      // try {
      //   await signUpCall(userData, dispatch);
      // } catch (error) {
      //   console.error("SignUp failed:", error);
      //   Swal.fire({
      //     icon: "error",
      //     title: "Oops...",
      //     text: "เกิดปัญหาขึ้นระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง!",
      //   });
      // } finally {
      //   Swal.fire({
      //     title: "สำเร็จ!",
      //     text: "ทางเราได้ทำการส่ง Email สำหรับรีเซ็ตรหัสผ่านให้ท่านแล้ว กรุณาตรวจสอบ Email ของท่าน",
      //     icon: "success",
      //     confirmButtonText: "รับทราบ",
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       history.push("/typepet");
      //     }
      //   });
      // }

      //console.log(userData);
    }
    //console.log(passwordError);
  };

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleShowPasswordConfirmation = () => {
    setShowPasswordConfirmation(
      (showPasswordConfirmation) => !showPasswordConfirmation
    );
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  helperText={ "ตัวอย่าง: สุดา"}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  autoFocus
                  helperText={"ตัวอย่าง: สุขใจ"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!emailError}
                  helperText={
                    !emailError
                      ? "กรุณากรอกอีเมลให้ถูกต้อง"
                      : "ตัวอย่าง: example@example.com"
                  }
                  onChange={(e) => handleEmailChange(e.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  error={!passwordError}
                  helperText={
                    !passwordError
                      ? "กรุณากรอกรหัสผ่านให้ถูกต้อง"
                      : "รหัสผ่านควรมีอักษร 6-16 ตัว (A-Z) ตัวอักษรพิมพ์เล็ก (a-z) ตัวเลข 0-9 และสัญลักษณ์ !@#$%^ &*()_+|~-=`{}[]:”;'<>?,./"
                  }
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  autoFocus
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword}>
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirmation"
                  label="Confirm Password"
                  type={showPasswordConfirmation ? "text" : "password"}
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  autoFocus
                  onChange={(e) => isValidPasswordConfirm(e.target.value)}
                  error={!passwordConfirmError}
                  helperText={
                    !passwordConfirmError
                      ? "กรุณากรอกยืนยันรหัสผ่านให้ถูกต้อง"
                      : "กรุณากรอกยืนยันรหัสผ่านให้ตรงกับรหัสผ่าน"
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPasswordConfirmation}>
                          {showPasswordConfirmation ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                  <Typography
                    variant="caption"
                    color="gray"
                    display="block"
                    gutterBottom
                  >
                    เพื่อความถูกต้องกรุณากรอกวันที่โดยเลือกผ่านไอคอนปฏิทิน
                  </Typography>
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
