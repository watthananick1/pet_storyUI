import "./post.css";
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

export default function Post({ isPost, onPostUpdate, indexPost }) {
  const { user, dispatch } = useContext(AuthContext);
  const [post, setPost] = useState(isPost);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElComment, setAnchorElComment] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const [commentIdUser, setCommentIdUser] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const maxDisplayedComments = 3;
  const { user: currentUser } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [statusAdmin, setStatusAdmin] = useState(false);
  const [typeModal, setTypeModal] = useState("Post");
  const [dataEdit, setdataEdit] = useState([]);
  const [dataPost, setdataPost] = useState([]);
  const [dataEditID, setdataEditID] = useState(null);
  const [isAddComment, setIsAddComment] = useState(false);
  const createdAt = new Date(post.createdAt.seconds * 1000);
  const formattedDate = format(createdAt);
  const token = Cookies.get("token");
  // const socket = io.connect(process.env.PATH_ID);

  //++++++++++++++++++ fetch Data +++++++++++++++++++

  async function newNotification(onType, onBody, onTitle) {
    const NotificationRef = firestore.collection("Notifications").doc();
    const NotificationID = NotificationRef.id;
    const newNotificationData = {
      id: NotificationID,
      type: onType,
      member_id: post.member_id,
      author_id: currentUser.member_id,
      name: `${user.firstName} ${user.lastName}`,
      profilePicture: user.profilePicture,
      timestamp: new Date(),
      title: onTitle,
      body: onBody,
      post_id: post.id,
      read: false,
    };

    await NotificationRef.set(newNotificationData);
  }

  useEffect(() => {
    setStatusAdmin(
      post.post_Status.includes("ADMIN") ||
        post.post_Status.includes("ADMINCON")
    );
  }, [post.post_Status]);

  useEffect(() => {
    setIsLiked(post?.likes?.includes(currentUser.member_id) || false);
  }, [currentUser.member_id, post?.likes]);

  //Like ------------------------------------------------

  const likeHandler = async () => {
    try {
      const response = await axios.put(`${path}/api/posts/${post.id}/like`, {
        member_id: currentUser.member_id,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
      } else {
        dispatch(Messageupdate("Failed to like post.", true, "error"));
      }
    } catch (err) {
      dispatch(Messageupdate("Failed to like post.", true, "error"));
      console.log(err);
    } finally {
    }

    if (isLiked) {
      setLike(like - 1);
    } else {
      setLike(like + 1);
      newNotification("LIKE", "liked your post.", "like post");
    }
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
  
    const fetchComments = async () => {
      try {
        const resComments = await axios.get(
          `${path}/api/comments/${post.id}/Comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: source.token,
          }
        );
        setComments(resComments.data);
        setLoadingComment(true);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          dispatch(Messageupdate("Failed comments post.", true, "error"));
          console.log(err);
        }
      } finally {
        setLoadingComment(false);
      }
    };
  
    fetchComments();
    handlePostUpdate(onPostUpdate);
  
    return () => {
      source.cancel("Component unmounted");
    };
  }, [post.id]);
  

  // console.log("Comments=", comments);

  //++++++++++ on Click Button +++++++++++

  //Post----------------------------------------------------

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    setdataEdit(post);
    setdataEditID(post.id);
    setTypeModal("Post");
    setOpenModal(true);
    handleClose();
  };

  const handleReportPost = () => {
    setdataEdit(post);
    setdataEdit("");
    setOpenReportModal(true);
    handleClose();
  };

  const handleReportUser = () => {
    setTypeModal("User");
    setdataEdit("");
    setOpenReportModal(true);
    handleClose();
  };

  const handlePostUpdate = (updatedPost, type) => {
    setLoadingComment(true);
    if (type === "Post") {
      setPost({ ...updatedPost, ...post });
    } else if (type === "Comment") {
      const updatedCommentIndex = comments.findIndex(
        (comment) => comment.id === updatedPost.id
      );

      if (updatedCommentIndex === -1) {
        // Comment is not present in the comments array, add it
        setComments((prevComments) => [...prevComments, ...updatedPost]);
      } else {
        // Comment is already present, update it
        setComments((prevComments) => {
          const updatedComments = [...prevComments];
          updatedComments[updatedCommentIndex] = updatedPost;
          return updatedComments;
        });
      }
    } else if (type === "Add Comment") {
      // Handle added comment
     
      console.log('comments', comments);
      // setComments((prevComments) => [...prevComments, ...updatedPost]);
      // console.log("updatedPost", updatedPost);
      dataPost.comments = ;
      setComments((prevComments) => {
        const updatedComments = [...prevComments]; 
        updatedComments[0] = [...updatedComments[0], updatedPost]; 
        return updatedComments;
      });
      setLoadingComment(false);
    } else {
      // console.log("Invalid type: ", type);
    }
  };

  const handleDeletePost = async () => {
    const requestBody = {
      member_id: currentUser.member_id,
    };

    try {
      const response = await axios.delete(`${path}/api/posts/${post.id}`, {
        data: requestBody,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //const message = response.data.message;
      // Handle the response message here
      //console.log(message);
      window.location.reload();
      handleClose();
    } catch (err) {
      dispatch(Messageupdate("Failed Delete Post.", true, "error"));
      console.log(err);
    } finally {
      dispatch(Messageupdate("Success Share Post.", true, "success"));
    }
  };

  //ITEM OF POST ----------------------------------------------

  const SortableList = SortableContainer(({ items }) => {
    // console.log(items)

    const setImage = (image) => ({
      title: image.title,
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
      switch (i + 1) {
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

  //Comment-------------------------------------------

  const handleClickComment = (event, id) => {
    setAnchorElComment(event.currentTarget);
    const comment = comments.find((c) => c.id === id);
    // console.log(comment)
    setdataEdit(comment);
    setCommentIdUser(comment.memberId);
    setCommentIdToDelete(id);
  };

  const handleCloseComment = () => {
    setAnchorElComment(null);
  };

  const handleEditComment = () => {
    const comment = comments.find((c) => c.id === commentIdToDelete);
    setdataEdit(comment);
    setdataEditID(commentIdToDelete);
    setTypeModal("Comment");
    setOpenModal(true);
    handleCloseComment();
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const resComments = await axios.get(
          `${path}/api/comments/${post.id}/Comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(resComments.data);
        setLoadingComment(true);
      } catch (err) {
        dispatch(Messageupdate("Failed comments post.", true, "error"));
        console.log(err);
      } finally {
        setLoadingComment(false);
      }
    };
    fetchComments();
  }, []);

  const handleDeleteComment = async () => {
    //console.log(`Delete Comment ${commentIdToDelete}`);
    const requestBody = {
      member_id: currentUser.member_id,
    };

    try {
      const response = await axios.delete(
        `${path}/api/comments/${post.id}/comments/${commentIdToDelete}`,
        {
          data: requestBody,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const message = response.data.message;
      // Handle the response message here
      //console.log(message);

      // Fetch the updated comments after deleting the comment
      const resComments = await axios.get(
        `${path}/api/comments/${post.id}/Comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(resComments.data);

      handleClose();
      setLoadingComment(true);
    } catch (err) {
      dispatch(
        Messageupdate("Failed for fetch the updated comments.", true, "error")
      );
      //console.log(err);
    } finally {
      handleCloseComment();
      setLoadingComment(false);
      dispatch(Messageupdate("Delete comments successfully.", true, "success"));
    }
  };

  const submitComment = (post) => {
    setdataPost(post)
    setTypeModal("Add Comment");
    setdataEdit("");
    setIsAddComment(true);
    setOpenModal(true);
  };

  return (
    <div className="post" key={indexPost}>
      <Paper elevation={3} className="postWrapper">
        <CardHeader
          avatar={
            <Link to={`/profile/${post.firstName}`}>
              <Avatar
                aria-label="recipe"
                src={post?.profilePicture}
                style={{ width: "39px", height: "39px" }}
              ></Avatar>
            </Link>
          }
          title={<>{`${post?.firstName} ${post?.lastName}`}</>}
          subheader={
            <>
              {formattedDate}{" "}
              {statusAdmin ? (
                <span>
                  <Chip
                    label={`Admin`}
                    className="postChip"
                    style={{ backgroundColor: "#0912DE", color: "white" }}
                  />
                </span>
              ) : null}
            </>
          }
          action={[
            <IconButton key="more" onClick={handleClick}>
              <MoreHoriz fontSize="small" />
            </IconButton>,
            <Menu
              key="menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              keepMounted
            >
              {post?.firstName === user.firstName ? (
                [
                  <MenuItem key="edit" onClick={handleEditPost}>
                    <span>
                      <EditIcon fontSize="small" />
                    </span>
                    <span>Edit</span>
                  </MenuItem>,
                  <MenuItem key="delete" onClick={handleDeletePost}>
                    <span>
                      <DeleteIcon fontSize="small" />
                    </span>
                    <span>Delete</span>
                  </MenuItem>,
                ]
              ) : (
                <MenuItem key="report" onClick={handleReportPost}>
                  <span>
                    <ReportIcon fontSize="small" />
                  </span>
                  <span>Report Post</span>
                </MenuItem>
              )}
            </Menu>,
          ]}
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
              {isLiked ? (
                <IconButton aria-label="add to favorites" onClick={likeHandler}>
                  <Favorite className="likeIcon" style={{ color: "#6200E8" }} />
                </IconButton>
              ) : (
                <IconButton aria-label="add to favorites" onClick={likeHandler}>
                  <FavoriteBorder
                    className="likeIcon"
                    style={{ color: "#6200E8" }}
                  />
                </IconButton>
              )}
              <Typography className="postLikeCounter">{like} like</Typography>
              <Comment
                style={{ color: "#6200E8" }}
                sx={{ mr: 1, ml: 1 }}
                onClick={() => setShowComments(!showComments)}
              />
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
          {loadingComment ? (
            <div className="loadingWrapper">
              <ReactLoading
                type="spin"
                color="#6200E8"
                height={"10%"}
                width={"10%"}
              />
            </div>
          ) : (
            <CardContent>
              {comments
                .slice(
                  0,
                  showAllComments ? comments.length : maxDisplayedComments
                )
                .map((C, index) => {
                  return (
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
                        key={index}
                      >
                        <ListItem
                          alignItems="flex-start"
                          secondaryAction={
                            <>
                              <MoreHoriz
                                fontSize="small"
                                onClick={(event) =>
                                  handleClickComment(event, C.id)
                                }
                              />
                              <Menu
                                anchorEl={anchorElComment || undefined}
                                open={Boolean(anchorElComment)}
                                onClose={handleCloseComment}
                              >
                                {user.member_id === commentIdUser ? (
                                  [
                                    <MenuItem
                                      key="edit"
                                      onClick={handleEditComment}
                                    >
                                      <span>
                                        <EditIcon fontSize="small" />
                                      </span>
                                      <span>Edit</span>
                                    </MenuItem>,
                                    <MenuItem
                                      key="delete"
                                      onClick={handleDeleteComment}
                                    >
                                      <span>
                                        <DeleteIcon fontSize="small" />
                                      </span>
                                      <span>Delete</span>
                                    </MenuItem>,
                                  ]
                                ) : (
                                  <MenuItem
                                    key="report"
                                    onClick={handleReportUser}
                                  >
                                    <span>
                                      <ReportIcon fontSize="small" />
                                    </span>
                                    <span>Report User</span>
                                  </MenuItem>
                                )}
                              </Menu>
                            </>
                          }
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
                      </List>
                    </>
                  );
                })}
              <Divider />
              <Button
                sx={{ mt: 0.5 }}
                variant="text"
                onClick={() => submitComment(post)}
              >
                Comment
              </Button>
            </CardContent>
          )}
        </Collapse>
      </Paper>
      {openModal && (
        <NestedModal
          key={indexPost}
          onClose={() => setOpenModal(false)}
          onContent={dataEdit}
          onTitle={typeModal}
          userId={currentUser?.member_id}
          onContentID={post?.id}
          onCommentsID={dataEditID}
          onContentData={() => setComments(comments)}
          onLoading={true}
          isMember_id={post.member_id}
          isAddComment={isAddComment}
          onPostUpdate={(updatedComment) => handlePostUpdate(updatedComment, typeModal)}
        />
      )}
      {openReportModal && (
        <ReportModal
          key={indexPost}
          onClose={() => setOpenReportModal(false)}
          onContent={dataEdit}
          onTitle={typeModal}
          userId={currentUser?.member_id}
          onContentID={post?.id}
          onCommentsID={commentIdUser}
          onLoading={true}
          onPostUpdate={handlePostUpdate}
        />
      )}
    </div>
  );
}
