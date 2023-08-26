import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import { Rightbar, RightbarR } from "../../components/rightbar/Rightbar";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import Cookies from "js-cookie";
import { Avatar, Badge, IconButton, Typography } from "@mui/material";
import LocalSeeIcon from "@mui/icons-material/LocalSee";
import { styled } from "@mui/material/styles";
import FormDialogImage from "../../components/dialogModel/dialogModel";
import FilePreviewerCover from "../../components/dialogModel/dialogModelCover";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { AuthContext } from "../../context/AuthContext";
import Box from "@mui/material/Box";

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

export default function Profile() {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const { firstName } = useParams();
  const [open, setOpen] = useState(false);
  const [openCover, setOpenCover] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const token = Cookies.get("token");
  const dataUser = JSON.parse(localStorage.getItem("user"));
  const path = process.env.REACT_APP_PATH_ID;

  useEffect(() => {
    setIsUser(currentUser.firstName === user?.firstName);
    // console.log("firstName1", currentUser.firstName);
    // console.log("UfirstName", user.firstName);
    // console.log("UfirstName", user);
  }, [firstName, currentUser, user]);
  
  useEffect(() => {
    setIsMounted(true); // Component is mounted

    return () => {
      setIsMounted(false); // Component is unmounted
    };
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${path}/api/users/user/${firstName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res?.data[0]);
        //console.log("data", res?.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [firstName]);

  const Image = styled("div")(({ theme }) => ({
    position: "relative",
    button: 150,
    width: "100%",
    height: 250,
    backgroundImage: `url("${
      user.coverPicture ? user.coverPicture : "/assets/person/noCover.png"
    }")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
    "&:hover $ImageBackdrop": {
      opacity: 0,
    },
    "&:hover $ImageMarked": {
      opacity: 0,
    },
    "&:hover $ImageTitle": {
      border: "4px solid currentColor",
    },
  }));

  const ImageTitle = styled(Typography)(({ theme }) => ({
    position: "relative",
    padding: theme.spacing(2),
    fontWeight: "bold",
    color: theme.palette.common.white,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  }));

  const ImageBackdrop = styled("div")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  }));

  const ImageMarked = styled("span")(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  }));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenCover = () => {
    setOpenCover(true);
  };
  
  // useEffect(() => {
  //   console.log("isUser", isUser);
  // }, [isUser]);

  

  return (
    <Box>
      <Topbar />
      <div className="profile">
        <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }}>
          <Sidebar />
        </Box>
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {isUser ? (
                <>
                  <Image onClick={handleClickOpenCover}>
                    <ImageTitle>
                      <LocalSeeIcon
                        fontSize="small"
                        sx={{
                          color: "#6200E8",
                          m: 1,
                        }}
                      />
                      <span>Change</span>
                      <ImageMarked className="MuiImageMarked-root" />
                    </ImageTitle>
                    <ImageBackdrop className="ImageBackdrop" />
                  </Image>
                  <Badge
                    overlap="circular"
                    sx={{
                      top: "-100px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="profileUserImg"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <label htmlFor="avatar-upload">
                        <IconButton
                          onClick={handleClickOpen}
                          color="white"
                          aria-label="Change Avatar"
                          component="span"
                          sx={{
                            backgroundColor: "white",
                            border: "0.5px solid #E2D7F0",
                            borderRadius: "50%",
                          }}
                        >
                          <LocalSeeIcon
                            fontSize="small"
                            sx={{
                              color: "#6200E8",
                            }}
                          />
                        </IconButton>
                      </label>
                    }
                  >
                    <Avatar
                      alt="Profile Picture"
                      src={currentUser?.profilePicture || "/assets/person/noAvatar.png"}
                      style={{ width: "150px", height: "150px" }}
                    />
                  </Badge>
                </>
              ) : (
                <>
                  <img
                    className="profileCoverImg"
                    src={
                      user.coverPicture
                        ? user?.coverPicture
                        : "/assets/person/noCover.png"
                    }
                    alt=""
                  />
                  <Avatar
                    className="profileUserImg"
                    alt="Profile Picture"
                    src={user?.profilePicture || "/assets/person/noAvatar.png"}
                    style={{ width: "150px", height: "150px" }}
                  />
                </>
              )}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">
                {user?.firstName} {user?.lastName}
              </h4>
              <span className="profileInfoDesc">{user?.desc}</span>
            </div>
            <Box sx={{ display: { xs: "block", sm: "none", md: "none" } }}>
              <RightbarR user={user} />
            </Box>
          </div>
          <div className="profileRightBottom">
            <Feed firstName={firstName} onProfile={true} />
            <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }}>
              <Rightbar user={user} />
            </Box>
          </div>
          {open ? (
            <>
              <FormDialogImage onClose={() => setOpen(false)} />
            </>
          ) : null}
          {openCover ? (
            <>
              <FilePreviewerCover onClose={() => setOpenCover(false)} />
            </>
          ) : null}
        </div>
      </div>
    </Box>
  );
}
