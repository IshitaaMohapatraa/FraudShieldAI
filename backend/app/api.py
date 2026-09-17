from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas import (
    TranscribeResponse,
    AnalyzeRequest,
    AnalyzeResponse,
)
from app.transcriber import whisper_transcribe
from app.gemini_analyzer import analyze_transcript
import traceback
import os

router = APIRouter()


# -------------------------------
# Transcribe Audio Endpoint
# -------------------------------
@router.post(
    "/transcribe",
    response_model=TranscribeResponse,
    status_code=status.HTTP_200_OK,
)
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe the uploaded audio file to text.
    """

    if not file.content_type.startswith("audio/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload an audio file.",
        )

    try:
        contents = await file.read()

        if len(contents) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty audio file uploaded.",
            )

        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Audio file too large. Max size: 10MB.",
            )

        suffix = os.path.splitext(file.filename)[1] or ".webm"

        transcription_text = whisper_transcribe(
            contents,
            suffix=suffix
        )

        return TranscribeResponse(
            transcription=transcription_text
        )

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


# -------------------------------
# Gemini Scam Analysis Endpoint
# -------------------------------
@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    status_code=status.HTTP_200_OK,
)
async def analyze_transcription(request: AnalyzeRequest):
    """
    Analyze the transcription using Gemini AI.
    """

    if not request.transcription.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcription cannot be empty.",
        )

    try:
        result = analyze_transcript(request.transcription)

        return AnalyzeResponse(**result)

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )