import "./adminModel.css";
import React, { useContext, useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import { useHistory } from "react-router-dom";
import TypePetSection from "../../components/typePetSection/TypePet";

import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { AuthContext } from "../../context/AuthContext";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();

export default function AdminModel() {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const { section } = useParams();
  const token = Cookies.get("token");
  const dataUser = JSON.parse(localStorage.getItem("user"));

  let content;

  switch (section) {
    case "typepet":
      content = <TypePetSection />;
      break;
    // คุณสามารถเพิ่ม case อื่น ๆ ตามที่คุณต้องการได้
    default:
      content = null;
      break;
  }

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopBar />
      <Drawerbar />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container
          sx={{
            mt: 4,
            mb: 4,
            flexGrow: 1,
            height: "100vh",
            overflow: open ? "hidden" : "auto",
            maxWidth: open ? "100%" : "lg",
          }}
        >
          <TableTypePet />
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  </ThemeProvider>
);
}
