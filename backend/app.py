from fastapi import FastAPI, Query, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
from pydantic import BaseModel
from langchain.chat_models import init_chat_model
from langchain_core.vectorstores import InMemoryVectorStore
from langchain.chains import RetrievalQA
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_elasticsearch import ElasticsearchStore
from langchain_chroma import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.schema import Document
import numpy as np
from PIL import Image
import cv2
import os
import traceback
from dotenv import load_dotenv
from langchain_core.vectorstores import InMemoryVectorStore # testing purposes

load_dotenv()

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = os.getenv("LANGSMITH_API_KEY")
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
app.secret_key = 'snap-scout-shop-secret-key'
CORS(app, origins="*", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.8)
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

vector_store = InMemoryVectorStore(embedding=embeddings) # testing purposes

docs = [
    Document(page_content="Nike Air Max 270 by Nike priced at $150", metadata={"id": "1", "price": 150, "brand": "Nike"}),
    Document(page_content="Adidas Ultraboost shoes priced at $180", metadata={"id": "2", "price": 180, "brand": "Adidas"}),
] # testing purposes

vector_store.add_documents(docs) # testing purposes
# vector_store = ElasticsearchStore(
#     es_url="http://localhost:3050",
#     index_name="products",
#     embedding=embeddings,
# )

qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vector_store.as_retriever(search_kwargs={"k": 5}),
    memory=memory,
    return_source_documents=False,
    output_key='answer'
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
        resp = qa.invoke({"question": q.question})
        return {
            "answer": resp["answer"],
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
def chat(message: ChatMessage):
    try:
        context = ""
        if message.product_data:
            context = f"Product: {message.product_data.get('name', 'Unknown')} - {message.product_data.get('brand', 'Unknown')} at ${message.product_data.get('price', 0)}. "
        
        full_prompt = f"{context}User question: {message.message}"

        print("Received chat message:", message)
        print("Full prompt to LLM:", full_prompt)
        
        resp = qa.invoke({"question": full_prompt})

        print("LLM response:", resp)
        
        return {
            "response": resp["answer"],
            "sources": [
                {
                  "id": doc.metadata.get("id"),
                  "price_history": doc.metadata.get("price_history")
                }
                for doc in resp["source_documents"]
            ]
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "snap-scout-shop-api"}

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=3050)