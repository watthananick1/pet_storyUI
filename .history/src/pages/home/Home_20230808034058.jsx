import Topbar from "../../components/topbar/Topbar";
import { useContext, forwardRef, useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import { Rightbar } from "../../components/rightbar/Rightbar";
import { AuthContext } from "../../context/AuthContext";
import Box from "@mui/material/Box";
import "./home.css";


export default function Home() {
  return (
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
      </div>
    </Box>
  );
}
