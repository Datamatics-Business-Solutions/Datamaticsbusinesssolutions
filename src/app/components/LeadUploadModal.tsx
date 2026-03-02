import { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockCsvPreview } from '../mockData';

interface LeadUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
}

type ColumnMapping = 'First Name' | 'Last Name' | 'Email' | 'Phone' | 'Company' | 'Job Title' | 'Source' | 'Ignore';

export function LeadUploadModal({ isOpen, onClose, clientName }: LeadUploadModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [columnMappings, setColumnMappings] = useState<Record<string, ColumnMapping>>({});
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit');
      return;
    }
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      alert('Please upload a .csv or .xlsx file');
      return;
    }
    setSelectedFile(file);
    setStep(2);
    
    // Initialize column mappings with smart defaults
    const headers = Object.keys(mockCsvPreview[0]);
    const mappings: Record<string, ColumnMapping> = {};
    headers.forEach(header => {
      mappings[header] = header as ColumnMapping;
    });
    setColumnMappings(mappings);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleConfirm = () => {
    const count = mockCsvPreview.length * 10; // Mock: simulate batch upload
    setUploadedCount(count);
    setStep(3);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedFile(null);
    setColumnMappings({});
    setUploadedCount(0);
    onClose();
  };

  const handleViewLeads = () => {
    handleClose();
    window.location.href = '/leads';
  };

  const columnOptions: ColumnMapping[] = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Company',
    'Job Title',
    'Source',
    'Ignore',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden card-shadow-lg"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Upload Leads
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {step === 1 && 'Upload a CSV or Excel file'}
              {step === 2 && 'Map columns and preview data'}
              {step === 3 && 'Upload complete'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-background-muted">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    s === step
                      ? 'bg-primary text-primary-foreground'
                      : s < step
                      ? 'bg-[#0F9D58] text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-1 ${
                      s < step ? 'bg-[#0F9D58]' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <AnimatePresence mode="wait">
            {/* STEP 1: Upload */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground mb-1">
                        Drag and drop your file here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse
                      </p>
                    </div>
                    <label className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all cursor-pointer">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        accept=".csv,.xlsx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: .xlsx, .csv • Max file size: 10MB
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Preview & Mapping */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {selectedFile?.name || 'leads_upload.csv'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {((selectedFile?.size || 125000) / 1024).toFixed(0)} KB • {mockCsvPreview.length} rows
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Map Columns
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Match each column from your file to the corresponding field
                  </p>

                  <div className="space-y-3 mb-6">
                    {Object.keys(mockCsvPreview[0]).map((header) => (
                      <div key={header} className="flex items-center gap-3">
                        <div className="w-40 text-sm font-medium text-foreground">
                          {header}
                        </div>
                        <div className="flex-1 relative">
                          <select
                            value={columnMappings[header] || 'Ignore'}
                            onChange={(e) =>
                              setColumnMappings({
                                ...columnMappings,
                                [header]: e.target.value as ColumnMapping,
                              })
                            }
                            className="w-full px-4 py-2 text-sm bg-input-background border border-border rounded-lg appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {columnOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      Preview (First 5 rows)
                    </h3>
                    <div className="overflow-x-auto border border-border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/30">
                          <tr>
                            {Object.keys(mockCsvPreview[0]).map((header) => (
                              <th
                                key={header}
                                className="px-4 py-2 text-left font-semibold text-foreground border-b border-border whitespace-nowrap"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {mockCsvPreview.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="border-b border-border last:border-0">
                              {Object.values(row).map((val, i) => (
                                <td
                                  key={i}
                                  className="px-4 py-2 text-muted-foreground whitespace-nowrap"
                                >
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2.5 text-sm font-semibold text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-all"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg transition-all"
                  >
                    Confirm & Upload
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-8 text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex"
                >
                  <div className="w-20 h-20 rounded-full bg-[#0F9D58]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-[#0F9D58]" />
                  </div>
                </motion.div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    Upload Successful!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{uploadedCount} leads</span>{' '}
                    uploaded successfully to{' '}
                    <span className="font-semibold text-foreground">{clientName}</span>
                  </p>
                </div>

                <div className="flex gap-3 justify-center pt-4">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 text-sm font-semibold text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleViewLeads}
                    className="px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg transition-all"
                  >
                    View Leads
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
