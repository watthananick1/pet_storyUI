import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Autocomplete from "@mui/material/Autocomplete";
import { performSearch } from "../search/Search";
import { format } from "timeago.js";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import firebase from "firebase/compat/app";
import DashboardIcon from "@mui/icons-material/Dashboard";
import "firebase/compat/firestore";
import { Link, useHistory, NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import Fab from "@mui/material/Fab";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import LogoutIcon from "@mui/icons-material/Logout";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import FeedIcon from "@mui/icons-material/Feed";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseFriend from "../closeFriend/CloseFriend";
import { Star, Notifications } from "@material-ui/icons";
import { Grid } from "@material-ui/core";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
} from "@mui/material";

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
const typePetsCollection = firestore.collection("TypePets");
const UsersCollection = firestore.collection("Users");
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

const ITEM_HEIGHT = 48;

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [typePets, setTypePets] = React.useState([]);
  const descriptionElementRef = React.useRef(null);
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
  const [menuanchorEl, setMenuAnchorEl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const open = Boolean(anchorEl);
  const menuopen = Boolean(menuanchorEl);
  const [homeopen, setHomeopen] = React.useState(false);
  const [homeCopen, setHomeCopen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const history = useHistory();
  const inputRef = React.useRef(null);
  const token = Cookies.get("token");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [selectedTypes, setSelectedTypes] = React.useState([]);
  const [allTypePets, setAllTypePets] = React.useState([]);
  const [allsetdata, setAllSetdata] = React.useState([]);

  React.useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userSnapshot = await UsersCollection.doc(user.member_id).get();
        const typeTags = userSnapshot.data().typePets;

        const typePromises = typeTags.map(async (tag) => {
          const typePetsSnapshot = await typePetsCollection
            .where("nameType", "==", tag)
            .get();

          return typePetsSnapshot.docs.map((doc) => doc.data());
        });

        const typePetsData = await Promise.all(typePromises);
        const mergedTypePets = typePetsData.flat();

        setTypePets(mergedTypePets);

        //console.log("Merged TypePets:", mergedTypePets);

        // ทำอย่างอื่น ๆ กับ mergedTypePets ตามที่คุณต้องการ
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    const fetchAllTypePets = async () => {
      try {
        const typePetsSnapshot = await typePetsCollection.get();
        const typePetsData = typePetsSnapshot.docs.map((doc) => doc.data());

        //console.log(typePetsData)

        const filteredTypePets = typePetsData.filter(
          (tag) => tag.status === true
        );
        //console.log("Filtered TypePets:", filteredTypePets);

        setAllTypePets(filteredTypePets);
      } catch (error) {
        console.error("Error fetching type pets:", error);
      }
    };

    fetchUserPosts();
    fetchAllTypePets();
  }, []);

  React.useEffect(() => {
    let tes = typePets;
    //console.log("typePets", typePets);
    //console.log("selectedTypes", selectedTypes);
    let tagPet = [];
    typePets.forEach((typePet) => {
      typePets.some((type) => type.nameType === typePet.nameType);
      tagPet.push(typePet.nameType);
    });

    let outs = [...tagPet, ...selectedTypes];
    setAllSetdata(outs);
    //console.log("OUT", outs);
  }, [typePets, selectedTypes]);

  const handleClickOpen = (scrollType) => () => {
    setHomeCopen(true);
    setScroll(scrollType);
  };

  const handleHomeMClose = () => {
    setHomeopen(false);
  };
  const handleHomeMCClose = () => {
    setHomeCopen(false);
  };

  React.useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const userSnapshot = await UsersCollection.doc(user.member_id).get();
        const typeTags = userSnapshot.data().typePets;

        const typePromises = typeTags.map(async (tag) => {
          const typePetsSnapshot = await typePetsCollection
            .where("nameType", "==", tag)
            .get();

          return typePetsSnapshot.docs.map((doc) => doc.data());
        });

        const typePetsData = await Promise.all(typePromises);
        const mergedTypePets = typePetsData.flat();

        setTypePets(mergedTypePets);

      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    fetchUserPets();
  }, []);

  const handleHomeClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleHomeClose = () => {
    setMenuAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${path}/api/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message);
      console.log(user.member_id);
      await firestore.collection("Users").doc(user.member_id).update({
        Online_Friends: false,
      });
      Cookies.remove("token");
      localStorage.clear();
      window.location.href = `/`;
    } catch (error) {
      console.error(error.response.data.error);
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

  const handleProfileClick = () => {
    handleClose();
    history.push(`/profile/${user?.firstName}`);
  };

  const handleSearchProfileClick = (firstName) => {
    handleClose();
    history.push(`/profile/${firstName}`);
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
            fontSize="small"
            aria-label="profile"
            sx={{ width: 35, height: 35, mt: 0.5, mb: 0.5 }}
            src={user?.profilePicture}
          />
        </ListItemIcon>
        Profile
      </MenuItem>
      {user.statusUser === "ADMIN" && (
        <MenuItem component={NavLink} to="/dashboard/home">
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
      )}
      {user.statusUser === "ADMINCON" && (
        <MenuItem component={NavLink} to="/dashboardContent/home">
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
      )}
      <MenuItem component={NavLink} to="/setting/information">
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        Setting
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
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

    await batch.commit();

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

  const handleFeed = () => {
    history.push("/");
  };

  const handlePopularity = () => {
    history.push("/sort/popularity");
  };

  const handleRelevance = () => {
    history.push("/sort/relevance");
  };

  const handleVideo = () => {
    history.push("/sort/video");
  };

  const handleNews = () => {
    history.push("/sort/news");
  };

  const handleDeleteNoti = (id) => {
    const NotificationRef = firestore.collection("Notifications").doc(id);
    NotificationRef.delete()
      .then(() => {
        console.log("Notification deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
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

  const isButtonPressed = (typePetId) =>
    selectedTypes.includes(typePetId) ||
    typePets.some((type) => type.nameType === typePetId);

  const handleSelect = (typePetId) => {
    if (selectedTypes.includes(typePetId)) {
      setSelectedTypes((prevState) =>
        prevState.filter((id) => id !== typePetId)
      );
    } else {
      setSelectedTypes((prevState) => [...prevState, typePetId]);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("allsetdata", allsetdata);
      const usersRef = firestore.collection("Users");
      await usersRef.doc(user.member_id).update({
        typePets: allsetdata,
      });
      handleClose();
      Swal.fire({
        title: "สำเร็จ!",
        text: "ท่านได้เพิ่มประเภทสัตว์ที่สนใจเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "รับทราบ",
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "เกิดปัญหาขึ้นระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง!",
      });
    }
  };

  const mobileMenuHomeId = "primary-search-account-menu-mobile";
  const renderMobileHomeMenu = (
    <Menu
      anchorEl={menuanchorEl}
      id={mobileMenuHomeId}
      open={menuopen}
      onClose={handleHomeClose}
      onClick={handleHomeClose}
      PaperProps={{
        elevation: 0,
        style: {
          maxHeight: ITEM_HEIGHT * 4.5,
          width: "20ch",
        },
      }}
    >
      <MenuItem onClick={handleFeed}>
        <ListItemIcon>
          <RssFeedIcon fontSize="small" />
        </ListItemIcon>
        Feed
      </MenuItem>
      <Divider />
      <MenuItem onClick={handlePopularity}>
        <ListItemIcon>
          <Star fontSize="small" />
        </ListItemIcon>
        Popularity
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleRelevance}>
        <ListItemIcon>
          <SavedSearchIcon fontSize="small" />
        </ListItemIcon>
        Relevance
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleNews}>
        <ListItemIcon>
          <FeedIcon fontSize="small" />
        </ListItemIcon>
        News
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleVideo}>
        <ListItemIcon>
          <PlayCircleFilledIcon fontSize="small" />
        </ListItemIcon>
        Videos
      </MenuItem>
      <Divider />
      {typePets.map((type, index) => (
        <CloseFriend key={index} typePet={type} />
      ))}
      <MenuItem>
        <Tooltip title="Add TypePet" placement="right-end">
          <Fab
            size="small"
            primary="Add account"
            aria-label="add TypePet"
            onClick={handleClickOpen("paper")}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </MenuItem>
      <Dialog
        open={homeCopen}
        onClose={handleHomeMCClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Add TypePets</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Grid container spacing={0.5}>
              {allTypePets.map((typePet, index) =>
                typePet.status !== false ? (
                  <Grid item key={index} xs={12} sm={12} md={12} lg={12}>
                    <div
                      className="typePetCard"
                      style={{ backgroundImage: `url(${typePet.imgPet})` }}
                    >
                      <div className="typePetCardBody">
                        <button
                          className={`typePetButton ${
                            isButtonPressed(typePet.nameType) ? "pressed" : ""
                          }`}
                          onClick={() => handleSelect(typePet.nameType)}
                        >
                          {isButtonPressed(typePet.nameType) ? (
                            <>
                              <span className="checkmark">&#10003;</span>
                              <span className="typePetButtonText">
                                {typePet.nameType}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="plusSymbol">+</span>
                              <span className="typePetButtonText">
                                {typePet.nameType}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Grid>
                ) : null
              )}
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHomeMCClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </Menu>
  );

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
      <MenuItem onClick={(event) => handleClickReadNoti(event.currentTarget)}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={messageDataLength} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileClick}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar
            aria-label="profile"
            src={user?.profilePicture}
            sx={{ width: 35, height: 35, mt: 0.5, mb: 0.5 }}
          />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      {user.statusUser === "ADMIN" && (
        <MenuItem component={NavLink} to="/dashboard/home">
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
      )}
      {user.statusUser === "ADMINCON" && (
        <MenuItem component={NavLink} to="/dashboardContent/home">
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
      )}
      <MenuItem component={NavLink} to="/setting/information">
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        Setting
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }} className="topbarContainer">
      <ThemeProvider theme={theme}>
        <AppBar
          position="sticky"
          sx={{
            width: "100%",
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              <NavLink
                className="navbar-item"
                activeClassName="is-active"
                to="/"
                exact
                style={{ textDecoration: "none" }}
              >
                <span className="logo">Pet Story</span>
              </NavLink>
            </Typography>
            <Typography
              noWrap
              component="div"
              onClick={handleHomeClick}
              sx={{ display: { xs: "block", sm: "none" }, m: 1 }}
            >
              <span className="logo">
                <IconButton>
                  <MenuIcon />
                </IconButton>
              </span>
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: "#6309DE" }} />
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
              <>
                <Menu
                  key="noti"
                  anchorEl={anchorElNoti}
                  open={anchorElNoti}
                  onClose={handleCloseNoti}
                  sx={{ top: 40 }}
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: "32ch",
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
              </>
              <IconButton
                key="noti"
                color="inherit"
                onClick={(event) => handleClickReadNoti(event.currentTarget)}
              >
                <Badge badgeContent={messageDataLength} color="error">
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
                <Avatar
                  aria-label="profile"
                  src={user?.profilePicture}
                  sx={{ width: 35, height: 35, mt: 0.5, mb: 0.5 }}
                />
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
        {renderMobileHomeMenu}
      </ThemeProvider>
    </Box>
  );
}
