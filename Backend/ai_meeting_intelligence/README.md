# Meeting Insights Backend

A FastAPI backend for extracting actionable insights from meeting recordings using AI.

## Features

- Audio/Video file upload and processing
- Speech-to-text transcription using Whisper
- AI-powered insight extraction using Ollama
- Vector search with ChromaDB
- RESTful API with automatic documentation

## Setup Instructions

### 1. Prerequisites

- Python 3.8+
- Git

### 2. Environment Setup

1. Navigate to the project directory:
```bash

cd Backend/AI_meeting_platform

```

2. Activate your virtual environment:

```bash

# Windows

venv\Scripts\activate

# macOS/Linux

source venv/bin/activate

```
3. Install dependencies:

```bash

pip install -r requirements.txt

```


### 3. External Dependencies

#### Install Ollama (for LLM processing)

1. Download and install Ollama from https://ollama.ai/

2. Pull a model:

```bash

ollama pull llama3

```

3. Start Ollama server (usually runs automatically)



#### Install Whisper (for transcription)

Whisper will be installed automatically with the requirements, but you may need to install ffmpeg:



**Windows:**

```bash

# Install using chocolatey

choco install ffmpeg



# Or download from https://ffmpeg.org/

```



**macOS:**

```bash

brew install ffmpeg

```



**Linux:**

```bash

sudo apt update

sudo apt install ffmpeg

```



### 4. Run the Application

```bash

python run.py

```



The API will be available at:

- **API Base URL:** http://localhost:8000


### Meetings

- `POST /api/meetings/transcribe` - Upload meeting file


## Project Structure



```

app/

├── main.py              # FastAPI application entry point

├── api/                 # API route handlers

│   ├── embedding.py         # Authentication routes

│   ├── meetings.py     # Meeting management routes

│   ├── retrival.py    # Analytics routes

```


### Testing

Run the development server with auto-reload:

```bash

python run.py

```

Test API endpoints using the interactive documentation at http://localhost:8000/



## Troubleshooting



### Common Issues



1. **Ollama Connection Error:**

   - Ensure Ollama is running: `ollama serve`

   - Check the model is available: `ollama list`



2. **Whisper Model Loading Error:**

   - Ensure you have sufficient disk space

   - Try a smaller model in `transcription.py`



3. **File Upload Issues:**

   - Check the `uploads` directory exists and is writable


### Performance Tips

1. Use smaller Whisper models for faster transcription
2. Adjust Ollama model size based on your hardware
3. Consider using GPU acceleration for better performance



## Next Steps



1. Set up the React frontend
2. Implement real-time processing updates
3. Add more sophisticated AI prompts
4. Implement user management and permissions
5. Add data export features