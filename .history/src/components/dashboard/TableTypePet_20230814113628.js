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

const path = process.env.REACT_APP_PATH_ID;

function geteData(id, imgPet, nameType, status) {
  return { id, imgPet, nameType, status };
}

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
  const [setNewType, setNewType] = useState([]);

  //   useEffect(() => {
  //     console.log(rows);
  //   }, [rows]);

  useEffect(() => {
    const fetchData = async () => {
      const source = axios.CancelToken.source();

      try {
        const res = await axios.get(`${path}/api/typePets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cancelToken: source.token,
        });

        let data = [];
        let dataRows = res.data;
        dataRows.map((tag) => {
          data.push(
            geteData(tag.id_TypePet, tag.imgPet, tag.nameType, tag.status)
          );
        });

        setRows(data);
      } catch (err) {
        if (axios.isCancel(err)) {
          // Handle request cancellation (optional)
        } else {
          console.log(err);
        }
      } finally {
        // Make sure to clean up the cancel token if needed
        // For example: source.cancel();
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    try {
      const unsubscribe = postsCollection
        .orderBy("createdAt", "desc")
        .onSnapshot(async (snapshot) => {
          const currentTime = new Date().getTime();
          const updatedPosts = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const postData = doc.data();
              const userDoc = await UsersCollection.doc(
                postData.member_id
              ).get();

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

          const filteredPosts = updatedPosts
            .filter((post) => post !== null)
            .filter((post) => {
              if (post && post.createdAt && post.createdAt.seconds) {
                const postTime = new Date(
                  post.createdAt.seconds * 1000
                ).getTime();
                return postTime > currentTime - 60000;
              }
              return false;
            });
          setNewType(filteredPosts);
          setLoading(false); // ปิดสถานะ loading
        });
      return unsubscribe;
    } catch (error) {}
  }, []);


  return (
    <React.Fragment>
      <FromTypePet />
      <Box sx={{ maxHeight: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
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
