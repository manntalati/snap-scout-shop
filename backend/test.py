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

qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vector_store.as_retriever(search_kwargs={"k": 5}),
    memory=memory,
    return_source_documents=False,
    output_key='answer',
)

test_resp = qa.invoke({"question": "Tell me about Nike Air Max 270"})
print(test_resp)