import React, { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import Typography from "@mui/material/Typography";
import { format } from "date-fns";
import FromPosts from "./FromPosts"
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FromPostReports from "./FromPostReports";
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
const postsCollection = firestore.collection("Posts");
const reportPostsCollection = firestore.collection("Report_Post");

function geteReportPostData(
  id,
  report_profilePicture,
  report_firstName,
  report_lastName,
  post_content,
  post_title,
  post_status,
  comment,
  createdAt,
  updatedAt,
  status
) {
  return {
    id,
    report_profilePicture,
    report_firstName,
    report_lastName,
    post_content,
    post_title,
    post_status,
    comment,
    createdAt,
    updatedAt,
    status,
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

async function getPostData(id) {
  const postDocRef = postsCollection.doc(id);
  const postDocSnapshot = await postDocRef.get();

  if (postDocSnapshot.exists) {
    const postData = postDocSnapshot.data();

    //console.log(userData);

    return postData;
  } else {
    return null;
  }
}

const columns = [
  {
    field: "report_profilePicture",
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
    field: "reportfullName",
    headerName: "Report name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 120,
    valueGetter: (params) =>
      `${params.row.report_firstName || ""} ${
        params.row.report_lastName || ""
      }`,
  },
  {
    field: "post_content",
    headerName: "Post content",
    width: 170,
    editable: false,
  },
  {
    field: "comment",
    headerName: "Comment",
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
        case "in progress":
          return <Chip label="In Progress" size="small" />;
        case "is checking":
          return <Chip label="Is Checking" color="warning" size="small" />;
        case "completed":
          return <Chip label="Completed" color="success" size="small" />;
        case "cancel":
          return <Chip label="Cancel" color="error" size="small" />;
        default:
          return null;
      }
    },
  },
];

function preventDefault(event) {
  event.preventDefault();
}

export default function DataGridSection({ sort }) {
  const token = Cookies.get("token");
  const [rows, setRows] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [newReportUser, setNewReportUser] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSort, setSort] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    //console.log(sort);
    setSort(sort);
  }, [sort]);

  useEffect(() => {
    try {
      setOpen(true);
      const fetchReportUser = reportPostsCollection.onSnapshot(
        async (snapshot) => {
          const updatedReportPosts = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const reportPostData = doc.data();

              const dataPosts = await getPostData(reportPostData.post_id);
              const dataUsers = await getUserData(dataPosts.member_id);
              
              // console.log('dataUsers', dataUsers);
              // console.log('dataPosts', dataPosts);

              return geteReportPostData(
                reportPostData.report_id,
                dataUsers.profilePicture,
                dataUsers.firstName,
                dataUsers.lastName,
                dataPosts.content,
                dataPosts.title,
                dataPosts.status,
                reportPostData.comment,
                reportPostData.createdAt,
                reportPostData.updatedAt,
                reportPostData.status
              );
            })
          );
          
          //console.log(updatedReportPosts);

          let filteredReportUsers = updatedReportPosts;

          if (isSort === "in progress") {
            filteredReportUsers = updatedReportPosts.filter(
              (user) => user.status === "in progress"
            );
            setRows(filteredReportUsers);
            setNewReportUser(filteredReportUsers);
          } else if (isSort === "is checking") {
            filteredReportUsers = updatedReportPosts.filter(
              (user) => user.status === "is checking"
            );
            setRows(filteredReportUsers);
            setNewReportUser(filteredReportUsers);
          } else if (isSort === "completed") {
            filteredReportUsers = updatedReportPosts.filter(
              (user) => user.status === "completed"
            );
            setRows(filteredReportUsers);
            setNewReportUser(filteredReportUsers);
          } else if (isSort === "cancel") {
            filteredReportUsers = updatedReportPosts.filter(
              (user) => user.status === "cancel"
            );
            setRows(filteredReportUsers);
            setNewReportUser(filteredReportUsers);
          } else if (isSort === "all") {
            setRows(filteredReportUsers);
            setNewReportUser(filteredReportUsers);
          } else {
            setRows([]);
            setNewReportUser([]);
          }
        }
      );

      return fetchReportUser;
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setOpen(false);
    }
  }, [isSort]);

  return (
    <React.Fragment>
      {open ? (
        <React.Fragment>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <FromPostReports selectedMember={selectedMember} />
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
      )}
    </React.Fragment>
  );
}
