import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassNavigation } from '../components/GlassNavigation';
import { useTheme } from '../context/ThemeContext';
import { Download, Search, FileText, CheckCircle, Clock, AlertCircle, Eye, CreditCard, PieChart as PieChartIcon, Building2, ArrowRightLeft, Calendar } from 'lucide-react';
import { TableRow } from '../components/TableRow';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { mockInvoices } from '../mockInvoices';
import { PaymentTimeline } from '../components/PaymentTimeline';
import { InvoicePreviewModal } from '../components/InvoicePreviewModal';

export default function Invoices() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [pageLoaded, setPageLoaded] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  const backgroundStyle = isDark
    ? { background: 'linear-gradient(135deg, #0F1117 0%, #1a1025 100%)', minHeight: '100vh' }
    : { background: '#F2F4F7', minHeight: '100vh' };

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPaid = mockInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = mockInvoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = mockInvoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const totalAmount = totalPaid + totalPending + totalOverdue;

  const paidCount = mockInvoices.filter(inv => inv.status === 'Paid').length;
  const pendingCount = mockInvoices.filter(inv => inv.status === 'Pending').length;
  const overdueCount = mockInvoices.filter(inv => inv.status === 'Overdue').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-[#059669] bg-[#ECFDF5] border-[rgba(5,150,105,0.2)]';
      case 'Pending':
        return 'text-[#D97706] bg-[#FFFBEB] border-[rgba(217,119,6,0.2)]';
      case 'Overdue':
        return 'text-[#DC2626] bg-[#FEF2F2] border-[rgba(220,38,38,0.2)]';
      default:
        return 'text-gray-500 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleBulkDownload = () => {
    if (selectedInvoices.length === 0) {
      toast.error('Please select invoices first');
      return;
    }
    toast.success(`Downloading ${selectedInvoices.length} invoices...`);
  };

  const handleViewInvoice = (invoice: any) => {
    setPreviewInvoice(invoice);
    setShowPreview(true);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPaymentMethod = (status: string) => {
    if (status === 'Paid') return { method: 'Wire Transfer', icon: Building2 };
    if (status === 'Pending') return { method: 'ACH', icon: ArrowRightLeft };
    if (status === 'Overdue') return { method: 'Credit Card', icon: CreditCard };
    return { method: 'N/A', icon: FileText };
  };

  // Find overdue invoice for banner
  const overdueInvoice = mockInvoices.find(inv => inv.status === 'Overdue');
  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div style={backgroundStyle} className={`transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <GlassNavigation />
      
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 className={`${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-2`}>
              Invoices & Billing
            </h1>
            <p className={`text-sm ${isDark ? 'text-[#B0AEBB]' : 'text-[#6B6B6B]'}`}>
              {filteredInvoices.length} invoices • ${totalAmount.toLocaleString()} total
            </p>
          </div>
        </div>

        {/* Payment Distribution Chart - SECTION 1: REDESIGNED */}
        <div className={`rounded-xl p-6 pb-6 pt-8 mb-5 border backdrop-blur-md animate-fadeIn ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-6 flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <PieChartIcon className="w-4 h-4" />
            Payment Distribution
          </h3>
          
          {/* Four-column grid layout */}
          <div className="grid grid-cols-4 gap-4">
            {/* Total Amount Box */}
            <div className={`rounded-xl p-4 border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                  Total Amount
                </span>
                <PieChartIcon className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>
              <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${(totalAmount / 1000).toFixed(1)}K
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>
                {filteredInvoices.length} total invoices
              </div>
            </div>

            {/* Total Paid Box */}
            <div className={`rounded-xl p-4 border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                  Total Paid
                </span>
                <CheckCircle className="w-4 h-4 text-[#0F9D58]" />
              </div>
              <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${(totalPaid / 1000).toFixed(1)}K
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>
                {paidCount} invoices • {((totalPaid / totalAmount) * 100).toFixed(1)}%
              </div>
            </div>
            
            {/* Pending Box */}
            <div className={`rounded-xl p-4 border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                  Pending
                </span>
                <Clock className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${(totalPending / 1000).toFixed(1)}K
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>
                {pendingCount} invoices • {((totalPending / totalAmount) * 100).toFixed(1)}%
              </div>
            </div>
            
            {/* Overdue Box */}
            <div className={`rounded-xl p-4 border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                  Overdue
                </span>
                <AlertCircle className="w-4 h-4 text-[#EA4335]" />
              </div>
              <div className={`text-2xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${(totalOverdue / 1000).toFixed(1)}K
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#6B7280]'}`}>
                {overdueCount} invoices • {((totalOverdue / totalAmount) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Overdue Alert Banner */}
        {overdueInvoice && (
          <div className="bg-[#FEF2F2] border border-[rgba(220,38,38,0.15)] rounded-[10px] px-4 py-3 mb-5 flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
            <div className="flex-1 text-sm text-[#1E1E1E]">
              <span className="font-semibold">{overdueInvoice.invoiceNumber}</span> — {overdueInvoice.campaignName} is overdue by {getDaysOverdue(overdueInvoice.dueDate)} days. ${overdueInvoice.amount.toLocaleString()} was due {new Date(overdueInvoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
            </div>
            <Link to={`/payment/${overdueInvoice.id}`}>
              <button className="px-4 py-2 rounded-lg border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all text-sm font-medium whitespace-nowrap">
                Pay Now →
              </button>
            </Link>
          </div>
        )}

        {/* SECTION 4: Filters with Date Range */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-5">
          <div className="lg:col-span-5 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search invoices by number or campaign..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full h-[42px] pl-10 pr-4 rounded-lg border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-[#E63946]'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#BA2027]'
              } outline-none`}
            />
          </div>
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full h-[42px] px-4 rounded-lg border transition-all ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } outline-none`}
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <button
              className={`w-full h-[42px] px-4 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Date Range</span>
            </button>
          </div>
          <div className="lg:col-span-3 flex gap-2">
            <button
              onClick={handleBulkDownload}
              className={`flex-1 h-[42px] px-4 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Download</span>
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div 
          className={`rounded-xl overflow-hidden animate-fadeIn ${
            isDark ? 'bg-white/5 backdrop-blur-md' : 'bg-white'
          }`}
          style={isDark ? {
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 4px 32px rgba(0, 0, 0, 0.4)'
          } : {
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)'
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} border-b ${
                  isDark ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInvoices(filteredInvoices.map(inv => inv.id));
                        } else {
                          setSelectedInvoices([]);
                        }
                      }}
                      checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      className={`w-4 h-4 rounded cursor-pointer transition-all appearance-none ${
                        isDark 
                          ? 'bg-white/10 border-2 border-white/20 hover:border-white/40' 
                          : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                      } checked:bg-[#E63946] checked:border-[#E63946] focus:ring-2 focus:ring-offset-0 focus:ring-[#E63946]/50 relative`}
                      style={{
                        backgroundImage: selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0 
                          ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")`
                          : 'none',
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ minWidth: '150px' }}>
                    Invoice #
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ width: '220px', maxWidth: '220px' }}>
                    Campaign
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Timeline
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Amount
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Method
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Status
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => {
                  const paymentMethod = getPaymentMethod(invoice.status);
                  const PaymentIcon = paymentMethod.icon;
                  
                  return (
                  <TableRow
                    key={invoice.id}
                    onClick={() => handleViewInvoice(invoice)}
                    animationDelay={index * 30}
                  >
                    <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvoices([...selectedInvoices, invoice.id]);
                          } else {
                            setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                          }
                        }}
                        className={`w-4 h-4 rounded cursor-pointer transition-all appearance-none ${
                          isDark 
                            ? 'bg-white/10 border-2 border-white/20 hover:border-white/40' 
                            : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                        } checked:bg-[#E63946] checked:border-[#E63946] focus:ring-2 focus:ring-offset-0 focus:ring-[#E63946]/50 relative`}
                        style={{
                          backgroundImage: selectedInvoices.includes(invoice.id)
                            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")`
                            : 'none',
                          backgroundSize: '100% 100%',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    </td>
                    <td className="px-6 py-3">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {invoice.invoiceNumber}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(invoice.issueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div 
                        className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} overflow-hidden text-ellipsis whitespace-nowrap`}
                        title={invoice.campaignName}
                      >
                        {invoice.campaignName}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="w-36">
                        <PaymentTimeline
                          status={invoice.status as any}
                          issueDate={invoice.issueDate}
                          dueDate={invoice.dueDate}
                          compact={true}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${invoice.amount.toLocaleString()}
                      </div>
                      {invoice.status === 'Pending' && getDaysUntilDue(invoice.dueDate) > 0 && (
                        <div className="text-xs text-gray-500">
                          Due in {getDaysUntilDue(invoice.dueDate)} days
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <PaymentIcon className="w-4 h-4" />
                        <span>{paymentMethod.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium ${
                        getStatusColor(invoice.status)
                      }`}>
                        {getStatusIcon(invoice.status)}
                        <span className="text-sm">{invoice.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                          }`}
                          title="View Invoice"
                        >
                          <Eye className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        </button>
                        <button
                          onClick={() => toast.success('Downloading invoice...')}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                          }`}
                          title="Download"
                        >
                          <Download className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        </button>
                        {(invoice.status === 'Pending' || invoice.status === 'Overdue') && (
                          <Link to={`/payment/${invoice.id}`}>
                            <button 
                              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium ${
                                isDark
                                  ? 'border-2 border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white'
                                  : 'border-2 border-[#BA2027] text-[#BA2027] hover:bg-[#BA2027] hover:text-white'
                              }`}
                            >
                              <CreditCard className="w-3 h-3" />
                              Pay
                            </button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </TableRow>
                )})}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className={`w-12 h-12 mx-auto mb-3 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No invoices found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        invoice={previewInvoice}
      />
    </div>
  );
}