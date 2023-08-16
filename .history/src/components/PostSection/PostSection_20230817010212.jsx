import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import FromMembers from "../dashboard/FromMembers";
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
const postsCollection = firestore.collection("Post");

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
    field: "email",
    headerName: "Email",
    width: 150,
    editable: false,
  },
  {
    field: "statusUser",
    headerName: "User rights",
    width: 100,
    editable: false,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    editable: false,
    renderCell: (params) => {
      switch (params.value) {
        case "normal":
          return <Chip label="Normal" size="small" />;
        case "private":
          return <Chip label="Private" color="warning" size="small" />;
        case "completed":
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
  const [newType, setNewType] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = postsCollection.onSnapshot(async (snapshot) => {
        const updatedPosts = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const postData = doc.data();

            return {
              ...postData,
            };
          })
        );

        let data = [];
        let dataRows = updatedPosts;
        dataRows.map((tag) => {
          data.push(
            // getePostData(
            //   id,
            //   member_id,
            //   profilePicture,
            //   firstName,
            //   lastName,
            //   content,
            //   createdAt,
            //   updatedAt,
            //   likes,
            //   tagpet,
            //   status,
            //   title
            // )
          );
        });

        setRows(data);

        setNewType(updatedPosts);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }, []);

  return (
    <React.Fragment>
      <FromMembers selectedMember={selectedMember} />
      <Box sx={{ maxHeight: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={(params) => {
            setSelectedMember(params.row);
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </React.Fragment>
  );
}
