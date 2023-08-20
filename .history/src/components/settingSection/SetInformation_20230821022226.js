import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";


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
            <Typography variant="h6" >
              h6. Heading
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
