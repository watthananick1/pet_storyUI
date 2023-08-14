import React, { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

// Generate Order Data
function createData(file, nameType, status) {
  return { file, nameType, status };
}

function preventDefault(event) {
  event.preventDefault();
}

export default function TableTypePet() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    //console.log("Feed", sort);
    
    const fetchData = async () => {
      const source = axios.CancelToken.source();
      
      try {
        const res = await axios.get(
          `${path}/api/posts/${user.member_id}/date`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: source.token,
          }
        );
  
        let filteredPosts = [];
  
        
  
        setPosts(filteredPosts);
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
  }, []);

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
              <TableCell>{row.imgPet}</TableCell>
              <TableCell>{row.nameType}</TableCell>
              <TableCell>{row.status}</TableCell>
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
