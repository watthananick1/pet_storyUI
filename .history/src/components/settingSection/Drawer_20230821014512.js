import React, { useEffect, useContext } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { List, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems } from "./listItems";
import { Settings, Logout } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { SetOpen } from "../../context/AuthActions";
import SettingsIcon from "@mui/icons-material/Settings";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#dddfe2",
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

function Drawerbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const token = Cookies.get("token");
  const openPro = Boolean(anchorEl);
  const { open, user, dispatch } = useContext(AuthContext);
  const toggleDrawer = () => {
    dispatch(SetOpen(!open));
  };

  //   useEffect(() => {
  //     console.log("Drawerbar", open);
  //   }, [open]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer variant="permanent" open={true}>
          <ListSubheader component="div">
            <ListItemIcon>
              <SettingsIcon />
            <ListItemText primary="Setting" />
            </ListItemIcon>
          </ListSubheader>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

function DrawerbarM() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const token = Cookies.get("token");
  const openPro = Boolean(anchorEl);
  const { open, user, dispatch } = useContext(AuthContext);
  const toggleDrawer = () => {
    dispatch(SetOpen(!open));
  };

  //   useEffect(() => {
  //     console.log("Drawerbar", open);
  //   }, [open]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer variant="permanent" open={false}>
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

export { Drawerbar, DrawerbarM };
