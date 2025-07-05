import uvicorn
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from train import main as train_main
from GPT import generate_token, generate_text, model  # reuse your generate function

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
    model, _ = train_main(num_user_epochs=epochs)
    return {"status": "training complete", "trained_epochs": epochs}

@app.post("/generate")
def generate_endpoint(req: GenerateRequest):
    result = generate_text(req.prompt, max_tokens=req.max_tokens)
    return {"output": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 
    
