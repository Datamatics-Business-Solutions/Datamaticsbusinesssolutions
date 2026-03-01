import { X, FileText, FileSpreadsheet, Download, Check } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeData, setIncludeData] = useState(true);

  if (!isOpen) return null;

  const formats = [
    { id: 'pdf', label: 'PDF Report', icon: FileText, description: 'Formatted document with charts' },
    { id: 'excel', label: 'Excel Workbook', icon: FileSpreadsheet, description: 'Spreadsheet with multiple sheets' },
    { id: 'csv', label: 'CSV Data', icon: FileText, description: 'Raw data in comma-separated format' }
  ];

  const handleExport = () => {
    toast.success(`Exporting report as ${selectedFormat.toUpperCase()}...`);
    setTimeout(() => {
      toast.success('Export complete!');
      onClose();
    }, 1500);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-2xl border z-50 animate-scaleIn ${
          isDark ? 'bg-[#16151A] border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Export Report
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Export Format
            </label>
            <div className="space-y-2">
              {formats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id as any)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedFormat === format.id
                      ? isDark
                        ? 'border-[#E63946] bg-[#E63946]/10'
                        : 'border-[#BA2027] bg-[#BA2027]/5'
                      : isDark
                        ? 'border-white/10 hover:bg-white/5'
                        : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <format.icon className={`w-5 h-5 mt-0.5 ${
                      selectedFormat === format.id
                        ? isDark ? 'text-[#E63946]' : 'text-[#BA2027]'
                        : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className={`font-medium mb-1 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {format.label}
                      </div>
                      <div className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {format.description}
                      </div>
                    </div>
                    {selectedFormat === format.id && (
                      <Check className={`w-5 h-5 ${
                        isDark ? 'text-[#E63946]' : 'text-[#BA2027]'
                      }`} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Include in Export
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className={`w-5 h-5 rounded cursor-pointer transition-all appearance-none ${
                    isDark 
                      ? 'bg-white/10 border-2 border-white/20 hover:border-white/40' 
                      : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                  } checked:bg-[#E63946] checked:border-[#E63946] focus:ring-2 focus:ring-offset-0 focus:ring-[#E63946]/50 relative`}
                  style={{
                    backgroundImage: includeCharts
                      ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E\")`
                      : 'none',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Charts and visualizations
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeData}
                  onChange={(e) => setIncludeData(e.target.checked)}
                  className={`w-5 h-5 rounded cursor-pointer transition-all appearance-none ${
                    isDark 
                      ? 'bg-white/10 border-2 border-white/20 hover:border-white/40' 
                      : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                  } checked:bg-[#E63946] checked:border-[#E63946] focus:ring-2 focus:ring-offset-0 focus:ring-[#E63946]/50 relative`}
                  style={{
                    backgroundImage: includeData
                      ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E\")`
                      : 'none',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Raw data tables
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 p-6 border-t ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
              isDark
                ? 'border-white/10 text-gray-300 hover:bg-white/5'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white transition-all flex items-center justify-center gap-2 ${
              isDark
                ? 'bg-gradient-to-r from-[#E63946] to-[#FF4D5A]'
                : 'bg-gradient-to-r from-[#BA2027] to-[#D32F2F]'
            }`}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </>
  );
}