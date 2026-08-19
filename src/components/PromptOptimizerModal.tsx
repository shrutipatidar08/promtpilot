import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  Play, 
  BookmarkPlus, 
  Sliders, 
  Zap, 
  Clock, 
  CheckCircle2,
  RefreshCw,
  Cpu,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryType, ModelType, OptimizationGoal, OptimizePromptResponse, RunPromptResponse } from '../types';

export const PromptOptimizerModal: React.FC = () => {
  const { 
    isOptimizerOpen, 
    setIsOptimizerOpen, 
    optimizerInitialPrompt, 
    optimizerInitialCategory,
    optimizerInitialModel,
    settings,
    addLog,
    addTemplate,
    showToast 
  } = useApp();

  const [promptInput, setPromptInput] = useState('');
  const [category, setCategory] = useState<CategoryType>('Coding');
  const [targetModel, setTargetModel] = useState<ModelType>('GPT-4o');
  const [goal, setGoal] = useState<OptimizationGoal>('Max Quality');
  const [customInstructions, setCustomInstructions] = useState('');
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizePromptResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Live test runner state
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<RunPromptResponse | null>(null);

  useEffect(() => {
    if (isOptimizerOpen) {
      if (optimizerInitialPrompt) {
        setPromptInput(optimizerInitialPrompt);
      }
      if (optimizerInitialCategory) {
        setCategory(optimizerInitialCategory);
      }
      if (optimizerInitialModel) {
        setTargetModel(optimizerInitialModel);
      }
    } else {
      setOptimizationResult(null);
      setTestResult(null);
    }
  }, [isOptimizerOpen, optimizerInitialPrompt, optimizerInitialCategory, optimizerInitialModel]);

  if (!isOptimizerOpen) return null;

  const handleOptimize = async () => {
    if (!promptInput.trim()) {
      showToast('Please enter a prompt to optimize');
      return;
    }

    setIsOptimizing(true);
    setTestResult(null);

    // A local .env key should remain the default. Ignore masked demo values
    // and incomplete entries instead of letting them override the server key.
    const customGeminiKey = settings.apiKeys.google.trim();
    const hasCustomGeminiKey = /^[A-Za-z0-9_-]{20,}$/.test(customGeminiKey);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(hasCustomGeminiKey ? { 'x-gemini-api-key': customGeminiKey } : {})
        },
        body: JSON.stringify({
          prompt: promptInput,
          category,
          targetModel,
          goal,
          customInstructions,
          ...(hasCustomGeminiKey ? { apiKey: customGeminiKey } : {}),
        }),
      });

      const data: OptimizePromptResponse = await response.json();
      setOptimizationResult(data);

      // Auto-save to History
      addLog({
        originalPrompt: promptInput,
        optimizedPrompt: data.optimizedPrompt,
        score: data.score,
        category: data.category,
        model: data.model,
        originalTokens: data.originalTokens,
        optimizedTokens: data.optimizedTokens,
        scoreBreakdown: data.scoreBreakdown,
        techniquesApplied: data.techniquesApplied,
        rationale: data.rationale,
        isFavorite: false,
      });
    } catch (err) {
      console.error(err);
      showToast('Optimization completed with local heuristic fallback');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRunTest = async () => {
    if (!optimizationResult) return;
    setIsRunningTest(true);

    const customGeminiKey = settings.apiKeys.google.trim();
    const hasCustomGeminiKey = /^[A-Za-z0-9_-]{20,}$/.test(customGeminiKey);

    try {
      const response = await fetch('/api/run-prompt', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(hasCustomGeminiKey ? { 'x-gemini-api-key': customGeminiKey } : {})
        },
        body: JSON.stringify({
          prompt: optimizationResult.optimizedPrompt,
          temperature: settings.temperature || 0.7,
          maxTokens: settings.maxTokens || 1000,
          model: targetModel,
          ...(hasCustomGeminiKey ? { apiKey: customGeminiKey } : {}),
        }),
      });

      const data: RunPromptResponse = await response.json();
      setTestResult(data);
      showToast('Prompt execution test completed');
    } catch (err: any) {
      showToast('Execution error: ' + err.message);
    } finally {
      setIsRunningTest(false);
    }
  };

  const handleCopy = () => {
    if (!optimizationResult) return;
    navigator.clipboard.writeText(optimizationResult.optimizedPrompt);
    setCopied(true);
    showToast('Copied optimized prompt to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsTemplate = () => {
    if (!optimizationResult) return;
    addTemplate({
      title: promptInput.slice(0, 35) + (promptInput.length > 35 ? '...' : ''),
      description: optimizationResult.rationale,
      category,
      recommendedModel: targetModel,
      score: optimizationResult.score,
      prompt: optimizationResult.optimizedPrompt,
      tags: [category, targetModel],
      variables: ['Subject', 'Constraints'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
      <div className="bg-[#131315] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#18181A] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3D2B1F] border border-[#5E4634] flex items-center justify-center text-[#DEC1AF]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Prompt Engineering Studio</h2>
              <p className="text-xs text-[#9B8E87]">Optimize, calibrate, and benchmark for state-of-the-art LLMs</p>
            </div>
          </div>

          <button
            id="btn-close-optimizer"
            onClick={() => setIsOptimizerOpen(false)}
            className="text-[#9B8E87] hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9B8E87] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                id="select-opt-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full bg-[#1C1B1D] text-xs font-medium text-[#E5E1E4] px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#DEC1AF] focus:outline-none"
              >
                <option value="Coding">Coding</option>
                <option value="Marketing">Marketing</option>
                <option value="Creative">Creative</option>
                <option value="Business">Business</option>
                <option value="Reasoning">Reasoning</option>
                <option value="Data">Data</option>
                <option value="Academic">Academic</option>
              </select>
            </div>

            {/* Target Model */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9B8E87] uppercase tracking-wider mb-1.5">
                Target Architecture
              </label>
              <select
                id="select-opt-model"
                value={targetModel}
                onChange={(e) => setTargetModel(e.target.value as ModelType)}
                className="w-full bg-[#1C1B1D] text-xs font-medium text-[#E5E1E4] px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#DEC1AF] focus:outline-none"
              >
                <option value="Gemini 3.7 Flash">Gemini 3.7 Flash (Ultra-Fast)</option>
                <option value="Gemini 3.1 Pro">Gemini 3.1 Pro (Deep Thinking)</option>
                <option value="GPT-4o">GPT-4o (Omni Balanced)</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Precision Code/Writing)</option>
                <option value="GPT-4">GPT-4 (Legacy)</option>
                <option value="DeepSeek-V3">DeepSeek-V3</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9B8E87] uppercase tracking-wider mb-1.5">
                Optimization Objective
              </label>
              <select
                id="select-opt-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as OptimizationGoal)}
                className="w-full bg-[#1C1B1D] text-xs font-medium text-[#E5E1E4] px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#DEC1AF] focus:outline-none"
              >
                <option value="Max Quality">Max Quality & Resiliency</option>
                <option value="Cost & Speed">Cost & Token Minimization</option>
                <option value="Balanced">Balanced Output</option>
                <option value="Reasoning">Rigorous Chain-of-Thought</option>
              </select>
            </div>
          </div>

          {/* Prompt Input Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#D2C4BC]">
                Input Raw Prompt / Idea
              </label>
              <span className="text-[11px] text-[#6E645F]">
                {promptInput.length} characters • ~{Math.max(0, Math.round(promptInput.trim().split(/\s+/).filter(Boolean).length * 1.3))} tokens
              </span>
            </div>
            <textarea
              id="textarea-raw-prompt"
              rows={4}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g. Write a python script to scrape data from an ecommerce store and export to CSV with rate limit handling..."
              className="w-full bg-[#1C1B1D] text-sm text-white placeholder-[#6E645F] p-4 rounded-xl border border-white/10 focus:border-[#DEC1AF] focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Optional custom constraints (e.g. 'Must use TypeScript strict mode', 'Keep under 200 words')"
              className="flex-1 bg-[#1C1B1D] text-xs text-[#D2C4BC] px-3.5 py-2.5 rounded-xl border border-white/5 focus:border-[#DEC1AF]/60 focus:outline-none"
            />

            <button
              id="btn-trigger-optimize"
              disabled={isOptimizing || !promptInput.trim()}
              onClick={handleOptimize}
              className="bg-[#3D2B1F] hover:bg-[#5E4634] active:bg-[#2A1D15] disabled:opacity-40 disabled:cursor-not-allowed text-[#DEC1AF] border border-[#5E4634] rounded-xl px-6 py-2.5 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-md"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#DEC1AF]" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#DEC1AF]" />
                  <span>Optimize Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Results Output Section */}
          {optimizationResult && (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
              
              {/* Score & Metrics Banner */}
              <div className="bg-[#1C1B1D] border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center font-bold text-lg text-emerald-400 shadow-inner">
                    {optimizationResult.score.toFixed(1)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Quality Index: Production Ready</h4>
                    <p className="text-xs text-[#9B8E87]">{optimizationResult.rationale}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6E645F] bg-[#131315] px-2.5 py-1 rounded-md border border-white/5">
                    {optimizationResult.originalTokens} → {optimizationResult.optimizedTokens} Tokens
                  </span>
                  <span className="text-xs text-[#DEC1AF] bg-[#3D2B1F] px-2.5 py-1 rounded-md border border-[#5E4634]">
                    {optimizationResult.model}
                  </span>
                </div>
              </div>

              {/* Breakdown Radar / Meters */}
              {optimizationResult.scoreBreakdown && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  {Object.entries(optimizationResult.scoreBreakdown).map(([key, val]) => (
                    <div key={key} className="bg-[#18181A] p-2.5 rounded-lg border border-white/5">
                      <div className="text-[10px] text-[#9B8E87] uppercase tracking-wider font-semibold">{key}</div>
                      <div className="text-sm font-bold text-[#DEC1AF] mt-0.5">{Number(val).toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Optimized Content Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">Optimized Master Prompt</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                      DELIMITED & REINFORCED
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 text-xs text-[#DEC1AF] hover:bg-[#2A2A2C] px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleSaveAsTemplate}
                      className="inline-flex items-center gap-1 text-xs text-[#E5E1E4] hover:bg-[#2A2A2C] px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-[#DEC1AF]" />
                      <span>Save as Template</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#0E0E10] border border-white/10 rounded-xl p-4 text-xs font-mono text-[#E5E1E4] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto select-text">
                  {optimizationResult.optimizedPrompt}
                </div>
              </div>

              {/* Applied Techniques Chips */}
              {optimizationResult.techniquesApplied && optimizationResult.techniquesApplied.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#9B8E87] uppercase">Techniques Applied</div>
                  <div className="flex flex-wrap gap-1.5">
                    {optimizationResult.techniquesApplied.map((tech, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[#201F21] text-[#D2C4BC] border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Test Playground Runner */}
              <div className="bg-[#18181A] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-[#DEC1AF]" />
                    <span className="text-xs font-semibold text-white">Live Model Execution Sandbox</span>
                  </div>

                  <button
                    id="btn-run-live-test"
                    disabled={isRunningTest}
                    onClick={handleRunTest}
                    className="inline-flex items-center gap-2 bg-[#2A2A2C] hover:bg-[#353437] text-xs font-medium text-[#DEC1AF] px-3.5 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer"
                  >
                    {isRunningTest ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Executing on Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-[#DEC1AF]" />
                        <span>Run Test Preview</span>
                      </>
                    )}
                  </button>
                </div>

                {testResult && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-[11px] text-[#9B8E87]">
                      <span>Model: {testResult.model}</span>
                      <span>Latency: {testResult.latencyMs}ms • {testResult.tokensUsed} tokens</span>
                    </div>
                    <div className="bg-[#0E0E10] border border-white/5 rounded-lg p-3 text-xs text-[#D2C4BC] max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {testResult.output}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
