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
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Cookies from "js-cookie";
import Post from "../../components/postMain/PostMain";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
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
const postsCollection = firestore.collection("Posts");

const path = process.env.REACT_APP_PATH_ID;

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

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

export default function FromPosts({ selectedMember }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(options[0].label);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState([]);
  const [status, setStatus] = useState(true);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [isImage, setImage] = useState([]);
  const [expirationDate, setExpirationDate] = useState(null);
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

  const handleBlock = () => {
    setOpenBlockDialog(true);
  };

  const handleUpdateReportUser = async () => {
    try {
      setLoading(true);
      //console.log(new Date().setHours(new Date().getHours() + 72));
      await usersCollection.doc(selectedMember.reported_id).update({
        status: status,
        expirationDate: new Date().setHours(new Date().getHours() + 72),
        blockReason: blockReason,
        updatedAt: new Date(),
      });
      console.log("Update successful.");
    } catch (error) {
      console.error("Error updating status:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(async () => {
    if (selectedMember) {
      console.log("object", selectedMember);

      // Fetch user data based on the reported_id
      const userDoc = await usersCollection.doc(selectedMember.report_id).get();
      const userData = userDoc.data();
      console.log("objectUser", userData);

      // Fetch post data based on the post_id
      const postDoc = await postsCollection.doc(selectedMember.post_id).get();
      const postData = postDoc.data();
      console.log("objectPost", postData);
      console.log("objectImg", postData.img);
      setImage(postData.img);

      // The following sections are commented out, likely for further development:
      // - Setting state variables with user and status data
      // - Setting image preview and expiration date

      // ... (your commented-out code for setting state variables)

      // ... (your commented-out code for setting status value based on userData.statusUser)

      // ... (your commented-out code for setting image preview and expiration date)
    }
  }, [selectedMember]);

  useEffect(() => {
    if (selectedMember && selectedMember.status === "blog") {
      const now = new Date();
      const expirationDate = selectedMember.expirationDate.toDate();

      console.log(expirationDate);

      if (now > expirationDate) {
        setSelectedStatus("active");
        handleUpdateReportUser();
        // Automatically block after 72 hours
        const timeout = setTimeout(() => {
          setSelectedStatus("blog");
          handleBlock();
        }, 72 * 60 * 60 * 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, []);

  useEffect(async () => {
    try {
    } catch (error) {}
  }, []);

  const handleConfirmBlock = () => {
    if (blockReason.trim() === "") {
      alert("กรุณากรอกข้อความในช่องรายละเอียด");
      return;
    }
    handleUpdateReportUser();

    setOpenBlockDialog(false);
  };

  const handleCloseBlockDialog = () => {
    setOpenBlockDialog(false);
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setStatus(true);
    setImagePreview(null);
    window.location.reload();
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      await usersCollection.doc(selectedMember.id).update({
        status: status,
        statusUser: value.value,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating status:", error.message);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateUser();
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
        <Paper elevation={0} sx={{ p: 2 }}>
          <Dialog open={openBlockDialog} onClose={handleCloseBlockDialog}>
            <DialogTitle>บล็อกผู้ใช้</DialogTitle>
            <DialogContent>
              <DialogContentText>
                กรุณาใส่รายละเอียดของการบล็อก
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="text"
                label="รายละเอียด"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setBlockReason(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseBlockDialog}>ยกเลิก</Button>
              <Button onClick={handleConfirmBlock}>ยืนยัน</Button>
            </DialogActions>
          </Dialog>
          <FormGroup>
            <Typography color="primary" sx={{ p: 2 }} variant="h5">
              Member
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
            
            <Grid item xs={12} md={12}>
              <Box sx={{ width: "100%", height: 200, overflowY: "scroll" }}>
                <ImageList
                  sx={{ width: 500, height: 450 }}
                  rowHeight={164}
                  variant="masonry"
                  cols={3}
                  gap={6}
                >
                  {isImage.map((item) => (
                    <ImageListItem key={item.img} sx={{ width: "100%" }}>
                      <img
                        src={item}
                        srcSet={item}
                        alt={post.title}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            </Grid>

            {/* <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  {firstName}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  {lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1" gutterBottom>
                  {email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Controllable" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={status === "active"}
                      onChange={(e) => {
                        setStatus(e.target.checked ? "active" : "blog");
                        if (!e.target.checked) {
                          handleBlock();
                        }
                      }}
                    />
                  }
                  label={status}
                />
              </Grid>
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
            </Grid> */}
          </FormGroup>
        </Paper>
      ) : null}
    </Box>
  );
}
