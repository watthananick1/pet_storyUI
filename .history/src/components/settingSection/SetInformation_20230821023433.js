import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
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
              height: 240,
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
                  sx={{ ml: 2, width: 59, height: 59 }}
                  alt="Remy Sharp"
                  src={
                    currentUser.profilePicture || "/assets/person/noAvatar.png"
                  }
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <TextField
                  required
                  id="outlined-required"
                  label="firstName"
                  defaultValue={{ currentUser.firstName }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
