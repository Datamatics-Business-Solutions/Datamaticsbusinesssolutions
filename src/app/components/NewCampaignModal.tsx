import { useState } from 'react';
import { X, Upload, Copy, Check, Mail, FileText, Sparkles } from 'lucide-react';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaign: CampaignFormData) => void;
}

export interface CampaignFormData {
  name: string;
  type: string;
  cpl: string;
  geography: 'US' | 'APAC' | 'EMEA';
  locations: string[];
  employeeSizeMin: string;
  employeeSizeMax: string;
  revenueSizeMin: string;
  revenueSizeMax: string;
  titles: string[];
  suppressionList?: File | null;
  additionalInfo: string;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const APAC_COUNTRIES = [
  'Australia', 'China', 'Hong Kong', 'India', 'Indonesia', 'Japan', 'Malaysia', 'New Zealand',
  'Philippines', 'Singapore', 'South Korea', 'Taiwan', 'Thailand', 'Vietnam'
];

const EMEA_COUNTRIES = [
  'Austria', 'Belgium', 'Czech Republic', 'Denmark', 'Finland', 'France', 'Germany', 'Greece',
  'Ireland', 'Italy', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'South Africa', 'Spain',
  'Sweden', 'Switzerland', 'United Arab Emirates', 'United Kingdom'
];

const EMPLOYEE_SIZES = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'
];

const CAMPAIGN_TYPES = [
  'Single Touch', 'Double Touch', 'BANT', 'Content Syndication', 'Appointment Setting', 'Custom'
];

const JOB_TITLE_SUGGESTIONS = [
  'CEO', 'CTO', 'CIO', 'CFO', 'VP Sales', 'VP Marketing', 'VP Engineering', 'Director IT',
  'Director Sales', 'Director Marketing', 'Manager IT', 'Manager Sales', 'CISO'
];

