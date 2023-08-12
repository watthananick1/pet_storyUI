import React, { useContext, useEffect, useState, forwardRef } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Messageupdate } from "../../context/AuthActions";
import ReactLoading from "react-loading";
import io from "socket.io-client";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { SnackbarProvider, useSnackbar } from "notistack";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import "firebase/database";

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
const postsCollection = firestore.collection("Posts");
const UsersCollection = firestore.collection("Users");

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const path = process.env.REACT_APP_PATH_ID;

export default function Feed({ firstName, onProfile }) {
  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState();
  const token = Cookies.get("token");
  const { enqueueSnackbar } = useSnackbar();
  const {
    user,
    dispatch,
    message: isMessage,
    open: isOpen,
    severity: isSeverity,
  } = useContext(AuthContext);
  const [message, setMessage] = useState({
    open: isOpen,
    severity: isSeverity,
    text: isMessage,
  });

  const fetchPosts = async () => {
    const source = axios.CancelToken.source();
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
      showSnackbarNewPosts(sortedPosts.length);
    } catch (err) {
      if (axios.isCancel(err)) {
        //console.log("Request canceled:", err.message);
      } else {
        dispatch(Messageupdate("Failed Request Post", true, "error"));
        enqueueSnackbar("Failed Request Post.", { variant: "error" });
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const currentTime = new Date().getTime();

      //setLoading(true);
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
      dispatch(Messageupdate("Failed Request Post", true, "error"));
      console.log(error);
    } finally {
      //setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpen((prev) => !prev);
    setPlacement("top");

    // ปิดป็อปอัพและรีเฟรชโพสต์ใหม่
    setOpen(false);
    if (onProfile) {
      fetchUserPosts();
    } else {
      fetchPosts();
    }
  };

  const showSnackbarNewPosts = (count) => {
    enqueueSnackbar(`You have ${count} new post(s).`, {
      variant: "info",
      action: (key) => (
        <>
          <Button
            onClick={() => {
              fetchPosts(); // รีเฟรชโพสต์
              enqueueSnackbar("Refreshing...", { variant: "success" });
              closeSnackbar(key); // ปิด Snackbar
            }}
            color="inherit"
          >
            Refresh
          </Button>
          <IconButton
            onClick={() => {
              closeSnackbar(key); // ปิด Snackbar
            }}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </>
      ),
    });
  };

  // ตั้งค่า useEffect และโค้ดอื่น ๆ ตามที่คุณมีอยู่

  return (
    <div className="feed">
      <SnackbarProvider maxSnack={3}>
        <div className="feedWrapper">
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
      </SnackbarProvider>
    </div>
  );
}
