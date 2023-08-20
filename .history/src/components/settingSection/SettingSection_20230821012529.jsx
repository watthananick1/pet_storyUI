import React from "react";
import {Drawerbar, } from "./Drawer";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  List,
  IconButton,
  Typography,
  Box,
  Badge,
  responsiveFontSizes,
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Show from "./Show";
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

export default function SettingSection() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box>
        <Drawerbar />
        </Box>
        <Box>
        <Drawerbar />
        </Box>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            maxWidth: "100%",
            overflow: "auto",
          }}
        >
          {/* <Toolbar /> */}
          <Show />
          <Copyright sx={{ pt: 4 }} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
