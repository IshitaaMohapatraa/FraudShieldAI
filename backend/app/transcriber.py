import whisper
import tempfile
import os

# Load Whisper model once when the server starts
model = whisper.load_model("base")


def whisper_transcribe(audio_bytes: bytes, suffix=".webm"):    
    """
    Transcribes uploaded audio bytes using Whisper.
    """

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_audio:
        temp_audio.write(audio_bytes)
        temp_audio_path = temp_audio.name

    try:
        result = model.transcribe(temp_audio_path)
        return result["text"]

    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)