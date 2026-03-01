import { Upload, X, FileText, Check } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface UploadZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadZoneModal({ isOpen, onClose }: UploadZoneModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  const handleFileSelect = () => {
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            toast.success('Document uploaded successfully!');
            onClose();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl rounded-2xl shadow-2xl border z-50 animate-scaleIn ${
          isDark ? 'bg-[#16151A] border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Upload Document
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Upload contracts, SOWs, NDAs, and other documents
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? isDark
                  ? 'border-[#E63946] bg-[#E63946]/10'
                  : 'border-[#BA2027] bg-[#BA2027]/5'
                : isDark
                  ? 'border-white/20 hover:border-white/40'
                  : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {isUploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#E63946] to-[#FF4D5A] flex items-center justify-center">
                  {uploadProgress === 100 ? (
                    <Check className="w-8 h-8 text-white" />
                  ) : (
                    <Upload className="w-8 h-8 text-white animate-bounce" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {uploadProgress === 100 ? 'Upload Complete!' : 'Uploading...'}
                  </p>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    isDark ? 'bg-white/10' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-[#E63946] to-[#FF4D5A] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {uploadProgress}%
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDragging 
                    ? isDark ? 'text-[#E63946]' : 'text-[#BA2027]'
                    : isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <p className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  or click to browse
                </p>
                <button
                  onClick={handleFileSelect}
                  className={`px-6 py-2.5 rounded-lg text-white transition-all ${
                    isDark
                      ? 'bg-gradient-to-r from-[#E63946] to-[#FF4D5A]'
                      : 'bg-gradient-to-r from-[#BA2027] to-[#D32F2F]'
                  }`}
                >
                  Select Files
                </button>
                <p className={`text-xs mt-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
