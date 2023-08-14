import React, { useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { List, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "./listItems";
import { Settings, Logout } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { AdminContext } from "../../context/AdminContext";
import { SetOpen } from "../../context/AdminActions";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "isOpen",
})(({ theme, isOpen }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!isOpen && {
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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Drawerbar(isOpen) {
  const { open, dispatch } = React.useContext(AdminContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const token = Cookies.get("token");
  const openPro = Boolean(anchorEl);
  const { user } = React.useContext(AuthContext);
  const dataUser = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();
  const toggleDrawer = () => {
    dispatch(SetOpen(!open));
  };

  useEffect(() => {
    console.log("Drawerbar", open);
  }, [open]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer({ isOpen })}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
