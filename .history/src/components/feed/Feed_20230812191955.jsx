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
  const [newPosts, setNewPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    // Create a socket connection
    const socket = io.connect(process.env.REACT_APP_SOCKET_URL); // Change this to your socket server URL

    // Event listener for new posts
    socket.on("newPost", (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    // Event listener for like updates
    socket.on("likeUpdated", ({ id, member_id }) => {
      // Handle the like update logic here, e.g., update the like count in the posts state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id && post.member_id === member_id
            ? { ...post, likes: post.likes + 1 }
            : post
        )
      );
    });

    // Event listener for new comments
    socket.on("commentAdded", ({ postId, comment }) => {
      // Handle the new comment logic here, e.g., update the comments in the posts state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, comment],
              }
            : post
        )
      );
    });

    return () => {
      socket.disconnect(); // Clean up socket connection when component unmounts
    };
  }, []);
  
  useEffect(() => {
    if (user && user.member_id) {
      // Fetch user's posts or all posts
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            onProfile
              ? `${path}/api/posts/user/${firstName}/date`
              : `${path}/api/posts/${user.member_id}/date`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPosts(res.data);
        } catch (err) {
          dispatch(Messageupdate("Failed Request Post", true, "error"));
          enqueueSnackbar("Failed Request Post.", { variant: "error" });
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [user, onProfile, firstName, dispatch, token, enqueueSnackbar]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const socket = io.connect(process.env.PATH_ID);

    const fetchPosts = async () => {
      try {
        const currentTime = new Date().getTime();
        setLoading(true);
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
          return b.createdAt.seconds - a.createdAt.seconds;
        });
        setPosts(sortedPosts);
      } catch (err) {
        if (axios.isCancel(err)) {
          // ...
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
        const res = await axios.get(
          `${path}/api/posts/user/${firstName}/date`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedPosts = res.data.sort((a, b) => {
          return b.createdAt.seconds - a.createdAt.seconds;
        });
        setPosts(sortedPosts);
      } catch (error) {
        dispatch(Messageupdate("Failed Request Post", true, "error"));
        console.log(error);
      } finally {
        // ...
      }
    };

    if (onProfile) {
      fetchUserPosts();
    } else {
      fetchPosts();
    }

    socket.on("newPost", (newPostData) => {
      handleNewPost(newPostData);
    });
    
    const handleNewPost = (newPostData) => {
      const postData = newPostData; // ตัดบรรทัดนี้ออก เนื่องจากไม่ต้องการทำการแปลงให้เป็น Firestore Document อีก
      if (postData && postData.member_id) {
        setNewPosts((prevPosts) => [postData, ...prevPosts]);
      }
    };

    return () => {
      source.cancel("Component unmounted");
      socket.off("newPost", handleNewPost);
      socket.disconnect();
    };
  }, [onProfile, firstName, user.member_id]);

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
        });
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
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
              {/* {newPosts.map((p, i) => (
                <Post key={i} isPost={p} indexPost={i} />
              ))} */}
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
