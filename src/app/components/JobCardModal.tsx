import { X, FileText } from 'lucide-react';
import { Campaign } from '../types';

interface JobCardModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export function JobCardModal({ campaign, onClose }: JobCardModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Job Card – {campaign.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Document styling */}
          <div className="border-2 border-gray-300 rounded-lg p-8 bg-white shadow-inner">
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
              <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                DatamaticsBPM
              </div>
              <div className="text-gray-600 text-sm">Business Process Management Solutions</div>
              <div className="text-lg font-semibold text-gray-900 mt-4">JOB CARD</div>
              <div className="text-sm text-gray-600 mt-1">Document No: JC-{campaign.id}-2026</div>
            </div>

            {/* Client Details */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 pb-2 border-b border-gray-300">
                Client Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Client Name:</span>
                  <span className="col-span-2 text-gray-900">{campaign.clientDetails.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Address:</span>
                  <span className="col-span-2 text-gray-900">{campaign.clientDetails.address}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Contact:</span>
                  <span className="col-span-2 text-gray-900">{campaign.clientDetails.contact}</span>
                </div>
              </div>
            </div>

            {/* Scope of Work */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 pb-2 border-b border-gray-300">
                Scope of Work
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-900">
                {campaign.scopeOfWork.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Target Volume & Pricing */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 pb-2 border-b border-gray-300">
                Target Volume & Pricing
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Service Type:</span>
                  <span className="col-span-2 text-gray-900">{campaign.serviceType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Target Volume:</span>
                  <span className="col-span-2 text-gray-900">{campaign.target} leads</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Pricing Model:</span>
                  <span className="col-span-2 text-gray-900">{campaign.pricingModel}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Campaign Duration:</span>
                  <span className="col-span-2 text-gray-900">
                    {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' – '}
                    {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Criteria */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 pb-2 border-b border-gray-300">
                Target Criteria & Filters
              </h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Geography:</span>
                  <span className="col-span-2 text-gray-900">{campaign.geo}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Industry:</span>
                  <span className="col-span-2 text-gray-900">{campaign.industry}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Company Revenue:</span>
                  <span className="col-span-2 text-gray-900">{campaign.revenueRange}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Employee Size:</span>
                  <span className="col-span-2 text-gray-900">{campaign.employeeSize}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-gray-600">Job Titles:</span>
                  <span className="col-span-2 text-gray-900">{campaign.jobTitles}</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 pb-2 border-b border-gray-300">
                Terms & Conditions
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                {campaign.terms}
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-12 pt-6 border-t-2 border-gray-300">
              <div>
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <div className="text-sm text-gray-900 font-medium">Client Signature</div>
                <div className="text-xs text-gray-600 mt-1">{campaign.clientDetails.name}</div>
                <div className="text-xs text-gray-600">Date: __________</div>
              </div>
              <div>
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <div className="text-sm text-gray-900 font-medium">DatamaticsBPM Signature</div>
                <div className="text-xs text-gray-600 mt-1">Authorized Representative</div>
                <div className="text-xs text-gray-600">Date: __________</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-colors">
            Send for e-signature
          </button>
        </div>
      </div>
    </div>
  );
}
