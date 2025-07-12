import cv2 as cv
from ultralytics import YOLO

# Use YOLO with DNN to first border across a clothing and then classify that based on brand and clothing item

yolo = YOLO('yolov8n.pt')

cap = cv.VideoCapture(0)

while True:
    ret, frame = cap.read()

    results = yolo.track(frame, stream=True)

    for result in results:
        class_names = result.names
        for box in result.boxes:
            if box.conf[0] > 0.6:
                [x1, y1, x2, y2] = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                cls = int(box.cls[0])
                class_name = class_names[cls]
                cv.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv.putText(frame, f'{class_names[int(box.cls[0])]} {box.conf[0]:.2f}', (x1, y1), cv.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    cv.imshow('frame', frame)
    if cv.waitKey(1) == ord('a'):
        break

cap.release()
cv.destroyAllWindows()