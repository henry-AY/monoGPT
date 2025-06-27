import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';

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
    <div className="app-container">
      <h1>🧠 monoGPT UI</h1>
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
        <motion.div
          className="action-status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {mode === "train" ? "Training..." : "Generating..."}
          <div className="progress-circle">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </motion.div>
      )}

      {output && (
        <motion.div
          className="output-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {output}
        </motion.div>
      )}
    </div>
  );
}
