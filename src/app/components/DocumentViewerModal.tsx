import { X, Download, Share2, Trash2, Edit, ZoomIn, ZoomOut, FileText, Pen } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any;
}

export function DocumentViewerModal({ isOpen, onClose, document }: DocumentViewerModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !document) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />
      <div 
        className={`fixed inset-4 md:inset-8 rounded-2xl shadow-2xl border z-50 flex flex-col animate-scaleIn ${
          isDark ? 'bg-[#16151A] border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-[#E63946]' : 'text-[#BA2027]'}`} />
            <div className="min-w-0">
              <h3 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {document.name}
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {document.size} • Uploaded {new Date(document.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className={`text-sm font-medium px-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className={`w-px h-6 mx-2 ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
            <button
              onClick={() => toast.success('Downloading document...')}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.info('Share link copied to clipboard')}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {document.type === 'SOW' || document.type === 'Contract' ? (
              <button
                onClick={() => toast.info('DocuSign integration coming soon')}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                  isDark
                    ? 'bg-[#E63946] hover:bg-[#FF4D5A] text-white'
                    : 'bg-[#BA2027] hover:bg-[#A01C22] text-white'
                }`}
                title="Sign with DocuSign"
              >
                <Pen className="w-4 h-4" />
                Sign
              </button>
            ) : null}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Preview */}
        <div className={`flex-1 overflow-auto p-8 ${isDark ? 'bg-[#0D0D0F]' : 'bg-gray-50'}`}>
          <div 
            className={`mx-auto shadow-2xl rounded-lg overflow-hidden ${
              isDark ? 'bg-white' : 'bg-white'
            }`}
            style={{ 
              width: `${zoom}%`,
              maxWidth: '210mm',
              minHeight: '297mm',
              transition: 'width 0.2s'
            }}
          >
            {/* PDF Preview Placeholder */}
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Document Preview</p>
              <p className="text-sm">PDF viewer would render here</p>
              <p className="text-xs mt-4 text-gray-400">{document.name}</p>
            </div>
          </div>
        </div>

        {/* Footer with document info */}
        <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between text-sm">
            <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              <span>Uploaded by {document.uploadedBy}</span>
              {document.campaign && (
                <>
                  <span className="mx-2">•</span>
                  <span>{document.campaign}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                document.status === 'Active'
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {document.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
