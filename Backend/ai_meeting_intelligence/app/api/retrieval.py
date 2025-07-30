import chromadb
import requests
from sentence_transformers import SentenceTransformer

# Initialize embedding model and ChromaDB client
embedder = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("meetings")

def retrieve_relevant_chunks(query, meeting_id, top_k=3):
    # Embed the query
    query_embedding = embedder.encode([query])[0].tolist()
    # Query ChromaDB for relevant chunks
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"meeting_id": meeting_id}
    )
    # Return the most relevant documents (chunks)
    return results["documents"][0] if results["documents"] else []

def ask_ollama(context, user_query, model="llama3:latest"):
    prompt = f"""
You are an AI assistant for meeting analysis.
Given the following meeting transcript context, answer the user's query.

Context:
{context}

User Query:
{user_query}

Your response must be a **valid JSON object only** with no explanation or additional text. 
Do NOT include markdown formatting like triple backticks (```).
Make sure keys are always consistent and well-structured as follows:
- For action items: {{ "action_items": [{{"description": "..."}}, ...] }}
- For decisions: {{ "decisions": [{{"description": "..."}}, ...] }}
- For participant interactions: 
  {{
    "participant_interactions": [
      {{
        "speaker": "...",
        "role": "...",
        "interaction_type": "...",
        "content": "..."
      }},
      ...
    ]
  }}

Respond only in JSON.
"""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": model, "prompt": prompt, "stream": False}
    )
    print("Ollama raw response:", response.text)  # Add this line for debugging
    data = response.json()
    if "response" in data:
        return data["response"]
    elif "error" in data:
        raise Exception(f"Ollama API error: {data['error']}")
    else:
        raise Exception(f"Unexpected Ollama API response: {data}")