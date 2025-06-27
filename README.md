# MonoGPT

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.10-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-red?logo=pytorch&logoColor=white)](https://pytorch.org/)

> Author(s): Henry Yost (henry-AY), Jessy Garcia (jgarc826), Dmitry Sorokin (Dekamayaro)

A <ins>Generative Pre-trained Transformer</ins> (GPT) is a type of artificial intelligence that understands and generates human-like text. We will be using the <a href="https://pytorch.org/docs/stable/nn.html"><ins>PyTorch.nn</a> (Neural network) library</ins> which houses transformer architecture. The goal of MonoGPT is to output linguistic text similar to humans' capabilities. Ultimately, we want the model to produce undifferentiable english text (compared to a human). The majority and basis of the architecture come from Andrej Karpathy's <a href="https://github.com/karpathy/nanoGPT">nanoGPT</a> GitHub repo, however, all analyses and text files are independent and licensed uniquely.

## Installation & Usage
To install and run this project locally, please follow the written instructions below. Moreover, this installation guide assumes that you are working in a Python environment.

### 1. Fork the Repository
* Visit the GitHub repository: https://github.com/henry-AY/monoGPT.git
* Fork the repository to create your own copy.

### 2. Clone the Repository
```
git clone https://github.com/<your-username>/monoGPT.git
cd monoGPT
```

### 3. Install dependencies
Use `pip3` if python 3+ installation
```
pip install -r requirements.txt
```

### 4. Generate Sample Output
```
python3 GPT.py
```

This will allow you to run a sample output of the GPT.

## Project Language Roadmap

| Language | Status |
| ---------| -------|
| English Weights | ⏳ In Progress |
| GUI | ⬜ Not Started |

## Transformer Architecture used in MonoGPT
<p align="center">
  <img src="readme_files/Transformer.png" width="400" height="675"/>
</p>

The picture above is the transformer architecture as described and depicted in <a href="https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf"><i>Attention Is All You Need</i></a>. In essence, a transformer is a type of artificial intelligence model that learns and analyzes patterns in heaps of data to generate new output. Transformers are a current cutting-edge natural language processing (NLP) model relying on a different type of encoder-decoder architecture. Previous encoder-decoder architectures relied mainly on Recurrent Neural Networks (RNNs), however, Transformers can entirely remove said recurrence.

### <ins>Encoder Workflow</ins>

The figure below (the left half of the transformer) is the Encoder.
<p align="center">
  <img src="readme_files/Input_Transformer.png" width="200" height="475"/>
</p>

#### Step 1 - Input Embeddings

It is important to note that the embedding process only happens in the bottom-most encoder, not each encoder. The encoder begins by converting the input into tokens--words, subwords, or characters--into vectors using embedding layers. The embeddings capture the semantic meaning of the tokens and convert them into numerical vectors.

#### Step 2 - Positional Encoding

Because Transformers lack a recurrence mechanism such as Recurrent Neural Networks (RNNs), a mathematical approach must be applied to introduce position-specific patterns to each token in a sequence. This process is called 'Positional Encoding', where a combination of sine and cosine functions creates a positional vector.

<details>
<summary>Math Behind Positional Encoding (Click to expand) </summary>
<hr>

  ##### <b>Positional Encoding using Sine</b>
  $\ PE(\text{pos}, 2i) = \sin \left( \frac{\text{pos}}{10000 \cdot \left( \frac{2i}{d_{\text{model}}} \right)} \right) \$

  ##### <b>Positional Encoding using Cosine</b>
  $\ PE(\text{pos}, 2i + 1) = \cos \left( \frac{\text{pos}}{10000 \cdot \left( \frac{2i}{d_{\text{model}}} \right)} \right) \$

As mentioned above, the following functions allow the model to encode sequence order without recurrence. The sine function is used for even dimensions of the embedding vector, while the cosine for odd dimensions.

<hr>
</details>

#### Step 3 - Multi-Headed Self-Attention

The encoder utilizes a specialized attention mechanism known as self-attention. Self-attention is how the model relates each word in the input with other words. This step differs for each model, as some are token, word, or character-based (MonoGPT is a character-based encoder). 

This mechanism allows the encoder to concentrate on various parts of the input sequence while processing each token. Attention scores are calculated based on a query, key, and value concept (QKV). A QKV is analogous to a basic retrieval system that is most likely used in numerous websites you use daily.
* <b>Query:</b> A vector that represents a token from the input sequence in the attention mechanism.
* <b>Key:</b> A vector in the attention mechanism that corresponds to each token in the input sequence.
* <b>Value:</b> Each value is associated with a given key, and the value where the query and key have the highest attention score is the final output.

<details>
<summary>Derivation of Scaled Dot-Product Attention (Click to expand) </summary>
<hr>

Scaled dot-product attention is the attention mechanism used in transformers. The dot products are scaled down by $\sqrt{d_k}$. As mentioned above, Q represents the query, K represents a key, and V is a value. We are able to calculate the attention using the following formula:

$\ \text{Attention}(Q, K, V) = \text{Softmax}\left(\dfrac{QK^{T}}{\sqrt{d_k}}\right) \$

Assuming that d and k are $d_k$-dimensional vectors of independent random variables with a mean of 0 and a variance of 1, then the dot product of $d \cdot k$ has a mean of 0 and a variance of $d_k$. However, we prefer a variance of 1, therefore, we divide by $\sqrt{d_k}$.

<hr>
</details>

#### Step 4 - Output of the Encoder

The final encoder layer outputs a set of vectors, each representing a deep contextual understanding of the input sequence. These output vectors are passed in as the input for the decoder in a Transformer model. The process of encoding 'paves the path' for the decoder to produce a sequence based on the words, tokens, or characters with the highest attention. Moreover, a unique characteristic of the encoder is that you can have <i>N</i> encoder layers. Each layer is an independent neural network per se, which can explore and learn unique sides of attention, resulting in a significantly more diverse conclusion.

### <ins>Decoder Workflow</ins>

The figure below (the right half of the transformer) is the Decoder
<p align="center">
  <img src="readme_files/Decoder_Transformer.png" width="200" height="675"/>
</p>

The decoder in a Transformer model is responsible for generating text sequences and consists of sub-layers similar to the encoder, including two multi-headed attention layers, a pointwise feed-forward layer, residual connections, and layer normalization. Each multi-headed attention layer has a distinct function, and the decoding process concludes with a linear layer and a softmax function to determine word probabilities.

Operating in an autoregressive manner, the decoder begins with a start token and utilizes previously generated outputs along with rich contextual information from the encoder. This decoding process continues until it produces a token that signifies the end of output generation.

#### Step 1 - Output Embeddings

At the beginning of the decoder's process, it closely resembles that of the encoder. In this stage, the input is first processed through an embedding layer.

#### Step 2 - Positional Encoding

After the embedding stage, the input is processed through a positional encoding layer, which generates positional embeddings. These embeddings are then directed into the first multi-head attention layer of the decoder, where attention scores specific to the decoder's input are calculated.

#### Step 3 - Multi-Headed Self-Attention

This process resembles the self-attention mechanism in the encoder, but with an important distinction: it restricts positions from attending to future positions. As a result, each word in the sequence remains uninfluenced by future tokens.

<p align="center">
  <img src="readme_files/Masked_Scores.png" width="650" height="200"/>
</p>

#### Step 4 - Output of the Decoder

The output from the final layer is converted into a predicted sequence using a linear layer followed by a softmax function to produce probabilities for each word in the vocabulary.

During operation, the decoder adds the newly generated output to its existing input list and continues the decoding process. This iterative cycle continues until the model identifies a specific token that indicates the end of the sequence. The token with the highest probability is designated as the final output, commonly represented by the end token.

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
