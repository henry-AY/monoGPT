import api from './api';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import linkedinIcon from './icons/linkedin.png';
import githubIcon from './icons/github.png';
import Aurora from './Aurora';
import GradientText from './GradientText';


export default function App() {
  const [mode, setMode] = useState(null); // "train" or "generate"
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState("");

  const handleTrain = () => {
    setMode("train");
    setProgress(0);
    setOutput("");
  
    const eventSource = new EventSource("http://localhost:8000/train-progress?epochs=1");
  
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
  
      // If training is complete
      if (data.done) {
        setMode(null);
        eventSource.close();
        console.log("Training completed.");
      } else {
        // Update progress bar
        setProgress(data.progress);
  
        // Optionally show loss or other info in the UI
        console.log(`Epoch ${data.epoch}, Iter ${data.iter}, Loss: ${data.train_loss}`);
      }
    };
  
    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
      setMode(null);
    };
  };  

  const handleGenerate = async () => {
    setMode("generate");
    setProgress(0);
    setOutput("");
  
    try {
      const res = await api.post('/generate', {
        prompt: "The Prince",
        max_tokens: 500,
      });
  
      // Simulate progress
      setTimeout(() => {
        setProgress(100);
        setOutput(res.data.output);
        setMode(null);
      }, 3000);
  
    } catch (err) {
      console.error("Generation error:", err);
    }
  };
  

  return (
    <>
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.8}
        amplitude={0.5}
        speed={0.75}
      />

      <motion.div
        className="sidebar"
        initial={{ width: "30px" }}
        whileHover={{ width: "250px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="sidebar-content">
          <h2>MonoGPT</h2>
          <hr></hr>
          <p>LLM-monoGPT is a large language model generative Pre-trained Transformer using neural networks and transformer architecture to generate human-like english text.</p>

          <p>Currently, the model has around ~85.1M paramaters! </p>

          <p>My inspiration for the project came from <a href="https://github.com/karpathy/nanoGPT">nanoGPT</a> by Andrej Karpathy, which I used as the base. I expanded upon nanoGPT, by designined a GUI, tweaking the hyperparamters, and building upon the existing structure such as implementing epoch checkpoints. </p>

          <h3>Features</h3>
          <ul className="sidebar-list">
            <li>Character-level tokenization and generation</li>
            <li>Model weights trained from scratch using PyTorch</li>
            <li>Model weights saved as checkpoints and final</li>
            <li>React and Node.js frontend</li>
            <li>AWS Integration Plan</li> 
          </ul>

          <h3>Tech Stack</h3>
          <ul className="sidebar-list">
            <li>React + Framer Motion</li>
            <li>WebGL(OGL)</li>
            <li>PyTorch + Python (Backend)</li>
          </ul>

          <p className="author">Author: henry-AY</p>

          <div className="social-icons">
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
            <a href="https://github.com/henry-AY" target="_blank" rel="noopener noreferrer">
              <img src={githubIcon} alt="GitHub" />
            </a>
          </div>
          <p className="date">Created: Jun 27, 2025</p>
        </div>

        <div className="sidebar-tech-icons">
          <img src="/logos/python.svg" alt="Python" title="Python" /> 
          <img src="/logos/pytorch.svg" alt="PyTorch" title="PyTorch" />
          <img src="/logos/numpy.svg" alt="NumPy" title="NumPy" />
          <img src="/logos/webgl.svg" alt="WebGL" title="WebGL" />
          <img src="/logos/react.svg" alt="React" title="React" />
          <img src="/logos/fastapi.svg" alt="FastAPI" title="FastAPI" />
          <img src="/logos/axios.svg" alt="Axios" title="Axios" />
        </div>
      </motion.div>

      <div className="hero-section">
        <h1 className="title">Welcome to MonoGPT!</h1>
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={5}
          showBorder={false}
          className="scroll-prompt"
        >
          Scroll down to generate
        </GradientText>
      </div>

      <div className="main-section">
        <div className="controls-container">
          <div className="button-row">
            <motion.button
              className="circle-button"
              whileTap={{ scale: 0.95 }}
              onClick={handleTrain}
            >
              Train
            </motion.button>
            <motion.button
              className="circle-button"
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
            >
              Generate
            </motion.button>
          </div>

          {mode && (
            <motion.div className="action-status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {mode === "train" ? "Training..." : "Generating..."}
              <div className="progress-circle">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </motion.div>
          )}

          {output && (
            <motion.div className="output-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {output}
            </motion.div>
          )}
        </div>
      </div>

      <div style={{ height: '40vh' }} />

      <div className="footer-stats">
        <p>Validation Loss: 0.012 &nbsp; | &nbsp; Training Loss: 0.018 &nbsp; | &nbsp; Epoch: 12 &nbsp; | &nbsp; Params: 85.1M</p>
      </div>

    </>
  );
}