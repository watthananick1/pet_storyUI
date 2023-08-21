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
import { Grid } from "@material-ui/core";
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
  const [allTypePets, setAllTypePets] = useState([]);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [selectedTypes, setSelectedTypes] = useState([]);

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

    const fetchAllTypePets = async () => {
      try {
        const typePetsSnapshot = await typePetsCollection.get();
        const typePetsData = typePetsSnapshot.docs.map((doc) => doc.data());

        //console.log(typePetsData)

        const filteredTypePets = typePetsData.filter(
          (tag) => tag.status === true
        );
        console.log("Filtered TypePets:", filteredTypePets);

        setAllTypePets(filteredTypePets);
      } catch (error) {
        console.error("Error fetching type pets:", error);
      }
    };

    fetchUserPosts();
    fetchAllTypePets();
  }, []);

  useEffect(() => {
    let tes = typePets;
    console.log("typePets", typePets);
    console.log("selectedTypes", selectedTypes);
    let tagPet = [];
    typePets.forEach((typePet) => {
      tagPet.push(typePet.nameType);
    });
    
    let outs = [
    ...tagPet,
    ...selectedTypes
    ]
    console.log('OUT', outs);
  }, [typePets]);

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
  
  const handleSubmit = () => {
  
  }

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
                  <Grid item key={index} xs={4} sm={4} md={4} lg={4}>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
