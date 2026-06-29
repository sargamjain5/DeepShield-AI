"use client";

import { useState } from "react";
import { Shield, Upload, RefreshCw, AlertTriangle, CheckCircle, Search } from "lucide-react";

interface PredictionData {
  label: "REAL" | "FAKE";
  confidence: number;
}

export default function DeepShieldAI() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const runAnalysis = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult({ label: data.label, confidence: data.confidence });
      } else {
        setError(data.error || "An analysis error occurred.");
      }
    } catch (err) {
      setError("Could not establish a connection to the backend AI layer.");
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* App Branding Header */}
      <header className="text-center mb-8 max-w-xl animate-fade-in">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl text-white flex items-center justify-center gap-3">
          <Shield className="w-10 h-10 text-indigo-500 animate-pulse" />
          DeepShield AI
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base">
          Deepfake Image Detector. Upload an asset to run structural pattern verification.
        </p>
      </header>

      {/* Main Container Dashboard */}
      <main className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl grid md:grid-cols-2 gap-8">
        
        {/* Left Side: Upload Interface and Preview */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-200 tracking-wide">📷 Upload Asset</h2>
            {preview && (
              <button 
                onClick={resetScanner} 
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          
          <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition relative min-h-[300px] overflow-hidden group">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={loading} />
            
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Target File Layout" className="w-full h-full max-h-72 object-contain rounded-lg" />
            ) : (
              <div className="text-center space-y-3 p-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto border border-slate-800 group-hover:border-indigo-500 transition">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition" />
                </div>
                <p className="text-sm font-semibold text-slate-300">Click or Drag & Drop image</p>
                <p className="text-xs text-slate-500">Supports PNG, JPG, or JPEG formats</p>
              </div>
            )}
          </label>

          <button
            onClick={runAnalysis}
            disabled={!file || loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/10 tracking-wide flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing Matrix Inferences...
              </>
            ) : (
              "Run Authenticity Check"
            )}
          </button>
        </div>

        {/* Right Side: AI Analytics and Realtime Output */}
        <div className="flex flex-col gap-4 justify-between">
          <h2 className="text-lg font-bold text-slate-200 tracking-wide">🧠 Inference Log</h2>

          <div className="flex-1 flex flex-col justify-center bg-slate-950/40 border border-slate-800 rounded-xl p-6 min-h-[300px]">
            {loading && (
              <div className="text-center space-y-3">
                <Search className="w-10 h-10 text-indigo-400 animate-bounce mx-auto" />
                <p className="text-sm text-indigo-400 font-medium">Scanning pixels for generative anomalies...</p>
              </div>
            )}

            {!loading && !result && !error && (
              <p className="text-center text-slate-500 text-sm max-w-xs mx-auto">
                Awaiting input target. Feed an image on the left to launch neural verification vectors.
              </p>
            )}

            {error && (
              <div className="border border-rose-500/20 bg-rose-500/10 p-4 rounded-xl text-rose-400 text-sm flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="font-bold block">Analysis Failed</span>
                  <p className="text-xs text-rose-400/80 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Verification Status UI */}
            {!loading && result && (
              <div className="space-y-6">
                
                {/* Confidence Threshold Rule Logic (< 80%) */}
                {result.confidence < 0.80 ? (
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Uncertain Matrix Analysis</p>
                      <p className="text-xs text-amber-400/80 mt-0.5">
                        The neural prediction layer could not confidently place this asset into a strict classification bracket.
                      </p>
                    </div>
                  </div>
                ) : result.label === "REAL" ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Verified Real Asset</p>
                      <p className="text-xs text-emerald-400/80 mt-0.5">
                        Structural texture profiles indicate standard geometric continuity. No diffusion markers found.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Deepfake Artifact Detected</p>
                      <p className="text-xs text-rose-400/80 mt-0.5">
                        High dimensional artifact match found. Severe alignment discrepancies identified in frequency domains.
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress Bar and Metrics Container */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence Rating</span>
                    <span className={`text-xl font-black ${result.label === "REAL" ? "text-emerald-400" : "text-rose-400"}`}>
                      {(result.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-out rounded-full ${
                        result.label === "REAL" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}