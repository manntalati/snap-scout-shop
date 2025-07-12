from fastapi import FastAPI, Query, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import ElasticVectorSearch
import base64
import io
import cv2
import numpy as np
from PIL import Image
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = OpenAI(temperature=0.2)
embeddings = OpenAIEmbeddings()

vector_store = ElasticVectorSearch(
    es_url="http://localhost:9200",
    index_name="products",
    embedding=embeddings,
)

qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vector_store.as_retriever(k=5),
    return_source_documents=True
)

class QueryIn(BaseModel):
    question: str

class ProductDetectionResponse(BaseModel):
    name: str
    brand: str
    price: float
    confidence: float
    category: str

class ChatMessage(BaseModel):
    message: str
    product_data: dict | None = None

@app.get("/")
def read_root():
    return {"message": "SnapScoutShop API"}

@app.post("/detect-product")
async def detect_product(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # TODO: Implement actual YOLO detection here
        # For now, return mock data
        # This should integrate with your OpenCV service
        
        detection_result = ProductDetectionResponse(
            name="Nike Air Max 270",
            brand="Nike",
            price=150.00,
            confidence=0.85,
            category="Shoes"
        )
        
        return detection_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/recommend")
def recommend(q: QueryIn):
    try:
        resp = qa(q.question)
        return {
            "answer": resp["result"],
            "sources": [
                {
                  "id": doc.metadata.get("id"),
                  "price_history": doc.metadata.get("price_history")
                }
                for doc in resp["source_documents"]
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        context = ""
        if message.product_data:
            context = f"Product: {message.product_data.get('name', 'Unknown')} - {message.product_data.get('brand', 'Unknown')} at ${message.product_data.get('price', 0)}. "
        
        full_prompt = f"{context}User question: {message.message}"
        
        resp = qa(full_prompt)
        
        return {
            "response": resp["result"],
            "sources": [
                {
                  "id": doc.metadata.get("id"),
                  "price_history": doc.metadata.get("price_history")
                }
                for doc in resp["source_documents"]
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "snap-scout-shop-api"}