import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
}

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Action menu */}
      {isOpen && (
        <div className="mb-4 space-y-3 animate-slideInUp">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center gap-3 justify-end group cursor-pointer"
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span
                className={`px-3 py-2 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDark ? 'bg-[#1A1820] text-white' : 'bg-white text-gray-900'
                }`}
              >
                {action.label}
              </span>
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform ${
                  action.color || (isDark ? 'bg-[#E63946]' : 'bg-[#BA2027]')
                }`}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all ${
          isDark 
            ? 'bg-gradient-to-br from-[#E63946] to-[#FF4D5A]' 
            : 'bg-gradient-to-br from-[#BA2027] to-[#D32F2F]'
        } ${isOpen ? 'rotate-45' : 'rotate-0'}`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
