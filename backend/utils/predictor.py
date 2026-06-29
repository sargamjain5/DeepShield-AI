import torch
import torch.nn as nn

from PIL import Image
from torchvision.models import efficientnet_b0

from utils.preprocess import transform


# -------------------------
# Device
# -------------------------

device = torch.device(
    "mps" if torch.backends.mps.is_available() else "cpu"
)


# -------------------------
# Model
# -------------------------

model = efficientnet_b0(weights=None)

model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    2
)

model.load_state_dict(
    torch.load(
        "models/deepfake_detector.pth",
        map_location=device
    )
)

model.to(device)
model.eval()


# -------------------------
# Prediction
# -------------------------

CLASS_NAMES = {
    1: "FAKE",
    0: "REAL"
}


def predict(image_path):

    image = Image.open(image_path).convert("RGB")

    image = transform(image)

    image = image.unsqueeze(0).to(device)

    with torch.no_grad():

        outputs = model(image)

        probabilities = torch.softmax(outputs, dim=1)

        confidence, prediction = torch.max(probabilities, dim=1)

    return (
        CLASS_NAMES[prediction.item()],
        confidence.item()
    )