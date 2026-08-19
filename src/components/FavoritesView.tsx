import React from 'react';
import { Star, Sparkles, LayoutTemplate, History, ArrowRight, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FavoritesView: React.FC = () => {
  const { logs, templates, setSelectedLog, toggleFavoriteLog, toggleFavoriteTemplate, openOptimizerWithText, showToast } = useApp();

  const favoriteLogs = logs.filter((l) => l.isFavorite);
  const favoriteTemplates = templates.filter((t) => t.isFavorite);

  return (
    <div className="flex-1 min-h-screen bg-[#0E0E10] text-[#E5E1E4] p-6 lg:p-10 overflow-y-auto space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
          Starred & Favorites
        </h1>
        <p className="text-sm lg:text-base text-[#9B8E87] max-w-2xl font-normal">
          Your curated collection of top-performing prompt iterations and reusable template architectures.
        </p>
      </div>

      {/* Favorite Optimization Logs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <History className="w-4 h-4 text-[#DEC1AF]" />
          <h2>Favorite Optimization Runs ({favoriteLogs.length})</h2>
        </div>

        {favoriteLogs.length === 0 ? (
          <div className="bg-[#131315] border border-white/5 rounded-xl p-8 text-center text-[#9B8E87]">
            <p className="text-xs">No starred prompt logs yet. Click the star icon on any log entry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="bg-[#131315] hover:bg-[#18181A] border border-white/5 hover:border-[#DEC1AF]/30 rounded-xl p-4 transition-all space-y-3 cursor-pointer group shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#2A2A2C] text-[#DEC1AF]">
                      {log.category}
                    </span>
                    <span className="text-xs text-[#DEC1AF] font-medium">{log.model}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ★ {log.score.toFixed(1)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteLog(log.id);
                      }}
                      className="text-amber-400 p-1 hover:bg-[#201F21] rounded"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#D2C4BC] font-mono line-clamp-3 bg-[#0E0E10] p-3 rounded-lg border border-white/5">
                  {log.optimizedPrompt}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#6E645F] pt-1">
                  <span>{log.timestamp}</span>
                  <span className="text-[#DEC1AF] group-hover:underline flex items-center gap-1">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Templates */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <LayoutTemplate className="w-4 h-4 text-[#DEC1AF]" />
          <h2>Favorite Templates ({favoriteTemplates.length})</h2>
        </div>

        {favoriteTemplates.length === 0 ? (
          <div className="bg-[#131315] border border-white/5 rounded-xl p-8 text-center text-[#9B8E87]">
            <p className="text-xs">No starred templates yet. Star templates from the Template Library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-[#131315] border border-white/5 rounded-xl p-4 space-y-3 shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#2A2A2C] text-[#DEC1AF]">
                    {tpl.category}
                  </span>
                  <button
                    onClick={() => toggleFavoriteTemplate(tpl.id)}
                    className="text-amber-400 p-1 hover:bg-[#201F21] rounded"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white">{tpl.title}</h4>
                  <p className="text-xs text-[#9B8E87] mt-0.5 line-clamp-2">{tpl.description}</p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tpl.prompt);
                      showToast('Template copied');
                    }}
                    className="text-xs text-[#9B8E87] hover:text-white px-2.5 py-1 rounded bg-[#1C1B1D] border border-white/5 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => openOptimizerWithText(tpl.prompt, tpl.category, tpl.recommendedModel)}
                    className="text-xs text-[#DEC1AF] bg-[#3D2B1F] hover:bg-[#5E4634] px-3 py-1 rounded border border-[#5E4634] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Use</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
