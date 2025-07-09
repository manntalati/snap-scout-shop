# SnapScoutShop

Main goal of project: Provide users with the ability to take a picture of the clothing brand or item that they want to buy (classify with OpenCV and Tensorflow/PyTorch model) and then query with RAG to search historical prices/potentially realtime prices to then pass information to LLM which will then give recommendation of whether to buy or not

Specifically help people with buying the right items and the right time -- shopping is hard, let's make it easier

## Steps

1. YOLO Object Detection (specifically clothing detection) -> current step
2. Brand Detection after a box has been constructed over the clothing item & cropped to important size (potentially also include brand object detection in the YOLO step as well)
3. Catalog & Retrieval (Elasticsearch + Embeddings) -> specifically for historical and realtime prices
4. RAG & LLM Integration (LangChain + GPT 3.5)
5. Frontend (React)
6. Deployment (AWS ECS)