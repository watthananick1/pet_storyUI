import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
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
const usersCollection = firestore.collection("User");

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
  const [newType, setNewType] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const unsubscribe = postsCollection.onSnapshot(async (snapshot) => {
        try {
            const updatedPosts = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const postData = doc.data();
                    return {
                        ...postData,
                    };
                })
            );

            // Use Promise.all to fetch user data for each tag asynchronously
            const userPromises = dataRows.map(async (tag) => {
                const dataUser = await getUserData(reportUserData.reported_member_id);
                const dataPost = await getUserData(reportUserData.id);
                // Process data and return the result
                const processedData = {
                    // Populate the fields based on fetched data
                    // id: tag.id,
                    // member_id: tag.member_id,
                    // profilePicture: tag.profilePicture,
                    // firstName: dataReported.firstName,
                    // lastName: dataReported.lastName,
                    // content: tag.content,
                    // createdAt: tag.createdAt,
                    // updatedAt: tag.updatedAt,
                    // likes: tag.likes,
                    // tagpet: tag.tagpet,
                    // status: tag.status,
                    // title: tag.title,
                };
                return processedData;
            });

            const data = await Promise.all(userPromises);

            setRows(data);
            setNewType(updatedPosts);
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
