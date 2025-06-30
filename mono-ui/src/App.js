import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import linkedinIcon from './icons/linkedin.png';
import githubIcon from './icons/github.png';
import Aurora from './Aurora'; // adjust path if needed

export default function App() {
  const [mode, setMode] = useState(null); // "train" or "generate"
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState("");

  const fakeTrain = () => {
    setMode("train");
    setOutput("");
    let i = 0;
    const interval = setInterval(() => {
      setProgress(i);
      if (i >= 100) {
        clearInterval(interval);
        setMode(null);
      }
      i += 5;
    }, 100);
  };

  const fakeGenerate = () => {
    setMode("generate");
    setProgress(0);
    setTimeout(() => {
      setProgress(100);
      setOutput("Here is the generated text: Lorem ipsum dolor sit amet...");
      setMode(null);
    }, 3000);
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

          <h3>Links</h3>
          <p>Inspiration: <a href="https://github.com/karpathy/nanoGPT">nanoGPT</a> by Andrej Karpathy</p>

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
      </motion.div>

      <div className="hero-section">
        <h1 className="title">Welcome to MonoGPT!</h1>
        <h2 className="scroll-hint">Scroll down to generate text</h2>
      </div>

      <div className="main-section">
        <div className="controls-container">
          <div className="button-row">
            <motion.button
              className="circle-button"
              whileTap={{ scale: 0.95 }}
              onClick={fakeTrain}
            >
              Train
            </motion.button>
            <motion.button
              className="circle-button"
              whileTap={{ scale: 0.95 }}
              onClick={fakeGenerate}
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