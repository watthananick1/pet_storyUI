import "./sidebar.css";
import { useState, useEffect, useContext } from "react";
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
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
import FeedIcon from "@mui/icons-material/Feed";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import Cookies from "js-cookie";
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
  const token = Cookies.get("token");
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const unsubscribe = UsersCollection.doc(user.)

    return () => {
      unsubscribe();
    };
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
        </ul>
      </div>
    </div>
  );
}
