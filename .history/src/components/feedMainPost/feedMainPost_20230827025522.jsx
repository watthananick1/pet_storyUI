import { useContext, useEffect, useState, forwardRef } from "react";
import Post from "../postMain/PostMain";
import Share from "../share/Share";
import "./feedMainPost.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Messageupdate } from "../../context/AuthActions";
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

export default function Feed({ post }) {
  const [posts, setPosts] = useState([]);
  const [issort, setSort] = useState(sort);
  const [newPosts, setNewPosts] = useState([]);
  const [showNewPosts, setShowNewPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [Open, isSetOpen] = useState(false);
  const [placement, setPlacement] = useState();
  const [countPost, setCountPost] = useState(0);
  // const token = Cookies.get("token");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();


  const handleCloseC = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    //console.log(posts);
  }, [posts]);

  useEffect(() => {
    try {
      const unsubscribe = postsCollection

        .orderBy("createdAt", "desc")
        .onSnapshot(async (snapshot) => {
          const currentTime = new Date().getTime();
          const updatedPosts = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const postData = doc.data();
              const userDoc = await UsersCollection.doc(postData.member_id).get();
  
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
          setPosts(updatedPosts.filter(post => post !== null && post.status === "normal"));
          setLoading(false);
        });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);
  
  useEffect(() => {
    async function fetchPostData() {
      try {
        const postDoc = await postsCollection.doc(postID).get();
        const postData = postDoc.data();
        console.log("Post: ", postData);
        //setPosts(postData.data());
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    }
  
    fetchPostData();
  
    // If needed, you can return a cleanup function here
    // return () => {
    //   // Cleanup logic, if applicable
    // };
  }, [postID]);
  

  const handleFeedScroll = () => {
    setOpen(false);
  };

  return (
    <div className="feed" onScroll={handleFeedScroll}>
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
            ? newPosts.map((p, i) => <Post key={i} isPost={p} indexPost={i} />)
            : null}
          {posts.map((p, i) => (
            <Post key={i} isPost={p} indexPost={i} />
          ))}
        </>
      )}
    </div>
  );
}
