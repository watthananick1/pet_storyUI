import Topbar from "../../components/topbar/Topbar";
import React, { useContext, forwardRef, useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import SettingSection from "../../components/settingSection/SettingSection";
import { Rightbar } from "../../components/rightbar/Rightbar";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import "./setting.css";


export default function Setting_page() {
  const { tab } = useParams();
  return (
    <Box sx={{ width: "100%" }}>
      <Topbar />
      <SettingSection />
    </Box>
  );
}
