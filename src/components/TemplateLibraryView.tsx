import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Star, 
  Trash2, 
  Sparkles, 
  SlidersHorizontal, 
  Code, 
  ArrowRight,
  ExternalLink,
  Edit3,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PromptTemplate, CategoryType } from '../types';

export const TemplateLibraryView: React.FC = () => {
  const { 
    templates, 
    addTemplate, 
    deleteTemplate, 
    toggleFavoriteTemplate, 
    openOptimizerWithText, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Template execution / variable filling modal
  const [activeTemplateForFill, setActiveTemplateForFill] = useState<PromptTemplate | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // New Template Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('Coding');
  const [newPrompt, setNewPrompt] = useState('');
  const [newTags, setNewTags] = useState('TypeScript, Architecture');

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedCategory !== 'All' && tpl.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tpl.title.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.tags.some((t) => t.toLowerCase().includes(q)) ||
        tpl.prompt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (e: React.MouseEvent, prompt: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    showToast('Template copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenFill = (tpl: PromptTemplate) => {
    setActiveTemplateForFill(tpl);
    const initialVars: Record<string, string> = {};
    tpl.variables.forEach((v) => {
      initialVars[v] = '';
    });
    setVariableValues(initialVars);
  };

  const getFilledPrompt = () => {
    if (!activeTemplateForFill) return '';
    let result = activeTemplateForFill.prompt;
    Object.entries(variableValues).forEach(([k, v]) => {
      const regex = new RegExp(`{{${k}}}`, 'g');
      result = result.replace(regex, v || `[${k}]`);
    });
    return result;
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) {
      showToast('Title and prompt content are required');
      return;
    }

    // Extract {{variables}} from prompt
    const matches = newPrompt.match(/{{(.*?)}}/g) || [];
    const extractedVars = Array.from(new Set(matches.map((m) => m.replace(/{{|}}/g, '').trim())));

    addTemplate({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom user template',
      category: newCategory,
      recommendedModel: 'Gemini 3.7 Flash',
      score: 9.5,
      prompt: newPrompt.trim(),
      variables: extractedVars.length > 0 ? extractedVars : ['Subject', 'Requirements'],
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setShowNewModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewPrompt('');
  };

  return (
    <div className="flex-1 min-h-screen bg-[#0E0E10] text-[#E5E1E4] p-6 lg:p-10 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
            Template Library
          </h1>
          <p className="text-sm lg:text-base text-[#9B8E87] max-w-2xl font-normal">
            Battle-tested, benchmarked prompt scaffolds with variable injection for high-throughput AI engineering.
          </p>
        </div>

        <button
          id="btn-create-template"
          onClick={() => setShowNewModal(true)}
          className="self-start inline-flex items-center gap-2 bg-[#3D2B1F] hover:bg-[#5E4634] active:bg-[#2A1D15] text-[#DEC1AF] border border-[#5E4634] rounded-lg px-4 py-2 text-xs lg:text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#DEC1AF]" />
          <span>New Template</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#131315]/80 p-2 rounded-xl border border-white/5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#9B8E87] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, variables, or tags..."
            className="w-full bg-[#1C1B1D] text-sm text-[#E5E1E4] placeholder-[#6E645F] pl-10 pr-4 py-2 rounded-lg border border-white/5 focus:border-[#DEC1AF]/60 focus:outline-none transition-all"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Coding', 'Marketing', 'Business', 'Reasoning', 'Data'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#3D2B1F] text-[#DEC1AF] border border-[#5E4634]'
                  : 'bg-[#1C1B1D] text-[#9B8E87] hover:text-[#E5E1E4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => handleOpenFill(tpl)}
            className="bg-[#131315] hover:bg-[#18181A] border border-white/5 hover:border-[#DEC1AF]/30 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2A2A2C] text-[#DEC1AF] border border-white/5">
                  {tpl.category}
                </span>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleFavoriteTemplate(tpl.id)}
                    className={`p-1.5 rounded-md hover:bg-[#201F21] ${
                      tpl.isFavorite ? 'text-amber-400' : 'text-[#6E645F] hover:text-white'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${tpl.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleCopy(e, tpl.prompt, tpl.id)}
                    className="p-1.5 rounded-md text-[#9B8E87] hover:text-white hover:bg-[#201F21]"
                  >
                    {copiedId === tpl.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {tpl.isCustom && (
                    <button
                      onClick={() => deleteTemplate(tpl.id)}
                      className="p-1.5 rounded-md text-[#6E645F] hover:text-rose-400 hover:bg-rose-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-base text-white group-hover:text-[#DEC1AF] transition-colors">
                  {tpl.title}
                </h3>
                <p className="text-xs text-[#9B8E87] mt-1 line-clamp-2 leading-relaxed font-normal">
                  {tpl.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {tpl.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] text-[#A69992] bg-[#1C1B1D] px-2 py-0.5 rounded border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom info */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#9B8E87]">
              <span className="text-[11px] text-[#DEC1AF]">
                {tpl.variables.length} Dynamic Variables
              </span>
              <div className="flex items-center gap-1 text-[11px] text-[#DEC1AF] font-medium group-hover:translate-x-0.5 transition-transform">
                <span>Configure</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Variable Injection / Fill Modal */}
      {activeTemplateForFill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131315] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="font-bold text-lg text-white">{activeTemplateForFill.title}</h3>
                <p className="text-xs text-[#9B8E87]">{activeTemplateForFill.description}</p>
              </div>
              <button
                onClick={() => setActiveTemplateForFill(null)}
                className="text-[#9B8E87] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Variables input */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#DEC1AF]">
                Template Parameters
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTemplateForFill.variables.map((varName) => (
                  <div key={varName}>
                    <label className="block text-[11px] text-[#9B8E87] mb-1 font-medium">
                      {varName}
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter ${varName}...`}
                      value={variableValues[varName] || ''}
                      onChange={(e) =>
                        setVariableValues({ ...variableValues, [varName]: e.target.value })
                      }
                      className="w-full bg-[#1C1B1D] text-xs text-white p-2.5 rounded-lg border border-white/10 focus:border-[#DEC1AF] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#9B8E87]">Compiled Prompt Preview</div>
              <div className="bg-[#0E0E10] border border-white/10 rounded-xl p-3.5 text-xs font-mono text-[#D2C4BC] max-h-48 overflow-y-auto whitespace-pre-wrap">
                {getFilledPrompt()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getFilledPrompt());
                  showToast('Compiled prompt copied');
                }}
                className="px-4 py-2 bg-[#201F21] hover:bg-[#2A2A2C] text-xs font-medium text-white rounded-lg border border-white/5 transition-colors"
              >
                Copy Prompt
              </button>

              <button
                onClick={() => {
                  const prompt = getFilledPrompt();
                  setActiveTemplateForFill(null);
                  openOptimizerWithText(prompt, activeTemplateForFill.category, activeTemplateForFill.recommendedModel);
                }}
                className="px-4 py-2 bg-[#3D2B1F] hover:bg-[#5E4634] text-xs font-medium text-[#DEC1AF] border border-[#5E4634] rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open in Optimizer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Template Creation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTemplate} className="bg-[#131315] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="font-bold text-lg text-white">Create Custom Template</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-[#9B8E87] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-[#9B8E87] mb-1 font-medium">Template Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. OpenAPI Specification Generator"
                className="w-full bg-[#1C1B1D] text-xs text-white p-2.5 rounded-lg border border-white/10 focus:border-[#DEC1AF] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#9B8E87] mb-1 font-medium">Category</label>
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
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#9B8E87] mb-1 font-medium">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-[#1C1B1D] text-xs text-white p-2.5 rounded-lg border border-white/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#9B8E87] mb-1 font-medium">Description</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief summary of what this template achieves..."
                className="w-full bg-[#1C1B1D] text-xs text-white p-2.5 rounded-lg border border-white/10"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-[#9B8E87] font-medium">Prompt Content (Use &#123;&#123;variable&#125;&#125; for placeholders)</label>
              </div>
              <textarea
                rows={5}
                required
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="You are an expert in {{Domain}}. Please generate a schema for {{Subject}} with constraints..."
                className="w-full bg-[#1C1B1D] text-xs font-mono text-white p-3 rounded-lg border border-white/10 focus:border-[#DEC1AF] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-xs text-[#9B8E87] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#3D2B1F] hover:bg-[#5E4634] text-xs font-medium text-[#DEC1AF] border border-[#5E4634] rounded-lg"
              >
                Save Template
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
