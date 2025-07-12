from ultralytics import YOLO

model = YOLO('yolov8n.pt') # load in model with pre-tuned weights

model.info()

results = model.train(data="fashion_mnist/fashion_mnist.yaml", epochs=30, imgsz=224) # train it on fashion_mnist yaml, 30 epochs, 224 size

metrics = model.val()

print(metrics) # look at metrics of trained model

model.export(format='onnx') # export it to onnx format for real-time object detection