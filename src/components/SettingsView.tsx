import React, { useState } from 'react';
import { 
  Key, 
  Palette, 
  Network, 
  Sliders, 
  Save, 
  RotateCcw, 
  Check, 
  Cpu, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Info,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppSettings, OptimizationGoal } from '../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetSettings, showToast } = useApp();

  const [formSettings, setFormSettings] = useState<AppSettings>(settings);
  const [verifyingKey, setVerifyingKey] = useState<string | null>(null);
  const [verifiedKeys, setVerifiedKeys] = useState<Record<string, boolean>>({
    openai: true,
    google: true,
  });
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);

  const handleVerify = (provider: string) => {
    setVerifyingKey(provider);
    setTimeout(() => {
      setVerifyingKey(null);
      setVerifiedKeys(prev => ({ ...prev, [provider]: true }));
      showToast(`${provider.toUpperCase()} API credentials verified`);
    }, 900);
  };

  const handleSave = () => {
    updateSettings(formSettings);
  };

  const handleDiscard = () => {
    setFormSettings(settings);
    showToast('Changes discarded');
  };

  return (
    <div className="flex-1 min-h-screen bg-[#0E0E10] text-[#E5E1E4] p-6 lg:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Main Grid matching Image 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: API Keys & Theme */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* API Keys Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-[#E5E1E4]">
                <Key className="w-5 h-5 text-[#DEC1AF]" />
                <span className="font-semibold text-base tracking-wide">API Credentials</span>
              </div>

              <div className="space-y-3">
                {/* OpenAI */}
                <div className="bg-[#1C1B1D] border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 w-28 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-[#252427] flex items-center justify-center text-[#DEC1AF]">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-white">OpenAI</span>
                  </div>

                  <input
                    id="input-key-openai"
                    type="password"
                    value={formSettings.apiKeys.openai}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        apiKeys: { ...formSettings.apiKeys, openai: e.target.value },
                      })
                    }
                    placeholder="sk-proj-..."
                    className="flex-1 bg-[#131315] text-xs font-mono text-[#D2C4BC] px-3 py-2 rounded-lg border border-white/5 focus:border-[#DEC1AF]/60 focus:outline-none"
                  />

                  <button
                    id="btn-verify-openai"
                    onClick={() => handleVerify('openai')}
                    className="bg-[#2A2A2C] hover:bg-[#353437] text-xs font-medium text-[#DEC1AF] px-4 py-2 rounded-lg border border-white/5 transition-all shrink-0 cursor-pointer min-w-[72px] text-center"
                  >
                    {verifyingKey === 'openai' ? 'Verifying...' : verifiedKeys['openai'] ? 'Verified' : 'Verify'}
                  </button>
                </div>

                {/* Anthropic */}
                <div className="bg-[#1C1B1D] border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 w-28 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-[#252427] flex items-center justify-center text-[#DEC1AF]">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-white">Anthropic</span>
                  </div>

                  <input
                    id="input-key-anthropic"
                    type="text"
                    value={formSettings.apiKeys.anthropic}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        apiKeys: { ...formSettings.apiKeys, anthropic: e.target.value },
                      })
                    }
                    placeholder="sk-ant-..."
                    className="flex-1 bg-[#131315] text-xs font-mono text-[#D2C4BC] px-3 py-2 rounded-lg border border-white/5 focus:border-[#DEC1AF]/60 focus:outline-none"
                  />

                  <button
                    id="btn-verify-anthropic"
                    onClick={() => handleVerify('anthropic')}
                    className="bg-[#2A2A2C] hover:bg-[#353437] text-xs font-medium text-[#DEC1AF] px-4 py-2 rounded-lg border border-white/5 transition-all shrink-0 cursor-pointer min-w-[72px] text-center"
                  >
                    {verifyingKey === 'anthropic' ? 'Verifying...' : 'Add Key'}
                  </button>
                </div>

                {/* Google Gemini */}
                <div className="bg-[#1C1B1D] border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 w-28 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-[#252427] flex items-center justify-center text-[#DEC1AF]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-white">Google</span>
                  </div>

                  <input
                    id="input-key-google"
                    type="text"
                    value={formSettings.apiKeys.google}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        apiKeys: { ...formSettings.apiKeys, google: e.target.value },
                      })
                    }
                    placeholder="AIza..."
                    className="flex-1 bg-[#131315] text-xs font-mono text-[#D2C4BC] px-3 py-2 rounded-lg border border-white/5 focus:border-[#DEC1AF]/60 focus:outline-none"
                  />

                  <button
                    id="btn-verify-google"
                    onClick={() => handleVerify('google')}
                    className="bg-[#2A2A2C] hover:bg-[#353437] text-xs font-medium text-[#DEC1AF] px-4 py-2 rounded-lg border border-white/5 transition-all shrink-0 cursor-pointer min-w-[72px] text-center"
                  >
                    {verifyingKey === 'google' ? 'Verifying...' : verifiedKeys['google'] ? 'Active' : 'Add Key'}
                  </button>
                </div>
              </div>
            </div>

            {/* Theme & Display Mode */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-[#E5E1E4]">
                <Palette className="w-5 h-5 text-[#DEC1AF]" />
                <span className="font-semibold text-base tracking-wide">Appearance & Interface</span>
              </div>

              <div className="bg-[#1C1B1D] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-md">
                <div>
                  <h4 className="text-sm font-medium text-white">Dark Mode</h4>
                  <p className="text-xs text-[#9B8E87] mt-0.5">Toggle dark/light theme</p>
                </div>

                {/* Switch */}
                <button
                  id="switch-dark-mode"
                  role="switch"
                  aria-checked={formSettings.darkMode}
                  onClick={() =>
                    setFormSettings({ ...formSettings, darkMode: !formSettings.darkMode })
                  }
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    formSettings.darkMode ? 'bg-[#5E4634]' : 'bg-[#353437]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formSettings.darkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Model Routing & Goals */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1C1B1D] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
              
              {/* Top Router Header */}
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-[#2A2A2C] border border-white/10 flex items-center justify-center text-[#DEC1AF]">
                  <Network className="w-5 h-5" />
                </div>
                <p className="text-sm text-[#D2C4BC] leading-relaxed">
                  Automatically select the best model based on prompt complexity and your optimization goals.
                </p>
              </div>

              {/* Optimization Goal Segment */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-semibold tracking-wider text-[#9B8E87] uppercase">
                  Optimization Goal
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#131315] p-1.5 rounded-xl border border-white/5">
                  <button
                    id="btn-goal-cost"
                    onClick={() => setFormSettings({ ...formSettings, optimizationGoal: 'Cost & Speed' })}
                    className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                      formSettings.optimizationGoal === 'Cost & Speed'
                        ? 'bg-[#3D2B1F] text-[#DEC1AF] border border-[#5E4634] shadow-sm'
                        : 'text-[#9B8E87] hover:text-[#E5E1E4]'
                    }`}
                  >
                    Cost & Speed
                  </button>

                  <button
                    id="btn-goal-quality"
                    onClick={() => setFormSettings({ ...formSettings, optimizationGoal: 'Max Quality' })}
                    className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                      formSettings.optimizationGoal === 'Max Quality'
                        ? 'bg-[#3D2B1F] text-[#DEC1AF] border border-[#5E4634] shadow-sm'
                        : 'text-[#9B8E87] hover:text-[#E5E1E4]'
                    }`}
                  >
                    Max Quality
                  </button>
                </div>
              </div>

              {/* Auto-fallback Switch */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Auto-fallback</span>
                  <button
                    id="switch-auto-fallback"
                    role="switch"
                    aria-checked={formSettings.autoFallback}
                    onClick={() =>
                      setFormSettings({ ...formSettings, autoFallback: !formSettings.autoFallback })
                    }
                    className={`w-11 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                      formSettings.autoFallback ? 'bg-[#5E4634]' : 'bg-[#353437]'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                        formSettings.autoFallback ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-[#9B8E87] leading-relaxed">
                  If the primary model fails or rate limits, automatically retry with the next best available model.
                </p>
              </div>

              {/* Advanced Routing Rules Button */}
              <div className="pt-2">
                <button
                  id="btn-advanced-routing"
                  onClick={() => setShowAdvancedModal(true)}
                  className="w-full py-2.5 px-4 bg-[#252427] hover:bg-[#2E2D30] text-[#DEC1AF] border border-white/5 hover:border-white/10 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Advanced Routing Rules</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar Footer matching Image 5 */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
          <button
            id="btn-discard-settings"
            onClick={handleDiscard}
            className="text-xs sm:text-sm font-medium text-[#9B8E87] hover:text-[#E5E1E4] px-4 py-2 transition-colors cursor-pointer"
          >
            Discard Changes
          </button>

          <button
            id="btn-save-settings"
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-[#DEC1AF] hover:bg-[#ebd5c8] active:bg-[#cbb09e] text-[#28180D] font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#28180D]" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Advanced Routing Rules Modal */}
      {showAdvancedModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1B1D] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-[#DEC1AF]" />
                <h3 className="font-semibold text-lg text-white">Advanced Model Routing</h3>
              </div>
              <button
                onClick={() => setShowAdvancedModal(false)}
                className="text-[#9B8E87] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#D2C4BC]">
              <div>
                <label className="block text-[#9B8E87] mb-1 font-medium">Default Optimization Engine</label>
                <select
                  value={formSettings.defaultModel}
                  onChange={(e) => setFormSettings({ ...formSettings, defaultModel: e.target.value as any })}
                  className="w-full bg-[#131315] border border-white/10 rounded-lg p-2.5 text-white"
                >
                  <option value="Gemini 3.7 Flash">Gemini 3.7 Flash (Fast, Ultra-Capable)</option>
                  <option value="Gemini 3.1 Pro">Gemini 3.1 Pro (Deep Reasoning)</option>
                  <option value="GPT-4o">GPT-4o (Standard Precision)</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Coding & Copy)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#9B8E87] font-medium">Temperature: {formSettings.temperature}</span>
                  <span className="text-[#DEC1AF]">{formSettings.temperature < 0.4 ? 'Deterministic' : 'Creative'}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={formSettings.temperature}
                  onChange={(e) => setFormSettings({ ...formSettings, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-[#DEC1AF] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#9B8E87] font-medium">Max Token Output: {formSettings.maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="8192"
                  step="256"
                  value={formSettings.maxTokens}
                  onChange={(e) => setFormSettings({ ...formSettings, maxTokens: parseInt(e.target.value) })}
                  className="w-full accent-[#DEC1AF] cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.advancedRouting.enableCostCapping}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        advancedRouting: {
                          ...formSettings.advancedRouting,
                          enableCostCapping: e.target.checked,
                        },
                      })
                    }
                    className="rounded accent-[#5E4634]"
                  />
                  <span>Enable Per-Query Cost Ceiling ($0.05 max limit)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.advancedRouting.enableLatencyOptimization}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        advancedRouting: {
                          ...formSettings.advancedRouting,
                          enableLatencyOptimization: e.target.checked,
                        },
                      })
                    }
                    className="rounded accent-[#5E4634]"
                  />
                  <span>Prioritize sub-500ms TTFT (Time-To-First-Token)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                onClick={() => setShowAdvancedModal(false)}
                className="px-4 py-2 bg-[#DEC1AF] text-[#28180D] font-medium rounded-lg text-xs hover:bg-[#ebd5c8]"
              >
                Apply Parameters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
