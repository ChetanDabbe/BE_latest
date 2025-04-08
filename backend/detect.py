from ultralytics import YOLO
import cv2
import numpy as np
import base64

# Load YOLOv8 models
bottle_model = YOLO("models/bottle_best.pt")  # Model for detecting bottles
defect_model = YOLO("models/best.pt")  # Model for detecting defects

def process_image(image):
    """ Process the image and return the result with bounding boxes. """
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Run YOLO detection for bottles
    bottle_results = bottle_model(rgb_image)
    bottle_boxes = []
    for result in bottle_results:
        for box in result.boxes.data:
            x1, y1, x2, y2, conf, cls = box.tolist()
            bottle_boxes.append([int(x1), int(y1), int(x2), int(y2), conf])

    defects = []
    # Run YOLO detection for defects
    defect_results = defect_model(rgb_image)
    for result in defect_results:
        for box in result.boxes.data:
            x1, y1, x2, y2, conf, cls = box.tolist()
            defects.append({
                "defect_name": defect_model.names[int(cls)],
                "confidence": conf,
                "coordinates": {"x1": int(x1), "y1": int(y1), "x2": int(x2), "y2": int(y2)}
            })
            # Draw defect bounding boxes
            cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
            cv2.putText(image, f"{defect_model.names[int(cls)]} {conf:.2f}", (int(x1), int(y1) - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

    # Draw bottle bounding boxes
    for x1, y1, x2, y2, conf in bottle_boxes:
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image, f"Bottle {conf:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Convert processed image to base64
    _, buffer = cv2.imencode('.jpg', image)
    processed_image_base64 = base64.b64encode(buffer).decode('utf-8')

    return processed_image_base64, defects
