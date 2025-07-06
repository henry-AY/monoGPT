import uvicorn
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import time
import json
import torch
import torch.nn as nn
from torch.nn import functional as F

from train import main as train_main
from train import train_generator as train_process
from train import checkpoint_path as path
from train import load_checkpoint as load
from GPT import model as global_model, update_model_weights
import config
from model import BigramLanguageModel
import GPT

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 100

@app.get("/")
def root():
    return {"message": "MonoGPT FastAPI server running!"}

@app.post("/train")
def train_model(epochs: int = Query(default=1, ge=1)):
    new_model, _ = train_main(num_user_epochs=epochs)
    GPT.update_model_weights(new_model)
    print(f"training complete from training request")  # server console log
    return {"status": "training complete", "trained_epochs": epochs}

@app.post("/generate")
def generate_endpoint(req: GenerateRequest):
    output = GPT.generate_token(req.prompt, max_tokens=req.max_tokens)
    print(f"generate complete from request")  # server console log
    return {"output": output}

@app.get("/train-progress")
def train_progress(epochs: int = Query(default=1, ge=1)):
    def event_stream():
        optimizer = torch.optim.AdamW(global_model.parameters(), lr=config.learning_rate)
        start_epoch, _ = load(path, global_model, optimizer)

        for update in train_process(global_model, optimizer, start_epoch, epochs):
            yield f"data: {json.dumps(update)}\n\n"
            time.sleep(0.05)

        # Final state already saved inside train_generator
        yield f"data: {json.dumps({'progress': 100, 'done': True})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 