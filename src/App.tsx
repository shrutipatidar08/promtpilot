import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { OptimizationLogView } from './components/OptimizationLogView';
import { TemplateLibraryView } from './components/TemplateLibraryView';
import { DraftsView } from './components/DraftsView';
import { FavoritesView } from './components/FavoritesView';
import { SettingsView } from './components/SettingsView';
import { SupportView } from './components/SupportView';
import { PromptOptimizerModal } from './components/PromptOptimizerModal';
import { PromptDetailModal } from './components/PromptDetailModal';
import { CheckCircle } from 'lucide-react';
import { LoginPage } from './components/LoginPage';
import { supabase } from './lib/supabase';

function AppContent() {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0E0E10] text-[#E5E1E4]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {activeTab === 'history' && <OptimizationLogView />}
        {activeTab === 'templates' && <TemplateLibraryView />}
        {activeTab === 'drafts' && <DraftsView />}
        {activeTab === 'favorites' && <FavoritesView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'support' && <SupportView />}

        {/* Global Floating Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1C1B1D] text-[#DEC1AF] border border-[#5E4634] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>

      {/* Modals */}
      <PromptOptimizerModal />
      <PromptDetailModal />
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      setSession(updatedSession);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) return <div className="min-h-screen bg-[#0E0E10]" />;

  if (!session) {
    return <LoginPage onAuthenticated={() => undefined} />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
