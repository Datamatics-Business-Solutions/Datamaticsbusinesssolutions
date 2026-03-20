import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  ArrowRightLeft,
  CreditCard,
  Search,
  ChevronDown,
  Download,
  DollarSign,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppLayout } from '../components/AppLayout';
import { TableRow } from '../components/TableRow';
import { InvoicePreviewModal } from '../components/InvoicePreviewModal';
import { mockInvoices } from '../mockInvoices';
import { useDebounce } from '../hooks/useDebounce';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/SkeletonLoader';

export default function Invoices() {
  useDocumentTitle('Invoices');
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      invoice.campaignName.toLowerCase().includes(debouncedSearch.toLowerCase());
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
        return 'badge badge-active';
      case 'Pending':
        return 'badge badge-paused';
      case 'Overdue':
        return 'badge badge-paused';
      default:
        return 'badge badge-completed';
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

  return (
    <AppLayout>
      <div className={`max-w-[1440px] mx-auto page-content animate-fadeIn`}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 md:mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 style={{ color: 'var(--color-text-primary)' }} className="text-2xl md:text-3xl lg:text-4xl">Invoices & Billing</h1>
            </div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Manage your invoices and payment history
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Link to="/payment" className="btn-outline px-4 py-2.5 flex items-center justify-center gap-2 no-underline">
              <CreditCard className="w-4 h-4" />
              <span className="whitespace-nowrap">Payment Methods</span>
            </Link>
            <button
              onClick={handleBulkDownload}
              className="btn-primary px-4 py-2.5 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="whitespace-nowrap">Download Selected</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6 stagger-children">
          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-info-bg)' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--color-info)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={totalAmount} prefix="$" /></div>
            <div className="kpi-card__label">Total Amount</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={totalPaid} prefix="$" /></div>
            <div className="kpi-card__label">Paid ({paidCount})</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-warning-bg)' }}>
                <Clock className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={totalPending} prefix="$" /></div>
            <div className="kpi-card__label">Pending ({pendingCount})</div>
          </div>

          <div className="kpi-card animate-slideInUp">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-error-bg)' }}>
                <AlertCircle className="w-5 h-5" style={{ color: 'var(--color-error)' }} />
              </div>
            </div>
            <div className="kpi-card__number"><AnimatedCounter value={totalOverdue} prefix="$" /></div>
            <div className="kpi-card__label">Overdue ({overdueCount})</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by invoice number or campaign..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base w-full pl-10 pr-4 py-3"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-base px-4 py-3 pr-10 appearance-none cursor-pointer w-full sm:w-auto"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
          </div>
        </div>

        {/* Invoices Table — desktop (sm+) */}
        <div className="glass-card overflow-hidden hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="table-header">
                <tr>
                  <th className="table-th">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="accent-[#BA2027] cursor-pointer"
                        style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', maxWidth: '18px', maxHeight: '18px' }}
                        checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvoices(filteredInvoices.map(inv => inv.id));
                          } else {
                            setSelectedInvoices([]);
                          }
                        }}
                      />
                    </div>
                  </th>
                  <th className="table-th">Invoice</th>
                  <th className="table-th">Campaign</th>
                  <th className="table-th text-right">Amount</th>
                  <th className="table-th">Due Date</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton rows={6} columns={7} />
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState
                        icon={FileText}
                        title="No invoices found"
                        description="No invoices match your current filters. Try adjusting your search or status filter."
                        actionLabel="Clear Filters"
                        onAction={() => { setSearchTerm(''); setStatusFilter('All'); }}
                      />
                    </td>
                  </tr>
                ) : filteredInvoices.map((invoice, index) => {
                    const daysUntil = getDaysUntilDue(invoice.dueDate);
                    const paymentInfo = getPaymentMethod(invoice.status);
                    const PaymentIcon = paymentInfo.icon;

                    return (
                      <TableRow
                        key={invoice.id}
                        showHoverEffect={true}
                        animationDelay={index * 50}
                      >
                        <td className="table-td" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="accent-[#BA2027] cursor-pointer"
                              style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', maxWidth: '18px', maxHeight: '18px' }}
                              checked={selectedInvoices.includes(invoice.id)}
                              onChange={() => {
                                if (selectedInvoices.includes(invoice.id)) {
                                  setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                                } else {
                                  setSelectedInvoices([...selectedInvoices, invoice.id]);
                                }
                              }}
                            />
                          </div>
                        </td>
                        <td className="table-td">
                          <div className="t1">{invoice.invoiceNumber}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <PaymentIcon className="w-3 h-3 t3" />
                            <span className="t3">{paymentInfo.method}</span>
                          </div>
                        </td>
                        <td className="table-td">
                          <span className="t1">{invoice.campaignName}</span>
                        </td>
                        <td className="table-td text-right">
                          <span className="t1">${invoice.amount.toLocaleString()}</span>
                        </td>
                        <td className="table-td">
                          <div className="t1">{new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          {invoice.status !== 'Paid' && (
                            <div className="t3" style={{ color: daysUntil < 0 ? 'var(--color-error)' : undefined }}>
                              {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `Due in ${daysUntil} days`}
                            </div>
                          )}
                        </td>
                        <td className="table-td">
                          <div className={getStatusColor(invoice.status)}>
                            {getStatusIcon(invoice.status)}
                            <span>{invoice.status}</span>
                          </div>
                        </td>
                        <td className="table-td">
                          <div className="flex items-center gap-1">
                            {(invoice.status === 'Pending' || invoice.status === 'Overdue') ? (
                              <button
                                onClick={() => navigate(`/payment/${invoice.id}`)}
                                className="btn-ghost p-2"
                                title="Pay now"
                              >
                                <DollarSign className="w-4 h-4 text-[#BA2027]" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleViewInvoice(invoice)}
                                className="btn-ghost p-2"
                                title="View invoice"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => toast.success(`Downloading ${invoice.invoiceNumber}...`)}
                              className="btn-ghost p-2"
                              title="Download invoice"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </TableRow>
                    );
                  })}
                </tbody>
            </table>
          </div>
        </div>

        {/* Invoices Card List — mobile (below sm) */}
        <div className="sm:hidden flex flex-col gap-3">
          {isLoading ? (
            <div className="glass-card p-4">
              <TableSkeleton rows={4} columns={1} />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="glass-card p-4">
              <EmptyState
                icon={FileText}
                title="No invoices found"
                description="No invoices match your current filters. Try adjusting your search or status filter."
                actionLabel="Clear Filters"
                onAction={() => { setSearchTerm(''); setStatusFilter('All'); }}
              />
            </div>
          ) : filteredInvoices.map((invoice) => {
            const daysUntil = getDaysUntilDue(invoice.dueDate);
            const paymentInfo = getPaymentMethod(invoice.status);
            const PaymentIcon = paymentInfo.icon;

            return (
              <div key={invoice.id} className="glass-card p-4 flex flex-col gap-3">
                {/* Row 1: Invoice number + payment method */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold t1">{invoice.invoiceNumber}</span>
                  <div className="flex items-center gap-1">
                    <PaymentIcon className="w-3.5 h-3.5 t3" />
                    <span className="t3 text-sm">{paymentInfo.method}</span>
                  </div>
                </div>

                {/* Row 2: Campaign name */}
                <div className="t3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {invoice.campaignName}
                </div>

                {/* Row 3: Amount + status badge */}
                <div className="flex items-center justify-between">
                  <span className="font-bold t1 text-base">${invoice.amount.toLocaleString()}</span>
                  <div className={getStatusColor(invoice.status)}>
                    {getStatusIcon(invoice.status)}
                    <span>{invoice.status}</span>
                  </div>
                </div>

                {/* Row 4: Due date + overdue/days remaining */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="t1">
                    {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {invoice.status !== 'Paid' && (
                    <span className="t3" style={{ color: daysUntil < 0 ? 'var(--color-error)' : undefined }}>
                      {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` : `Due in ${daysUntil} days`}
                    </span>
                  )}
                </div>

                {/* Row 5: Action buttons */}
                <div className="flex gap-2 pt-1">
                  {(invoice.status === 'Pending' || invoice.status === 'Overdue') ? (
                    <button
                      onClick={() => navigate(`/payment/${invoice.id}`)}
                      className="btn-primary flex-1 flex items-center justify-center gap-2 py-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Pay Now</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleViewInvoice(invoice)}
                      className="btn-outline flex-1 flex items-center justify-center gap-2 py-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  )}
                  <button
                    onClick={() => toast.success(`Downloading ${invoice.invoiceNumber}...`)}
                    className="btn-outline flex-1 flex items-center justify-center gap-2 py-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        invoice={previewInvoice}
      />
    </AppLayout>
  );
}