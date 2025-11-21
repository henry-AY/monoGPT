# MonoGPT
> Author(s): Henry Yost (henry-AY), Jessy Garcia (jgarc826), Dmitry Sorokin (Dekamayaro)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.10-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-red?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![NumPy](https://img.shields.io/badge/NumPy-013243?logo=numpy&logoColor=white)](https://numpy.org/)
[![WebGL](https://img.shields.io/badge/WebGL-990000?logo=webgl&logoColor=white)](https://www.khronos.org/webgl/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

![MonoGPTshowcase_1280_20_fullcolor](https://github.com/user-attachments/assets/48741b1f-bc28-4af3-b46f-a8d00937dd4b)

MonoGPT is a locally hosted front-end application capable of training and generating output from custom-trained model weights. The interface is designed to be intuitive and interactive; users can initiate model training directly from the GUI or request text generation as well. Each action is visually represented in the UI through animations that illustrate the underlying back-end process. Additionally, MonoGPT does not use HuggingFace transformers, giving you complete control over the transformer(s) implementation with raw PyTorch code.

**Additional Info**: A <ins>Generative Pre-trained Transformer</ins> (GPT) is a type of artificial intelligence that understands and generates human-like text. We will be using the <a href="https://pytorch.org/docs/stable/nn.html"><ins>PyTorch.nn</a> (Neural network) library</ins> which houses transformer architecture. The goal of MonoGPT is to generate linguistic text that resembles human capabilities. Ultimately, we want the model to produce undifferentiable English text (compared to a human). The majority and basis of the architecture originates from Andrej Karpathy's <a href="https://github.com/karpathy/nanoGPT">nanoGPT</a> GitHub repository; however, all analyses and text files are independent and licensed separately.

If you are interested in reading more about the architecture of monoGPT, please refer to [ARCHITECTURE.md](https://github.com/henry-AY/monoGPT/blob/ea413814b004bf45ed3e5b44b3c686f4b9927998/ARCHITECTURE.md)

## Features + Tech Stack
* Character-level tokenization and generation
* Model weights trained from scratch using PyTorch
* Model weights saved as checkpoints and final
* React and Node.js frontend
* Works with custom datasets

| Layer        | Tech                                 |
|--------------|--------------------------------------|
| Frontend     | React.js, CSS, Framer Motion, WebGL  |
| Backend      | FastAPI, Python                      |
| ML Framework | PyTorch (`torch.nn`, transformers)   |
| Architecture | Custom GPT-like Transformer          |

## Installation & Usage
To install and run this project locally, please follow the written instructions below. 

> [!CAUTION]
> This guide assumes you have both Python (for the backend + ML engine) and Node.js (for the frontend GUI). The setup assumes you're comfortable working in a terminal with virtual environments or Node package managers.

### Prerequisites

Ensure you have the following installed:

- Python 3.8+
- pip or pipenv
- Node.js
- npm
- GitLFS

### ⚠️ Required: Install Git LFS Before Cloning

The model weights are stored using Git Large File Storage (Git LFS). If Git LFS is not installed before cloning, the model directory will contain pointer files instead of actual weights, and the model will fail to load.

#### Install Git LFS

macOS (Homebrew)
```bash
brew install git-lfs
git lfs install
```

### Linux
```bash
sudo apt-get install git-lfs
git lfs install
```

### 1. Fork + Clone Repo
```bash
git clone https://github.com/<your-username>/monoGPT.git
cd monoGPT
```

### 2. Create a virtual environment (optional, but highly recommended in this instance)
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Backend + Launch
```bash
cd mono-model/src
uvicorn api:app --host 0.0.0.0 --port 8000;
```

### 5. Frontend + Setup

To run the frontend locally, open a new terminal window, leaving the previous backend running:

```bash
cd mono-ui
npm install                      # install all frontend packages
npm install framer-motion axios  # in case not already installed
npm start
```

This should open a new window on your browser @ 'http://localhost:3000/'

If everything is done correctly, both the frontend and backend should be communicating with each other.

You'll be able to:
- Trigger training via GUI
- Generate text interactively
- Watch real-time feedback animations

## Training and Sample Output (CLI)

### 1. Generate Sample Output

If you want to test model output via cmd line:

First, navigate to the `mono-model/src` directory (if not already in it).

```bash
python3 GPT.py
```

This will generate text from your currently trained weights.

### 2. Train the Model

Update your dataset/configs in `config.py`, then navigate to `mono-model/src` directory (if not already in it).

```bash
python3 train.py
```

This will save the model weights in `mono-model/model` folder, which are accessible for text generation. 

## References

<a href="https://github.com/karpathy/nanoGPT">nanoGPT</a> (Andrej Karpathy), <a href="https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf"><i>Attention Is All You Need</i></a>, <a href="https://www.gutenberg.org/"><i>Project Gutenberg</i></a>


## Model Training Analysis

#### 2/21/25

To normalize the training loss and validation loss, we averaged the values [(trainloss + valloss) / 2] to get a loss graph, which follows a typical and expected loss curve. There is a rapid drop, which is expected because the model is learning the basic patterns in the data. At t = ~1000, we see a noticeable increase in the flattening of the curve (especially compared to t = ~500). This could mean that the model is beginning to converge. At t = ~1500 to 2800 iterations, the loss stabilizes quite significantly, which possibly indicates diminishing returns of the training, and the model is near convergence. To address this, we plan to train on a new dataset and adjust the hyperparameters.  

<p align="center">
  <img src="readme_files/trainloss_valloss_graph.png" width="" height=""/>
</p>


#### 4/6/25

In this 20-epoch training of our model, we initially observe a high training and validation loss at the first step, which is typical as the model begins without prior learning. A rapid decline in loss follows immediately as the model quickly learns fundamental patterns in the data. For the majority of the training period, the training and validation losses closely track each other, indicating consistent learning.

However, at later epochs, around step 15,000, the validation loss stops decreasing and becomes stagnant while the training loss continues a gradual decline. This emerging gap between training and validation performance suggests the model is beginning to learn training data specifics rather than generalizable patterns, which is indicative of early-stage overfitting.

Therefore, while the model exhibits only mild overfitting tendencies towards the end of training, this warrants exploring techniques such as regularization, early stopping, or learning rate scheduling to enhance the performance of the model.

<p align="center">
  <img src="readme_files/train_loss and val_loss_20EPOCH.png" width="" height=""/>
</p>
