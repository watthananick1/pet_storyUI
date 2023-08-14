import "./sidebar.css";
import { useState, useEffect } from "react";
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

const path = process.env.REACT_APP_PATH_ID;

export default function Sidebar() {
  const history = useHistory();
  const [typePets, setTypePets] = useState([]);
  const token = Cookies.get("token");
  const {
    user,
    dispatch,
    message: isMessage,
    open: isOpen,
    severity: isSeverity,
  } = useContext(AuthContext);

  useEffect(() => {
    const getTypePets = async () => {
      try {
        const res = await axios.get(`${path}/api/typePets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTypePets(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getTypePets();
  }, [typePets, token]);

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
