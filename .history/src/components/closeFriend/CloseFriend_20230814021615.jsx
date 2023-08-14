import "./closeFriend.css";

import {
  Avatar,
} from "@mui/material";

export default function CloseFriend({typePet}) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
  const handleType() => {
    history.push("/");
  };
  return (
    <li className="sidebarFriend">
      <Avatar className="sidebarFriendImg" aria-label="recipe" src={typePet?.imgPet} style={{ width: '39px', height: '39px' }}>
      </Avatar>
      <span className="sidebarFriendName">{typePet?.nameType}</span>
    </li>
  );
}
