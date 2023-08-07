import Topbar from "../../components/topbar/Topbar";
import { useContext, forwardRef, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import { Rightbar } from "../../components/rightbar/Rightbar";
import { AuthContext } from "../../context/AuthContext";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import "./home.css";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home() {
  const { message: isMessage } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({ severity: "success", text: isMessage });
  
  useEffect(() => {
    setMessage(isOpen);
  }, [isOpen]);
  
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={message.severity}
              sx={{ width: "100%" }}
            >
              {message.text}
            </Alert>
          </Snackbar>
      <Topbar />
      <div className="homeContainer">
        <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }}  position="sticky">
          <Sidebar />
        </Box>
        <Feed />
        <Box sx={{ display: { xs: "none", sm: "block", md: "block" } }} > 
          <Rightbar />
        </Box>
      </div>
    </Box>
  );
}
