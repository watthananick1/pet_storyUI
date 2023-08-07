import "./share.css";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import io from "socket.io-client";
import Cookies from "js-cookie";

import {
  Avatar,
  Chip,
  Autocomplete,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Box
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  PermMedia,
  Cancel,
  Send as SendIcon,
  PhotoCameraBack as PhotoCameraBackIcon,
} from "@mui/icons-material";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

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
const storage = firebase.storage();
const path = process.env.REACT_APP_PATH_ID;

export default function Share({ onNewPost }) {
  const { user, dispatch } = useContext(AuthContext);
  const desc = useRef();
  const [typePets, setTypePets] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [files, setFiles] = useState([]);
  const [typeData, setTypeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState("normal");
  const MAX_TAGS_LIMIT = 3;
  const token = Cookies.get("token");

  const privacyOptions = [
    { label: "สาธารณะ", value: "normal" },
    { label: "ส่วนตัว", value: "private" },
    { label: "เฉพาะผู้ติดตาม", value: "followers" },
  ];

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setFiles(arrayMove(files, oldIndex, newIndex));
  };

  const handlePrivacyChange = (event, value) => {
    if (value) {
      setPrivacy(value.value);
    } else {
      setPrivacy("normal"); // Default to normal if no option is selected
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 6); // Limit to 6 files

    // File size limits
    const imageMaxSize = 5 * 1024 * 1024; // 5 MB in bytes
    const videoMaxSize = 100 * 1024 * 1024; // 100 MB in bytes

    // Validate file sizes
    const validFiles = selectedFiles.filter((file) => {
      if (file.type.startsWith("image/") && file.size <= imageMaxSize) {
        return true; // Valid image file
      }
      if (file.type.startsWith("video/") && file.size <= videoMaxSize) {
        return true; // Valid video file
      }
      return false; // Invalid file
    });

    setFiles(validFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    // console.log("updatedFiles",updatedFiles);
    // console.log("index",index);
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    const storageRef = storage.ref();
    const filePromises = files.map((file) => {
      const fileName = Date.now() + file.name;
      const fileRef = storageRef.child(`${user.member_id}/${fileName}`);
      return fileRef.put(file);
    });

    const socket = io.connect(process.env.PATH_ID); // Fix the environment variable name

    try {
      const uploadSnapshots = await Promise.all(filePromises);

      const fileUrls = await Promise.all(
        uploadSnapshots.map((snapshot) => snapshot.ref.getDownloadURL())
      );

      const newPost = {
        title: typeData,
        content: desc.current.value,
        member_id: user.member_id,
        likes: [],
        tagpet: selectedTags.map((tag) => tag.nameType),
        img: fileUrls,
        comment: [],
        status: privacy,
      };

      const res = await axios.post(`${path}/api/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiles([]);
      setTypeData(null);
      setSelectedTags([]);
      desc.current.value = "";
      socket.emit("newPost", res.data); // Emit the "newPost" event with data
      if (onNewPost) {
        onNewPost();
      }
    } catch (err) {
      dispatch({ type: "MESSAGE_UPDATE", message: "Failed Share Post.", open: true, severity: "error"});
      console.log(err);
      // Handle error here and display appropriate message to the user
    } finally {
      import { useContext, useEffect, useState, forwardRef } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import ReactLoading from "react-loading";
import io from "socket.io-client";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const path = process.env.REACT_APP_PATH_ID;

export default function Feed({ firstName, onProfile }) {
  const [posts, setPosts] = useState([]);
  const { user, dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");
  const { message: isMessage, open: isOpen, severity: isSeverity } = useContext(AuthContext);
  const [message, setMessage] = useState({
    open: isOpen,
    severity: isSeverity,
    text: isMessage,
  });
  
  useEffect(() => {
    setMessage({ severity: isSeverity, text: isMessage, open: isOpen });
  }, [isMessage, isOpen, isSeverity]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMessage({ severity: isSeverity, text: isMessage, open: false });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    const socket = io.connect(process.env.PATH_ID); // Fix the environment variable name
    const fetchPosts = async () => {
      try {
        const currentTime = new Date().getTime();
        setLoading(true);
        const res = await axios.get(`${path}/api/posts/${user.member_id}/date`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: source.token,
        });
        const sortedPosts = res.data.sort((a, b) => {
          const timeDiffA = Math.abs(
            currentTime - new Date(a.createdAt.seconds * 1000).getTime()
          );
          const timeDiffB = Math.abs(
            currentTime - new Date(b.createdAt.seconds * 1000).getTime()
          );
          return timeDiffA - timeDiffB;
        });
        setPosts(sortedPosts);
      } catch (err) {
        if (axios.isCancel(err)) {
          //console.log("Request canceled:", err.message);
        } else {
          dispatch({ type: "MESSAGE_UPDATE", message: "Failed Request Post", open: true, severity: "error"});
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const currentTime = new Date().getTime();

        setLoading(true);
        const res = await axios.get(`${path}/api/posts/user/${firstName}/date`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedPosts = res.data.sort((a, b) => {
          const timeDiffA = Math.abs(
            currentTime - new Date(a.createdAt.seconds * 1000).getTime()
          );
          const timeDiffB = Math.abs(
            currentTime - new Date(b.createdAt.seconds * 1000).getTime()
          );
          return timeDiffA - timeDiffB;
        });
        setPosts(sortedPosts);
      } catch (error) {
        dispatch({ type: "MESSAGE_UPDATE", message: "Failed Request Post", open: true, severity: "error"});
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const handleNewPost = (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    if (onProfile) {
      fetchUserPosts();
    } else {
      fetchPosts();
    }

    socket.on("newPost", handleNewPost);

    return () => {
      source.cancel("Component unmounted");
      console.log("Component unmounted", source);
      socket.off("newPost", handleNewPost);
      socket.disconnect();
    };
  }, [onProfile, firstName, user.member_id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={message.severity}
          sx={{ width: "100%" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
        {!firstName || firstName === user?.firstName ? <Share /> : null}
        {loading ? (
          <div className="loadingWrapper">
            <ReactLoading
              type="spin"
              color="#6200E8"
              height={"10%"}
              width={"10%"}
            />
          </div>
        ) : (
          <>
            {posts.map((p, i) => (
              <Post key={i} isPost={p} indexPost={i} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

      setLoading(false);
    }
  };

  useEffect(() => {
    const getTypePets = async () => {
      try {
        const res = await axios.get(`${path}/api/typePets`);
        const data = res.data;
        const typePets = data.map((item, index) => ({
          id: index,
          nameType: item.nameType,
        }));
        setTypePets(typePets);
      } catch (err) {
        console.log(err);
      }
    };
    getTypePets();
  }, []);

  const SortableItem = SortableElement(({ item, index }) => {
    if (item.type === "image") {
      setTypeData("image");
      return (
        <div className="shareImgItem">
          <img src={item.url} alt="Gallery Image" className="shareImg" />
          <Cancel
            className="shareCancelImg"
            onClick={() => removeFile(item.index)}
          />
        </div>
      );
    } else if (item.type === "video") {
      setTypeData("video");
      return (
        <div className="shareVideoItem">
          <video src={item.url} className="shareVideo" controls />
          <Cancel
            className="shareCancelImg"
            onClick={() => removeFile(item.index)}
          />
        </div>
      );
    } else {
      return null; // Exclude unsupported file types
    }
  });

  const SortableList = SortableContainer(({ items}) => (
    <div className="shareImgContainer">
      {items.map((item, index) => (
        <div key={index}>
          {" "}
          {/* Assign a unique key to each child element */}
          <SortableItem item={item} index={item.index} />
        </div>
      ))}
    </div>
  ));

  function arrayMove(array, oldIndex, newIndex) {
    if (newIndex >= array.length) {
      let k = newIndex - array.length + 1;
      while (k--) {
        array.push(undefined);
      }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <Grid container alignItems="center">
            <Grid item xs={6} sm={6} md={6}>
              <Avatar
                aria-label="recipe"
                src={user.profilePicture}
                sx={{ width: "39px", height: "39px", mr: 1 }}
              />
              <Autocomplete
                id="margin-none"
                autoFocus
                disableCloseOnSelect
                fullWidth
                selectOnFocus
                autoHighlight
                options={privacyOptions}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                defaultValue={privacyOptions.find(
                  (option) => option.value === "normal"
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
                fullWidth
                placeholder={`What's on your mind, ${user.firstName}?`}
                className="shareInput"
                variant="standard"
                size="small"
                rows={3}
                multiline
                inputRef={desc}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <form className="shareBottom" onSubmit={submitHandler}>
                {/* Share options */}
                <div className="shareOptions">
                  <div className="shareOption">
                    <label htmlFor="file" className="shareOptionLabel">
                      <PhotoCameraBackIcon />
                      {/* <PermMedia htmlColor="tomato" className="shareIcon" /> */}
                      <br></br>
                      <span className="shareOptionText">Photo or Video</span>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        id="file"
                        accept=".png,.jpeg,.jpg,.gif,.mp4,.mov"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                {/* Share images */}
                <Box className="shareImg">
                  <SortableList
                    items={files.map((file, index) => ({
                      type: file.type.startsWith("image/") ? "image" : "video",
                      url: URL.createObjectURL(file),
                      index: index
                    }))}
                    onSortEnd={onSortEnd}
                    axis="xy"
                    distance={1}
                  />
                </Box>
                {/* Share tags */}
                <div className="shareTags">
                  <Autocomplete
                    multiple
                    sx={{ m: 1 }}
                    id="type-pets-select"
                    options={typePets}
                    // defaultValue={typePets[0]}
                    getOptionLabel={(option) => option.nameType}
                    onChange={(event, value) => setSelectedTags(value)}
                    value={selectedTags}
                    limitTags={MAX_TAGS_LIMIT}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type Pets"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </div>
                {/* Share button */}
                <div className="shareBottomOptions">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: "#6309DE" }}
                    startIcon={<SendIcon />}
                    className="shareButton"
                    disabled={loading}
                    loading={loading}
                  >
                    Share
                  </LoadingButton>
                </div>
              </form>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
