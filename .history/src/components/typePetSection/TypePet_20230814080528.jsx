import React, { useContext, useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  List,
  IconButton,
  Typography,
  Badge,
  responsiveFontSizes,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "../dashboard/listItems";
import {
  Settings,
  Logout,
} from "@mui/icons-material";
import Show from "../dashboard/Show";
import TopBar from "../dashboard/TopBar";
import Drawerbar from "../dashboard/Drawer";
import Chart from "../dashboard/Chart";
import Deposits from "../dashboard/Deposits";
import Orders from "../dashboard/Orders";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { SetOpen } from "../../context/AuthActions";

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

// TODO remove, this demo shouldn't need to reset the theme.
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


export default function TypePetSection() {
  const [anchorEl, setAnchorEl] = useState(null);
  const token = Cookies.get("token");
  const openPro = Boolean(anchorEl);
  const { open, user, dispatch } = useContext(AuthContext);
  const dataUser = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();
  // const toggleDrawer = () => {
  //   setOpen(!open);
  // };

  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    history.push(`/profile/${user?.firstName}`);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message); // "Logout successful"
      Cookies.remove("token");
      localStorage.clear();
      window.location.href = `/`;
    } catch (error) {
      console.error(error.response.data.error); // "Logout failed"
    }
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <TopBar />
        <Drawerbar />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container
            sx={{
              mt: 4,
              mb: 4,
              flexGrow: 1,
              height: "100vh",
              overflow: open ? "hidden" : "auto",
              maxWidth: open ? "100%" : "lg",
            }}
          >
            <Show />
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
