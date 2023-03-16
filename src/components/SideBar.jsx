import React from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import AbcIcon from "@mui/icons-material/Abc";
import CategoryIcon from "@mui/icons-material/Category";
import SellIcon from "@mui/icons-material/Sell";
import EqualizerIcon from "@mui/icons-material/Equalizer";

const drawerWidth = 240;

export default function SideBar() {
  const navigate = useNavigate();
  return (
    <Drawer
      sx={{
        width: drawerWidth,

        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
        ".css-12i7wg6-MuiPaper-root-MuiDrawer-paper": {
          position: "absolute",
          top: 64,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <List>
        {/* Clientes */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/clientes")}>
            <ListItemIcon>
              <AbcIcon />
            </ListItemIcon>
            <ListItemText primary={"Clientes"} />
          </ListItemButton>
        </ListItem>
        {/* Products */}

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/productos")}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary={"Productos"} />
          </ListItemButton>
        </ListItem>
        {/* Ventas */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/ventas")}>
            <ListItemIcon>
              <SellIcon />
            </ListItemIcon>
            <ListItemText primary={"Ventas"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {["Dashboard"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <EqualizerIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
