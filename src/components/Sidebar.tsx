import React from 'react';
import { History, LayoutTemplate, FileEdit, Star, Settings, HelpCircle, Plus, Sparkles, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, setIsOptimizerOpen, logs, templates, drafts } = useApp();

  const favoriteCount = logs.filter(l => l.isFavorite).length + templates.filter(t => t.isFavorite).length;

  const navItems = [
    { id: 'history', label: 'History', icon: History, count: logs.length },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate, count: templates.length },
    { id: 'drafts', label: 'Drafts', icon: FileEdit, count: drafts.length },
    { id: 'favorites', label: 'Favorites', icon: Star, count: favoriteCount },
  ] as const;

  return (
    <aside className="w-64 min-h-screen bg-[#0E0E10] border-r border-white/5 flex flex-col justify-between p-4 select-none shrink-0 z-20">
      {/* Brand Header */}
      <div>
        <div 
          onClick={() => setActiveTab('history')}
          className="flex items-center gap-3 px-2 py-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#201F21] border border-white/10 flex items-center justify-center text-[#DEC1AF] group-hover:border-[#DEC1AF]/40 transition-colors shadow-inner">
            <span className="font-bold text-xs tracking-tighter">PP</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white italic font-serif">PromptPilot</span>
            </div>
            <p className="text-[11px] text-[#A69992] tracking-wide font-normal">Intelligence Orchestrator</p>
          </div>
        </div>

        {/* New Prompt Button */}
        <div className="mt-5 mb-6">
          <button
            id="btn-new-prompt"
            onClick={() => setIsOptimizerOpen(true)}
            className="w-full bg-[#3D2B1F] hover:bg-[#5E4634] active:bg-[#2A1D15] text-[#DEC1AF] border border-[#5E4634]/60 hover:border-[#DEC1AF]/40 rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm group"
          >
            <Plus className="w-4 h-4 text-[#DEC1AF] group-hover:rotate-90 transition-transform duration-200" />
            <span>New Prompt</span>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#201F21] text-white font-medium border-l-2 border-[#DEC1AF]'
                    : 'text-[#9B8E87] hover:text-[#E5E1E4] hover:bg-[#18181A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#DEC1AF]' : 'text-[#9B8E87]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-[#3D2B1F] text-[#DEC1AF]' : 'text-[#6E645F]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-white/5 pt-3 space-y-1">
        <button
          id="nav-settings"
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all ${
            activeTab === 'settings'
              ? 'bg-[#201F21] text-white font-medium border-l-2 border-[#DEC1AF]'
              : 'text-[#9B8E87] hover:text-[#E5E1E4] hover:bg-[#18181A]'
          }`}
        >
          <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#DEC1AF]' : 'text-[#9B8E87]'}`} />
          <span>Settings</span>
        </button>

        <button
          id="nav-support"
          onClick={() => setActiveTab('support')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all ${
            activeTab === 'support'
              ? 'bg-[#201F21] text-white font-medium border-l-2 border-[#DEC1AF]'
              : 'text-[#9B8E87] hover:text-[#E5E1E4] hover:bg-[#18181A]'
          }`}
        >
          <HelpCircle className={`w-4 h-4 ${activeTab === 'support' ? 'text-[#DEC1AF]' : 'text-[#9B8E87]'}`} />
          <span>Support & Docs</span>
        </button>
      </div>
    </aside>
  );
};
