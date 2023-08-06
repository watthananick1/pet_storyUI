import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Box from "@mui/material/Box";
import "./home.css";

export default function Home() {
  return (
    <Box sx={ with: 100}>
      <Topbar />
      <div className="homeContainer">
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Sidebar />
        </Box>
        <Feed />
        <Box sx={{ display: { xs: "none", sm: "block" } }} > 
          <Rightbar />
        </Box>
      </div>
    </Box>
  );
}
