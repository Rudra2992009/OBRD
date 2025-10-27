from fastapi import FastAPI, File
import torch, uvicorn
from PIL import Image
import io
from yolov8 import YOLO  # example import of any heavy models
app = FastAPI()

# Load multiple heavy models once
models = [
    YOLO("yolov8x.pt"),
    # + add 30–40 models of your choice here
]

@app.post("/detect")
async def detect(file: bytes = File(...)):
    img = Image.open(io.BytesIO(file))
    results = []
    for m in models:
        p = m.predict(img)
        for det in p:
            results.append({"class": det["name"], "score": float(det["conf"]), "bbox": det["bbox"], "src": m.name})
    results = sorted(results, key=lambda x: x["score"], reverse=True)
    return results[:20]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8500)
