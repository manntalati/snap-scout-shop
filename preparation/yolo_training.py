from ultralytics import YOLO

model = YOLO('yolov8n.pt')

model.info()

results = model.train(data="fashion_mnist/fashion_mnist.yaml", epochs=30, imgsz=224)

model.export(format='onnx')