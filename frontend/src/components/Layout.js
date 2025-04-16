import React, { useState } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    }),
  }),
);

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Medical Records', icon: <MedicalInformationIcon />, path: '/medical-records' },
    { text: 'Reports', icon: <DescriptionIcon />, path: '/reports' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Health Record
          </Typography>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Welcome, {user.username}
              </Typography>
              
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          {user && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, mb: 1, bgcolor: 'primary.main' }}
                alt={user.username}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              
              <Typography variant="h6">{user.username}</Typography>
              
              {user.firstName && user.lastName && (
                <Typography variant="body2" color="text.secondary">
                  {user.firstName} {user.lastName}
                </Typography>
              )}
            </Box>
          )}
          
          <Divider />
          
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={RouterLink}
                to={item.path}
                sx={{
                  '&.active': {
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          
          <Divider />
          
          <List>
            <ListItem button onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      <Main open={drawerOpen}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Outlet />
        </Container>
      </Main>
    </Box>
  );
};

export default Layout;
