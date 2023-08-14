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

const path = process.env.REACT_APP_PATH_ID;

// Generate Order Data
function createData(file, nameType, status) {
  return { file, nameType, status };
}

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'imgPet', headerName: 'IMAGE', width: 90 },
    {
      field: 'nameType',
      headerName: 'Name Type',
      width: 150,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: true,
    }
  ];

function preventDefault(event) {
  event.preventDefault();
}

export default function TableTypePet() {
  const token = Cookies.get("token");
  const [rows, setRows] = useState([]);
  
  useEffect(() => {
  
  }, []);

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
  
        setRows(res.data);
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
  

  return (
    <React.Fragment>
      <Box sx={{ height: 400, width: "100%" }}>
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
