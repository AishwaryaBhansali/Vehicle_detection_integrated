from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse, FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import torch
from ultralytics import YOLO
from tensorflow.keras.models import load_model  # type: ignore
import io
import tempfile
import imghdr
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
yolo_model_path = r"C:\Users\Aishwarya Bhansali\React-ML\vdetection\backend\best.pt"
model = YOLO(yolo_model_path)

color_model_path = r"C:\Users\Aishwarya Bhansali\React-ML\vdetection\backend\ResNet50-model.best.keras"
color_model = load_model(color_model_path)

vehicle_type_labels = ['car', 'motorcycle', 'bus', 'truck']
color_labels = ['black', 'blue', 'grey', 'red', 'white', 'yellow']

# Function to stream video
def video_streamer(video_path):
    with open(video_path, "rb") as video_file:
        yield from video_file

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """Handles image and video uploads."""
    contents = await file.read()

    # Identify file type
    file_type = imghdr.what(None, h=contents)
    
    if file_type in ["jpeg", "png", "jpg"]:
        return await process_image(contents)
    elif file.filename.endswith(".mp4"):
        return await process_video(contents)
    else:
        return {"error": "Unsupported file format"}

async def process_image(image_data):
    """Processes an image and returns the detected image."""
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        return {"error": "Invalid image"}

    results = model(image)
    detections = results[0]

    for detection in detections.boxes:
        box = detection.xyxy[0].tolist()
        x1, y1, x2, y2 = map(int, box[:4])

        class_id = int(detection.cls)
        vehicle_type = vehicle_type_labels[class_id] if class_id < len(vehicle_type_labels) else "unknown"

        # Ensure bounding box is within valid range
        if x1 < 0 or y1 < 0 or x2 > image.shape[1] or y2 > image.shape[0]:
            continue

        roi = image[y1:y2, x1:x2]
        roi_resized = cv2.resize(roi, (64, 64))
        roi_normalized = roi_resized.astype('float32') / 255.0
        roi_rgb = cv2.cvtColor(roi_normalized, cv2.COLOR_BGR2RGB)
        roi_input = np.expand_dims(roi_rgb, axis=0)

        predicted_color = color_model.predict(roi_input)
        color_class = np.argmax(predicted_color)
        color_name = color_labels[color_class] if color_class < len(color_labels) else "unknown"

        label = f"{vehicle_type}, {color_name}"
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    _, encoded_image = cv2.imencode('.jpg', image)
    return Response(content=encoded_image.tobytes(), media_type="image/jpeg")

async def process_video(video_data):
    """Processes a video and returns the detected video."""
    temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    temp_input.write(video_data)
    temp_input.close()

    cap = cv2.VideoCapture(temp_input.name)
    if not cap.isOpened():
        return {"error": "Error opening video file"}

    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(temp_output.name, fourcc, fps, (frame_width, frame_height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)
        detections = results[0]
        for detection in detections.boxes:
            box = detection.xyxy[0].tolist()
            x1, y1, x2, y2 = map(int, box[:4])

            class_id = int(detection.cls)
            vehicle_type = vehicle_type_labels[class_id] if class_id < len(vehicle_type_labels) else "unknown"

            if x1 < 0 or y1 < 0 or x2 > frame.shape[1] or y2 > frame.shape[0]:
                continue

            roi = frame[y1:y2, x1:x2]
            roi_resized = cv2.resize(roi, (64, 64))
            roi_normalized = roi_resized.astype('float32') / 255.0
            roi_rgb = cv2.cvtColor(roi_normalized, cv2.COLOR_BGR2RGB)
            roi_input = np.expand_dims(roi_rgb, axis=0)

            predicted_color = color_model.predict(roi_input)
            color_class = np.argmax(predicted_color)
            color_name = color_labels[color_class] if color_class < len(color_labels) else "unknown"

            label = f"{vehicle_type}, {color_name}"
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        out.write(frame)
    
    cap.release()
    out.release()

    return FileResponse(temp_output.name, media_type='video/mp4', filename="output.mp4")