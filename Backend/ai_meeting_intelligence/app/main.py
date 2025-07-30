from fastapi import FastAPI
from app.api import meeting  # Adjust the import path if needed
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the meeting router
app.include_router(meeting.router, prefix="/api/meeting")

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Meeting Intelligence API!"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}