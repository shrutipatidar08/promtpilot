import React from 'react';
import { BookOpen, Cpu, Shield, Sparkles, Terminal, CheckCircle2, Zap } from 'lucide-react';

export const SupportView: React.FC = () => {
  return (
    <div className="flex-1 min-h-screen bg-[#0E0E10] text-[#E5E1E4] p-6 lg:p-10 overflow-y-auto space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
          Documentation & Prompt Engineering Guide
        </h1>
        <p className="text-sm lg:text-base text-[#9B8E87] max-w-2xl font-normal">
          Master techniques for prompt optimization, token budget calibration, and multi-model routing.
        </p>
      </div>

      {/* Grid of Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Principles */}
        <div className="bg-[#131315] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 text-[#DEC1AF]">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">PromptPilot Core Engineering Principles</h3>
          </div>
          
          <ul className="space-y-3 text-xs text-[#D2C4BC] leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Role & Domain Conditioning:</strong> Always establish an explicit authoritative persona to narrow down semantic space.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Delimited Input & Boundary Anchoring:</strong> Use clear markdown headers (e.g. `### OBJECTIVE:`) and triple quotes to prevent prompt injection and ambiguous instruction parsing.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Deterministic Output Schemas:</strong> Mandate concrete response structures (JSON, bullet lists, typed code) to minimize conversational fluff.
              </div>
            </li>
          </ul>
        </div>

        {/* Model Architecture Matrix */}
        <div className="bg-[#131315] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2.5 text-[#DEC1AF]">
            <Cpu className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Architecture & Benchmark Matrix</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-[#18181A] p-3 rounded-lg border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-semibold text-white">Gemini 3.7 Flash</span>
                <p className="text-[11px] text-[#9B8E87]">Ultra-fast latency, high multimodal context</p>
              </div>
              <span className="text-[11px] text-[#DEC1AF] bg-[#3D2B1F] px-2 py-0.5 rounded">Optimal: Production Speed</span>
            </div>

            <div className="bg-[#18181A] p-3 rounded-lg border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-semibold text-white">Gemini 3.1 Pro</span>
                <p className="text-[11px] text-[#9B8E87]">Deep thinking, multi-step chain-of-thought</p>
              </div>
              <span className="text-[11px] text-[#DEC1AF] bg-[#3D2B1F] px-2 py-0.5 rounded">Optimal: Complex Logic</span>
            </div>

            <div className="bg-[#18181A] p-3 rounded-lg border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-semibold text-white">GPT-4o & Claude 3.5 Sonnet</span>
                <p className="text-[11px] text-[#9B8E87]">Advanced coding, tool use & copy generation</p>
              </div>
              <span className="text-[11px] text-[#DEC1AF] bg-[#3D2B1F] px-2 py-0.5 rounded">Optimal: Code & Copy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
