import os
import copy
import torch
import torch.nn as nn
import matplotlib.pyplot as plt

from torchvision import datasets
from torchvision import transforms
from torchvision.models import efficientnet_b0

from torch.utils.data import DataLoader
from sklearn.metrics import classification_report


# ==========================
# CONFIG
# ==========================

TRAIN_DIR = "dataset/train"
TEST_DIR = "dataset/test"
MODEL_PATH = "models/deepfake_detector.pth"
BATCH_SIZE = 32
EPOCHS = 12
LR = 3e-5


# ==========================
# DEVICE
# ==========================

device = torch.device(
    "mps"
    if torch.backends.mps.is_available()
    else "cpu"
)

print(f"Using: {device}")

# ==========================
# TRANSFORMS
# ==========================

train_transform = transforms.Compose([

    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(
        brightness=0.2,
        contrast=0.2

    ),

    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )

])


test_transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )

])


# ==========================
# DATASET
# ==========================

train_dataset = datasets.ImageFolder(
    TRAIN_DIR,
    transform=train_transform

)

test_dataset = datasets.ImageFolder(
    TEST_DIR,
    transform=test_transform

)


print("\nClasses:")
print(train_dataset.classes)
print(train_dataset.class_to_idx)

# ==========================
# DATALOADERS
# ==========================

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=0
)


test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0
)


# ==========================
# MODEL
# ==========================
model = efficientnet_b0(
    weights='DEFAULT'
)


for param in model.features.parameters():
    param.requires_grad = False

model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    2
)


model = model.to(device)

# ==========================
# LOSS + OPTIMIZER
# ==========================

criterion = nn.CrossEntropyLoss()


optimizer = torch.optim.Adam(
    model.parameters(),
    lr=LR

)


# ==========================
# VALIDATION FUNCTION
# ==========================

def evaluate():
    model.eval()
    correct = 0
    total = 0
    y_true = []
    y_pred = []


    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            preds = outputs.argmax(1)
            correct += (

                preds == labels

            ).sum().item()


            total += labels.size(0)


            y_true.extend(

                labels.cpu().numpy()

            )


            y_pred.extend(

                preds.cpu().numpy()

            )


    accuracy = 100 * correct / total


    return accuracy, y_true, y_pred


# ==========================
# TRAINING LOOP
# ==========================

best_acc = 0

best_model = None


train_acc_history = []

val_acc_history = []


for epoch in range(EPOCHS):

    model.train()


    correct = 0

    total = 0

    running_loss = 0


    for images, labels in train_loader:

        images = images.to(device)

        labels = labels.to(device)


        optimizer.zero_grad()


        outputs = model(images)


        loss = criterion(

            outputs,

            labels

        )


        loss.backward()

        optimizer.step()

        running_loss += loss.item()
        preds = outputs.argmax(1)


        correct += (
            preds == labels
        ).sum().item()
        total += labels.size(0)


    train_acc = (

        100 * correct / total

    )


    val_acc, _, _ = evaluate()


    train_acc_history.append(

        train_acc

    )


    val_acc_history.append(

        val_acc

    )


    print(

        f"Epoch {epoch+1}/{EPOCHS}"

        f" | Train: {train_acc:.2f}%"

        f" | Validation: {val_acc:.2f}%"

    )


    if val_acc > best_acc:

        best_acc = val_acc

        best_model = copy.deepcopy(

            model.state_dict()

        )


# ==========================
# SAVE MODEL
# ==========================

os.makedirs(

    "models",

    exist_ok=True

)


torch.save(

    best_model,

    MODEL_PATH

)


print(
    f"\nBest Accuracy: {best_acc:.2f}%"
)


print(
    "\nModel Saved"
)


# ==========================
# FINAL REPORT
# ==========================

model.load_state_dict(
    best_model
)


_, y_true, y_pred = evaluate()
print(
    classification_report(
        y_true,
        y_pred
    )

)


# ==========================
# PLOT
# ==========================
plt.figure(
    figsize=(10,5)
)


plt.plot(

    train_acc_history,

    label="Train"

)


plt.plot(

    val_acc_history,
    label="Validation"

)


plt.xlabel(
    "Epoch"
)


plt.ylabel(
    "Accuracy"

)

plt.legend()
plt.grid(True)
plt.show()