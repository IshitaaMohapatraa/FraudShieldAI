# FraudShield AI — Real-Time Audio Fraud Detection

FraudShield AI is an AI-powered system designed to detect potential scams and fraudulent activity in phone conversations. It processes call audio, converts speech into text, analyzes conversational patterns for potential fraud indicators, and generates a risk assessment with clear user guidance.

The system is designed with a particular focus on elderly and digitally vulnerable users who may be targeted through impersonation, urgency, emotional manipulation, and financial scams.

---

## Overview

Voice-based scams often rely on psychological pressure rather than technical vulnerabilities. Attackers may impersonate trusted organizations, create a sense of urgency, request sensitive information, or pressure users into making financial transactions.

FraudShield AI aims to provide an additional layer of protection by analyzing conversational content and identifying patterns commonly associated with fraudulent calls.

### Detection Pipeline

```text
Call Audio
    ↓
Speech-to-Text
    ↓
Conversation Analysis
    ↓
Fraud Indicator Detection
    ↓
Risk Assessment
    ↓
Alert and Guidance
```

---

## Features

* Real-time audio fraud detection workflow
* Speech-to-text conversion for call conversations
* AI-powered conversation analysis
* Detection of potential scam and fraud indicators
* Fraud risk assessment
* Clear explanations for detected risk factors
* Elder Mode with a simplified, accessibility-focused interface
* REST API-based frontend and backend communication

---

## Scam Indicators

The system can analyze conversations for patterns such as:

* Impersonation of banks, government organizations, or trusted entities
* Requests for OTPs, passwords, PINs, or financial information
* Urgency and psychological pressure
* Threats involving account suspension or legal action
* Suspicious payment requests
* Emotional manipulation
* Other potentially fraudulent conversational patterns

---

## Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

### Backend

* Python
* FastAPI
* Uvicorn

### AI and Processing

* Speech-to-Text
* AI-based conversation analysis
* Fraud pattern detection

### Communication

* REST APIs

---

## Project Structure

```text
FraudShieldAI/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── api.py
│   │   └── schemas.py
│   │
│   ├── requirements.txt
│   └── ...
│
├── src/
│   ├── ...
│
├── public/
│   └── ...
│
├── package.json
├── vite.config.ts
├── README.md
└── .gitignore
```

---

# Installation

## Prerequisites

Make sure the following are installed:

* Python 3.10+
* Node.js
* npm
* Git

Verify the installations:

```bash
python --version
node --version
npm --version
git --version
```

---

## 1. Clone the Repository

Clone the repository and navigate into the project directory:

```bash
git clone https://github.com/IshitaaMohapatraa/FraudShieldAI.git
cd FraudShieldAI
```

---

# Frontend Setup

The frontend is built using React, TypeScript, Tailwind CSS, and Vite.

## 2. Install Frontend Dependencies

From the project root:

```bash
npm install
```

## 3. Start the Frontend

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Typically:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

# Backend Setup

The backend is built using Python and FastAPI.

## 4. Navigate to the Backend

Open a new terminal and run:

```bash
cd FraudShieldAI/backend
```

## 5. Create a Virtual Environment

```bash
python -m venv venv
```

## 6. Activate the Virtual Environment

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

### Windows Command Prompt

```cmd
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

After activation, the terminal should display the virtual environment name.

Example:

```text
(venv) D:\FraudShieldAI\backend>
```

---

## 7. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

If `python-multipart` is not already included in the requirements:

```bash
pip install python-multipart
```

---

## 8. Start the Backend Server

From the `backend` directory:

```bash
python -m uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI provides interactive API documentation at:

```text
http://127.0.0.1:8000/docs
```

You can use the `/docs` interface to view and test the available API endpoints.

---

# Environment Variables

If the application requires external AI services or API keys, create a `.env` file inside the backend directory.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

Never commit API keys or other credentials to GitHub.

Make sure `.env` is included in `.gitignore`:

```gitignore
.env
venv/
venv_tmp/
venv311/
__pycache__/
*.pyc
```

---

# Running the Application

The frontend and backend need to run simultaneously.

## Terminal 1 — Backend

Navigate to the backend:

```bash
cd FraudShieldAI/backend
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Start the FastAPI server:

```bash
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Terminal 2 — Frontend

From the project root:

```bash
cd FraudShieldAI
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Use the URL displayed by Vite if a different port is assigned.

---

# Usage

1. Open the FraudShield AI web application.
2. Enable Elder Mode if required.
3. Navigate to the fraud detection interface.
4. Start or provide a call audio input.
5. The audio is processed by the backend.
6. Speech is converted into text.
7. The conversation is analyzed for potential scam indicators.
8. Detected indicators are presented to the user.
9. A risk assessment and appropriate guidance are generated.

---

# API

The backend exposes REST API endpoints through FastAPI.

Once the backend is running, open:

```text
http://127.0.0.1:8000/docs
```

The Swagger interface allows developers to view and test the available endpoints.

---

# Security Considerations

FraudShield AI is intended as an assistive fraud-prevention and awareness system. Its results should not be considered a definitive guarantee that a call is fraudulent or safe.

Users should never share sensitive information such as:

* OTPs
* PINs
* Passwords
* Banking credentials
* Card details

with unknown callers based solely on their claims.

---

# Project Objective

FraudShield AI aims to improve protection against voice-based scams by combining audio processing, speech-to-text technology, and AI-based conversation analysis.

The system is designed to identify potential fraud indicators, assess conversational risk, and provide users with clear information that can help them recognize potentially fraudulent calls.
