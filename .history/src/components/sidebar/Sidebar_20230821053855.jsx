import "./sidebar.css";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
  Star,
} from "@material-ui/icons";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import FeedIcon from "@mui/icons-material/Feed";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import Cookies from "js-cookie";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { AuthContext } from "../../context/AuthContext";
import firebase from "firebase/compat/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const typePetsCollection = firestore.collection("TypePets");
const UsersCollection = firestore.collection("Users");

const path = process.env.REACT_APP_PATH_ID;

export default function Sidebar() {
  const history = useHistory();
  const [typePets, setTypePets] = useState([]);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
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

    fetchUserPosts();
  }, []);

  // useEffect(() => {
  //   const getTypePets = async () => {
  //     try {
  //       const res = await axios.get(`${path}/api/typePets`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setTypePets(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getTypePets();
  // }, [typePets, token]);

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
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem" onClick={handleFeed}>
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem" onClick={handlePopularity}>
            <Star className="sidebarIcon" />
            <span className="sidebarListItemText">Popularity</span>
          </li>
          <li className="sidebarListItem" onClick={handleRelevance}>
            <SavedSearchIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Relevance</span>
          </li>
          <li className="sidebarListItem" onClick={handleNews}>
            <FeedIcon className="sidebarIcon" />
            <span className="sidebarListItemText">News</span>
          </li>
          <li className="sidebarListItem" onClick={handleVideo}>
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
        </ul>
        {/* <button className="sidebarButton">Show More</button> */}
        <hr className="sidebarHr" />

        <ul className="sidebarFriendList">
          <li className="sidebarListItem">
            <Grid3x3Icon className="sidebarIcon" />
            <span>Type Pets</span>
          </li>
          {typePets.map((type, index) => (
            <CloseFriend key={index} typePet={type} />
          ))}
          <li>
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
          </li>
        </ul>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
