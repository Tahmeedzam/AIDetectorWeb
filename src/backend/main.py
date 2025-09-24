from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import aiohttp
import shutil
import os

app = FastAPI()

# Allow frontend (localhost:3000) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev, you can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect-video")
async def detect_video(file: UploadFile = File(...)):
    temp_file = f"temp_{file.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    url = "https://api.sightengine.com/1.0/video/check-sync.json"
    params = {
        "api_user": "334590953",
        "api_secret": "5GyUFfJAudt94pBYuxJYZYs6jJnAtjcu",
        "models": "genai"
    }

    async with aiohttp.ClientSession() as session:
        form_data = aiohttp.FormData()
        form_data.add_field("media", open(temp_file, "rb"), filename=file.filename)

        async with session.post(url, data=form_data, params=params) as resp:
            result = await resp.json()

    os.remove(temp_file)

    frames = result.get("data", {}).get("frames", [])
    avg_ai_score = sum(frame["type"]["ai_generated"] for frame in frames) / len(frames) if frames else 0
    is_ai = avg_ai_score > 0.5  # choose threshold

    return {
        "filename": file.filename,
        "ai_detected": is_ai,
        "confidence": avg_ai_score,
        "frames_checked": len(frames),
        "raw": result
    }
