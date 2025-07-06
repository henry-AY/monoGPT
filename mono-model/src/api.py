import uvicorn
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from train import main as train_main
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 
    
