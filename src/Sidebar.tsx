import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useState, useEffect } from "react";

const drawerWidth = 240;

interface SidebarProps {
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the outside click event
    setOpen(true);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && !(event.target as HTMLElement).closest(".sidebar")) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        className="sidebar"
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 60,
            transition: "width 0.3s",
            backgroundColor: isDarkMode ? "#333333" : "white", // Dark mode: Dark Grey, Light mode: White
            color: isDarkMode ? "#FFFFFF" : "black", // Dark mode: White text, Light mode: Black text
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingLeft: open ? "20px" : "0px",
          },
        }}
      >
        <List>
          {/* Show Hamburger Icon only when Collapsed */}
          {!open && (
            <ListItem disablePadding>
              <ListItemButton onClick={toggleDrawer} sx={{ justifyContent: "flex-start", paddingLeft: "10px" }}>
                <ListItemIcon>
                  <MenuIcon sx={{ color: isDarkMode ? "#FFFFFF" : "black" }} /> {/* Dark mode: White icon */}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )}

          {/* Dashboard Item at the Top when Expanded */}
          {open && (
            <ListItem disablePadding>
              <ListItemButton sx={{ paddingLeft: "10px" }}>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: isDarkMode ? "#FFFFFF" : "black" }} /> {/* Dark mode: White icon */}
                </ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ color: isDarkMode ? "#FFFFFF" : "black" }} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
