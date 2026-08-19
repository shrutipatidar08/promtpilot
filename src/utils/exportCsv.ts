import { PromptLog } from '../types';

export function exportLogsToCSV(logs: PromptLog[]) {
  if (!logs.length) return;

  const headers = ['Score', 'Category', 'Model', 'Timestamp', 'Original Prompt', 'Optimized Prompt', 'Original Tokens', 'Optimized Tokens', 'Techniques'];
  
  const rows = logs.map(log => [
    log.score.toFixed(1),
    `"${(log.category || '').replace(/"/g, '""')}"`,
    `"${(log.model || '').replace(/"/g, '""')}"`,
    `"${(log.timestamp || '').replace(/"/g, '""')}"`,
    `"${(log.originalPrompt || '').replace(/"/g, '""')}"`,
    `"${(log.optimizedPrompt || '').replace(/"/g, '""')}"`,
    log.originalTokens,
    log.optimizedTokens,
    `"${(log.techniquesApplied?.join(', ') || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `promptpilot-optimization-log-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
