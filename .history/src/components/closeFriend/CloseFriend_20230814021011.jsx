import "./closeFriend.css";

import {
  Avatar,
} from "@mui/material";

export default function CloseFriend({typePet}) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
      <Avatar className="sidebarFriendImg" aria-label="recipe" src={typePet?.profilePicture} style={{ width: '39px', height: '39px' }}>
      </Avatar>
      <span className="sidebarFriendName">{user?.firstName} {user?.lastName}</span>
    </li>
  );
}
