import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
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
const usersCollection = firestore.collection("Users");
const reportUsersCollection = firestore.collection("Report_User");

function geteUserData(
  id,
  profilePicture,
  firstName,
  lastName,
  email,
  statusUser,
  status
) {
  return { id, profilePicture, firstName, lastName, email, statusUser, status };
}

function geteReportUserData(
  id,
  reported_member_id,
  reporter_id,
  comment,
  createdAt,
  updatedAt,
  status
) {
  return {
    id,
    reported_member_id,
    reporter_id,
    comment,
    createdAt,
    updatedAt,
    status,
  };
}

async function getUserData(id) {
  const snapshot = await usersCollection.get();

  const updatedTypePets = await Promise.all(
    snapshot.docs.map(async (doc) => {
      // const userData = doc.data();
      // You can fetch additional data here based on the user's member_id
      // For example:
      const additionalData = await fetchAdditionalData(id);

      // Return the combined data
      return {
        // ...userData,
        ...additionalData,
      };
    })
  );

  // Process the updatedTypePets array or set it to state, etc.
  console.log(updatedTypePets);
  return updatedTypePets; // Return the processed data
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
    renderCell: (params) => (
      <Chip
        label={params.value === "active" ? "Active" : "Inactive"}
        color={params.value === "active" ? "success" : "error"}
      />
    ),
  },
];

function preventDefault(event) {
  event.preventDefault();
}

export default function DataGridSection() {
  const token = Cookies.get("token");
  const [rows, setRows] = useState([]);
  const [newType, setNewType] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    try {
      const fetchReportUser = reportUsersCollection.onSnapshot(
        async (snapshot) => {
          const updatedTypePets = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const reportUserData = doc.data();

              return {
                ...reportUserData,
              };
            })
          );

          let data = [];
          let dataRows = updatedTypePets;
          // dataRows.map((tag) => {
          //   data.push(
          //     geteReportUserData(
          //       tag.member_id,
          //       tag.profilePicture,
          //       tag.firstName,
          //       tag.lastName,
          //       tag.email,
          //       tag.statusUser,
          //       tag.status
          //     )
          //   );
          // });

          // setRows(data);

          // setNewType(updatedTypePets);
        }
      );
      return fetchReportUser;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }, []);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}
