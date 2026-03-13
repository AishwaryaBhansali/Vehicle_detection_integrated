import { Box, Divider, Typography, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import "./app.css";

const SplitCard = () => {
  const [file, setFile] = useState<string | null>(null);
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string | null>(null);

  // Handle File Upload (Image or Video) and Send to FastAPI
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFile(fileUrl);
      setIsProcessing(true);

      const formData = new FormData();
      formData.append("file", file);

      setFileType(file.type.startsWith("video") ? "video" : "image");

      try {
        const response = await axios.post("http://localhost:8000/upload/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob", // Get file response as a blob
        });

        const processedFileUrl = URL.createObjectURL(response.data);
        setProcessedFile(processedFileUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle Upload Another File
  const handleUploadAnotherFile = () => {
    setFile(null);
    setProcessedFile(null);
    setFileType(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
        gap: 4,
      }}
    >
      {/* File Upload Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "500px",
        }}
      >
        {/* Uploaded File (Image or Video) */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {file && (
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "#3498db",
                position: "relative",
                '&::after': {
                  content: '""',
                  display: "block",
                  width: "50%",
                  height: "4px",
                  background: "#3498db",
                  margin: "4px auto",
                  borderRadius: "2px"
                }
              }}
            >
              Input File
            </Typography>
          )}

          {!file ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #3498db",
                backgroundColor: "#e3f2fd",
                padding: 4,
                borderRadius: 4,
                width: "90%",
                height: "90%",
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 60, color: "#3498db" }} />
              <Typography variant="h6" color="gray">
                Drag & Drop or Click to Upload (Image/Video)
              </Typography>
              <Button variant="contained" component="label">
                Choose File
                <input type="file" hidden accept="image/*,video/mp4" onChange={handleFileUpload} />
              </Button>
            </Box>
          ) : fileType === "image" ? (
            <img src={file} alt="Uploaded" style={{ width: "90%", height: "90%", objectFit: "contain" }} />
          ) : (
            <video src={file} controls style={{ width: "90%", height: "90%" }} />
          )}
        </Box>

        {/* Divider Line */}
        <Divider orientation="vertical" flexItem sx={{ borderRightWidth: 2, height: "100%" }} />

        {/* Processed File Output */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            className={isProcessing ? "processing-text" : "normal-text"}
          >
            {isProcessing ? "Processing..." : "Processed Output"}
          </Typography>

          {isProcessing ? (
            <CircularProgress size={50} />
          ) : processedFile ? (
            fileType === "image" ? (
              <img src={processedFile} alt="Processed Output" style={{ width: "90%", height: "90%", objectFit: "contain" }} />
            ) : (
              <>
                <video src={processedFile} controls style={{ width: "90%", height: "90%" }} />
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                  startIcon={<DownloadIcon />}
                  href={processedFile}
                  download="processed_video.mp4"
                >
                  Download Video
                </Button>
              </>
            )
          ) : (
            <Typography variant="h5" fontWeight="bold" color="gray">
              No File Processed
            </Typography>
          )}
        </Box>
      </Box>

      {/* Button to Upload Another File */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={handleUploadAnotherFile}
      >
        Upload Another File
      </Button>
    </Box>
  );
};

export default SplitCard;
