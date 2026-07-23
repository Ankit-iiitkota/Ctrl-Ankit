import React, { useState, useEffect } from 'react'
import { Play, RotateCcw, Brain, Activity, Settings, HelpCircle } from 'lucide-react'

interface Connection {
  from: string
  to: string
  weight: number
}

export const AIPlayground: React.FC = () => {
  const [learningRate, setLearningRate] = useState(0.05)
  const [hiddenNodes, setHiddenNodes] = useState(4)
  const [epochs, setEpochs] = useState(200)
  
  // Training state
  const [isTraining, setIsTraining] = useState(false)
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [loss, setLoss] = useState(0.68)
  const [accuracy, setAccuracy] = useState(0.12)
  const [lossHistory, setLossHistory] = useState<number[]>([0.68])
  
  // Custom inputs
  const [inputVal1, setInputVal1] = useState(0.5)
  const [inputVal2, setInputVal2] = useState(0.8)
  const [prediction, setPrediction] = useState<number | null>(null)

  // Simulation parameters
  const [weights, setWeights] = useState<Connection[]>([])

  // Initialize synapses weights
  const initWeights = () => {
    const newWeights: Connection[] = []
    
    // Inputs (2) to Hidden (N)
    for (let i = 1; i <= 2; i++) {
      for (let h = 1; h <= hiddenNodes; h++) {
        newWeights.push({
          from: `in-${i}`,
          to: `hid-${h}`,
          weight: Math.random() * 2 - 1
        })
      }
    }
    
    // Hidden (N) to Output (1)
    for (let h = 1; h <= hiddenNodes; h++) {
      newWeights.push({
        from: `hid-${h}`,
        to: `out-1`,
        weight: Math.random() * 2 - 1
      })
    }
    
    setWeights(newWeights)
  }

  useEffect(() => {
    initWeights()
    setLossHistory([0.68])
    setLoss(0.68)
    setAccuracy(0.12)
    setPrediction(null)
  }, [hiddenNodes])

  // Neural network training execution loop
  const handleTrain = () => {
    if (isTraining) return
    setIsTraining(true)
    setCurrentEpoch(0)
    
    let epoch = 0
    let tempLoss = 0.68
    let tempAcc = 0.12
    const hist: number[] = [0.68]

    const interval = setInterval(() => {
      epoch += Math.max(1, Math.floor(epochs / 30)) // speed up epochs rendering
      
      // Calculate loss reduction dynamically (simulating training descent)
      const ratio = epoch / epochs
      tempLoss = 0.68 * Math.exp(-ratio * 3.5) + (Math.random() * 0.02)
      tempAcc = 0.12 + 0.85 * (1 - Math.exp(-ratio * 4.0)) + (Math.random() * 0.01)
      
      setCurrentEpoch(Math.min(epoch, epochs))
      setLoss(Number(tempLoss.toFixed(3)))
      setAccuracy(Number(Math.min(tempAcc * 100, 99.2).toFixed(1)))
      
      hist.push(tempLoss)
      setLossHistory([...hist])

      // Randomize weights during training to animate line visual values
      setWeights((prev) =>
        prev.map((w) => ({
          ...w,
          weight: w.weight + (Math.random() - 0.5) * learningRate
        }))
      )

      if (epoch >= epochs) {
        clearInterval(interval)
        setIsTraining(false)
      }
    }, 40)
  }

  // Clear weights back to base
  const handleReset = () => {
    initWeights()
    setLossHistory([0.68])
    setLoss(0.68)
    setAccuracy(0.12)
    setCurrentEpoch(0)
    setPrediction(null)
  }

  const handlePredict = () => {
    // Simulated prediction using active dynamic weights
    let output = 0.0
    for (let h = 1; h <= hiddenNodes; h++) {
      const w1 = weights.find(w => w.from === 'in-1' && w.to === `hid-${h}`)?.weight || 0.5
      const w2 = weights.find(w => w.from === 'in-2' && w.to === `hid-${h}`)?.weight || 0.5
      const wOut = weights.find(w => w.from === `hid-${h}` && w.to === 'out-1')?.weight || 0.5
      
      // Node activation (sigmoid simulation)
      const hNodeVal = Math.tanh(inputVal1 * w1 + inputVal2 * w2)
      output += hNodeVal * wOut
    }
    
    // Scale prediction result between 0 and 1
    const finalVal = Math.min(Math.max((Math.tanh(output) + 1) / 2, 0.02), 0.99)
    setPrediction(Number(finalVal.toFixed(3)))
  }

  return (
    <section
      id="playground"
      className="relative w-full py-24 px-6 border-b border-white/5 bg-[#0a0a0c] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
            05 &bull; Artificial Intelligence
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mt-2">
            Interactive AI Playground
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 mt-4 mx-auto md:mx-0 rounded-full" />
        </div>

        {/* Console layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Panel (Left column) */}
          <div className="lg:col-span-4 bg-slate-950/20 glassmorphism p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Settings className="text-accent-400" size={16} />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-200">Hyperparameters</h3>
              </div>

              {/* Learning rate */}
              <div>
                <div className="flex justify-between text-2xs text-slate-400 font-matrix mb-2">
                  <span>LEARNING RATE (η)</span>
                  <span>{learningRate}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={learningRate}
                  disabled={isTraining}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
              </div>

              {/* Hidden Layer Nodes */}
              <div>
                <div className="flex justify-between text-2xs text-slate-400 font-matrix mb-2">
                  <span>HIDDEN NODES</span>
                  <span>{hiddenNodes} nodes</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={hiddenNodes}
                  disabled={isTraining}
                  onChange={(e) => setHiddenNodes(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
              </div>

              {/* Epoch count */}
              <div>
                <div className="flex justify-between text-2xs text-slate-400 font-matrix mb-2">
                  <span>EPOCHS</span>
                  <span>{epochs} epochs</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={epochs}
                  disabled={isTraining}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleTrain}
                disabled={isTraining}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-accent-600 to-accent-400 hover:from-accent-500 hover:to-accent-300 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-accent-600/10"
              >
                <Play size={14} /> Train Model
              </button>
              <button
                onClick={handleReset}
                disabled={isTraining}
                className="p-3 bg-slate-950/60 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reset Weights"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Visual Model Canvas (Center column) */}
          <div className="lg:col-span-5 bg-slate-950/20 glassmorphism p-6 rounded-2xl border border-white/5 flex flex-col justify-between relative min-h-[360px]">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Brain className="text-accent-400" size={16} />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-200">Neural Network Map</h3>
              </div>
              
              {/* Active pulse tag */}
              {isTraining && (
                <span className="text-[9px] font-bold font-matrix text-accent-400 animate-pulse">TRAINING...</span>
              )}
            </div>

            {/* Nodes Visual SVG Area */}
            <div className="relative flex-1 w-full min-h-[220px] flex justify-between items-center px-4 py-8 select-none">
              
              {/* Connections lines layer (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {weights.map((w, idx) => {
                  const fromEl = document.getElementById(w.from)
                  const toEl = document.getElementById(w.to)
                  const parentEl = fromEl?.parentElement
                  
                  if (!fromEl || !toEl || !parentEl) return null
                  
                  const pRect = parentEl.getBoundingClientRect()
                  const fRect = fromEl.getBoundingClientRect()
                  const tRect = toEl.getBoundingClientRect()
                  
                  const x1 = fRect.left - pRect.left + fRect.width / 2
                  const y1 = fRect.top - pRect.top + fRect.height / 2
                  const x2 = tRect.left - pRect.left + tRect.width / 2
                  const y2 = tRect.top - pRect.top + tRect.height / 2
                  
                  // Color depends on weight (positive positive cyan, negative red/purple)
                  const strokeColor = w.weight > 0 
                    ? `rgba(6, 182, 212, ${Math.min(Math.abs(w.weight), 0.7)})` 
                    : `rgba(168, 85, 247, ${Math.min(Math.abs(w.weight), 0.7)})`

                  return (
                    <g key={idx}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={strokeColor}
                        strokeWidth={Math.max(Math.abs(w.weight) * 3, 1)}
                      />
                      {isTraining && (
                        <circle
                          r="2"
                          fill="#ffffff"
                          className="animate-[pulse_1s_infinite]"
                        >
                          <animateMotion
                            path={`M ${x1} ${y1} L ${x2} ${y2}`}
                            dur={`${1 - learningRate * 1.5}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Input Nodes (2) */}
              <div className="flex flex-col gap-10 z-10">
                <div id="in-1" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">X₁</div>
                <div id="in-2" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">X₂</div>
              </div>

              {/* Hidden Nodes (N) */}
              <div className="flex flex-col gap-6 z-10">
                {Array.from({ length: hiddenNodes }).map((_, i) => (
                  <div
                    key={i}
                    id={`hid-${i + 1}`}
                    className="w-7 h-7 rounded-full bg-slate-900 border border-accent-500/40 flex items-center justify-center text-[10px] text-accent-300"
                  >
                    H{i + 1}
                  </div>
                ))}
              </div>

              {/* Output Nodes (1) */}
              <div className="flex flex-col z-10">
                <div id="out-1" className="w-9 h-9 rounded-full bg-slate-900 border border-emerald-500/40 flex flex-col items-center justify-center text-xs font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  Y
                </div>
              </div>

            </div>

            {/* Bottom status */}
            <div className="flex items-center justify-between border-t border-white/5 pt-3 text-2xs font-matrix text-slate-500">
              <span>ACCURACY: {accuracy}%</span>
              <span>LOSS: {loss}</span>
            </div>
          </div>

          {/* Performance Chart & Testing (Right column) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Realtime Loss Plot */}
            <div className="bg-slate-950/20 glassmorphism p-5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 mb-3 text-2xs text-slate-400 font-matrix uppercase">
                <Activity size={12} className="text-accent-400" /> Loss Convergence
              </div>
              
              {/* Dynamic SVG chart */}
              <div className="w-full h-24 bg-slate-950/50 border border-white/5 rounded-lg overflow-hidden flex items-end p-2">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  {lossHistory.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="hsl(var(--accent-hue) var(--accent-saturation) 60%)"
                      strokeWidth="1.5"
                      points={lossHistory
                        .map((l, idx) => {
                          const x = (idx / (lossHistory.length - 1)) * 100
                          // Map loss [0.68 - 0.0] to Y [36 - 4]
                          const y = 36 - ((l) / 0.68) * 32
                          return `${x},${y}`
                        })
                        .join(' ')}
                    />
                  )}
                </svg>
              </div>
              
              <div className="flex justify-between text-3xs text-slate-500 font-matrix mt-1">
                <span>EPOCH 0</span>
                <span>EPOCH {currentEpoch}</span>
              </div>
            </div>

            {/* Inferences testing */}
            <div className="bg-slate-950/20 glassmorphism p-5 rounded-2xl border border-white/5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-4 text-2xs text-slate-400 font-matrix uppercase">
                  <HelpCircle size={12} className="text-accent-400" /> Predictor Test
                </div>

                <div className="flex flex-col gap-3">
                  {/* Input 1 */}
                  <div>
                    <div className="flex justify-between text-3xs text-slate-500 font-matrix mb-1">
                      <span>INPUT X₁</span>
                      <span>{inputVal1}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.1"
                      value={inputVal1}
                      onChange={(e) => setInputVal1(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-500"
                    />
                  </div>

                  {/* Input 2 */}
                  <div>
                    <div className="flex justify-between text-3xs text-slate-500 font-matrix mb-1">
                      <span>INPUT X₂</span>
                      <span>{inputVal2}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.1"
                      value={inputVal2}
                      onChange={(e) => setInputVal2(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-500"
                    />
                  </div>
                </div>
              </div>

              {/* Prediction result outputs */}
              <div className="mt-6">
                <button
                  onClick={handlePredict}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-white/10 text-2xs font-bold font-display uppercase tracking-widest text-slate-300 transition-colors cursor-pointer"
                >
                  Forward Propagate
                </button>

                {prediction !== null && (
                  <div className="mt-3 bg-slate-950/80 border border-white/5 rounded-lg p-3 text-center">
                    <div className="text-[10px] text-slate-500 font-matrix uppercase tracking-wider">Output Class Activation</div>
                    <div className="text-lg font-black font-display text-emerald-400 mt-1">{prediction}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      Prediction: {prediction > 0.5 ? 'Class Alpha (>= 0.5)' : 'Class Beta (< 0.5)'}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
export default AIPlayground
