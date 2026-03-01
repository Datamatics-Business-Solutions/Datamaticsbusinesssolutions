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
import { UnifiedKpiCard } from '../components/UnifiedKpiCard';

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

        {/* Payment Distribution with UnifiedKpiCard */}
        <div className={`rounded-xl p-6 pb-6 pt-8 mb-5 border backdrop-blur-md animate-fadeIn ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-sm font-semibold mb-6 flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <PieChartIcon className="w-4 h-4" />
            Payment Distribution
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <UnifiedKpiCard
              index={0}
              icon={PieChartIcon}
              iconColor={isDark ? 'text-gray-400' : 'text-[#5A555D]'}
              iconBg={isDark ? 'bg-gradient-to-br from-[#5A555D]/20 to-[#5A555D]/10' : 'bg-gradient-to-br from-[#5A555D]/10 to-[#5A555D]/5'}
              value={`$${(totalAmount / 1000).toFixed(1)}K`}
              label="Total Amount"
              footer={`${filteredInvoices.length} total invoices`}
            />
            <UnifiedKpiCard
              index={1}
              icon={CheckCircle}
              iconColor="text-[#0F9D58]"
              iconBg={isDark ? 'bg-gradient-to-br from-[#0F9D58]/20 to-[#0F9D58]/10' : 'bg-gradient-to-br from-[#0F9D58]/10 to-[#0F9D58]/5'}
              value={`$${(totalPaid / 1000).toFixed(1)}K`}
              label="Total Paid"
              footer={`${paidCount} invoices • ${((totalPaid / totalAmount) * 100).toFixed(1)}%`}
            />
            <UnifiedKpiCard
              index={2}
              icon={Clock}
              iconColor="text-[#F4B400]"
              iconBg={isDark ? 'bg-gradient-to-br from-[#F4B400]/20 to-[#F4B400]/10' : 'bg-gradient-to-br from-[#F4B400]/10 to-[#F4B400]/5'}
              value={`$${(totalPending / 1000).toFixed(1)}K`}
              label="Pending"
              footer={`${pendingCount} invoices • ${((totalPending / totalAmount) * 100).toFixed(1)}%`}
            />
            <UnifiedKpiCard
              index={3}
              icon={AlertCircle}
              iconColor="text-[#EA4335]"
              iconBg={isDark ? 'bg-gradient-to-br from-[#EA4335]/20 to-[#EA4335]/10' : 'bg-gradient-to-br from-[#EA4335]/10 to-[#EA4335]/5'}
              value={`$${(totalOverdue / 1000).toFixed(1)}K`}
              label="Overdue"
              footer={`${overdueCount} invoices • ${((totalOverdue / totalAmount) * 100).toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Overdue Alert Banner */}
        {overdueInvoice && (
          <div className="bg-[#FEF2F2] border border-[rgba(220,38,38,0.15)] rounded-[10px] px-4 py-3 mb-5 flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
            <div className="flex-1 text-sm text-[#1E1E1E]">
              <span className="font-semibold">{overdueInvoice.invoiceNumber}</span> — {overdueInvoice.campaignName} is overdue by {getDaysOverdue(overdueInvoice.dueDate)} days. ${overdueInvoice.amount.toLocaleString()} was due {new Date(overdueInvoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
            </div>
            <Link to={`/payment/${overdueInvoice.id}`}>
              <motion.button 
                className="px-4 py-2 rounded-lg border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all text-sm font-medium whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pay Now →
              </motion.button>
            </Link>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search invoices by number or campaign..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border text-base ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-[#BA2027]/20`}
            />
          </div>
          <div className="flex gap-3">
            {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  statusFilter === status
                    ? isDark
                      ? 'bg-gradient-to-r from-[#E63946] to-[#BA2027] text-white shadow-lg'
                      : 'bg-gradient-to-r from-[#BA2027] to-[#8E1C22] text-white shadow-lg'
                    : isDark
                      ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Table */}
        <div className={`rounded-xl border backdrop-blur-md overflow-hidden ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInvoices(filteredInvoices.map(inv => inv.id));
                        } else {
                          setSelectedInvoices([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Invoice</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Campaign</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Amount</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Due Date</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <TableRow key={invoice.id} index={index}>
                    <td className="px-6 py-4">
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
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isDark ? 'bg-white/10' : 'bg-gray-100'
                        }`}>
                          <FileText className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <div className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {invoice.invoiceNumber}
                          </div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {invoice.issueDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {invoice.campaignName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${invoice.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      {invoice.status === 'Pending' && getDaysUntilDue(invoice.dueDate) <= 3 && (
                        <div className="text-xs text-[#D97706] mt-1">
                          Due in {getDaysUntilDue(invoice.dueDate)} days
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className={`p-2 rounded-lg transition-all ${
                            isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Eye className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                        </button>
                        <button
                          onClick={() => toast.success('Downloading invoice...')}
                          className={`p-2 rounded-lg transition-all ${
                            isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Download className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                        </button>
                        {invoice.status !== 'Paid' && (
                          <Link to={`/payment/${invoice.id}`}>
                            <motion.button
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Pay Now
                            </motion.button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedInvoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <span className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={handleBulkDownload}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isDark
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Download className="w-4 h-4 inline mr-2" />
                Download Selected
              </button>
            </div>
          </motion.div>
        )}

        {/* Payment Timeline */}
        <div className="mt-6">
          <PaymentTimeline />
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {showPreview && previewInvoice && (
          <InvoicePreviewModal
            invoice={previewInvoice}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
