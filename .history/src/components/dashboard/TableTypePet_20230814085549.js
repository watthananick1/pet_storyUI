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
    {
      field: 'nameType',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
  ];

function preventDefault(event) {
  event.preventDefault();
}

export default function TableTypePet() {
  const token = Cookies.get("token");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    //console.log("Feed", sort);

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
      }
    };

    fetchData();
  }, [rows]);

  return (
    <React.Fragment>
      <Box sx={{ height: 400, width: "100%" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={row.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <img style={{ width: "100px" }} src={row.imgPet} alt="" />
                </TableCell>
                <TableCell>
                  <Typography color="primary" variant="h5" gutterBottom>
                    {row.nameType}
                  </Typography>
                </TableCell>
                <TableCell>
                  {row.status ? (
                    <Chip label="active" color="success" variant="outlined" />
                  ) : (
                    <Chip label="inactive" color="error" variant="outlined" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
          See more orders
        </Link>
      </Box>
    </React.Fragment>
  );
}
