import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Box from "@mui/material/Box";
import "./home.css";

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Box>
          <Sidebar sx={{ display: { xs: "none", sm: "block" } }} />
        </Box>
        <Feed />
        <Box>
          <Rightbar sx={{ display: { xs: "none", sm: "block" } }} />
        </Box>
      </div>
    </>
  );
}
