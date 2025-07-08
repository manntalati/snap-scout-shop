import cv2 as cv

# Use YOLO with DNN to first border across a clothing and then classify that based on brand and clothing item

cam = cv.VideoCapture(0)

while True:
    check, frame = cam.read()

    cv.imshow('video', frame)

    key = cv.waitKey(1)
    if key == ord('q'):
        break

cam.release()
cv.destroyAllWindows()