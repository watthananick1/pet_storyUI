import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import ContentPasteOffIcon from '@mui/icons-material/ContentPasteOff';
import ReportOffIcon from '@mui/icons-material/ReportOff';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PetsIcon from '@mui/icons-material/Pets';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import { Link, NavLink } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={NavLink} to="/dashboardContent/home">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/">
      <ListItemIcon>
        <RssFeedIcon />
      </ListItemIcon>
      <ListItemText primary="Feed" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/dashboardContent/typepet">
      <ListItemIcon>
        <PetsIcon />
      </ListItemIcon>
      <ListItemText primary="Type Pets" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/dashboardContent/member">
      <ListItemIcon>
        <ReportOffIcon />
      </ListItemIcon>
      <ListItemText primary="Member" />
    </ListItemButton>
    <ListItemButton component={NavLink} to="/dashboardContent/member_report">
      <ListItemIcon>
        <ContentPasteOffIcon />
      </ListItemIcon>
      <ListItemText primary="Member Reports" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Member reports" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);