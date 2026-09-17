const BASE_URL = "http://127.0.0.1:8000";

export async function transcribeAudio(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Transcription failed");
  }

  return await response.json();
}

export async function analyzeTranscript(transcription: string) {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      transcription,
    }),
  });

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  return await response.json();
}