import React, { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
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
  const [selectedDate, setSelectedDate] = useState(currentUser.dateOfBirth ?? null);
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const formatDate = (date) => {
    if (date) {
      return dayjs(date).format('YYYY-MM-DD');
    }
    return '';
  };
  
  return (
    <ThemeProvider theme={theme}>
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
                <Typography variant="h6" sx={{ m: 1, color: "secondary.main" }}>
                  Basic details
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Avatar
                  sx={{ ml: 2, width: 69, height: 69 }}
                  alt="Remy Sharp"
                  src={
                    currentUser.profilePicture || "/assets/person/noAvatar.png"
                  }
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  required
                  fullWidth
                  id="outlined-required"
                  label="firstName"
                  sx={{ mt: 1 }}
                  defaultValue={currentUser.firstName ?? ""}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  required
                  fullWidth
                  id="outlined-required"
                  label="lastName"
                  sx={{ mt: 1 }}
                  defaultValue={currentUser.lastName ?? ""}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker 
                  format="DD/MM/YYYY"
                  value={selectedDate}
                  onChange={handleDateChange}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Button size="medium">Save</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
