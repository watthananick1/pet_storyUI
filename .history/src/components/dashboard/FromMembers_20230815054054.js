import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Stack from "@mui/material/Stack";
import { ReactCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axios from "axios";
import Cookies from "js-cookie";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
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
const storage = firebase.storage();

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
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
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

export default function FromMembers({ selectedMember }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState(true);
  const token = Cookies.get("token");
  const cropperRef = useRef(null);
  const profileSize = 200;
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  useEffect(() => {
    if (selectedMember) {
      setFirstName(selectedMember.firstName);
      setLastName(selectedMember.lastName);
      setStatus(selectedMember.status === "active");
      setImagePreview(selectedMember.profilePicture);
    }
  }, [selectedMember]);

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setStatus(true);
    setImagePreview(null);
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // await handleAvatarUpload();
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "100%" },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      xs={12}
      md={8}
    >
      <Paper
        sx={{
          p: 2,
        }}
      >
        <FormGroup>
            <Typography color="primary" sx={{ p: 2 }} variant="h5">
              Update Type Pet
            </Typography>
          <Grid container spacing={3}>
          <Grid item xs={6} md={8}>
              <Typography variant="subtitle1" gutterBottom>
                {firstName}
              </Typography>
            </Grid>
            <Grid item xs={6} md={8}>
              <Typography variant="subtitle1" gutterBottom>
                {lastName}
              </Typography>
            </Grid>

            <Grid item xs={6} md={8}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "auto",
                }}
              ></Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <FormControlLabel
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                  />
                }
                label="Status Type"
              />
            </Grid>
            <Grid item xs={12} md={8}>
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
    </Box>
  );
}
