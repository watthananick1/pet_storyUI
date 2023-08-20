import Topbar from "../../components/topbar/Topbar";
import React, { useContext, forwardRef, useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import SettingSection from "../../components/settingSection/SettingSection";
import { Rightbar } from "../../components/rightbar/Rightbar";
import Box from "@mui/material/Box";
import "./setting.css";


export default function Setting_page() {
  return (
    <Box sx={{ width: "100%" }}>
      <Topbar />
      elevation={3}
      <div className="homeContainer">
      </div>
    </Box>
  );
}
