import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  CreditCard, 
  Building2, 
  Lock, 
  CheckCircle, 
  ArrowLeft,
  Wallet,
  Smartphone
} from 'lucide-react';
import { GlassNavigation } from '../components/GlassNavigation';
import { useTheme } from '../context/ThemeContext';
import { mockInvoices } from '../mockInvoices';

export default function Payment() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const invoice = mockInvoices.find(inv => inv.id === invoiceId);
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  
  // ACH fields
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Professional BPM gradient background
  const backgroundStyle = isDark
    ? { background: 'linear-gradient(135deg, #0F1117 0%, #1a1025 100%)', minHeight: '100vh' }
    : { background: '#F2F4F7', minHeight: '100vh' };

  // iOS-style card styling
  const cardStyle = isDark
    ? { 
        background: '#1C1F2E', 
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }
    : { 
        background: '#FFFFFF', 
        border: '1px solid rgba(186, 32, 39, 0.08)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
      };

  if (!invoice) {
    return (
      <div style={backgroundStyle}>
        <GlassNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-4`}>
              Invoice not found
            </h2>
            <button
              onClick={() => navigate('/invoices')}
              className="text-[#BA2027] hover:text-[#A01C22] font-medium"
            >
              Return to Invoices
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/invoices');
      }, 3000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  if (paymentSuccess) {
    return (
      <div style={backgroundStyle}>
        <GlassNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl border p-12 text-center transition-all" style={cardStyle}>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-4`}>
              Payment Successful!
            </h2>
            <p className={`text-lg ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'} mb-2`}>
              Your payment of <span className="font-semibold">${invoice.amount.toLocaleString()}</span> has been processed.
            </p>
            <p className={`text-sm ${isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'} mb-8`}>
              Invoice {invoice.invoiceNumber}
            </p>
            <p className={`text-sm ${isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
              Redirecting to invoices...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <GlassNavigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/invoices')}
          className={`flex items-center gap-2 mb-6 ${isDark ? 'text-[#E63946] hover:text-[#FF4757]' : 'text-[#BA2027] hover:text-[#A01C22]'} font-medium transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </button>

        <h1 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-8`}>
          Complete Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="rounded-2xl border p-6 transition-all" style={cardStyle}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-6`}>
                Select Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? isDark 
                        ? 'border-[#E63946] bg-[#E63946]/10' 
                        : 'border-[#BA2027] bg-[#BA2027]/5'
                      : isDark
                        ? 'border-white/8 hover:border-white/20'
                        : 'border-[#1E293B]/8 hover:border-[#1E293B]/20'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'card' ? (isDark ? 'text-[#E63946]' : 'text-[#BA2027]') : (isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]')}`} />
                  <div className={`text-sm font-medium ${paymentMethod === 'card' ? (isDark ? 'text-[#E63946]' : 'text-[#BA2027]') : (isDark ? 'text-white' : 'text-[#1E1E1E]')}`}>
                    Credit Card
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('ach')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'ach'
                      ? isDark 
                        ? 'border-[#E63946] bg-[#E63946]/10' 
                        : 'border-[#BA2027] bg-[#BA2027]/5'
                      : isDark
                        ? 'border-white/8 hover:border-white/20'
                        : 'border-[#1E293B]/8 hover:border-[#1E293B]/20'
                  }`}
                >
                  <Building2 className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'ach' ? (isDark ? 'text-[#E63946]' : 'text-[#BA2027]') : (isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]')}`} />
                  <div className={`text-sm font-medium ${paymentMethod === 'ach' ? (isDark ? 'text-[#E63946]' : 'text-[#BA2027]') : (isDark ? 'text-white' : 'text-[#1E1E1E]')}`}>
                    ACH / Bank
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'wallet'
                      ? isDark 
                        ? 'border-[#E63946] bg-[#E63946]/10' 
                        : 'border-[#BA2027] bg-[#BA2027]/5'
                      : isDark
                        ? 'border-white/8 hover:border-white/20'
                        : 'border-[#1E293B]/8 hover:border-[#1E293B]/20'
                  }`}
                >
                  <Smartphone className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'wallet' ? (isDark ? 'text-[#E63946]' : 'text-[#BA2027]') : (isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]')}`} />
                  <div className={`text-sm font-medium ${paymentMethod === 'wallet' ? (isDark ? 'text-[#E63946]' : 'text-[#BA2027]') : (isDark ? 'text-white' : 'text-[#1E1E1E]')}`}>
                    Digital Wallet
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Details */}
            {paymentMethod === 'card' && (
              <div className="rounded-2xl border p-6 transition-all" style={cardStyle}>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-6`}>
                  Card Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'} mb-2`}>
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-3 pr-12 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FCFD]'} border ${isDark ? 'border-white/8' : 'border-[#1E293B]/8'} rounded-lg ${isDark ? 'text-white' : 'text-[#1E293B]'} focus:outline-none focus:ring-2 focus:ring-[#BA2027]/50 font-light`}
                      />
                      <CreditCard className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'}`} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'} mb-2`}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Smith"
                      className={`w-full px-4 py-3 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FCFD]'} border ${isDark ? 'border-white/8' : 'border-[#1E293B]/8'} rounded-lg ${isDark ? 'text-white' : 'text-[#1E293B]'} focus:outline-none focus:ring-2 focus:ring-[#BA2027]/50 font-light`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'} mb-2`}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-4 py-3 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FCFD]'} border ${isDark ? 'border-white/8' : 'border-[#1E293B]/8'} rounded-lg ${isDark ? 'text-white' : 'text-[#1E293B]'} focus:outline-none focus:ring-2 focus:ring-[#BA2027]/50 font-light`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'} mb-2`}>
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full px-4 py-3 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FCFD]'} border ${isDark ? 'border-white/8' : 'border-[#1E293B]/8'} rounded-lg ${isDark ? 'text-white' : 'text-[#1E293B]'} focus:outline-none focus:ring-2 focus:ring-[#BA2027]/50 font-light`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="w-4 h-4 text-[#BA2027] border-gray-300 rounded focus:ring-[#BA2027]"
                    />
                    <label htmlFor="saveCard" className={`text-sm ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                      Save card for future payments
                    </label>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'ach' && (
              <div className="rounded-2xl border p-6 transition-all" style={cardStyle}>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-6`}>
                  Bank Account Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'} mb-2`}>
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setAccountType('checking')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          accountType === 'checking'
                            ? isDark 
                              ? 'border-[#E63946] bg-[#E63946]/10 text-[#E63946]' 
                              : 'border-[#BA2027] bg-[#BA2027]/5 text-[#BA2027]'
                            : isDark
                              ? 'border-white/8 text-white'
                              : 'border-[#1E293B]/8 text-[#1E1E1E]'
                        }`}
                      >
                        Checking
                      </button>
                      <button
                        onClick={() => setAccountType('savings')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          accountType === 'savings'
                            ? isDark 
                              ? 'border-[#E63946] bg-[#E63946]/10 text-[#E63946]' 
                              : 'border-[#BA2027] bg-[#BA2027]/5 text-[#BA2027]'
                            : isDark
                              ? 'border-white/8 text-white'
                              : 'border-[#1E293B]/8 text-[#1E1E1E]'
                        }`}
                      >
                        Savings
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'} mb-2`}>
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').substring(0, 9))}
                      placeholder="123456789"
                      maxLength={9}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FCFD]'} border ${isDark ? 'border-white/8' : 'border-[#1E293B]/8'} rounded-lg ${isDark ? 'text-white' : 'text-[#1E293B]'} focus:outline-none focus:ring-2 focus:ring-[#BA2027]/50 font-light`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'} mb-2`}>
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').substring(0, 17))}
                      placeholder="000123456789"
                      maxLength={17}
                      className={`w-full px-4 py-3 ${isDark ? 'bg-[#0F172A]' : 'bg-[#F8FCFD]'} border ${isDark ? 'border-white/8' : 'border-[#1E293B]/8'} rounded-lg ${isDark ? 'text-white' : 'text-[#1E293B]'} focus:outline-none focus:ring-2 focus:ring-[#BA2027]/50 font-light`}
                    />
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      <strong>Note:</strong> ACH payments typically take 3-5 business days to process.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="rounded-2xl border p-6 transition-all" style={cardStyle}>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-6`}>
                  Digital Wallet
                </h2>
                <div className="space-y-4">
                  <button className="w-full p-4 bg-black text-white rounded-lg hover:bg-gray-900 transition-all flex items-center justify-center gap-3 font-medium">
                    <Wallet className="w-5 h-5" />
                    Pay with Apple Pay
                  </button>
                  <button className="w-full p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3 font-medium">
                    <Wallet className="w-5 h-5" />
                    Pay with Google Pay
                  </button>
                  <button className="w-full p-4 bg-[#635BFF] text-white rounded-lg hover:bg-[#5349E6] transition-all flex items-center justify-center gap-3 font-medium">
                    <Wallet className="w-5 h-5" />
                    Pay with Link
                  </button>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
              <Lock className={`w-5 h-5 mt-0.5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-900'}`}>
                  Secure Payment
                </div>
                <div className={`text-xs ${isDark ? 'text-green-400' : 'text-green-700'} mt-1`}>
                  Your payment information is encrypted and secure. We never store your full card details.
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border p-6 transition-all sticky top-24" style={cardStyle}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-6`}>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className={`text-sm ${isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'} mb-1`}>
                    Invoice Number
                  </div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                    {invoice.invoiceNumber}
                  </div>
                </div>
                
                <div>
                  <div className={`text-sm ${isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'} mb-1`}>
                    Campaign
                  </div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                    {invoice.campaignName}
                  </div>
                </div>
                
                <div>
                  <div className={`text-sm ${isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'} mb-1`}>
                    Due Date
                  </div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                    {new Date(invoice.dueDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              <div className={`border-t ${isDark ? 'border-white/8' : 'border-[#1E293B]/8'} pt-4 mb-6`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                    Subtotal
                  </span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                    ${invoice.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${isDark ? 'text-[#CBD5E1]' : 'text-[#475569]'}`}>
                    Processing Fee
                  </span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                    $0.00
                  </span>
                </div>
                <div className={`flex justify-between items-center pt-4 border-t ${isDark ? 'border-white/8' : 'border-[#1E293B]/8'}`}>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                    Total
                  </span>
                  <span className={`text-2xl font-semibold ${isDark ? 'text-[#E63946]' : 'text-[#BA2027]'}`}>
                    ${invoice.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full py-4 rounded-lg font-semibold transition-all ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#BA2027] hover:bg-[#A01C22] shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay $${invoice.amount.toLocaleString()}`
                )}
              </button>

              <p className={`text-xs text-center ${isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'} mt-4`}>
                By completing this payment, you agree to our terms of service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}