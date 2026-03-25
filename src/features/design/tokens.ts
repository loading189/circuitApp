export const designTokens = {
  backgroundBase: 'var(--bg-base)',
  backgroundPanel: 'var(--bg-panel)',
  backgroundElevated: 'var(--bg-elevated)',
  accentPrimary: 'var(--accent-primary)',
  accentSecondary: 'var(--accent-secondary)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  borderSoft: 'var(--border-soft)',
  borderStrong: 'var(--border-strong)',
  glowSubtle: 'var(--glow-subtle)',
  glowActive: 'var(--glow-active)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  shadow: 'var(--shadow-elevation)',
} as const;

export type DesignTokenKey = keyof typeof designTokens;
