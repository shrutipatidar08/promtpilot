import React, { createContext, useContext, useState, useEffect } from 'react';
import { PromptLog, PromptTemplate, AppSettings, PromptDraft, CategoryType, ModelType, OptimizationGoal } from '../types';
import { INITIAL_LOGS, INITIAL_TEMPLATES, INITIAL_DRAFTS, DEFAULT_SETTINGS } from '../data/seedData';

interface AppContextType {
  // Navigation
  activeTab: 'history' | 'templates' | 'drafts' | 'favorites' | 'settings' | 'support';
  setActiveTab: (tab: 'history' | 'templates' | 'drafts' | 'favorites' | 'settings' | 'support') => void;
  
  // Prompt Optimizer Modal / Workflow
  isOptimizerOpen: boolean;
  setIsOptimizerOpen: (open: boolean) => void;
  optimizerInitialPrompt: string;
  setOptimizerInitialPrompt: (prompt: string) => void;
  optimizerInitialCategory: CategoryType;
  setOptimizerInitialCategory: (cat: CategoryType) => void;
  optimizerInitialModel: ModelType;
  setOptimizerInitialModel: (model: ModelType) => void;

  // Selected Log Details Modal
  selectedLog: PromptLog | null;
  setSelectedLog: (log: PromptLog | null) => void;

  // Logs state
  logs: PromptLog[];
  addLog: (log: Omit<PromptLog, 'id' | 'createdAt' | 'timestamp'>) => PromptLog;
  deleteLog: (id: string) => void;
  toggleFavoriteLog: (id: string) => void;
  clearAllLogs: () => void;

  // Templates state
  templates: PromptTemplate[];
  addTemplate: (tpl: Omit<PromptTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  toggleFavoriteTemplate: (id: string) => void;

  // Drafts state
  drafts: PromptDraft[];
  saveDraft: (draft: Omit<PromptDraft, 'id' | 'lastModified'> & { id?: string }) => void;
  deleteDraft: (id: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;

  // Notifications / Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Quick Action
  openOptimizerWithText: (text: string, category?: CategoryType, model?: ModelType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'templates' | 'drafts' | 'favorites' | 'settings' | 'support'>('history');
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [optimizerInitialPrompt, setOptimizerInitialPrompt] = useState('');
  const [optimizerInitialCategory, setOptimizerInitialCategory] = useState<CategoryType>('Coding');
  const [optimizerInitialModel, setOptimizerInitialModel] = useState<ModelType>('GPT-4o');
  const [selectedLog, setSelectedLog] = useState<PromptLog | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence: Logs
  const [logs, setLogs] = useState<PromptLog[]>(() => {
    try {
      const saved = localStorage.getItem('promptpilot_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LOGS;
  });

  // Persistence: Templates
  const [templates, setTemplates] = useState<PromptTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('promptpilot_templates');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TEMPLATES;
  });

  // Persistence: Drafts
  const [drafts, setDrafts] = useState<PromptDraft[]>(() => {
    try {
      const saved = localStorage.getItem('promptpilot_drafts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DRAFTS;
  });

  // Persistence: Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('promptpilot_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('promptpilot_logs', JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem('promptpilot_templates', JSON.stringify(templates));
    } catch (e) {
      console.error(e);
    }
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem('promptpilot_drafts', JSON.stringify(drafts));
    } catch (e) {
      console.error(e);
    }
  }, [drafts]);

  useEffect(() => {
    try {
      localStorage.setItem('promptpilot_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const addLog = (logData: Omit<PromptLog, 'id' | 'createdAt' | 'timestamp'>): PromptLog => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newLog: PromptLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      timestamp: timeStr,
      isFavorite: logData.isFavorite ?? false,
    };

    setLogs((prev) => [newLog, ...prev]);
    showToast('Prompt optimization saved to History');
    return newLog;
  };

  const deleteLog = (id: string) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
    if (selectedLog?.id === id) {
      setSelectedLog(null);
    }
    showToast('Prompt record deleted');
  };

  const toggleFavoriteLog = (id: string) => {
    setLogs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (selectedLog?.id === id) {
      setSelectedLog((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const clearAllLogs = () => {
    setLogs([]);
    setSelectedLog(null);
    showToast('Optimization history cleared');
  };

  const addTemplate = (tpl: Omit<PromptTemplate, 'id'>) => {
    const newTpl: PromptTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      isCustom: true,
    };
    setTemplates((prev) => [newTpl, ...prev]);
    showToast('Template saved to library');
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast('Template deleted');
  };

  const toggleFavoriteTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    );
  };

  const saveDraft = (draftData: Omit<PromptDraft, 'id' | 'lastModified'> & { id?: string }) => {
    if (draftData.id) {
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === draftData.id
            ? { ...d, ...draftData, lastModified: Date.now() }
            : d
        )
      );
      showToast('Draft updated');
    } else {
      const newDraft: PromptDraft = {
        ...draftData,
        id: `draft-${Date.now()}`,
        lastModified: Date.now(),
      };
      setDrafts((prev) => [newDraft, ...prev]);
      showToast('Draft created');
    }
  };

  const deleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    showToast('Draft removed');
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      apiKeys: {
        ...prev.apiKeys,
        ...(newSettings.apiKeys || {}),
      },
      advancedRouting: {
        ...prev.advancedRouting,
        ...(newSettings.advancedRouting || {}),
      },
    }));
    showToast('Settings saved successfully');
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    showToast('Settings reset to default');
  };

  const openOptimizerWithText = (text: string, category: CategoryType = 'Coding', model: ModelType = 'GPT-4o') => {
    setOptimizerInitialPrompt(text);
    setOptimizerInitialCategory(category);
    setOptimizerInitialModel(model);
    setIsOptimizerOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isOptimizerOpen,
        setIsOptimizerOpen,
        optimizerInitialPrompt,
        setOptimizerInitialPrompt,
        optimizerInitialCategory,
        setOptimizerInitialCategory,
        optimizerInitialModel,
        setOptimizerInitialModel,
        selectedLog,
        setSelectedLog,
        logs,
        addLog,
        deleteLog,
        toggleFavoriteLog,
        clearAllLogs,
        templates,
        addTemplate,
        deleteTemplate,
        toggleFavoriteTemplate,
        drafts,
        saveDraft,
        deleteDraft,
        settings,
        updateSettings,
        resetSettings,
        toastMessage,
        showToast,
        openOptimizerWithText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
