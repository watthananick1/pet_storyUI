import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import Cookies from "js-cookie";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import AvatarGroup from "@mui/material/AvatarGroup";
import Card from "@mui/material/Card";

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

export function Rightbar({ user }) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const dataUser = JSON.parse(localStorage.getItem("user"));
  const [Onlinefriends, setOnlineFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.followers.includes(dataUser?.member_id)
  );
  const token = Cookies.get("token");

  //++++++++++++++++++ fetch Data +++++++++++++++++++

  useEffect(() => {
    console.log("currentUser", currentUser);
    console.log("user", currentUser);
  }, [currentUser]);

  useEffect(() => {
    const usersRef = firestore.collection("Users");
    const unsubscribeUserListeners = [];
    const followerUsers = [];

    const fetchData = async () => {
      for (const followerId of currentUser.followings) {
        const followerDoc = await usersRef.doc(followerId).get();
        const followerData = followerDoc.data();

        if (followerData.Online_Friends) {
          followerUsers.push({
            member_id: followerId,
            Online_Friends: followerData.Online_Friends,
            profilePicture: followerData.profilePicture,
            firstName: followerData.firstName,
            lastName: followerData.lastName,
          });
        }

        const unsubscribeFollowerListener = usersRef
          .doc(followerId)
          .onSnapshot((doc) => {
            const updatedFollowerData = doc.data();

            // Update the existing follower data in the array
            const indexToUpdate = followerUsers.findIndex(
              (user) => user.member_id === followerId
            );

            if (indexToUpdate !== -1) {
              followerUsers[indexToUpdate] = {
                member_id: followerId,
                Online_Friends: updatedFollowerData.Online_Friends,
                profilePicture: updatedFollowerData.profilePicture,
                firstName: updatedFollowerData.firstName,
                lastName: updatedFollowerData.lastName,
              };

              // Update the state with the modified array
              setOnlineFriends([...followerUsers]);
            }
          });

        unsubscribeUserListeners.push(unsubscribeFollowerListener);
      }
    };

    fetchData();

    return () => {
      unsubscribeUserListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentUser.followings]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(
          `${path}/api/users/friends/${dataUser.member_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user, token]);

  //++++++++++ on Click Button +++++++++++

  const handleClick = async () => {
    try {
      const userRef = firestore.collection("Users").doc(dataUser?.member_id);
      const currentUserRef = firestore.collection("Users").doc(currentUser?.id);
  
      if (followed) {
        // Unfollow the user
        await currentUserRef.update({
          followings: firebase.firestore.FieldValue.arrayRemove(dataUser?.member_id)
        });
  
        await userRef.update({
          followers: firebase.firestore.FieldValue.arrayRemove(currentUser?.id)
        });
      } else {
        // Follow the user
        await currentUserRef.update({
          followings: firebase.firestore.FieldValue.arrayUnion(dataUser?.member_id)
        });
  
        await userRef.update({
          followers: firebase.firestore.FieldValue.arrayUnion(currentUser?.id)
        });
      }
  
      dispatch({ type: followed ? "UNFOLLOW" : "FOLLOW", payload: dataUser?.member_id });
      setFollowed(!followed);
    } catch (err) {
      console.error(err);
    }
  };
  

  const HomeRightbar = () => {
    return (
      <>
        <img className="rightbarAd" src="../../../../assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Onlinefriends.map((u, index) => {
            //*console.log("user", u.member_id);
            return <Online key={index} user={u} />;
          })}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <Box>
        {user?.firstName !== currentUser?.firstName && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
      </Box>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
export function RightbarR({ user }) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const dataUser = JSON.parse(localStorage.getItem("user"));
  const [Onlinefriends, setOnlineFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.followers.includes(user?.member_id)
  );
  const token = Cookies.get("token");

  //++++++++++++++++++ fetch Data +++++++++++++++++++

  // useEffect(() => {
  //   console.log("Online", Onlinefriends);
  // }, [Onlinefriends]);

  useEffect(() => {
    const usersRef = firestore.collection("Users");
    const unsubscribeUserListeners = [];
    const followerUsers = [];

    const fetchData = async () => {
      for (const followerId of currentUser.followings) {
        const followerDoc = await usersRef.doc(followerId).get();
        const followerData = followerDoc.data();

        if (followerData.Online_Friends) {
          followerUsers.push({
            member_id: followerId,
            Online_Friends: followerData.Online_Friends,
            profilePicture: followerData.profilePicture,
            firstName: followerData.firstName,
            lastName: followerData.lastName,
          });
        }

        const unsubscribeFollowerListener = usersRef
          .doc(followerId)
          .onSnapshot((doc) => {
            const updatedFollowerData = doc.data();

            // Update the existing follower data in the array
            const indexToUpdate = followerUsers.findIndex(
              (user) => user.member_id === followerId
            );

            if (indexToUpdate !== -1) {
              followerUsers[indexToUpdate] = {
                member_id: followerId,
                Online_Friends: updatedFollowerData.Online_Friends,
                profilePicture: updatedFollowerData.profilePicture,
                firstName: updatedFollowerData.firstName,
                lastName: updatedFollowerData.lastName,
              };

              // Update the state with the modified array
              setOnlineFriends([...followerUsers]);
            }
          });

        unsubscribeUserListeners.push(unsubscribeFollowerListener);
      }
    };

    fetchData();

    return () => {
      unsubscribeUserListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentUser.followings]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(
          `${path}/api/users/friends/${dataUser.member_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user, token]);

  //++++++++++ on Click Button +++++++++++

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`${path}/api/users/${dataUser?.member_id}/unfollow`, {
          member_id: dataUser?.member_id,
        });
        dispatch({ type: "UNFOLLOW", payload: dataUser?.member_id });
      } else {
        await axios.put(`${path}/api/users/${dataUser?.member_id}/follow`, {
          member_id: dataUser?.member_id,
        });
        dispatch({ type: "FOLLOW", payload: dataUser?.member_id });
      }
      setFollowed(!followed);
    } catch (err) {}
  };

  const HomeRightbar = () => {
    return (
      <>
        {/* <div className="birthdayContainer">
          <img className="birthdayImg" src="./../assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div> */}
        <img className="rightbarAd" src="../../../public/assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Onlinefriends.map((u, index) => {
            return <Online key={index} user={u} />;
          })}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        <Box>
          <Card className="Wrapper">
            {user?.firstName !== currentUser?.firstName && (
              <button
                className="rightbarFollowButton"
                onClick={handleClick}
                style={{ marginBottom: "10px" }}
              >
                {followed ? "Unfollow" : "Follow"}
                {followed ? <Remove /> : <Add />}
              </button>
            )}
            
          </Card>
        </Box>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}