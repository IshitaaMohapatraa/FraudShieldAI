import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def analyze_transcript(transcript: str):

    prompt = f"""
You are an AI cybersecurity fraud detection system.

Analyze this phone call transcript.

Transcript:
{transcript}

Return ONLY valid JSON.

Format:

{{
    "risk_score": 0-100,
    "threat_level": "Low | Medium | High | Critical",
    "detected_pattern": "string",
    "red_flags":[
        "...",
        "...",
        "..."
    ],
    "timeline":[
        {{
            "time":"00:10",
            "riskLevel":85,
            "event":"OTP requested",
            "severity":"high"
        }}
    ]
}}
"""

    response = model.generate_content(prompt)

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    elif text.startswith("```"):
        text = text.replace("```", "").strip()

    return json.loads(text)