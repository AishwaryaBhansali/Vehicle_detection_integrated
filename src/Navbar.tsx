import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

interface NavbarProps {
  toggleMode: () => void;
  isDarkMode: boolean;
}

function Navbar({ toggleMode, isDarkMode }: NavbarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        backgroundColor: isDarkMode ? "#3A3B3D" : "#1976d2", // Dark mode: Black, Light mode: Blue
        height: "64px",
        transition: "background-color 0.3s",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            color: isDarkMode ? "#FFFFFF" : "#FFFFFF", // Text always white
            fontFamily: "Roboto, Arial, sans-serif",
            fontWeight: 500,
          }}
        >
          Vehicle Detection
        </Typography>

        <IconButton
          onClick={toggleMode}
          sx={{
            color: isDarkMode ? "#FACC15" : "#1E40AF",
          }}
        >
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
