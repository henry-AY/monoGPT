import random
import sys
import torch
import torch.nn as nn
from model import BigramLanguageModel

import config
from pathlib import Path

with open(config.data, 'r', encoding='utf-8') as f:
    text = f.read()

chars = sorted(list(set(text)))
vocab_size = len(chars)

stoi = {ch : i for i, ch in enumerate(chars) }
itos = {i : ch for i, ch in enumerate(chars) }
encode = lambda s: [stoi[c] for c in s] # encoder: take a string, outut a list of integers
decode = lambda l: ''.join([itos[i] for i in l]) # decoder: take a list of integers, output a string

state_dict = config.BASE_DIR.parent / 'model' / 'final_model_weights.pth'

model = BigramLanguageModel(vocab_size).to(config.device)

model.load_state_dict(torch.load(state_dict, weights_only=True))
model.eval()

checkpoint_path = config.BASE_DIR.parent / 'model' / 'checkpoint.pth'
checkpoint = torch.load(checkpoint_path, weights_only=True)
curr_epoch = checkpoint['epoch']

def generate_token(token, max_tokens):
    input_ids = torch.tensor([encode(token)], dtype=torch.long).to(config.device)
    generated_ids = model.generate(input_ids, max_new_tokens=max_tokens)
    return (decode(generated_ids[0].tolist()))

def count_parameters(model):
    return sum(p.numel() for p in model.parameters())

def generate_text(prompt: str = "The Prince", max_tokens: int = 500):
    output = generate_token(prompt, max_tokens)
    return {
        "output": output,
        "epoch": curr_epoch,
        "parameters": count_parameters(model),
    }

if __name__ == "__main__":
    """ REPLACE WITH SINGLE SEED FOR REPEATABLE RESULTS """
    random_seed = random.randint(0, sys.maxsize - 1)
    torch.manual_seed(random_seed)  

    res = generate_text("The Prince", 500)
    print(f'\nRandom seed set to: {random_seed}\nEpoch: {res["epoch"]}')
    print(f'Total model parameters: {res["parameters"]:,}\n')

    output_path = config.BASE_DIR.parent / 'output' / 'text_logs' / 'output.txt'
    with open(output_path, 'a') as f:
        f.write(f'\nOutput @ Epoch: {res["epoch"]}\n{res["output"]}\n')

    print(res["output"])