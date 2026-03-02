// Stub file - dark mode has been removed from the app
// This file only exists to prevent import errors
// All components should be updated to remove useTheme() calls

export function useTheme() {
  return {
    theme: 'light' as const,
    toggleTheme: () => {
      // No-op: dark mode removed
    }
  };
}
