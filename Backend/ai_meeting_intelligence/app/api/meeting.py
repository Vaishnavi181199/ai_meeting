from fastapi import APIRouter, Body, File, UploadFile, HTTPException
import whisper
import shutil
import os
from tempfile import NamedTemporaryFile
import uuid
from .retrieval import ask_ollama, retrieve_relevant_chunks
from .embedding import store_transcript_with_embedding

router = APIRouter()

# Load Whisper model once at startup
model = whisper.load_model("base")  # You can use "small", "medium", "large" as needed

@router.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    # Save uploaded file to a temporary location
    try:
        suffix = os.path.splitext(file.filename)[1]
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
            temp_file.flush()  # Ensure all data is written
            os.fsync(temp_file.fileno())  # Force write to disk
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    # Transcribe using Whisper
    try:
        result = model.transcribe(temp_file_path)
        text = result["text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")
    finally:
        os.remove(temp_file_path)

    meeting_id = str(uuid.uuid4())
    embed  =store_transcript_with_embedding(text, meeting_id)
    if embed["status"] != "success":
        raise HTTPException(status_code=500, detail="Failed to store transcript with embedding.")
     

    # Retrieve action items, decisions, and participant interactions using RAG & Ollama
    context_chunks = retrieve_relevant_chunks("meeting summary", meeting_id)
    context = "\n".join(context_chunks) if context_chunks else text

    # Ask Ollama for each insight separately
    action_items = ask_ollama(context, "List all action items from this meeting transcript. Return as a JSON array.")
    decisions = ask_ollama(context, "List all decisions made in this meeting transcript. Return as a JSON array.")
    participant_interactions = ask_ollama(context, "Describe participant interactions in this meeting transcript. Return as a JSON array.")

    insights = {
        "action_items": action_items,
        "decisions": decisions,
        "participant_interactions": participant_interactions
    }
    print(f"Insights for meeting {meeting_id}: {insights}")
    return {
        "meeting_id": meeting_id,
        "transcription": text,
        "insights": insights
    }


@router.post("/ask/")
async def ask_meeting_insights(
    meeting_id: str = Body(...),
    user_query: str = Body(...)
):
    # Retrieve relevant transcript chunks
    context_chunks = retrieve_relevant_chunks(user_query, meeting_id)
    context = "\n".join(context_chunks)
    if not context:
        raise HTTPException(status_code=404, detail="No relevant context found for this meeting.")

    # Ask Ollama
    answer = ask_ollama(context, user_query)
    return {"answer": answer}