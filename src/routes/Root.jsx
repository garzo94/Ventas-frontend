import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Menu,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { AuthContext } from "../context/authContextProvider";

export default function Root() {
  const { setIsAuthenticated } = React.useContext(AuthContext);
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function logout() {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <StorefrontIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema de ventas
            </Typography>
            {auth && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography>Usuario</Typography>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  sx={{ marginTop: 5 }}
                >
                  <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {/* <SideBar /> */}
        <SideBar />
        <Outlet />
      </Box>
    </>
  );
}
