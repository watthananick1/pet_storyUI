import Topbar from "../../components/topbar/Topbar";
import { useParams } from "react-router-dom";
import React, { useContext, forwardRef, useState, useEffect } from "react";
import ReactLoading from "react-loading";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import { Rightbar } from "../../components/rightbar/Rightbar";
import Box from "@mui/material/Box";
import "./sort_feed.css";


export default function Sort_feed() {
  const { sort } = useParams();
  const [loading, setLoading] = useState(fa);

  useEffect(() => {
    console.log(sort);
  }, [sort]);
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
        {loading ? (
            <div className="loadingWrapper">
              <ReactLoading
                type="spin"
                color="#6200E8"
                height={"10%"}
                width={"10%"}
              />
            </div>
          ) : (
          
        <Feed sort={sort} />
          )}
        <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }}>
          <Rightbar />
        </Box>
      </div>
    </Box>
  );
}
