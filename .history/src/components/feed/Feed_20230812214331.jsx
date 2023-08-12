import { useContext, useEffect, useState, forwardRef } from "react";
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
import Chip from '@mui/material/Chip';
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
  const [countPost, setCountPost] = useState(0);
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

  useEffect(() => {
    console.log(message);
  }, [message]);

  useEffect(() => {
    setMessage({
      text: isMessage,
      open: isOpen,
      severity: isSeverity,
    });
    enqueueSnackbar(isMessage, { variant: isSeverity });
  }, [isMessage, isOpen, isSeverity]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMessage((prevMessage) => ({
      ...prevMessage,
      open: false,
    }));
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    const socket = io.connect(process.env.PATH_ID);
    const fetchPosts = async () => {
      try {
        const currentTime = new Date().getTime();
        setOpen(true);
        const res = await axios.get(
          `${path}/api/posts/${user.member_id}/date`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: source.token,
          }
        );
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
        const res = await axios.get(
          `${path}/api/posts/user/${firstName}/date`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

    const handleNewPost = (newPost) => {
      if (user && user.member_id) {
        const postData = newPost.data();
        if (postData && postData.member_id) {
          setNewPosts((prevPosts) => [newPost, ...prevPosts]);

          setCountPost((prevCount) => prevCount + 1);
          setOpen(true);
        }
      }
    };

    if (onProfile) {
      fetchUserPosts();
    } else {
      fetchPosts();
    }

    socket.on("newPost", handleNewPost);

    return () => {
      source.cancel("Component unmounted");
      //console.log("Component unmounted", source);
      socket.off("newPost", handleNewPost);
      socket.disconnect();
    };
  }, [onProfile, firstName, user.member_id, newPosts]);

  useEffect(() => {
    let unsubscribe;

    try {
      unsubscribe = postsCollection
        .orderBy("createdAt", "desc")
        .onSnapshot(async (snapshot) => {
          const currentTime = new Date().getTime();
          const updatedPosts = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const postData = doc.data();
              if (postData.member_id.exists) {
                const userDoc = await UsersCollection.doc(
                  postData.member_id
                ).get();

                if (userDoc.exists) {
                  const userData = userDoc.data();

                  return {
                    ...postData,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    post_Status: userData.statusUser,
                    profilePicture: userData.profilePicture,
                  };
                } else {
                  return null;
                }
              }
            })
          );

          const filteredPosts = updatedPosts
            .filter((post) => post !== null)
            .filter((post) => {
              if (post && post.createdAt && post.createdAt.seconds) {
                const postTime = new Date(
                  post.createdAt.seconds * 1000
                ).getTime();
                return postTime > currentTime - 60000;
              }
              return false;
            });

          setNewPosts(filteredPosts);
          setPosts(filteredPosts); // อัพเดต state posts เพื่อแสดงผลใหม่ใน Feed
        });
    } catch (error) {
      // จัดการข้อผิดพลาดที่เกิดขึ้นในการเรียกใช้ API หรือข้อมูลอื่น ๆ
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); // ปิดสถานะ loading
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="feed">
      <SnackbarProvider maxSnack={3}>
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
          <Popper
            className="feedWrapper"
            open={open}
            anchorEl={anchorEl}
            placement={placement}
            transition
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <Typography sx={{ p: 2 }}>
                    Have new {countPost} post.
                  </Typography>
                  <div className="floatingButton">
                    <Fab
                      color="primary"
                      aria-label="add"
                      onClick={handleOpenDialog}
                    >
                      <AddIcon />
                    </Fab>
                  </div>
                </Paper>
              </Fade>
            )}
          </Popper>
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
      </SnackbarProvider>
    </div>
  );
}
