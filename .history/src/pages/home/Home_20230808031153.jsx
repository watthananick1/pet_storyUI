import Topbar from "../../components/topbar/Topbar";
import { useContext } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import { Rightbar } from "../../components/rightbar/Rightbar";
import { AuthContext } from "../../context/AuthContext";
import Box from "@mui/material/Box";
import Swal from 'sweetalert2';
import "./home.css";

export default function Home() {
  const { message } = useContext(AuthContext);
  return (
    <Box sx={{ width: "100%" }}>
      <Topbar />
      <div className="homeContainer">
        <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }}  position="sticky">
          <Sidebar />
        </Box>
        <Feed />
        <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }} > 
          <Rightbar />
        </Box>
        Swal.fire({
        title: 'สำเร็จ!',
        text: 'ทางเราได้ทำการส่ง Email สำหรับรีเซ็ตรหัสผ่านให้ท่านแล้ว กรุณาตรวจสอบ',
        icon: 'success',
        confirmButtonText: 'รับทราบ',
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/");
        }
      });
      </div>
    </Box>
  );
}
