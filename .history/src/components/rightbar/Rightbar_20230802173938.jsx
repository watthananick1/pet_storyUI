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

export default function Rightbar({ user }) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [Onlinefriends, setOnlinfFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.followers.includes(user?.member_id)
  );
  const token = Cookies.get("token");

  //++++++++++++++++++ fetch Data +++++++++++++++++++

  useEffect(() => {
    const usersRef = firestore.collection("Users");
    const unsubscribeUserListeners = [];
  
    // Get the users who are in currentUser.followers
    const followerUsers = [];
  
    currentUser.followers.forEach((followerId) => {
      const unsubscribeFollowerListener = usersRef.doc(followerId).onSnapshot((doc) => {
        const followerData = doc.data();
        
        if (followerData.Online_Friends) {
          followerUsers.push({
            member_id: followerId,
            Online_Friends: followerData.Online_Friends,
          });
          Onlinefriends= {
            member_id: followerData.member_id,
            profilePicture: followerData.profilePicture,
            firstName: "Janell",
            lastName: "Shrum",
          
          }
        }
      });
  
      unsubscribeUserListeners.push(unsubscribeFollowerListener);
    });
  
    // Update Online Friends state with the filtered followerUsers
    setOnlinfFriends(followerUsers);
  
    return () => {
      unsubscribeUserListeners.forEach((unsubscribe) => unsubscribe());
    };
  }, [currentUser]);  

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(
          `${path}/api/users/friends/${user.member_id}`,
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
        await axios.put(`${path}/api/users/${user?.member_id}/unfollow`, {
          member_id: currentUser?.member_id,
        });
        dispatch({ type: "UNFOLLOW", payload: user?.member_id });
      } else {
        await axios.put(`${path}/api/users/${user?.member_id}/follow`, {
          member_id: currentUser?.member_id,
        });
        dispatch({ type: "FOLLOW", payload: user?.member_id });
      }
      setFollowed(!followed);
    } catch (err) {}
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Onlinefriends.map((u, index) => (
            <Online key={index} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user?.firstName !== currentUser?.firstName && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">
              {user.city ? user?.city : "-"}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">
              {user.from ? user?.from : "-"}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user?.relationship === 1
                ? "Single"
                : user?.relationship === 1
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend?.firstName}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <Avatar
                  className="rightbarFollowingImg"
                  aria-label="recipe"
                  src={
                    friend.profilePicture
                      ? friend?.profilePicture
                      : "/assets/person/noAvatar.png"
                  }
                  style={{ width: "39px", height: "39px" }}
                ></Avatar>
                <span className="rightbarFollowingName">
                  {friend?.firstName} {friend?.lastName}
                </span>
              </div>
            </Link>
          ))}
        </div>
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
