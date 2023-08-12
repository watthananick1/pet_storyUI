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

  return (
    <div className="feed">
      <SnackbarProvider maxSnack={3}>
        <div className="feedWrapper">
          <Snackbar
            open={isOpen}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleClose}
              severity={isSeverity}
              sx={{ width: "100%" }}
            >
              {isMessage}
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
      </SnackbarProvider>
    </div>
  );
}
