import React from "react";
import Drawerbar from "./Drawer";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  List,
  IconButton,
  Typography,
  Badge,
  responsiveFontSizes,
} from "@mui/material";
import Container from "@mui/material/Container";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Pet story
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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

export default function SettingSection() {
  return (
    <div>
      <Drawerbar />
      <Container
        sx={{
          mt: 4,
          mb: 4,
          flexGrow: 1,
          height: "100vh",
          overflow:  "auto",
          maxWidth: open ? "100%" : "lg",
        }}
      >
        {content}
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </div>
  );
}
