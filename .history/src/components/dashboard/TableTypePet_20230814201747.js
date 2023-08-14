import React, { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Title from "./Title";
import Cookies from "js-cookie";
import FromTypePet from "./FromTypePets";
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

const path = process.env.REACT_APP_PATH_ID;
const typePetsCollection = firestore.collection("TypePets");

function geteData(id, imgPet, nameType, status) {
  return { id, imgPet, nameType, status };
}

const updateTypePetStatus = async (id, newStatus) => {
    try {
      await typePetsCollection.doc(id).update({
        status: newStatus,
      });
      //console.log("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

const columns = [
  {
    field: "imgPet",
    headerName: "IMAGE",
    width: 100,
    renderCell: (params) => (
      <img
        src={params.value}
        alt=""
        style={{ width: "100%", height: "auto" }}
      />
    ),
  },
  {
    field: "nameType",
    headerName: "Name Type",
    width: 90,
    editable: true,
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    editable: false,
    renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          onClick={() => {
            const newStatus = !params.value; // สลับสถานะ
            updateTypePetStatus(params.row.id, newStatus);
          }}
        />
      ),
  },
];

function preventDefault(event) {
  event.preventDefault();
}

export default function TableTypePet() {
  const token = Cookies.get("token");
  const [rows, setRows] = useState([]);
  const [newType, setNewType] = useState([]);

  useEffect(() => {
    try {
      const unsubscribe = typePetsCollection.onSnapshot(async (snapshot) => {
        const updatedTypePets = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const typePetData = doc.data();

            return {
              ...typePetData,
            };
          })
        );

        let data = [];
        let dataRows = updatedTypePets;
        dataRows.map((tag) => {
          data.push(
            geteData(tag.id_TypePet, tag.imgPet, tag.nameType, tag.status)
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
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </React.Fragment>
  );
}
