import React, { } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

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
        setIsUser(currentUser.firstName === user?.firstName);
        // console.log("firstName1", currentUser.firstName);
        // console.log("UfirstName", user.firstName);
      }, [firstName, currentUser, user]);
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