//import "./App.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { useState, useEffect } from "react";
import Card from "./Card";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          backgroundColor: isDarkMode ? "#292a2d" : "#F5FAFF",
          transition: "background-color 0.3s",
          overflow: "hidden", // Removes scrollbars
        }}
      >
        {/* Sidebar */}
        <Sidebar isDarkMode={isDarkMode} />

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            height: "100vh",
            transition: "width 0.3s ease",
          }}
        >
          {/* Navbar */}
          <Navbar toggleMode={toggleMode} isDarkMode={isDarkMode} />

          {/* Centered Card Section with slight left shift */}
          <Box
            component="main"
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Card Component - Moved Slightly Left */}
            <Box
              sx={{
                width: "50vw",
                height: "60vh",
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "box-shadow 0.3s",
                position: "relative",
                left: "-10vw", // Moves card slightly to the left
              }}
            >
              <Card />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
