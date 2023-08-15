import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Avatar from '@mui/material/Avatar';
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import FromTypePet from "../dashboard/FromTypePets";
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
const usersCollection = firestore.collection("Users");

function geteData(id, profilePicture, firstName, lastName, email, statusUser, status) {
  return { id, profilePicture, firstName, lastName, email, statusUser, status };
}

const updateTypePetStatus = async (id, newStatus) => {
    try {
      await usersCollection.doc(id).update({
        status: newStatus,
        updatedAt: new Date()
      });
      //console.log("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

const columns = [
  {
    field: "profilePicture",
    headerName: "Profile",
    width: 90,
    renderCell: (params) => (
      <Avatar alt="Remy Sharp" src={params.value ?? "assets/person/noAvatar.png"} />
    ),
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 120,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    editable: true,
  },
  {
    field: "statusUser",
    headerName: "User rights",
    width: 100,
    editable: true,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    editable: false,
    renderCell: (params) => (
        <Chip
          label={params.value === 'active' ? "Active" : "Inactive"}
          color={params.value === 'active' ? "success" : "error"}
          onClick={() => {
            const newStatus = params.value === "active" ? "blog" : "active";
            updateTypePetStatus(params.row.id, newStatus);
          }}
        />
      ),
  },
];

function preventDefault(event) {
  event.preventDefault();
}

export default function MemberSection () {
  const token = Cookies.get("token");
  const [rows, setRows] = useState([]);
  const [newType, setNewType] = useState([]);
  const [selectedTypePet, setSelectedTypePet] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = usersCollection.onSnapshot(async (snapshot) => {
        const updatedTypePets = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const userData = doc.data();

            return {
              ...userData,
            };
          })
        );

        let data = [];
        let dataRows = updatedTypePets;
        dataRows.map((tag) => {
          data.push(
            geteData(tag.member_id, tag.profilePicture, tag.firstName, tag.lastName, tag.email, tag.statusUser, tag.status)
          );
        });

        setRows(data);

        setNewType(updatedTypePets);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error:", error.message);
    }
  }, []);

  return (
    <React.Fragment>
      {/* <FromTypePet selectedTypePet={selectedTypePet} /> */}
      <Box sx={{ maxHeight: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          onRowClick={(params) => {
            setSelectedTypePet(params.row);
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </React.Fragment>
  );
}
