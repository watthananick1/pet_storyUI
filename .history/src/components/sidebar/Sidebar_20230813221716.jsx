import "./sidebar.css";
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
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";

export default function Sidebar() {
  const history = useHistory();
  
  const handleFeed = () => {
    history.push("/");
  }
  
  const handlePopularity = () => {
    history.push("/sort/popularity");
  }
  
  const handleRelevance = () => {
    history.push("/sort/Relevance");
  }
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem" onClick={handleFeed}>
            <Link
              to="/Home"
              style={{ textDecoration: "none", color: "#454545" }}
            >
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Feed</span>
            </Link>
          </li>
          <li className="sidebarListItem" onClick={handlePopularity}>
            <Link
              to="/sort/popularity"
              style={{ textDecoration: "none", color: "#454545" }}
            >
              <Star className="sidebarIcon" />
              <span className="sidebarListItemText">Popularity</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link
              to="/sort/relevance"
              style={{ textDecoration: "none", color: "#454545" }}
            >
              <SavedSearchIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Relevance</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link
              to="/Home"
              style={{ textDecoration: "none", color: "#454545" }}
            >
              <PlayCircleFilledOutlined className="sidebarIcon" />
              <span className="sidebarListItemText">Videos</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link
              to="/Home"
              style={{ textDecoration: "none", color: "#454545" }}
            >
              <Grid3x3Icon className="sidebarIcon" />
              <span className="sidebarListItemText">Type Pets</span>
            </Link>
          </li>
        </ul>
        {/* <button className="sidebarButton">Show More</button> */}
        <hr className="sidebarHr" />
        {/* <ul className="sidebarFriendList">
          {Users.map((user, index) => (
            <CloseFriend key={index} user={user} />
          ))}
        </ul> */}
      </div>
    </div>
  );
}