export function NewCampaignModal({ isOpen, onClose, onSubmit }: NewCampaignModalProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'email' | 'parse'>('manual');
  const [emailCopied, setEmailCopied] = useState(false);
  const [pastedEmail, setPastedEmail] = useState('');
  const [parsedData, setParsedData] = useState<CampaignFormData | null>(null);
  const [titleInput, setTitleInput] = useState('');
  
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    type: 'Single Touch',
    cpl: '',
    geography: 'US',
    locations: [],
    employeeSizeMin: '1-10',
    employeeSizeMax: '5000+',
    revenueSizeMin: '',
    revenueSizeMax: '',
    titles: [],
    suppressionList: null,
    additionalInfo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const clientName = 'johnsmith'; // This would come from auth context in real app
  const personalizedEmail = `newcampaign_${clientName}@datamaticsbpm.com`;

  const getLocationOptions = () => {
    switch (formData.geography) {
      case 'US': return US_STATES;
      case 'APAC': return APAC_COUNTRIES;
      case 'EMEA': return EMEA_COUNTRIES;
      default: return [];
    }
  };

  const handleLocationToggle = (location: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const handleAddTitle = () => {
    if (titleInput.trim() && !formData.titles.includes(titleInput.trim())) {
      setFormData(prev => ({
        ...prev,
        titles: [...prev.titles, titleInput.trim()]
      }));
      setTitleInput('');
    }
  };

  const handleRemoveTitle = (title: string) => {
    setFormData(prev => ({
      ...prev,
      titles: prev.titles.filter(t => t !== title)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setFormData(prev => ({ ...prev, suppressionList: file }));
    } else {
      alert('Please upload a CSV or Excel file');
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(personalizedEmail);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const parseEmailContent = () => {
    // Simple parsing logic for demo purposes
    const lowerText = pastedEmail.toLowerCase();
    
    const parsed: CampaignFormData = {
      name: '',
      type: 'Single Touch',
      cpl: '',
      geography: 'US',
      locations: [],
      employeeSizeMin: '1-10',
      employeeSizeMax: '5000+',
      revenueSizeMin: '',
      revenueSizeMax: '',
      titles: [],
      suppressionList: null,
      additionalInfo: ''
    };

    // Extract campaign name
    const nameMatch = pastedEmail.match(/(?:campaign name|name of campaign)[:\s]+([^\n]+)/i);
    if (nameMatch) parsed.name = nameMatch[1].trim();

    // Extract CPL
    const cplMatch = pastedEmail.match(/(?:cpl|cost per lead)[:\s]+\$?(\d+)/i);
    if (cplMatch) parsed.cpl = cplMatch[1];

    // Detect geography
    if (lowerText.includes('emea') || lowerText.includes('europe')) {
      parsed.geography = 'EMEA';
    } else if (lowerText.includes('apac') || lowerText.includes('asia')) {
      parsed.geography = 'APAC';
    } else {
      parsed.geography = 'US';
    }

    // Extract states/countries
    const locations: string[] = [];
    const allLocations = [...US_STATES, ...APAC_COUNTRIES, ...EMEA_COUNTRIES];
    allLocations.forEach(loc => {
      if (lowerText.includes(loc.toLowerCase())) {
        locations.push(loc);
      }
    });
    parsed.locations = locations;

    // Extract employee size
    const empMatch = pastedEmail.match(/(?:employee|employees)[:\s]+(\d+)[\s-]+to[\s-]+(\d+)/i);
    if (empMatch) {
      const min = parseInt(empMatch[1]);
      const max = parseInt(empMatch[2]);
      parsed.employeeSizeMin = EMPLOYEE_SIZES.find(s => s.includes(min.toString())) || '1-10';
      parsed.employeeSizeMax = EMPLOYEE_SIZES.find(s => s.includes(max.toString())) || '5000+';
    }

    // Extract revenue
    const revMatch = pastedEmail.match(/(?:revenue)[:\s]+\$?(\d+)M?[\s-]+to[\s-]+\$?(\d+)M?/i);
    if (revMatch) {
      parsed.revenueSizeMin = `$${revMatch[1]}M`;
      parsed.revenueSizeMax = `$${revMatch[2]}M`;
    }

    // Extract job titles
    const titles: string[] = [];
    JOB_TITLE_SUGGESTIONS.forEach(title => {
      if (lowerText.includes(title.toLowerCase())) {
        titles.push(title);
      }
    });
    parsed.titles = titles;

    // Detect campaign type
    if (lowerText.includes('bant')) parsed.type = 'BANT';
    else if (lowerText.includes('double touch')) parsed.type = 'Double Touch';
    else if (lowerText.includes('appointment')) parsed.type = 'Appointment Setting';
    else if (lowerText.includes('content syndication')) parsed.type = 'Content Syndication';

    // Extract additional info
    const additionalMatch = pastedEmail.match(/(?:additional info|additional requirements|notes)[:\s]+([^\n]+)/i);
    if (additionalMatch) parsed.additionalInfo = additionalMatch[1].trim();

    setParsedData(parsed);
  };

  const validateForm = (data: CampaignFormData): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) newErrors.name = 'Campaign name is required';
    if (!data.cpl || parseFloat(data.cpl) <= 0) newErrors.cpl = 'Valid CPL is required';
    if (data.locations.length === 0) newErrors.locations = 'At least one location is required';
    if (data.titles.length === 0) newErrors.titles = 'At least one job title is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const dataToSubmit = parsedData || formData;
    
    if (validateForm(dataToSubmit)) {
      onSubmit(dataToSubmit);
      onClose();
      // Reset form
      setFormData({
        name: '',
        type: 'Single Touch',
        cpl: '',
        geography: 'US',
        locations: [],
        employeeSizeMin: '1-10',
        employeeSizeMax: '5000+',
        revenueSizeMin: '',
        revenueSizeMax: '',
        titles: [],
        suppressionList: null,
        additionalInfo: ''
      });
      setParsedData(null);
      setPastedEmail('');
    }
  };

  const handleUseParsedData = () => {
    if (parsedData) {
      setFormData(parsedData);
      setActiveTab('manual');
      setParsedData(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#BA2027] to-[#BA2027]/80 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Submit New Campaign</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'manual'
                  ? 'border-[#BA2027] text-[#BA2027]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'email'
                  ? 'border-[#BA2027] text-[#BA2027]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-4 h-4 inline-block mr-2" />
              Email Instructions
            </button>
            <button
              onClick={() => setActiveTab('parse')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'parse'
                  ? 'border-[#BA2027] text-[#BA2027]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Sparkles className="w-4 h-4 inline-block mr-2" />
              Paste & Parse
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'manual' && (
            <div className="space-y-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Enterprise IT Security Q1 2026"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Campaign Type & CPL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent"
                  >
                    {CAMPAIGN_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Per Lead (CPL) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.cpl}
                      onChange={(e) => setFormData(prev => ({ ...prev, cpl: e.target.value }))}
                      className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent ${
                        errors.cpl ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="45"
                    />
                  </div>
                  {errors.cpl && <p className="text-red-500 text-sm mt-1">{errors.cpl}</p>}
                </div>
              </div>

              {/* Geography */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Geography <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mb-3">
                  {(['US', 'APAC', 'EMEA'] as const).map(geo => (
                    <label key={geo} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="geography"
                        value={geo}
                        checked={formData.geography === geo}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          geography: e.target.value as 'US' | 'APAC' | 'EMEA',
                          locations: [] // Reset locations when changing geography
                        }))}
                        className="w-4 h-4 text-[#BA2027] focus:ring-[#BA2027]"
                      />
                      <span className="ml-2 text-gray-700">{geo}</span>
                    </label>
                  ))}
                </div>

                {/* Location Multi-select */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select {formData.geography === 'US' ? 'States' : 'Countries'} <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {getLocationOptions().map(location => (
                      <label key={location} className="flex items-center cursor-pointer hover:bg-white px-2 py-1 rounded">
                        <input
                          type="checkbox"
                          checked={formData.locations.includes(location)}
                          onChange={() => handleLocationToggle(location)}
                          className={`w-4 h-4 rounded cursor-pointer transition-all appearance-none bg-white border-2 border-gray-300 hover:border-gray-400 checked:bg-[#BA2027] checked:border-[#BA2027] focus:ring-2 focus:ring-offset-0 focus:ring-[#BA2027]/50 relative`}
                          style={{
                            backgroundImage: formData.locations.includes(location)
                              ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E\")`
                              : 'none',
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.locations.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">{formData.locations.length} location(s) selected</p>
                )}
                {errors.locations && <p className="text-red-500 text-sm mt-1">{errors.locations}</p>}
              </div>

              {/* Employee Size Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Size Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                    <select
                      value={formData.employeeSizeMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeSizeMin: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent"
                    >
                      {EMPLOYEE_SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                    <select
                      value={formData.employeeSizeMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeSizeMax: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent"
                    >
                      {EMPLOYEE_SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Revenue Size Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Size Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Minimum (e.g., $1M, $50M)</label>
                    <input
                      type="text"
                      value={formData.revenueSizeMin}
                      onChange={(e) => setFormData(prev => ({ ...prev, revenueSizeMin: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent"
                      placeholder="$10M"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Maximum (e.g., $100M, $1B)</label>
                    <input
                      type="text"
                      value={formData.revenueSizeMax}
                      onChange={(e) => setFormData(prev => ({ ...prev, revenueSizeMax: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent"
                      placeholder="$500M"
                    />
                  </div>
                </div>
              </div>

              {/* Job Titles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Titles <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTitle())}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent ${
                      errors.titles ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Type title and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTitle}
                    className="px-4 py-2 bg-[#BA2027] text-white rounded-lg hover:bg-[#BA2027]/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {/* Suggestions */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TITLE_SUGGESTIONS.map(title => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => {
                          if (!formData.titles.includes(title)) {
                            setFormData(prev => ({ ...prev, titles: [...prev.titles, title] }));
                          }
                        }}
                        disabled={formData.titles.includes(title)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          formData.titles.includes(title)
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#BA2027] hover:text-[#BA2027]'
                        }`}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Titles */}
                {formData.titles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.titles.map(title => (
                      <span
                        key={title}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-[#BA2027] text-white rounded-full text-sm"
                      >
                        {title}
                        <button
                          type="button"
                          onClick={() => handleRemoveTitle(title)}
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.titles && <p className="text-red-500 text-sm mt-1">{errors.titles}</p>}
              </div>

              {/* Suppression List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suppression List (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#BA2027] transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="suppression-upload"
                  />
                  <label
                    htmlFor="suppression-upload"
                    className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Choose File
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Accepts CSV or Excel files</p>
                  {formData.suppressionList && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      ✓ {formData.suppressionList.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent"
                  placeholder="Any other specifications or requirements for this campaign..."
                />
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <Mail className="w-16 h-16 text-[#BA2027] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Submit via Email
                </h3>
                <p className="text-gray-600 mb-6">
                  Send your campaign requirements to your personalized email address
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Personalized Campaign Email:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={personalizedEmail}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={copyEmailToClipboard}
                    className="px-4 py-3 bg-[#BA2027] text-white rounded-lg hover:bg-[#BA2027]/90 transition-colors flex items-center gap-2"
                  >
                    {emailCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Email Template Example:</h4>
                <div className="bg-white rounded p-4 text-sm text-gray-700 space-y-2 border border-blue-100">
                  <p><strong>Subject:</strong> New Campaign Request - [Your Campaign Name]</p>
                  <p><strong>Campaign Name:</strong> Enterprise IT Security Q1 2026</p>
                  <p><strong>Geography:</strong> US (California, Texas, New York)</p>
                  <p><strong>Employee Size:</strong> 500 to 2000</p>
                  <p><strong>Revenue:</strong> $50M to $500M</p>
                  <p><strong>Job Titles:</strong> CIO, CISO, IT Director</p>
                  <p><strong>CPL:</strong> $45</p>
                  <p><strong>Campaign Type:</strong> Double Touch</p>
                  <p><strong>Additional Info:</strong> Need leads validated within 48 hours</p>
                </div>
              </div>

              <div className="text-center text-gray-600">
                <p className="text-sm">
                  We'll process your email and set up your campaign within 24 hours
                </p>
              </div>
            </div>
          )}

          {activeTab === 'parse' && (
            <div className="space-y-6">
              {!parsedData ? (
                <>
                  {/* Sample Email Template for Demo */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Try the Demo!
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Copy this sample email and paste it below to see how the parser works:
                    </p>
                    <div className="bg-white rounded p-3 text-xs font-mono text-gray-700 space-y-1 border border-blue-100 max-h-40 overflow-y-auto">
                      <p>Campaign Name: Enterprise Cloud Security Initiative 2026</p>
                      <p>Geography: EMEA</p>
                      <p>Countries: United Kingdom, Germany, France, Netherlands</p>
                      <p>Employee Size: 501 to 2000</p>
                      <p>Revenue: $100M to $500M</p>
                      <p>Job Titles: CIO, CISO, IT Director, Security Manager</p>
                      <p>CPL: $65</p>
                      <p>Campaign Type: BANT</p>
                      <p>Additional Info: Need leads qualified through phone verification. Weekly delivery preferred.</p>
                    </div>
                    <button
                      onClick={() => {
                        const sampleEmail = `Campaign Name: Enterprise Cloud Security Initiative 2026
Geography: EMEA
Countries: United Kingdom, Germany, France, Netherlands
Employee Size: 501 to 2000
Revenue: $100M to $500M
Job Titles: CIO, CISO, IT Director, Security Manager
CPL: $65
Campaign Type: BANT
Additional Info: Need leads qualified through phone verification. Weekly delivery preferred.`;
                        setPastedEmail(sampleEmail);
                      }}
                      className="mt-2 text-sm text-blue-700 hover:text-blue-900 font-medium"
                    >
                      Copy to textarea ↓
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste Your Campaign Request Email
                    </label>
                    <textarea
                      value={pastedEmail}
                      onChange={(e) => setPastedEmail(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#BA2027] focus:border-transparent font-mono text-sm"
                      placeholder="Paste your email content here. Include details like campaign name, geography, employee size, revenue, titles, CPL, campaign type, etc."
                    />
                  </div>

                  <button
                    onClick={parseEmailContent}
                    disabled={!pastedEmail.trim()}
                    className="w-full px-6 py-3 bg-[#BA2027] text-white rounded-lg hover:bg-[#BA2027]/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Parse Email & Extract Campaign Details
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <Check className="w-5 h-5" />
                      <h3 className="font-semibold">Email Parsed Successfully!</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      We've extracted the following details from your email. Review and edit if needed.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Campaign Name</p>
                      <p className="font-medium text-gray-900">{parsedData.name || 'Not detected'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Campaign Type</p>
                      <p className="font-medium text-gray-900">{parsedData.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">CPL</p>
                      <p className="font-medium text-gray-900">${parsedData.cpl || 'Not detected'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Geography</p>
                      <p className="font-medium text-gray-900">{parsedData.geography}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Locations ({parsedData.locations.length})</p>
                      <p className="font-medium text-gray-900">
                        {parsedData.locations.length > 0 ? parsedData.locations.join(', ') : 'None detected'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Employee Size</p>
                      <p className="font-medium text-gray-900">
                        {parsedData.employeeSizeMin} to {parsedData.employeeSizeMax}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue Range</p>
                      <p className="font-medium text-gray-900">
                        {parsedData.revenueSizeMin || 'N/A'} to {parsedData.revenueSizeMax || 'N/A'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Job Titles ({parsedData.titles.length})</p>
                      <p className="font-medium text-gray-900">
                        {parsedData.titles.length > 0 ? parsedData.titles.join(', ') : 'None detected'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleUseParsedData}
                      className="flex-1 px-6 py-3 bg-[#BA2027] text-white rounded-lg hover:bg-[#BA2027]/90 transition-colors"
                    >
                      Edit in Form
                    </button>
                    <button
                      onClick={() => setParsedData(null)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Parse Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {(activeTab === 'manual' || parsedData) && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#BA2027] text-white rounded-lg hover:bg-[#BA2027]/90 transition-colors"
            >
              Submit Campaign
            </button>
          </div>
        )}
      </div>
    </div>
  );
}