import React, { useEffect, useContext, useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Typography,
  Badge,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import { Settings, Logout } from "@mui/icons-material";
import Show from "./Show";
import Chart from "./Chart";
import Deposits from "./Deposits";
import Orders from "./Orders";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { SetOpen } from "../../context/AuthActions";

const path = process.env.REACT_APP_PATH_ID;

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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

function TopBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const token = Cookies.get("token");
  const openPro = Boolean(anchorEl);
  const [messageData, setMessageData] = useState([]);
  const { open, user, dispatch } = useContext(AuthContext);
  const [anchorElNoti, setAnchorElNoti] = useState(null);
  // const dataUser = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();
  const toggleDrawer = () => {
    dispatch(SetOpen(!open));
  };

  //   useEffect(() => {
  //     console.log("TopBar", open);
  //   }, [open]);

  const handleDeleteNoti = (id) => {
    // const NotificationRef = firestore.collection("Notifications").doc(id);
    // NotificationRef.delete()
    //   .then(() => {
    //     console.log("Notification deleted successfully");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickReadNoti = async () => {
    // setAnchorElNoti(true);
    // Mark notifications as read in Firestore
    // const batch = firestore.batch();
    // messageData.forEach((notification) => {
    //   if (!notification.read) {
    //     const notificationRef = firestore
    //       .collection("Notifications")
    //       .doc(notification.id);
    //     batch.update(notificationRef, { read: true });
    //   }
    // });
    // await batch.commit();
    // const unreadNotifications = messageData.filter(
    //   (notification) => !notification.read
    // );
    // setMessageDataLength(unreadNotifications.length);
  };

  const handleCloseNoti = () => {
    setAnchorElNoti(null);
  };

  const handleProfileClick = () => {
    handleClose();
    history.push(`/profile/${user?.firstName}`);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${path}/api/auth/logout`, {
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
    <div>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Admin Dashboard
              </Typography>
              <IconButton color="inherit" onClick={(event) => handleClickReadNoti(event.currentTarget)}>
                <Badge
                  badgeContent={4}
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu
                key="noti"
                anchorEl={anchorElNoti}
                open={anchorElNoti}
                onClose={handleCloseNoti}
                onClick={handleCloseNoti}
                sx={{ top: 40 }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "bottom" }}
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
              >
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <>
                          <Typography
                            sx={{ m: 1, Color: "#f1f1f1" }}
                            variant="h6"
                            display="inline"
                            gutterBottom
                          >
                            Notification
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </List>
                {messageData.map((notification, index) => (
                  <MenuItem
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    key={index}
                  >
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar sx={{ width: 35, height: 35 }}>
                        <Avatar
                          alt="Remy Sharp"
                          src={notification.profilePicture}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <Typography variant="subtitle1" noWrap>
                              {notification.name}
                            </Typography>
                            <Typography variant="subtitle2">
                              is {notification.title}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {notification.formattedDate}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemIcon>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteNoti(notification.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemIcon>
                    </ListItem>
                    <hr />
                  </MenuItem>
                ))}
              </Menu>
              <IconButton color="inherit">
                <Avatar
                  aria-label="profile"
                  src={user?.profilePicture}
                  sx={{ width: 35, height: 35, mt: 0.5, mb: 0.5 }}
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openPro}
                onClose={handleClose}
                onClick={handleClose}
                sx={{ top: 40 }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "bottom" }}
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <Avatar
                      aria-label="profile"
                      src={user?.profilePicture}
                      onClick={(event) => setAnchorEl(event.currentTarget)}
                    />
                    Profile
                  </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default TopBar;
