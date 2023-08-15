import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import "react-image-crop/dist/ReactCrop.css";
import axios from "axios";
import Cookies from "js-cookie";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
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

const path = process.env.REACT_APP_PATH_ID;

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#FE0000",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

function EditData(
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

const options = [
  { label: "Admin", value: "ADMIN" },
  { label: "Admin-con", value: "ADMINCON" },
  { label: "User", value: "USER" },
];

export default function FromMemberReports({ selectedMember }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(options[0].label);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("in progress");

  // useEffect(() => {
  //   console.log(value.value);
  // }, [value]);

  useEffect(() => {
    if (selectedMember) {
      console.log(selectedMember);
      setFirstName(selectedMember.reported_firstName);
      setLastName(selectedMember.reported_lastName);
      setStatus(selectedMember.status);
      setComment(selectedMember.comment)
    }
  }, [selectedMember]);

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setStatus("");
    window.location.reload();
  };

  const handleUpdateReportUser = async () => {
    try {
      setLoading(true);
      // await usersCollection.doc(selectedMember.id).update({
      //   status: status,
      //   updatedAt: new Date(),
      // });
      console.log("run...")
    } catch (error) {
      console.error("Error updating status:", error.message);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateReportUser();
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "100%" },
      }}
      noValidate
      autoComplete="on"
      onSubmit={handleSubmit}
      xs={12}
      md={8}
    >
      {selectedMember ? (
        <Paper
          sx={{
            p: 2,
          }}
        >
          <FormGroup>
            <Typography color="primary" sx={{ p: 2 }} variant="h5">
              Update Member Report
            </Typography>
            {/* <Grid item xs={12} md={12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  sx={{ m: 2, width: 100, height: 100 }}
                  alt="Remy Sharp"
                  src={imagePreview ?? "assets/person/noAvatar.png"}
                />
              </div>
            </Grid> */}
            <Grid container spacing={3}>
              <Grid item xs={6} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                ชื่อซ {firstName}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                นามสกุล {lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Comment {comment}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <RadioGroup
                    row
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="in progress"
                      control={<Radio />}
                      label="in Progress"
                    />
                    <FormControlLabel
                      value="is checking"
                      control={<Radio />}
                      label="is Checking"
                    />
                    <FormControlLabel
                      value="completed"
                      control={<Radio />}
                      label="Completed"
                    />
                    <FormControlLabel
                      value="cancel"
                      control={<Radio />}
                      label="Cancel"
                    />
                  </RadioGroup>
                </Paper>
              </Grid>
              {/* <Grid item xs={12} md={12}>
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={status === "active"}
                      onChange={(e) =>
                        setStatus(e.target.checked ? "active" : "blog")
                      }
                    />
                  }
                  label={status}
                />
              </Grid> */}
              <Grid item xs={12} md={12}>
                <LoadingButton
                  loading={loading}
                  fullWidth
                  startIcon={<SaveIcon />}
                  // onClick={handleAvatarUpload}
                  variant="outlined"
                  type="submit"
                  sx={{
                    color: "#0063cc",
                    "&:hover": {
                      color: "#0051a8",
                    },
                  }}
                >
                  Update
                </LoadingButton>
              </Grid>
            </Grid>
          </FormGroup>
        </Paper>
      ) : null}
    </Box>
  );
}
