import cv2
import base64
import numpy as np
import os
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from detect import process_image

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

app = Flask(__name__)
CORS(app, supports_credentials=True)

VIDEO_DIR = os.path.join(os.path.dirname(__file__), 'recorded_videos')
os.makedirs(VIDEO_DIR, exist_ok=True)

video_writer = None
is_recording = False
output_video_path = None
drive_video_link = None

# Replace with your shared Google Drive folder ID
FOLDER_ID = "1gCUc24lLZvV2YllYPlzxXJ9dY6dO24si"

def upload_to_drive(file_path):
    credentials = service_account.Credentials.from_service_account_file("credentials.json", scopes=["https://www.googleapis.com/auth/drive"])
    service = build("drive", "v3", credentials=credentials)

    file_metadata = {
        "name": os.path.basename(file_path),
        "parents": [FOLDER_ID]
    }

    media = MediaFileUpload(file_path, mimetype="video/avi")
    uploaded_file = service.files().create(body=file_metadata, media_body=media, fields="id").execute()
    
    file_id = uploaded_file.get("id")

    # Make file public
    service.permissions().create(fileId=file_id, body={"role": "reader", "type": "anyone"}).execute()

    return f"https://drive.google.com/file/d/{file_id}/view?usp=sharing"

@app.route('/stream', methods=['POST'])
def stream():
    global video_writer, is_recording
    try:
        data = request.json
        image_data = data['image'].split(",")[1]
        image_bytes = base64.b64decode(image_data)

        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            raise ValueError("Decoded frame is None. Check base64 encoding.")

        processed_image_base64, defects = process_image(frame)

        if is_recording and video_writer is not None:
            video_writer.write(frame)

        return jsonify({"processed_image": processed_image_base64, "defects": defects})

    except Exception as e:
        print("Error processing frame:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/start_recording', methods=['POST'])
def start_recording():
    global video_writer, is_recording, output_video_path
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    output_video_path = os.path.join(VIDEO_DIR, f"output_{timestamp}.avi")

    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    video_writer = cv2.VideoWriter(output_video_path, fourcc, 10, (640, 480))

    if not video_writer.isOpened():
        return jsonify({"error": "Failed to start video recording"}), 500

    is_recording = True
    return jsonify({"message": "Recording started"})

@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global video_writer, is_recording, output_video_path

    if video_writer is not None:
        video_writer.release()
        video_writer = None

    is_recording = False

    try:
        drive_link = upload_to_drive(output_video_path)
        return jsonify({"message": "Recording stopped", "video_link": drive_link})
    except Exception as e:
        return jsonify({"message": "Recording stopped", "error": str(e)}), 500

@app.route('/')
def home():
    return "🎉 Flask backend is running on Render!"

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))  # Render injects PORT env
    app.run(debug=False, host='0.0.0.0', port=port)

