import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Search, 
  ChevronDown, 
  SlidersHorizontal, 
  ArrowRight, 
  Copy, 
  Check, 
  Star, 
  Trash2, 
  Play, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PromptLog, CategoryType, ModelType } from '../types';
import { exportLogsToCSV } from '../utils/exportCsv';

export const OptimizationLogView: React.FC = () => {
  const { 
    logs, 
    setSelectedLog, 
    toggleFavoriteLog, 
    deleteLog, 
    openOptimizerWithText,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'score' | 'tokens'>('newest');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logs based on inputs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesOriginal = log.originalPrompt.toLowerCase().includes(q);
        const matchesOptimized = log.optimizedPrompt.toLowerCase().includes(q);
        const matchesCat = log.category.toLowerCase().includes(q);
        const matchesModel = log.model.toLowerCase().includes(q);
        if (!matchesOriginal && !matchesOptimized && !matchesCat && !matchesModel) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && log.category !== selectedCategory) {
        return false;
      }

      // Model
      if (selectedModel !== 'All' && log.model !== selectedModel) {
        return false;
      }

      // Date Range
      if (selectedDateRange === '7days') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        if (log.createdAt < sevenDaysAgo) return false;
      } else if (selectedDateRange === 'today') {
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        if (log.createdAt < startOfDay) return false;
      } else if (selectedDateRange === '30days') {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        if (log.createdAt < thirtyDaysAgo) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'score') return b.score - a.score;
      if (sortOrder === 'tokens') return b.optimizedTokens - a.optimizedTokens;
      return b.createdAt - a.createdAt;
    });
  }, [logs, searchQuery, selectedCategory, selectedModel, selectedDateRange, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Optimized prompt copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getScoreStyle = (score: number) => {
    if (score >= 9.0) {
      return 'border-emerald-500/50 bg-emerald-950/40 text-emerald-400';
    } else if (score >= 8.0) {
      return 'border-teal-500/50 bg-teal-950/40 text-teal-300';
    } else if (score >= 7.0) {
      return 'border-amber-500/50 bg-amber-950/40 text-amber-300';
    } else {
      return 'border-rose-500/50 bg-rose-950/40 text-rose-300';
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#0E0E10] text-[#E5E1E4] p-6 lg:p-10 overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
            Optimization Log
          </h1>
          <p className="text-sm lg:text-base text-[#9B8E87] max-w-2xl font-normal">
            A complete history of your prompt iterations, scored and cataloged for continuous improvement.
          </p>
        </div>

        {/* Export CSV Action */}
        <button
          id="btn-export-csv"
          onClick={() => {
            exportLogsToCSV(filteredLogs);
            showToast(`Exported ${filteredLogs.length} prompt records`);
          }}
          className="self-start inline-flex items-center gap-2 bg-[#1C1B1D] hover:bg-[#2A2A2C] active:bg-[#131315] text-[#E5E1E4] border border-white/10 hover:border-white/20 rounded-lg px-4 py-2 text-xs lg:text-sm font-medium transition-all shadow-sm group cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#DEC1AF] group-hover:-translate-y-0.5 transition-transform" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#131315]/80 p-2 rounded-xl border border-white/5">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#9B8E87] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-prompts"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search prompts..."
            className="w-full bg-[#1C1B1D] text-sm text-[#E5E1E4] placeholder-[#6E645F] pl-10 pr-4 py-2 rounded-lg border border-white/5 focus:border-[#DEC1AF]/60 focus:outline-none transition-all"
          />
        </div>

        {/* Date Dropdown */}
        <div className="relative">
          <select
            id="select-filter-date"
            value={selectedDateRange}
            onChange={(e) => {
              setSelectedDateRange(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by date range"
            className="appearance-none bg-[#1C1B1D] hover:bg-[#201F21] text-xs font-medium text-[#D2C4BC] pl-3 pr-8 py-2 rounded-lg border border-white/5 cursor-pointer focus:outline-none focus:border-[#DEC1AF]/60 transition-colors"
          >
            <option value="all">Date: All Time</option>
            <option value="today">Date: Today</option>
            <option value="7days">Date: Last 7 Days</option>
            <option value="30days">Date: Last 30 Days</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#9B8E87] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Model Dropdown */}
        <div className="relative">
          <select
            id="select-filter-model"
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by model"
            className="appearance-none bg-[#1C1B1D] hover:bg-[#201F21] text-xs font-medium text-[#D2C4BC] pl-3 pr-8 py-2 rounded-lg border border-white/5 cursor-pointer focus:outline-none focus:border-[#DEC1AF]/60 transition-colors"
          >
            <option value="All">Model: All Models</option>
            <option value="GPT-4o">Model: GPT-4o</option>
            <option value="Gemini 3.7 Flash">Model: Gemini 3.7 Flash</option>
            <option value="Gemini 3.1 Pro">Model: Gemini 3.1 Pro</option>
            <option value="Claude 3.5 Sonnet">Model: Claude 3.5 Sonnet</option>
            <option value="GPT-4">Model: GPT-4</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#9B8E87] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            id="select-filter-category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by category"
            className="appearance-none bg-[#1C1B1D] hover:bg-[#201F21] text-xs font-medium text-[#D2C4BC] pl-3 pr-8 py-2 rounded-lg border border-white/5 cursor-pointer focus:outline-none focus:border-[#DEC1AF]/60 transition-colors"
          >
            <option value="All">Category: All</option>
            <option value="Coding">Category: Coding</option>
            <option value="Marketing">Category: Marketing</option>
            <option value="Creative">Category: Creative</option>
            <option value="Business">Category: Business</option>
            <option value="Reasoning">Category: Reasoning</option>
            <option value="Data">Category: Data</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#9B8E87] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort Toggle */}
        <button
          id="btn-toggle-sort"
          onClick={() => {
            const nextSort = sortOrder === 'newest' ? 'score' : sortOrder === 'score' ? 'tokens' : 'newest';
            setSortOrder(nextSort);
          }}
          title={`Sorted by: ${sortOrder}`}
          className="p-2 bg-[#1C1B1D] hover:bg-[#201F21] text-[#9B8E87] hover:text-[#DEC1AF] rounded-lg border border-white/5 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Main Table / Grid */}
      <div className="bg-[#131315] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        {/* Table Column Headers */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#18181A] border-b border-white/5 text-[11px] font-semibold tracking-wider text-[#9B8E87] uppercase">
          <div className="col-span-1 text-center">Score</div>
          <div className="col-span-4 lg:col-span-4">Original Prompt</div>
          <div className="col-span-6 lg:col-span-6">Optimized Prompt</div>
          <div className="col-span-1 text-right">Details</div>
        </div>

        {/* Table Rows */}
        {paginatedLogs.length === 0 ? (
          <div className="py-16 text-center text-[#9B8E87]">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-[#DEC1AF]/40" />
            <p className="text-sm font-medium text-[#E5E1E4]">No optimization logs found</p>
            <p className="text-xs text-[#6E645F] mt-1">Try adjusting your filters or create a new prompt.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {paginatedLogs.map((log) => {
              const scoreStyle = getScoreStyle(log.score);
              return (
                <div
                  key={log.id}
                  id={`log-row-${log.id}`}
                  onClick={() => setSelectedLog(log)}
                  className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-[#1C1B1D]/70 transition-colors duration-150 cursor-pointer group items-start"
                >
                  {/* Score Column */}
                  <div className="col-span-1 flex items-center justify-center pt-1">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm shadow-inner transition-transform group-hover:scale-105 ${scoreStyle}`}>
                      {log.score.toFixed(1)}
                    </div>
                  </div>

                  {/* Original Prompt Column */}
                  <div className="col-span-4 space-y-2 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block uppercase text-[10px] tracking-wider font-semibold px-2 py-0.5 rounded bg-[#2A2A2C] text-[#DEC1AF] border border-white/5">
                        {log.category}
                      </span>
                      <span className="text-xs text-[#6E645F] font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-[#D2C4BC] font-normal leading-relaxed line-clamp-3">
                      {log.originalPrompt}
                    </p>
                    <div className="text-[11px] text-[#6E645F]">
                      ~{log.originalTokens} tokens
                    </div>
                  </div>

                  {/* Optimized Prompt Column */}
                  <div className="col-span-6 space-y-2 pr-2">
                    <div className="flex items-center gap-2 text-xs text-[#9B8E87]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#DEC1AF]" />
                      <span className="font-medium text-[#DEC1AF]">{log.model}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-[#DEC1AF] font-bold text-sm shrink-0 mt-0.5">→</span>
                      <p className="text-sm text-white font-normal leading-relaxed line-clamp-3 font-sans">
                        {log.optimizedPrompt}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-0.5">
                      <span className="text-[11px] text-[#6E645F]">
                        ~{log.optimizedTokens} tokens
                      </span>
                      {log.techniquesApplied && log.techniquesApplied.length > 0 && (
                        <span className="text-[11px] text-[#A69992] bg-[#201F21] px-2 py-0.5 rounded border border-white/5">
                          {log.techniquesApplied[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="col-span-1 flex flex-col items-end gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Copy */}
                      <button
                        title="Copy Optimized Prompt"
                        onClick={(e) => handleCopy(e, log.optimizedPrompt, log.id)}
                        className="p-1.5 text-[#9B8E87] hover:text-[#DEC1AF] hover:bg-[#2A2A2C] rounded-md transition-colors"
                      >
                        {copiedId === log.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Favorite */}
                      <button
                        title={log.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        onClick={() => toggleFavoriteLog(log.id)}
                        className={`p-1.5 rounded-md transition-colors ${
                          log.isFavorite ? 'text-amber-400 hover:bg-[#2A2A2C]' : 'text-[#6E645F] hover:text-[#DEC1AF] hover:bg-[#2A2A2C]'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${log.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Expand / View Details */}
                      <button
                        title="Inspect Score Breakdown & Test"
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-[#9B8E87] hover:text-[#DEC1AF] hover:bg-[#2A2A2C] rounded-md transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      title="Re-optimize this prompt"
                      onClick={() => openOptimizerWithText(log.originalPrompt, log.category, log.model)}
                      className="text-[11px] text-[#DEC1AF] hover:underline flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span>Re-tune</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-[#18181A] border-t border-white/5 text-xs text-[#9B8E87] gap-3">
          <div>
            Showing {filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length}
          </div>

          <div className="flex items-center gap-1">
            <button
              id="btn-prev-page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md bg-[#201F21] text-[#E5E1E4] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2A2A2C] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-[#3D2B1F] text-[#DEC1AF] border border-[#5E4634]'
                    : 'bg-[#201F21] text-[#9B8E87] hover:bg-[#2A2A2C] hover:text-[#E5E1E4]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              id="btn-next-page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md bg-[#201F21] text-[#E5E1E4] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2A2A2C] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
