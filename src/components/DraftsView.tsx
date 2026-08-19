import React, { useState } from 'react';
import { FileEdit, Plus, Trash2, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryType, ModelType, OptimizationGoal } from '../types';

export const DraftsView: React.FC = () => {
  const { drafts, saveDraft, deleteDraft, openOptimizerWithText, showToast } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('Coding');

  const handleAddNewDraft = () => {
    if (!newContent.trim()) {
      showToast('Draft content cannot be empty');
      return;
    }
    saveDraft({
      title: newTitle.trim() || 'Untitled Draft',
      content: newContent.trim(),
      category: newCategory,
      targetModel: 'GPT-4o',
      goal: 'Max Quality',
    });
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="flex-1 min-h-screen bg-[#0E0E10] text-[#E5E1E4] p-6 lg:p-10 overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
            Drafts & Scratchpad
          </h1>
          <p className="text-sm lg:text-base text-[#9B8E87] max-w-2xl font-normal">
            Quickly jot down prompt ideas, iterate privately, and send directly to the optimization engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Draft Editor */}
        <div className="lg:col-span-5 bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-[#DEC1AF]" />
            <h3 className="font-semibold text-sm text-white">Create New Draft</h3>
          </div>

          <div>
            <input
              type="text"
              placeholder="Draft title (e.g. Stripe Webhook Handler Prompt)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#1C1B1D] text-xs text-white p-2.5 rounded-lg border border-white/10 focus:border-[#DEC1AF] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as CategoryType)}
              className="w-full bg-[#1C1B1D] text-xs text-white p-2.5 rounded-lg border border-white/10"
            >
              <option value="Coding">Coding</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Reasoning">Reasoning</option>
              <option value="Data">Data</option>
              <option value="Creative">Creative</option>
            </select>
          </div>

          <div>
            <textarea
              rows={6}
              placeholder="Jot down your raw thoughts or initial prompt..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-[#1C1B1D] text-xs font-mono text-white p-3 rounded-lg border border-white/10 focus:border-[#DEC1AF] focus:outline-none"
            />
          </div>

          <button
            onClick={handleAddNewDraft}
            className="w-full py-2.5 bg-[#3D2B1F] hover:bg-[#5E4634] text-[#DEC1AF] border border-[#5E4634] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Save to Drafts</span>
          </button>
        </div>

        {/* Right: Saved Drafts List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#9B8E87] px-1">
            <span>{drafts.length} Saved Drafts</span>
          </div>

          {drafts.length === 0 ? (
            <div className="bg-[#131315] border border-white/5 rounded-2xl p-12 text-center text-[#9B8E87]">
              <FileEdit className="w-8 h-8 mx-auto mb-2 text-[#DEC1AF]/40" />
              <p className="text-sm font-medium text-white">No drafts yet</p>
              <p className="text-xs text-[#6E645F] mt-0.5">Use the scratchpad to save work in progress.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-[#131315] hover:bg-[#18181A] border border-white/5 hover:border-[#DEC1AF]/30 rounded-xl p-4 transition-all space-y-3 group shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2A2A2C] text-[#DEC1AF]">
                        {draft.category}
                      </span>
                      <h4 className="text-sm font-semibold text-white">{draft.title}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="p-1.5 text-[#6E645F] hover:text-rose-400 rounded-md hover:bg-[#201F21]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#D2C4BC] font-mono leading-relaxed line-clamp-3 bg-[#0E0E10] p-3 rounded-lg border border-white/5">
                    {draft.content}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#6E645F]">
                      Last updated {new Date(draft.lastModified).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => openOptimizerWithText(draft.content, draft.category, draft.targetModel)}
                      className="inline-flex items-center gap-1 text-xs text-[#DEC1AF] hover:text-white bg-[#3D2B1F] hover:bg-[#5E4634] px-3 py-1.5 rounded-lg border border-[#5E4634] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Send to Optimizer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
