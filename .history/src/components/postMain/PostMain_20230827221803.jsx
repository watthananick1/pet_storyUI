import "./PostMain.css";
import { useState, useEffect, useContext } from "react";
import { format } from "timeago.js";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { SortableContainer } from "react-sortable-hoc";
import ReactPlayer from "react-player";
import { MuiFbPhotoGrid } from "mui-fb-photo-grid";
import Paper from "@mui/material/Paper";
import "mui-fb-photo-grid/dist/index.css";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { TransitionGroup } from "react-transition-group";
import { styled } from "@mui/system";

import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Collapse,
  Typography,
  Avatar,
  Chip,
  Box,
  CardMedia,
} from "@mui/material";
// import ReactPlayer from 'react-player';
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

const PostText = styled("div")`
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  position: relative;
`;

function renderItem({ C }) {
  return (
    <ListItem alignItems="flex-start">
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
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const maxDisplayedComments = 3;
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const createdAt = new Date(post.createdAt.seconds * 1000);
  const formattedDate = format(createdAt);

  useEffect(() => {
    // console.log(isPost);
    //console.log(comments);
  }, [comments]);

  const privacyOptions = [
    { label: "สาธารณะ", value: "normal" },
    { label: "ส่วนตัว", value: "private" },
    { label: "เฉพาะผู้ติดตาม", value: "followers" },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const fetchComments = async () => {
      const dataComment = post.comments || [];
      
      if (dataComment.length > 0) {
        const commentsDataPromises = dataComment.map(async (commentId) => {
          const commentsSnapshot = await firestore
            .collection("Comments")
            .doc(commentId)
            .get();

          const commentData = commentsSnapshot.data() || {};
          //console.log("object", commentData);

          const userDoc = await firestore
            .collection("Users")
            .doc(commentData.memberId)
            .get();

          const userData = userDoc.data() || {};

          return {
            id: commentsSnapshot.id,
            profilePicture: userData.profilePicture,
            firstName: userData.firstName,
            lastName: userData.lastName,
            ...commentData,
          };
        });

        const commentsData = await Promise.all(commentsDataPromises);
        setComments(commentsData);
      }
    };

    fetchComments();
  }, [post.comments, firestore]);

  useEffect(() => {
    const element = document.querySelector(".content");
    if (element) {
      setShowButton(element.scrollHeight > element.clientHeight);
    }
  }, [post.content, expanded]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

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
        if (items.length >= 4 && items[3]) {
          updatedGroup.push(setImage(items[3]));
        }
        return updatedGroup;
      }),
    ];

    const FIVE = [
      ...FOUR.map((group) => {
        const updatedGroup = [...group];
        if (items.length >= 5 && items[4]) {
          updatedGroup.push(setImage(items[4]));
        }
        return updatedGroup;
      }),
    ];
    const SIX = [
      ...FIVE.map((group) => {
        const updatedGroup = [...group];
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
              {formattedDate} {" | "}
              <span>
                {
                  privacyOptions.find((option) => option.value === post.status)
                    ?.label
                }
              </span>{" "}
            </>
          }
        />
        <CardContent>
          <div className={`content ${expanded ? "expanded" : ""}`}>
            {expanded ? (
              post.content
            ) : (
              <PostText>
                {post.content.split("\n").slice(0, 3).join("\n")}{" "}
                {post.content.split("\n").length > 3 && ""}
              </PostText>
            )}
          </div>

          {post.content.split("\n").length > 3 && (
            <Box
              component="button"
              onClick={toggleExpand}
              className={`readMoreButton ${expanded ? "expanded" : ""}`}
              sx={{
                background: "none",
                border: "none",
                color: "blue",
                cursor: "pointer",
                display: "block",
              }}
            >
              {expanded ? "ย่อเนื้อหา" : "อ่านเพิ่มเติม..."}
            </Box>
          )}
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
                  {comments.slice(0).map((C, index) => (
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
