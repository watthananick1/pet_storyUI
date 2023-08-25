import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Modal,
  IconButton,
  TextField,
  Grid,
  Autocomplete,
} from "@mui/material";
// import {
//   Avatar,
//   Chip,
//   Autocomplete,
//   TextField,
//   Grid,
//   IconButton,
//   FormControl,
//   InputLabel,
//   Box,
// } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import Cookies from "js-cookie";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { AuthContext } from "../../context/AuthContext";
import { Messageupdate } from "../../context/AuthActions";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const NestedModal = ({
  onContent,
  onContentID,
  onCommentsID,
  onClose,
  onTitle,
  userId,
  onContentData,
  onStatus,
  onPostUpdate,
  isAddComment,
  isMember_id,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const { user: datauser, dispatch } = useContext(AuthContext);
  const [privacy, setPrivacy] = useState(onStatus);

  const privacyOptions = [
    { label: "สาธารณะ", value: "normal" },
    { label: "ส่วนตัว", value: "private" },
    { label: "เฉพาะผู้ติดตาม", value: "followers" },
  ];
  
  useEffect(() => {
    setContent(onContent);
  }, [onContent]);

  async function newNotification(onType, onBody, onTitle) {
    const NotificationRef = firestore.collection("Notifications").doc();
    const NotificationID = NotificationRef.id;
    const newNotificationData = {
      id: NotificationID,
      type: onType,
      member_id: isMember_id,
      author_id: userId,
      name: `${datauser.firstName} ${datauser.lastName}`,
      profilePicture: datauser.profilePicture,
      timestamp: new Date(),
      title: onTitle,
      body: onBody,
      post_id: onContentID,
      read: false,
    };

    await NotificationRef.set(newNotificationData);
  }

  const handlePrivacyChange = (event, value) => {
    if (value) {
      setPrivacy(value.value);
      console.log("object", value.value);
    } else {
      setPrivacy(onStatus);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      let endpoint = "";
      let updatedData = null;

      if (onTitle === "Post") {
        // endpoint = `${path}/api/posts/${onContentID}`;
        console.log("onTitle", onTitle);
        updatedData = {
          content: content,
          member_id: userId,
          status: privacy,
        };
        
        console.log(updatedData)
        // await axios.put(endpoint, updatedData, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });

        // const updatedPost = { ...onContent, ...updatedData };
        // onPostUpdate(updatedPost);
        dispatch(Messageupdate("Success Share Post.", true, "success"));
      } else if (onTitle === "Comment") {
        endpoint = `${path}/api/comments/${onContentID}/Comments/${onCommentsID}`;
        updatedData = { content: content, member_id: userId };
        await axios.put(endpoint, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (onTitle === "Add Comment") {
        try {
          endpoint = `${path}/api/comments/Comment/${onContentID}`;
          const updatedData = { content: content, member_id: userId };

          await axios.post(endpoint, updatedData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          dispatch(Messageupdate("Success comment post.", true, "success"));
        } catch (error) {
          dispatch(
            Messageupdate("Failed to comment on the post.", true, "error")
          );
          console.error("Error adding comment:", error);
        } finally {
          onClose();
        }
      } else {
        console.log("Invalid Edit Type");
        return;
      }

      if (isAddComment) {
        const resComments = await axios.get(
          `${path}/api/comments/${onContentID}/Comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        onPostUpdate(resComments.data, onTitle);
      } else {
        const updatedItem = { ...onContent, content };
        onPostUpdate(updatedItem, onTitle);
      }
    } catch (err) {
      dispatch(Messageupdate("Failed Add Content Post.", true, "error"));
      console.log(err);
    } finally {
      setLoading(false);
      dispatch(Messageupdate("Success Add Content Post.", true, "success"));
    }
    onClose();
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleChangeContent = (event) => {
    setContent(event.target.value);
  };

  return (
    <Modal open={true}>
      <Box sx={style}>
        <IconButton
          onClick={handleCloseModal}
          size="small"
          sx={{
            position: "absolute",
            top: "0px",
            right: "0px",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <h2 id="nested-modal-title">{onTitle}</h2>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <h5 id="nested-modal-title">Status</h5>
            <Autocomplete
              id="margin-none"
              autoFocus
              disableCloseOnSelect
              fullWidth
              selectOnFocus
              autoHighlight
              options={privacyOptions}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              defaultValue={privacyOptions.find(
                (option) => option.value === onStatus
              )}
              getOptionLabel={(option) => option.label}
              onChange={handlePrivacyChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  size="small"
                  sx={{ color: "#6309DE", m: 1 }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              id="nested-modal-content"
              label={`${onTitle} Content`}
              multiline
              rows={4}
              value={content?.content}
              onChange={handleChangeContent}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <LoadingButton
              size="small"
              onClick={handleSaveChanges}
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
              sx={{ backgroundColor: "#6200E8" }}
              fullWidth
            >
              <span>{isAddComment ? "Add" : "Edit"}</span>
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

//---------------------------------------------------------

const ReportModal = ({
  onContent,
  onContentID,
  onCommentsID,
  onClose,
  onTitle,
  userId,
  onPostUpdate,
  isAddComment,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const token = Cookies.get("token");

  const handleSaveChanges = async () => {
    if (onContent !== content) {
      try {
        setLoading(true);

        let endpoint = "";
        let rePortData;
        if (onTitle === "Post") {
          // console.log('post', onContentID,'report');
          const memberId = userId;
          const postId = onContentID;
          const comment = content;
          const status = "in progress";

          const reportRef = firestore.collection("Report_Post").doc();
          const reportId = reportRef.id;

          const postRef = firestore.collection("Posts").doc(postId);
          const postSnapshot = await postRef.get();

          if (!postSnapshot.exists) {
            dispatch(Messageupdate(`Failed report ${onTitle}.`, true, "error"));
            return;
          } else {
            const reportData = {
              report_id: reportId,
              member_id: memberId,
              post_id: postId,
              comment: comment,
              status: status,
              isOpen: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            await reportRef.set(reportData);
          }
        } else if (onTitle === "User") {
          const reporterId = userId;
          const reportedMemberId = onCommentsID;
          const comments = content;
          const status = "in progress";

          const reportRef = firestore.collection("Report_User").doc();
          const reportId = reportRef.id;

          const reportedUserRef = firestore
            .collection("Users")
            .doc(reportedMemberId);
          const reportedUserSnapshot = await reportedUserRef.get();

          if (!reportedUserSnapshot.exists) {
            return;
          } else {
            const reportData = {
              report_id: reportId,
              reporter_id: reporterId,
              reported_member_id: reportedMemberId,
              comment: comments,
              status: status,
              isOpen: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            await reportRef.set(reportData);
          }
        }
      } catch (err) {
        dispatch(Messageupdate(`Failed report ${onTitle}.`, true, "error"));
        console.log(err);
      } finally {
        setLoading(false);
        dispatch(Messageupdate(`Success report ${onTitle}.`, true, "success"));
      }
    } else {
      console.log("Err Edit Content");
      dispatch(Messageupdate("Failed Edit Content.", true, "error"));
    }
    onClose();
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleChangeContent = (event) => {
    setContent(event.target.value);
  };

  return (
    <Modal open={true}>
      <Box sx={style}>
        <IconButton
          onClick={handleCloseModal}
          size="small"
          sx={{
            position: "absolute",
            top: "0px",
            right: "0px",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={12} md={12}>
            <h2 id="nested-modal-title">Report {onTitle}</h2>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              id="nested-modal-content"
              label={`${onTitle} report`}
              multiline
              rows={4}
              value={content}
              onChange={handleChangeContent}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <LoadingButton
              size="small"
              onClick={handleSaveChanges}
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="filled"
              sx={{ backgroundColor: "#ffc400" }}
              fullWidth
            >
              <span>Report</span>
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export { NestedModal, ReportModal };
