import "./closeFriend.css";
import React, { useState } from 'react'
import { useHistory } from "react-router";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
export default function CloseFriend({ typePet }) {
  const [secondary, setSecondary] = useState(false);
  const history = useHistory();

  const handleType = (tagpet) => {
    history.push(`/sort/type/${tagpet}`);
  };
  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Single-line item"
          secondary={!secondary ? "Secondary text" : null}
        />
      </ListItem>
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
