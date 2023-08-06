import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Autocomplete from "@mui/material/Autocomplete";
import { performSearch } from "../search/Search";
import { format } from "timeago.js";
import ItemsList from "../listItems/listItems";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import firebase from "firebase/compat/app";
import DashboardIcon from "@mui/icons-material/Dashboard";
import "firebase/compat/firestore";
import { Link, useHistory } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { Chat, Notifications, Settings, Logout } from "@mui/icons-material";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const path = process.env.REACT_APP_PATH_ID;

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

theme = responsiveFontSizes(theme);

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(3),
    width: "30ch",
  },
  [theme.breakpoints.up("xs")]: {
    marginLeft: theme.spacing(3),
    width: "30ch",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 0),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const {
    user,
    message: messageUser,
    dispatch,
  } = React.useContext(AuthContext);
  const [anchorElNoti, setAnchorElNoti] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchOptions, setSearchOptions] = React.useState([]);
  const [messageData, setMessageData] = React.useState([]);
  const [messageDataLength, setMessageDataLength] = React.useState(null);
  const [searchResponse, setSearchResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const inputRef = React.useRef(null);
  const token = Cookies.get("token");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setAnchorEl(null);
  };

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      ref: inputRef, // นำ ref มาใช้ในการกำหนดคุณสมบัติของ input
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${path}/api/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message); // "Logout successful"
      console.log(user.member_id);
      await firestore.collection("Users").doc(user.member_id).update({
        Online_Friends: false,
      });
      Cookies.remove("token");
      localStorage.clear();
      window.location.href = `/`;
    } catch (error) {
      console.error(error.response.data.error); // "Logout failed"
    }
    handleClose();
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
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
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const handleClickReadNoti = async () => {
    setAnchorElNoti(true);
    // Mark notifications as read in Firestore
    const batch = firestore.batch();
    messageData.forEach((notification) => {
      if (!notification.read) {
        const notificationRef = firestore
          .collection("Notifications")
          .doc(notification.id);
        batch.update(notificationRef, { read: true });
      }
    });

    // Commit the batch update
    await batch.commit();

    // Update messageDataLength state
    const unreadNotifications = messageData.filter(
      (notification) => !notification.read
    );
    setMessageDataLength(unreadNotifications.length);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseNoti = () => {
    setAnchorElNoti(null);
  };

  const handleDeleteNoti = (id) => {
    const NotificationRef = firestore.collection("Notifications").doc(id);
    NotificationRef.delete()
      .then(() => {
        console.log("Notification deleted successfully"); // Notification deleted successfully
      })
      .catch((err) => {
        console.log(err); // Handle error
      });
  };

  const handleProfileClick = () => {
    handleClose();
    history.push(`/profile/${user?.firstName}`);
  };

  const handleDashboardClick = () => {
    handleClose();
    history.push(`/dashboard`);
  };

  const handleSearchProfileClick = (firstName) => {
    handleClose();
    history.push(`/profile/${firstName}`);
  };

  React.useEffect(() => {
    const unsubscribeNotification = firestore
      .collection("Notifications")
      .where("member_id", "==", user.member_id)
      .onSnapshot((querySnapshot) => {
        const updatedMessageUser = [];
        querySnapshot.forEach((doc) => {
          const notificationData = doc.data();
          const createdAt = new Date(notificationData.timestamp.seconds * 1000);
          const formattedDate = format(createdAt);

          updatedMessageUser.push({ ...notificationData, formattedDate });
        });

        const sortedNotifications = updatedMessageUser.sort((a, b) => {
          return b.timestamp.seconds - a.timestamp.seconds;
        });

        dispatch({
          type: "MESSAGE_UPDATE",
          payload: sortedNotifications,
        });

        setMessageData(sortedNotifications);
        const unreadNotifications = sortedNotifications.filter(
          (notification) => !notification.read
        );
        setMessageDataLength(unreadNotifications.length);
      });

    return () => {
      unsubscribeNotification();
    };
  }, []);

  // React.useEffect(() => {
  //   const fetchSearchResults = async () => {
  //     setLoading(true);
  //     const trimmedSearchValue = searchValue && searchValue.trim();
  //     const response = await performSearch(trimmedSearchValue);
  //     setLoading(false);
  //     setSearchResponse(response);
  //     console.log(response);
  //     if (response) {
  //       setSearchOptions(response);
  //     } else {
  //       setSearchOptions([]);
  //     }
  //   };

  //   fetchSearchResults();
  // }, [searchValue]);

  const handleSearchChange = async (event) => {
    const { value } = event.target;
    if (value) {
      setLoading(true);
      const trimmedSearchValue = value && value.trim();
      const response = await performSearch(trimmedSearchValue);
      setLoading(false);
      setSearchResponse(response);
      console.log(response);
      if (response) {
        setSearchOptions(response);
      } else {
        setSearchOptions([]);
      }
    }
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="#6309DE">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      {user.statusUser === "ADMIN" && (
        <MenuItem onClick={handleDashboardClick}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
      )}
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }} className="topbarContainer">
      <ThemeProvider theme={theme}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Pet Story
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <Autocomplete
                sx={{
                  ml: 3,
                  //position: "absolute",
                  display: "flex",
                  width: "100%",
                  "& TextField": {
                    padding: theme.spacing(1, 1, 1, 0),
                    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                    //transition: theme.transitions.create("width"),
                    width: "100%",
                    [theme.breakpoints.up("md")]: {
                      width: "20ch",
                    },
                    [theme.breakpoints.up("lg")]: {
                      width: "100ch",
                    },
                  },
                }}
                size="small"
                onClick={handleClick}
                id="custom-input"
                loading={loading}
                options={searchOptions}
                getOptionLabel={(option) =>
                  `${option.firstName} ${option.lastName}` ||
                  option.content ||
                  ""
                }
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      size="small"
                      variant="standard"
                      sx={{
                        mt: 2,
                        mb: 2,
                        boxShadow: "none",
                        width: "97%",
                        borderRadius: 30,
                        outline: "none",
                        border: "none",
                      }}
                      onChange={handleSearchChange}
                      placeholder="Search..."
                    />
                  </>
                )}
                renderOption={(props, option) => {
                  if (option.type === "User") {
                    return (
                      <li {...props}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          onClick={() =>
                            handleSearchProfileClick(option?.firstName)
                          }
                        >
                          <Avatar
                            src={`${option.profilePicture}`}
                            sx={{
                              width: 35,
                              height: 35,
                              mt: 0.5,
                              mb: 0.5,
                              mr: 1,
                            }}
                          />
                          <span>
                            {option?.firstName} {option?.lastName}
                          </span>
                        </Stack>
                      </li>
                    );
                  }
                  if (option.type === "Post") {
                    return (
                      <li {...props}>
                        <Stack direction="row" alignItems="center">
                          <span>{`Post ${option.content}`}</span>
                        </Stack>
                      </li>
                    );
                  }
                  return null;
                }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </ThemeProvider>
    </Box>
  );
}
