import { useContext, useEffect, useState, forwardRef } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./sortpost_feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Messageupdate } from "../../context/AuthActions";
import { useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import io from "socket.io-client";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
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

export default function Sortpost_feed({ firstName }) {
  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [showNewPosts, setShowNewPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [Open, isSetOpen] = useState(false);
  const [placement, setPlacement] = useState();
  const [countPost, setCountPost] = useState(0);
  const token = Cookies.get("token");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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

  // useEffect(() => {
  //   console.log("sort", sort);
  //   setSort(sort);
  //   fetchPosts();
  // }, [sort]);

  const fetchPosts = async () => {
    const source = axios.CancelToken.source();
    try {
      //const currentTime = new Date().getTime();
      setLoading(true);
      isSetOpen(false);
      const res = await axios.get(`${path}/api/posts/${user.member_id}/date`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
      });
      const filteredPosts = res.data.filter((post) => post.title === "video");
      setPosts(filteredPosts);
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
      setOpen(false);
    }
  };

  // const fetchUserPosts = async () => {
  //   try {
  //     const currentTime = new Date().getTime();
  //     isSetOpen(false);
  //     setLoading(true);
  //     const res = await axios.get(`${path}/api/posts/user/${firstName}/date`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     // const sortedPosts = res.data.sort((a, b) => {
  //     //   const timeDiffA = Math.abs(
  //     //     currentTime - new Date(a.createdAt.seconds * 1000).getTime()
  //     //   );
  //     //   const timeDiffB = Math.abs(
  //     //     currentTime - new Date(b.createdAt.seconds * 1000).getTime()
  //     //   );
  //     //   return timeDiffA - timeDiffB;
  //     // });
  //     setPosts(res.data);
  //   } catch (error) {
  //     dispatch(Messageupdate("Failed Request Post", true, "error"));
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //     setOpen(false);
  //   }
  // };

  const handleRefresh = (key) => {
    closeSnackbar(key);

    fetchPosts();
  };

  useEffect(() => {
    console.log(newPosts);
    if (newPosts.length > 0) {
      // Check if any new post has a different member_id than the user
      const hasDifferentMemberId = newPosts.some(
        (post) => post.member_id !== user.member_id
      );

      if (hasDifferentMemberId) {
        setOpen(true);
        setCountPost((prevCount) => prevCount + 1);
      } else {
        setOpen(false);
        isSetOpen(true);
        //fetchUserPosts(); // Fetch user-specific posts
        setCountPost(0);
      }
    } else {
      setOpen(false);
      setCountPost(0);
      setShowNewPosts([]);
    }
  }, [newPosts]);

  // useEffect(() => {
  //   console.log(showNewPosts);
  // }, [showNewPosts]);

  // useEffect(() => {
  //   console.log(posts);
  // }, [posts]);

  // useEffect(() => {
  //   console.log(message);
  // }, [message]);

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

  const handleCloseC = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleNewPost = (newPost) => {
    if (user && user.member_id) {
      const postData = newPost.data();
      if (postData && postData.member_id) {
        setPosts((prevPosts) => [...newPosts, ...prevPosts]);
      }
    }
  };

  // useEffect(() => {
  //   const source = axios.CancelToken.source();
  //   const socket = io.connect(process.env.PATH_ID);
  //   const fetchPosts = async () => {
  //     try {
  //       const currentTime = new Date().getTime();
  //       const res = await axios.get(
  //         `${path}/api/posts/${user.member_id}/${issort}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           cancelToken: source.token,
  //         }
  //       );
  //       setPosts(res.data);
  //     } catch (err) {
  //       if (axios.isCancel(err)) {
  //         //console.log("Request canceled:", err.message);
  //       } else {
  //         dispatch(Messageupdate("Failed Request Post", true, "error"));
  //         enqueueSnackbar("Failed Request Post.", { variant: "error" });
  //         console.log(err);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const fetchUserPosts = async () => {
  //     try {
  //       const currentTime = new Date().getTime();

  //       //setLoading(true);
  //       isSetOpen(false);
  //       const res = await axios.get(
  //         `${path}/api/posts/user/${firstName}/${issort}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const sortedPosts = res.data.sort((a, b) => {
  //         const timeDiffA = Math.abs(
  //           currentTime - new Date(a.createdAt.seconds * 1000).getTime()
  //         );
  //         const timeDiffB = Math.abs(
  //           currentTime - new Date(b.createdAt.seconds * 1000).getTime()
  //         );
  //         return timeDiffA - timeDiffB;
  //       });
  //       setPosts(sortedPosts);
  //     } catch (error) {
  //       dispatch(Messageupdate("Failed Request Post", true, "error"));
  //       console.log(error);
  //     } finally {
  //       //setLoading(false);
  //     }
  //   };

  //   if (onProfile) {
  //     fetchUserPosts();
  //   } else {
  //     fetchPosts();
  //   }
  //   socket.on("newPost", handleNewPost);

  //   return () => {
  //     source.cancel("Component unmounted");
  //     //console.log("Component unmounted", source);
  //     // socket.off("newPost", handleNewPost);
  //     socket.disconnect();
  //   };
  // }, [onProfile, firstName, user.member_id, newPosts, issort]);

  useEffect(() => {
    try {
      const unsubscribe = postsCollection
        .orderBy("createdAt", "desc")
        .onSnapshot(async (snapshot) => {
          const currentTime = new Date().getTime();
          const updatedPosts = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const postData = doc.data();
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
          setLoading(false); // ปิดสถานะ loading
        });
      return unsubscribe;
    } catch (error) {}
  }, []);

  const handleFeedScroll = () => {
    setOpen(false);
  };

  return (
    <div className="feed" onScroll={handleFeedScroll}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseC}
        key={"topcenter"}
      >
        <Alert
          severity="info"
          variant="outlined"
          sx={{ width: "100%" }}
          action={
            <>
              <Button
                onClick={() => {
                  handleRefresh(); // Refresh posts
                  enqueueSnackbar("Refreshing...", { variant: "success" });
                }}
                color="inherit"
              >
                Refresh
              </Button>
              <IconButton onClick={handleCloseC} color="inherit" size="small">
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </>
          }
        >
          {`You have ${countPost} new post(s).`}
        </Alert>
      </Snackbar>
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
              {Open
                ? newPosts.map((p, i) => (
                    <Post key={i} isPost={p} indexPost={i} />
                  ))
                : null}
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
