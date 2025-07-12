import json
from elasticsearch import Elasticsearch
import openai
import os

elastic_search = Elasticsearch("http://localhost:9200")
openai.api_key = os.getenv("OPENAI_API_KEY")

with open("data/products.json") as file:
    products = json.load(file)

for product in products:
    text = product["name"] + ". " + product["description"]
    response = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=text
    )
    embedding = response["data"][0]["embedding"]
    body = {**product, "embedding": embedding}
    elastic_search.index(index="products", id=product["id"], document=body)