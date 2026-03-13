import { createTheme } from "@mui/material/styles";

// Custom Very Light Blue Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#BBDEFB", // Very Light Blue
    },
    secondary: {
      main: "#E3F2FD", // Softest Blue
    },
    background: {
      default: "#F5FAFF", // Almost White with Blue Tint
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000000", // Slightly Darker Blue for contrast
      secondary: "#000000",
    },
  },
});

export default theme;
