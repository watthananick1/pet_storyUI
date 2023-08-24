import "./PostMain.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { NestedModal, ReportModal } from "../modelEdit/ModalEdit";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { SortableContainer } from "react-sortable-hoc";
import ReactPlayer from "react-player";
import Cookies from "js-cookie";
import { MuiFbPhotoGrid } from "mui-fb-photo-grid";
import Paper from "@mui/material/Paper";
import "mui-fb-photo-grid/dist/index.css";
import { Messageupdate } from "../../context/AuthActions";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { TransitionGroup } from "react-transition-group";

import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Collapse,
  Typography,
  IconButton,
  Avatar,
  Button,
  Chip,
  Menu,
  MenuItem,
  Box,
  CardMedia,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import {
  FavoriteBorder,
  Favorite,
  Comment,
  MoreHoriz,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
// import ReactPlayer from 'react-player';
import ReactLoading from "react-loading";

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
const path = process.env.REACT_APP_PATH_ID;

function renderItem({
  C
}) {
  return (
    <ListItem
      alignItems="flex-start"
    >
      <ListItemAvatar>
        <Avatar
          aria-label="recipe"
          src={C?.profilePicture}
          sx={{ width: "39px", height: "39px" }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={`${C?.firstName} ${C?.lastName}`}
        secondary={
          <>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {C.content}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
}

export default function Post({ isPost, onPostUpdate, indexPost }) {
  // const { user, dispatch } = useContext(AuthContext);
  const [post, setPost] = useState(isPost);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  // const [showAllComments, setShowAllComments] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // const [anchorElComment, setAnchorElComment] = useState(false);
  // const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  // const [commentIdUser, setCommentIdUser] = useState("");
  // const [loadingComment, setLoadingComment] = useState(false);
  const maxDisplayedComments = 3;

  const createdAt = new Date(post.createdAt.seconds * 1000);
  const formattedDate = format(createdAt);

  
  useEffect(() => {
    // console.log(isPost);
    //console.log(comments);
  }, [comments]);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (post.comments) {
        const commentsDataPromises = post.comments.map(async (item) => {
          const commentsSnapshot = await firestore.collection('Comments')
            .doc(item)
            .get();
  
          const userdata = await firestore.collection('Users').doc(post.member_id).get();
  
          const commentData = {
            id: commentsSnapshot.id,
            profilePicture: userdata.data().profilePicture,
            firstName: userdata.data().firstName,
            lastName: userdata.data().lastName,
            ...commentsSnapshot.data()
          };
  
          return commentData;
        });
  
        const commentsData = await Promise.all(commentsDataPromises);
        setComments(commentsData);
      }
    };
  
    fetchComments();
  }, [post.comments, post.member_id]); // Include post.member_id in the dependency array
  


  //ITEM OF POST ----------------------------------------------

  const SortableList = SortableContainer(({ items }) => {
    // console.log(items)

    const setImage = (image) => ({
      img: image.url,
      imgThumbnail: image.url,
    });

    const ONE = [];
    if (items.length >= 1 && items[0]) {
      ONE.push([setImage(items[0])]);
    }

    const TWO = [];
    if (items.length >= 2 && items[0] && items[1]) {
      TWO.push([setImage(items[0]), setImage(items[1])]);
    }

    const THREE = [];
    if (items.length >= 3 && items[0] && items[1] && items[2]) {
      THREE.push([setImage(items[0]), setImage(items[1]), setImage(items[2])]);
    }

    const FOUR = [
      ...THREE.map((group) => {
        const updatedGroup = [...group];
        if (items.length >= 5 && items[4]) {
          updatedGroup.push(setImage(items[4]));
        }
        return updatedGroup;
      }),
    ];

    const FIVE = [
      ...FOUR.map((group) => {
        const updatedGroup = [...group];
        if (items.length >= 6 && items[5]) {
          updatedGroup.push(setImage(items[5]));
        }
        return updatedGroup;
      }),
    ];
    const SIX = [
      ...FIVE.map((group) => {
        const updatedGroup = [...group ];
        if (items.length >= 6 && items[5]) {
          updatedGroup.push(setImage(items[5]));
        }
        return updatedGroup;
      }),
    ];

    const MORE = [
      ...THREE.map((group) => {
        const updatedGroup = [...group];
        if (items.length >= 7 && items[4] && items[5] && items[6]) {
          updatedGroup.push(
            setImage(items[4]),
            setImage(items[5]),
            setImage(items[6])
          );
        }
        return updatedGroup;
      }),
    ];

    const GROUP_NUM_IMAGE = Array.from({ length: items.length }, (_, i) => {
      console.log("num", items.length, items);
      switch (items.length) {
        case 1:
          return ONE;
        case 2:
          return TWO;
        case 3:
          return THREE;
        case 4:
          return FOUR;
        case 5:
          return FIVE;
        case 6:
          console.log("SIX", SIX);
          return SIX;
        default:
          return MORE;
      }
    });

    return (
      <Box style={{ "& > *": { height: "100%", width: "100%" } }}>
        {items.map((item, index) => {
          const isImage = item.type === "image" ? true : false;

          // console.log(isImage)
          // console.log(item.type)

          if (isImage) {
            const imageCount = Math.min(items.length, GROUP_NUM_IMAGE.length);
            //console.log("item", items.length);
            const images = GROUP_NUM_IMAGE[imageCount - 1];

            return (
              <div key={index}>
                {index === 0 && (
                  <MuiFbPhotoGrid
                    images={images[0]}
                    style={{ width: "100%" }}
                    reactModalStyle={{ overlay: { zIndex: 2000 } }}
                  />
                )}
              </div>
            );
          } else {
            return (
              <div key={index}>
                <ReactPlayer
                  url={item.url}
                  className="shareVideo"
                  width="100%"
                  height="300px"
                  controls
                  onClick={(event) => event.preventDefault()}
                />
              </div>
            );
          }
        })}
      </Box>
    );
  });

  return (
    <div className="post" key={indexPost}>
      <Paper elevation={3} className="postWrapper">
        <CardHeader
          avatar={

              <Avatar
                aria-label="recipe"
                src={post?.profilePicture}
                style={{ width: "39px", height: "39px" }}
              ></Avatar>

          }
          title={<>{`${post?.firstName} ${post?.lastName}`}</>}
          subheader={
            <>
              {formattedDate}{" "}
            </>
          }
        />
        <CardContent>
          <Typography variant="body1" className="postText">
            <span>{post?.content}</span>
          </Typography>
          <Typography
            variant="body2"
            style={{
              width: "100%",
              alignItems: "right",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            {post?.tagpet.map((pet, i) => (
              <span>
                <Chip
                  key={i}
                  label={`#${pet}`}
                  // className="postChip"
                  sx={{ color: "#6200E8", m: 0.5 }}
                />
              </span>
            ))}
          </Typography>
        </CardContent>
        <CardMedia component="div" style={{ width: "100%" }}>
          <SortableList
            items={post.img.map((item) => ({
              type: post.title,
              url: item,
            }))}
            axis="xy"
          />
        </CardMedia>
        <hr className="PostHr" />
        <div className="postBottom">
          <div className="postBottomLeft">
            <CardActions>
              <Typography className="postLikeCounter">{like} like</Typography>
              <Typography
                style={{ marginLeft: "5px" }}
                className="postLikeCounter"
                onClick={() => setShowComments(!showComments)}
              >
                {" "}
                {comments.length} Comment{" "}
              </Typography>
            </CardActions>
          </div>
        </div>
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <hr className="PostHr" />
          <CardContent>
            <>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  position: "relative",
                  overflow: "auto",
                  maxHeight: 300,
                  "& ul": { padding: 0 },
                }}
                subheader={<li />}
              >
                <TransitionGroup>
                  {comments
                    .slice(
                      0
                    )
                    .map((C, index) => (
                      <Collapse key={index}>
                      {renderItem({
                        C,
                      })}
                      </Collapse>
                    ))}
                </TransitionGroup>
              </List>
            </>
          </CardContent>
        </Collapse>
      </Paper>
     
    </div>
  );
}
