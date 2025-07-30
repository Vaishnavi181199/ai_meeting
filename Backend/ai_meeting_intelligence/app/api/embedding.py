from sentence_transformers import SentenceTransformer
import chromadb

# EMBEDDING_M0DEL = "hf.co/CompendumLabs/bge-base-en-v1.5-gguf"
# LANGUAGE_MODEL = "hf.co/bartowski/Llama-3.2-1B-Instruct-GGUF"


# Initialize embedding model and ChromaDB client once
embedder = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("meetings")

def store_transcript_with_embedding(text, meeting_id):
    try:
        embedding = embedder.encode([text])[0]
        collection.add(
            documents=[text],
            embeddings=[embedding.tolist()],
            metadatas=[{"meeting_id": meeting_id}],
            ids=[meeting_id]
        )
        return {"status": "success", "meeting_id": meeting_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store transcript with embedding: {e}")  
        return {"status": "error", "detail": str(e)}    
