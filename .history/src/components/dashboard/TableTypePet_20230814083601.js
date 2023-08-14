import React, { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from '@mui/material/Chip';
import axios from "axios";
import Title from "./Title";
import Cookies from "js-cookie";

const path = process.env.REACT_APP_PATH_ID;

// Generate Order Data
function createData(file, nameType, status) {
  return { file, nameType, status };
}

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
        const res = await axios.get(
          `${path}/api/typePets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: source.token,
          }
        );

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
      <Title>Table TypePet</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
              <img
                    src={
                        row.imgPet
                        ? row.imgPete
                        : "/assets/person/noCover.png"
                    }
                    alt=""
                  />
              {row.imgPet}
              </TableCell>
              <TableCell>{row.nameType}</TableCell>
              <TableCell>{row.status ? <Chip label="success" color="success" variant="outlined" /> : <Chip label="success" color="success" variant="outlined" />}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
