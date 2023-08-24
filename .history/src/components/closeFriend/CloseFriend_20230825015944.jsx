import "./closeFriend.css";
import { useHistory } from "react-router";

import { Avatar } from "@mui/material";

export default function CloseFriend({ typePet }) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useHistory();

  const handleType = (tagpet) => {
    history.push(`/sort/type/${tagpet}`);
  };
  return (
    <>
      <li
        className="sidebarFriend"
        onClick={() => handleType(typePet?.nameType)}
      >
        <Avatar
          className="sidebarFriendImg"
          aria-label="recipe"
          src={typePet?.imgPet}
          style={{ width: "39px", height: "39px" }}
        ></Avatar>
        <span className="sidebarFriendName">{typePet?.nameType}</span>
      </li>
    </>
  );
}
