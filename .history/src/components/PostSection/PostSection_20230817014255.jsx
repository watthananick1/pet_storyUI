import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import FromPosts from "../dashboardCon/FromPosts";
import firebase from "firebase/compat/app";
import "firebase/firestore";

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
const usersCollection = firestore.collection("Users");

function geteData(
  id,
  profilePicture,
  firstName,
  lastName,
  email,
  statusUser,
  status,
  expirationDate
) {
  return {
    id,
    profilePicture,
    firstName,
    lastName,
    email,
    statusUser,
    status,
    expirationDate,
  };
}

async function getUserData(id) {
  const userDocRef = usersCollection.doc(id);
  const userDocSnapshot = await userDocRef.get();

  if (userDocSnapshot.exists) {
    const userData = userDocSnapshot.data();

    //console.log(userData);

    return userData;
  } else {
    return null;
  }
}

function getePostData(
  id,
  member_id,
  profilePicture,
  firstName,
  lastName,
  content,
  createdAt,
  updatedAt,
  likes,
  tagpet,
  status,
  title
) {
  return {
    id,
    member_id,
    profilePicture,
    firstName,
    lastName,
    content,
    createdAt,
    updatedAt,
    likes,
    tagpet,
    status,
    title,
  };
}

const columns = [
  {
    field: "profilePicture",
    headerName: "Profile",
    width: 90,
    renderCell: (params) => (
      <Avatar
        alt="Remy Sharp"
        src={params.value ?? "assets/person/noAvatar.png"}
      />
    ),
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 120,
    valueGetter: (params) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
  {
    field: "content",
    headerName: "Content",
    width: 170,
    editable: false,
  },
  {
    field: "createdAt",
    headerName: "CreatedAt",
    width: 150,
    editable: false,
    renderCell: (params) => (
      <Typography variant="subtitle1">
        {format(params.value.toDate(), "dd/MM/yyyy")}
      </Typography>
    ),
  },
  {
    field: "updatedAt",
    headerName: "UpdatedAt",
    width: 150,
    editable: false,
    renderCell: (params) => (
      <Typography variant="subtitle1">
        {format(params.value.toDate(), "dd/MM/yyyy")}
      </Typography>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    editable: false,
    renderCell: (params) => {
      switch (params.value) {
        case "followers":
          return <Chip label="Followers" size="small" />;
        case "private":
          return <Chip label="Private" color="warning" size="small" />;
        case "normal":
          return <Chip label="Normal" color="success" size="small" />;
        default:
          return null;
      }
    },
  },
];

function preventDefault(event) {
  event.preventDefault();
}

export default function PostSection() {
  const token = Cookies.get("token");
  const [rows, setRows] = useState([]);
  const [newPort, setNewPort] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const unsubscribe = postsCollection.onSnapshot(async (snapshot) => {
      try {
        const updatedPosts = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const postData = doc.data();

            const dataUser = await getUserData(postData.member_id);
            return getePostData(
              postData.id,
              postData.member_id,
              dataUser.profilePicture,
              dataUser.firstName,
              dataUser.lastName,
              postData.content,
              postData.createdAt,
              postData.updatedAt,
              postData.likes,
              postData.tagpet,
              postData.status,
              postData.title
            );
          })
        );

        //console.log("updatedPosts", updatedPosts);

        setRows(updatedPosts);
        setNewPort(updatedPosts);
      } catch (error) {
        console.error("Error:", error.message);
      }
    });

    return () => {
      // Unsubscribe the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <React.Fragment>
      <FromPosts selectedMember={selectedMember} />
      <Box sx={{ maxHeight: "700", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={(params) => {
            setSelectedMember(params.row);
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 8,
              },
            },
          }}
          pageSizeOptions={[8]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </React.Fragment>
  );
}
