import Topbar from "../../components/topbarMain/topbarMain";
import React, { useContext, forwardRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/sidebarMain/sidebarMain";
import Feed from "../../components/feedMain/feedMain";
import { Rightbar } from "../../components/rightbarMain/rightbarMain";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material";
import "./homePost.css";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6309DE",
    },
    secondary: {
      main: "#6309DE",
    },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

theme = responsiveFontSizes(theme);

export default function homePost() {
  const { post } = useParams()
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        <Topbar />
        <div className="homeContainer">
          <Box
            sx={{ display: { xs: "none", sm: "block", md: "block" } }}
            position="sticky"
          >
            <Sidebar />
          </Box>
          <Feed />
          <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }}>
            <Rightbar />
          </Box>
          <IconButton
            onClick={handleScrollToTop}
            sx={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#ddd",
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </div>
      </Box>
    </ThemeProvider>
  );
}
