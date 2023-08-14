import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PetsIcon from '@mui/icons-material/Pets';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import { Link, useHistory, NavLink } from "react-router-dom";

const handleDashboardClick = () => {
  handleClose();
  history.push(`/dashboard/home`);
};
export const mainListItems = (
  const history = useHistory();
  <React.Fragment>
    <ListItemButton to="/dashboard/home">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton to="/">
      <ListItemIcon>
        <RssFeedIcon />
      </ListItemIcon>
      <ListItemText primary="Feed" />
    </ListItemButton>
    <ListItemButton to="/dashboard/typepet">
      <ListItemIcon>
        <PetsIcon />
      </ListItemIcon>
      <ListItemText primary="Type Pets" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Member" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIndIcon />
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