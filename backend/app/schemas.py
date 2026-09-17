from pydantic import BaseModel
from typing import List


class TranscribeResponse(BaseModel):
    transcription: str


class AnalyzeRequest(BaseModel):
    transcription: str


class TimelineEvent(BaseModel):
    time: str
    riskLevel: int
    event: str
    severity: str


class AnalyzeResponse(BaseModel):
    risk_score: int
    threat_level: str
    detected_pattern: str
    red_flags: List[str]
    timeline: List[TimelineEvent]