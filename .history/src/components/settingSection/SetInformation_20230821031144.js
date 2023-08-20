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
import { AuthContext } from "../../context/AuthContext";

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
  const [selectedDate, setSelectedDate] = useState(
    dayjs(currentUser.dateOfBirth) ?? null
  );

  useEffect(() => {
    //console.log(dayjs(currentUser.dateOfBirth).format('DD/MM/YYYY'));
  }, [currentUser.dateOfBirth]);

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
    const password = data.get("password");
    const confirmedPassword = data.get("passwordConfirmation");
    
    const userData = {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        password: password,
        dateOfBirth: formatDate(selectedDate),
        status: 'active',
        statusUser: 'USER',
        typePets: [],
        profilePicture: "",
        coverPicture: "",
        followings: [],
        followers: [],
      };
    
  
      try {

      } catch (error) {
        console.error("SignUp failed:", error);
      } finally{
 
      }
  
      //console.log(userData);
    
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
                    defaultValue={currentUser.firstName ?? ""}
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
                      defaultValue={
                        formatDate(currentUser.dateOfBirth) ??
                        null
                      }
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Button  type="submit" size="medium">Save</Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
