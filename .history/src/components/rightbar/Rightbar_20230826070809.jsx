import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Typography from "@mui/material/Typography";
import { Add, Remove } from "@material-ui/icons";
import Cookies from "js-cookie";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import AvatarGroup from "@mui/material/AvatarGroup";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Autocomplete,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

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
  const [friendsfollowings, setFriendsfollowings] = useState([]);
  const dataUser = JSON.parse(localStorage.getItem("user"));
  const [Onlinefriends, setOnlineFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followings, setFollowed] = useState(
    currentUser.followings.includes(user?.member_id)
  );
  const token = Cookies.get("token");

  //++++++++++++++++++ fetch Data +++++++++++++++++++

  // useEffect(() => {
  // console.log("currentUser", currentUser);
  // console.log("user", user);
  //console.log("fng", followings);
  // }, [followings]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        //console.log("user", currentUser);
        const currentUserRef = firestore
          .collection("Users")
          .doc(user?.member_id);
        const currentUserDoc = await currentUserRef.get();

        const friendPromises = currentUserDoc
          .data()
          .followers.map(async (friend) => {
            //console.log("data", friend);
            const friendRef = firestore.collection("Users").doc(friend);
            const friendDoc = await friendRef.get();

            return friendDoc.data();
          });
        const friendFollowingPromises = currentUserDoc
          .data()
          .followings.map(async (friend) => {
            //console.log("data", friend);
            const friendRef = firestore.collection("Users").doc(friend);
            const friendDoc = await friendRef.get();

            return friendDoc.data();
          });

        const fetchedFriends = await Promise.all(friendPromises);
        const fetchedFollowing = await Promise.all(friendFollowingPromises);

        const currentUpdateUserRef = firestore
          .collection("Users")
          .doc(currentUser?.member_id);
        const currentUpdateUserDoc = (await currentUpdateUserRef.get()).data();

        //console.log("ww", currentUpdateUserDoc);

        setFriendsfollowings(fetchedFollowing);
        setFriends(fetchedFriends);
        setFollowed(currentUpdateUserDoc.followings.includes(user?.member_id));
        //console.log(fetchedFriends);
      } catch (err) {
        console.log(err);
      }
    };

    getFriends();
  }, [user, followings]);

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

  // useEffect(() => {
  //   const getFriends = async () => {
  //     try {
  //       const friendList = await axios.get(
  //         `${path}/api/users/friends/${dataUser.member_id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setFriends(friendList.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getFriends();
  // }, [user, token]);

  //++++++++++ on Click Button +++++++++++

  const handleClick = async () => {
    try {
      const userRef = firestore.collection("Users").doc(user?.member_id);
      const currentUserRef = firestore
        .collection("Users")
        .doc(currentUser?.member_id);

      const userDoc = await userRef.get();
      const currentUserDoc = await currentUserRef.get();

      if (userDoc.exists && currentUserDoc.exists) {
        if (followings) {
          // Unfollow the user
          await currentUserRef.update({
            followings: firebase.firestore.FieldValue.arrayRemove(
              user?.member_id
            ),
          });

          await userRef.update({
            followers: firebase.firestore.FieldValue.arrayRemove(
              currentUser?.member_id
            ),
          });
        } else {
          // Follow the user
          await currentUserRef.update({
            followings: firebase.firestore.FieldValue.arrayUnion(
              user?.member_id
            ),
          });

          await userRef.update({
            followers: firebase.firestore.FieldValue.arrayUnion(
              currentUser?.member_id
            ),
          });
        }

        dispatch({
          type: followings ? "UNFOLLOW" : "FOLLOW",
          payload: user?.member_id,
        });
        setFollowed(!followings);
      } else {
        console.log("User documents do not exist.");
      }
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
      <Box className="rightbar">
        <Card sx={{ p: 2 }}>
          <div className="rightbarAd">
            <Grid container spacing={2}>
              <Grid xs={12}>
                <Box sx={{ width: "100%" }}>
                  <span>
                    {friends.length !== 0 ? (
                      <Typography variant="h6" gutterBottom>
                        Follower
                      </Typography>
                    ) : (
                      "No follower..."
                    )}
                  </span>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <AvatarGroup max={4}>
                      {friends.map((friend) => (
                        <Avatar
                          sx={{ width: 39, height: 39 }}
                          key={friend?.member_id}
                          alt={friend?.firstName}
                          src={friend?.profilePicture}
                        />
                      ))}
                    </AvatarGroup>
                  </Box>
                </Box>
              </Grid>
              <Grid xs={12}>
                {user?.firstName === currentUser?.firstName && (
                  <Box sx={{ width: "100%" }}>
                    <span>
                      {friendsfollowings.length !== 0 ? (
                        <Typography variant="h6" gutterBottom>
                          Following
                        </Typography>
                      ) : (
                        "No following..."
                      )}
                    </span>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <AvatarGroup max={4}>
                        {friendsfollowings.map((friend) => (
                          <Avatar
                            sx={{ width: 39, height: 39 }}
                            key={friend?.member_id}
                            alt={friend?.firstName}
                            src={friend?.profilePicture}
                          />
                        ))}
                      </AvatarGroup>
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid xs={12}>
                {user?.firstName !== currentUser?.firstName && (
                  <button
                    className="rightbarFollowButton"
                    onClick={handleClick}
                    style={{ marginBottom: "10px" }}
                  >
                    {followings ? "Unfollow" : "Follow"}
                    {followings ? <Remove /> : <Add />}
                  </button>
                )}
              </Grid>
            </Grid>
          </div>
        </Card>
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
  const [friendsfollowings, setFriendsfollowings] = useState([]);
  const [Onlinefriends, setOnlineFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [privacy, setPrivacy] = useState("normal");
  const [followings, setFollowed] = useState(
    currentUser.followings.includes(user?.member_id)
  );
  const token = Cookies.get("token");
  const privacyOptions = [
    { label: "สาธารณะ", value: "normal" },
    { label: "ส่วนตัว", value: "private" },
    { label: "เฉพาะผู้ติดตาม", value: "followers" },
  ];

  //++++++++++++++++++ fetch Data +++++++++++++++++++

  // useEffect(() => {
  //   console.log("currentUser", currentUser);
  //   console.log("user", user);
  // }, [currentUser, user]);
  
  const handlePrivacyChange = (event, value) => {
    if (value) {
      setPrivacy(value.value);
    } else {
      setPrivacy("normal");
    }
  };

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
        //console.log("user", currentUser);
        const currentUserRef = firestore
          .collection("Users")
          .doc(user?.member_id);
        const currentUserDoc = await currentUserRef.get();

        const friendPromises = currentUserDoc
          .data()
          .followers.map(async (friend) => {
            //console.log("data", friend);
            const friendRef = firestore.collection("Users").doc(friend);
            const friendDoc = await friendRef.get();

            return friendDoc.data();
          });
        const friendFollowingPromises = currentUserDoc
          .data()
          .followings.map(async (friend) => {
            //console.log("data", friend);
            const friendRef = firestore.collection("Users").doc(friend);
            const friendDoc = await friendRef.get();

            return friendDoc.data();
          });

        const fetchedFriends = await Promise.all(friendPromises);
        const fetchedFollowing = await Promise.all(friendFollowingPromises);

        const currentUpdateUserRef = firestore
          .collection("Users")
          .doc(currentUser?.member_id);
        const currentUpdateUserDoc = (await currentUpdateUserRef.get()).data();

        //console.log("ww", currentUpdateUserDoc);

        setFriendsfollowings(fetchedFollowing);
        setFriends(fetchedFriends);
        setFollowed(currentUpdateUserDoc.followings.includes(user?.member_id));
        //console.log(fetchedFriends);
      } catch (err) {
        console.log(err);
      }
    };

    getFriends();
  }, [user, followings]);
  //++++++++++ on Click Button +++++++++++

  const handleClick = async () => {
    try {
      const userRef = firestore.collection("Users").doc(user?.member_id);
      const currentUserRef = firestore
        .collection("Users")
        .doc(currentUser?.member_id);

      const userDoc = await userRef.get();
      const currentUserDoc = await currentUserRef.get();

      if (userDoc.exists && currentUserDoc.exists) {
        if (followings) {
          // Unfollow the user
          await currentUserRef.update({
            followings: firebase.firestore.FieldValue.arrayRemove(
              user?.member_id
            ),
          });

          await userRef.update({
            followers: firebase.firestore.FieldValue.arrayRemove(
              currentUser?.member_id
            ),
          });
        } else {
          // Follow the user
          await currentUserRef.update({
            followings: firebase.firestore.FieldValue.arrayUnion(
              user?.member_id
            ),
          });

          await userRef.update({
            followers: firebase.firestore.FieldValue.arrayUnion(
              currentUser?.member_id
            ),
          });
        }

        dispatch({
          type: followings ? "UNFOLLOW" : "FOLLOW",
          payload: user?.member_id,
        });
        setFollowed(!followings);
      } else {
        console.log("User documents do not exist.");
      }
    } catch (err) {
      console.error(err);
    }
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
        <img
          className="rightbarAd"
          src="../../../public/assets/ad.png"
          alt=""
        />
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
      <Box className="rightbar">
        <Card sx={{ ml: 2, p: 2 }}>
          <div className="rightbarAd">
            <Grid container spacing={2}>
              <Grid
                xs={12}
                sx={{ display: { xs: "block", sm: "none", md: "none" } }}
              >
                <Typography variant="h6" gutterBottom>
                  Sort Post
                </Typography>
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
              <Grid
                xs={12}
                sx={{ display: { xs: "block", sm: "none", md: "none" } }}
              >
                <Box sx={{ width: "100%" }}>
                  <span>
                    {friends.length !== 0 ? (
                      <Typography variant="h6" gutterBottom>
                        Follower
                      </Typography>
                    ) : (
                      "No follower..."
                    )}
                  </span>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <AvatarGroup max={4}>
                      {friends.map((friend) => (
                        <Avatar
                          key={friend?.member_id}
                          alt={friend?.firstName}
                          src={friend?.profilePicture}
                        />
                      ))}
                    </AvatarGroup>
                  </Box>
                </Box>
              </Grid>
              <Grid xs={12}>
                {user?.firstName === currentUser?.firstName && (
                  <Box sx={{ width: "100%" }}>
                    <span>
                      {friendsfollowings.length !== 0 ? (
                        <Typography variant="h6" gutterBottom>
                          Following
                        </Typography>
                      ) : (
                        "No following..."
                      )}
                    </span>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <AvatarGroup max={4}>
                        {friendsfollowings.map((friend) => (
                          <Avatar
                            key={friend?.member_id}
                            alt={friend?.firstName}
                            src={friend?.profilePicture}
                          />
                        ))}
                      </AvatarGroup>
                    </Box>
                  </Box>
                )}
              </Grid>
              <Grid
                xs={12}
                sx={{ display: { xs: "block", sm: "none", md: "none" } }}
              >
                {user?.firstName !== currentUser?.firstName && (
                  <button
                    className="rightbarFollowButton"
                    onClick={handleClick}
                    style={{ marginBottom: "10px" }}
                  >
                    {followings ? "Unfollow" : "Follow"}
                    {followings ? <Remove /> : <Add />}
                  </button>
                )}
              </Grid>
            </Grid>
          </div>
        </Card>
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
