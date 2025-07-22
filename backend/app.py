from fastapi import FastAPI, Query, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.chat_models import init_chat_model
from langchain_core.vectorstores import InMemoryVectorStore
from langchain.chains import RetrievalQA
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_elasticsearch import ElasticsearchStore
from langchain_chroma import Chroma
from langchain.schema import Document
import numpy as np
from PIL import Image
import cv2
import os
import traceback

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = os.getenv('LANGSMITH_API_KEY')

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = init_chat_model("gemini-2.0-flash", model_provider="google_genai")
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

#texts = ["Nike Air Max is a popular shoe.", "Adidas UltraBoost is known for comfort."]
#docs = [Document(page_content=t) for t in texts]

#docs = [Document(page_content="Nike Air Max 270 - stylish and comfy."), Document(page_content="Adidas Originals, classic street style.")]
#vector_store = Chroma.from_documents(docs, embedding=embeddings)

vector_store = ElasticsearchStore(
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

        print("Received chat message:", message)
        print("Full prompt to LLM:", full_prompt)
        
        resp = qa(full_prompt)

        print("LLM response:", resp)
        
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
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "snap-scout-shop-api"}