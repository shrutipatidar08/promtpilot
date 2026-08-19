import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Play, 
  Star, 
  Trash2, 
  RotateCw, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PromptLog, RunPromptResponse } from '../types';

export const PromptDetailModal: React.FC = () => {
  const { 
    selectedLog, 
    setSelectedLog, 
    toggleFavoriteLog, 
    deleteLog, 
    openOptimizerWithText, 
    settings,
    showToast 
  } = useApp();

  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<RunPromptResponse | null>(null);

  if (!selectedLog) return null;

  const handleCopy = (text: string, type: 'orig' | 'opt') => {
    navigator.clipboard.writeText(text);
    if (type === 'orig') {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedOptimized(true);
      setTimeout(() => setCopiedOptimized(false), 2000);
    }
    showToast('Prompt copied to clipboard');
  };

  const handleRunExecution = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/run-prompt', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(settings.apiKeys.google ? { 'x-gemini-api-key': settings.apiKeys.google } : {})
        },
        body: JSON.stringify({
          prompt: selectedLog.optimizedPrompt,
          model: selectedLog.model,
          temperature: settings.temperature || 0.7,
          apiKey: settings.apiKeys.google,
        }),
      });
      const data: RunPromptResponse = await res.json();
      setTestOutput(data);
      showToast('Live test completed');
    } catch (e: any) {
      showToast('Execution error: ' + e.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
      <div className="bg-[#131315] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#18181A] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 font-bold flex items-center justify-center text-sm shadow-inner">
              {selectedLog.score.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2A2A2C] text-[#DEC1AF]">
                  {selectedLog.category}
                </span>
                <span className="text-xs font-medium text-white">{selectedLog.model}</span>
                <span className="text-xs text-[#6E645F]">• {selectedLog.timestamp}</span>
              </div>
              <p className="text-xs text-[#9B8E87] mt-0.5">Prompt iteration record ID: {selectedLog.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteLog(selectedLog.id)}
              className={`p-2 rounded-lg border border-white/10 transition-colors ${
                selectedLog.isFavorite ? 'text-amber-400 bg-amber-950/20' : 'text-[#9B8E87] hover:text-white'
              }`}
            >
              <Star className={`w-4 h-4 ${selectedLog.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => deleteLog(selectedLog.id)}
              className="p-2 rounded-lg border border-white/10 text-[#9B8E87] hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedLog(null)}
              className="p-2 rounded-lg text-[#9B8E87] hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Side by side prompt comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Original */}
            <div className="bg-[#18181A] border border-white/5 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-semibold text-[#9B8E87] uppercase tracking-wider">Original Input</span>
                <span className="text-[11px] text-[#6E645F]">~{selectedLog.originalTokens} tokens</span>
              </div>
              <p className="text-xs text-[#D2C4BC] leading-relaxed flex-1 whitespace-pre-wrap font-mono">
                {selectedLog.originalPrompt}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleCopy(selectedLog.originalPrompt, 'orig')}
                  className="text-xs text-[#9B8E87] hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#201F21] hover:bg-[#2A2A2C] transition-colors"
                >
                  {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedOriginal ? 'Copied' : 'Copy Original'}</span>
                </button>
              </div>
            </div>

            {/* Optimized */}
            <div className="bg-[#18181A] border border-[#5E4634]/40 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-semibold text-[#DEC1AF] uppercase tracking-wider">Optimized Master Prompt</span>
                <span className="text-[11px] text-[#DEC1AF]">~{selectedLog.optimizedTokens} tokens</span>
              </div>
              <p className="text-xs text-white leading-relaxed flex-1 whitespace-pre-wrap font-mono select-text">
                {selectedLog.optimizedPrompt}
              </p>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => handleCopy(selectedLog.optimizedPrompt, 'opt')}
                  className="text-xs text-[#DEC1AF] hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#3D2B1F] hover:bg-[#5E4634] transition-colors"
                >
                  {copiedOptimized ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedOptimized ? 'Copied' : 'Copy Optimized'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rationale & Techniques */}
          <div className="bg-[#18181A] border border-white/5 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DEC1AF]">Engineering Analysis & Rationale</h4>
            <p className="text-xs text-[#D2C4BC] leading-relaxed">
              {selectedLog.rationale || 'Engineered using structured role framing, explicit formatting constraints, and domain-calibrated prompt anchoring.'}
            </p>

            {selectedLog.techniquesApplied && selectedLog.techniquesApplied.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {selectedLog.techniquesApplied.map((tech, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#201F21] text-[#DEC1AF] border border-white/5">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Live Playground Runner */}
          <div className="bg-[#18181A] border border-white/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#DEC1AF]" />
                <span className="text-xs font-semibold text-white">Live Execution Output</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedLog(null);
                    openOptimizerWithText(selectedLog.originalPrompt, selectedLog.category, selectedLog.model);
                  }}
                  className="text-xs text-[#9B8E87] hover:text-[#DEC1AF] px-3 py-1.5 rounded-lg border border-white/5 hover:bg-[#201F21] transition-colors flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Re-Tune</span>
                </button>

                <button
                  disabled={isRunning}
                  onClick={handleRunExecution}
                  className="text-xs font-medium text-[#DEC1AF] bg-[#3D2B1F] hover:bg-[#5E4634] px-3.5 py-1.5 rounded-lg border border-[#5E4634] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Running LLM...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-[#DEC1AF]" />
                      <span>Execute Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {testOutput && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-[11px] text-[#9B8E87]">
                  <span>Model: {testOutput.model}</span>
                  <span>Latency: {testOutput.latencyMs}ms • {testOutput.tokensUsed} tokens</span>
                </div>
                <div className="bg-[#0E0E10] border border-white/5 rounded-lg p-3 text-xs text-[#D2C4BC] font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {testOutput.output}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
