import json
from elasticsearch import Elasticsearch
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

elastic_search = Elasticsearch("http://localhost:3050")
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

with open("data/products.json") as file:
    products = json.load(file)

for product in products:
    text = product["name"] + ". " + product.get("description", "")
    embedding = embeddings_model.embed_query(text)
    body = {**product, "vector": embedding}
    elastic_search.index(index="products", id=product["id"], document=body)