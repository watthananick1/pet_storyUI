import Topbar from "../../components/topbar/Topbar";
import { useParams } from "react-router-dom";
import React, { useContext, forwardRef, useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Sortpost_feed from "../../components/sortpost_feed/sortpost_feed";
import { Rightbar } from "../../components/rightbar/Rightbar";
import Box from "@mui/material/Box";
import "./sort_feed.css";

export default function Sort_feed() {
  const { sort } = useParams();
  const [isvideo, setVideo] = useState(false);

  useEffect(() => {
    console.log(sort);
    if (sort === "video") {
      setVideo(true);
    } e
  }, [sort]);
  
  useEffect(() => {
    console.log(isvideo);
  }, [isvideo]);
  return (
    <Box sx={{ width: "100%" }}>
      <Topbar />
      <div className="sort_feedContainer">
        <Box
          sx={{ display: { xs: "none", sm: "block", md: "block" } }}
          position="sticky"
        >
          <Sidebar />
        </Box>
        {isvideo ? <Sortpost_feed /> : null }
        {isvideo ? null : <Feed sort={sort} />}

        <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }}>
          <Rightbar />
        </Box>
      </div>
    </Box>
  );
}
