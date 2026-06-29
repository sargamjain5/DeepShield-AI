# DeepShield AI

An AI-powered deepfake detection platform developed to identify manipulated images and support digital forensics, media verification, and defense-critical information systems.

## Overview

DeepShield AI leverages deep learning techniques to detect AI-generated and manipulated images with high accuracy. The system combines a trained image classification model with a modern web interface, enabling users to upload images and receive authenticity predictions in real time.

## Problem Statement

Recent advances in Generative AI, including GANs and diffusion models, have enabled the creation of highly realistic synthetic images. These manipulated images can be used for misinformation, identity spoofing, evidence fabrication, and information warfare, posing significant challenges to cybersecurity and national security.

DeepShield AI aims to address these challenges by providing a reliable deepfake detection framework capable of distinguishing authentic images from AI-generated content.

---

## Features

- AI-powered image deepfake detection
- Real-time image authenticity verification
- Modern and responsive web interface
- FastAPI backend for model inference
- Deep learning-based classification pipeline
- Confidence score generation
- Scalable deployment architecture

---

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- Python

### Machine Learning
- PyTorch
- OpenCV
- NumPy
- Pillow

### Deployment
- Vercel (Frontend)
- FastAPI Server (Backend)

---

## Dataset

The model was trained using the CIFake dataset containing:

| Category | Images |
|-----------|----------|
| Real Images | 50,000 |
| Fake Images | 50,000 |

Testing Dataset:

| Category | Images |
|-----------|----------|
| Real Images | 10,000 |
| Fake Images | 10,000 |

Total Images: **120,000**

---

## Model Performance

| Metric | Score |
|---------|---------|
| Accuracy | 98.34% |
| Precision | High |
| Recall | High |
| F1-Score | High |

Best Validation Accuracy Achieved:

```text
98.34%
```

---

## Project Structure

```text
DeepShieldAI/
│
├── backend/
│   ├── main.py
│   ├── train.py
│   ├── requirements.txt
│   └── utils/
│       ├── predictor.py
│       └── preprocess.py
│
├── deepshield-ui/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

## System Architecture

```text
User Upload
      │
      ▼
Frontend (Next.js)
      │
      ▼
FastAPI Backend
      │
      ▼
Image Preprocessing
      │
      ▼
Deep Learning Model
      │
      ▼
Prediction & Confidence Score
      │
      ▼
Result Display
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/DeepShieldAI.git
cd DeepShieldAI
```

### Backend Setup

```bash
cd backend

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

Run backend:

```bash
uvicorn main:app --reload
```

---

### Frontend Setup

```bash
cd deepshield-ui

npm install
npm run dev
```

Application will run on:

```text
http://localhost:3000
```

---

## API Endpoint

### Predict Deepfake

```http
POST /predict
```

Request:

```json
{
  "image": "uploaded_file"
}
```

Response:

```json
{
  "prediction": "Fake",
  "confidence": 98.34
}
```

---

## Future Improvements

- Audio deepfake detection
- Video deepfake detection
- Explainable AI visualizations
- Batch image analysis
- Cloud deployment
- Defense-grade forensic reporting

---

## Applications

- Digital Forensics
- Media Verification
- Cybersecurity
- Intelligence Analysis
- Defense Communication Systems
- Misinformation Detection

---

## Disclaimer

This project is intended for research, educational, and digital forensics applications. Detection accuracy may vary depending on image quality, compression artifacts, and emerging generative AI techniques.

---

## Authors

Developed as part of the DeepShield AI project focusing on deepfake detection, digital trust, and AI-assisted forensic analysis.
