import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Campaign as CampaignIcon,
  BookOnline as BookOnlineIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Close as CloseIcon
} from '@mui/icons-material';

function Layout({ children }) {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Hoardings', icon: <CampaignIcon />, path: '/hoardings' },
    { text: 'Bookings', icon: <BookOnlineIcon />, path: '/bookings' },
  ];

  if (isAdmin) {
    menuItems.push({ text: 'Admin', icon: <AdminIcon />, path: '/admin' });
  }

  const drawer = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          BMS
        </Typography>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => setDrawerOpen(false)}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            mx: 1,
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText',
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{ 
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          width: '100%'
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            px: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            maxWidth: '100% !important'
          }}
        >
          <Toolbar 
            disableGutters 
            sx={{ 
              minHeight: { xs: 64, md: 70 },
              width: '100%'
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ 
                mr: 2,
                display: { xs: 'flex', md: 'none' }
              }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'flex' },
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              BMS
            </Typography>

            <Box sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' },
              gap: 1
            }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{ 
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Account settings">
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ 
                    p: 0.5,
                    border: '2px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <Avatar 
                    alt={user?.name} 
                    src="/static/images/avatar/2.jpg"
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 2,
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                    }
                  }
                }}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography variant="subtitle2">{user?.name}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            boxShadow: 2
          }
        }}
      >
        {drawer}
      </Drawer>

      <Container 
        component="main" 
        maxWidth="xl" 
        sx={{ 
          mt: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3, md: 4 },
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Booking Management System
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout; 