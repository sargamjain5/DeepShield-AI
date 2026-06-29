import io

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from utils.predictor import predict


app = FastAPI(
    title="DeepShield AI API",
    description="Backend API for Deepfake Image Classification"
)

# ----------------------------
# CORS
# ----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Prediction Endpoint
# ----------------------------

@app.post("/api/predict")
async def handle_prediction(file: UploadFile = File(...)):

    if not file.content_type.startswith("image/"):
        return {
            "success": False,
            "error": "Uploaded file must be an image."
        }

    try:

        image_bytes = await file.read()

        image_buffer = io.BytesIO(image_bytes)

        label, confidence = predict(image_buffer)

        return {
            "success": True,
            "label": label,
            "confidence": confidence
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }


# ----------------------------
# Run Server
# ----------------------------

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )