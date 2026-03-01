import { useState } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { 
  ChevronRight, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Calendar,
  Pause,
  Headphones,
  FileText,
  Download,
  DollarSign
} from 'lucide-react';
import { GlassNavigation } from '../components/GlassNavigation';
import { JobCardModal } from '../components/JobCardModalGlass';
import { AnimatedDonutChart } from '../components/AnimatedDonutChart';
import { mockCampaigns, mockActivityUpdates } from '../mockData';
import { useTheme } from '../context/ThemeContext';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const campaign = mockCampaigns.find(c => c.id === id);
  const [showJobCard, setShowJobCard] = useState(false);

  const isDark = theme === 'dark';
  
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

  if (!campaign) {
    return (
      <div style={backgroundStyle}>
        <GlassNavigation />
        <div className="max-w-[1440px] mx-auto px-8 py-12 text-center">
          <p className={isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'}>Campaign not found</p>
          <button 
            onClick={() => navigate('/campaigns')}
            className={`${isDark ? 'text-[#E63946] hover:text-[#FF4D5A]' : 'text-[#BA2027] hover:text-[#A01C22]'} mt-4 font-medium transition-colors`}
          >
            Back to campaigns
          </button>
        </div>
      </div>
    );
  }

  const progress = (campaign.delivered / campaign.target) * 100;
  const accepted = Math.floor(campaign.delivered * 0.89); // Mock 89% acceptance rate

  return (
    <div style={backgroundStyle}>
      <GlassNavigation />
      
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <div className={`flex items-center text-sm mb-8 ${isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'}`}>
          <button 
            onClick={() => navigate('/campaigns')}
            className={`${isDark ? 'hover:text-white' : 'hover:text-[#BA2027]'} transition-colors font-medium`}
          >
            Campaigns
          </button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className={isDark ? 'text-white' : 'text-[#1E1E1E]'}>{campaign.name}</span>
        </div>

        {/* 4 KPI Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
        >
          {[
            { icon: Target, label: 'Target', value: campaign.target, color: isDark ? 'text-[#E63946]' : 'text-[#BA2027]' },
            { icon: TrendingUp, label: 'Delivered', value: campaign.delivered, color: 'text-[#0891B2]' },
            { icon: CheckCircle, label: 'Accepted', value: accepted, color: 'text-[#10B981]' },
            { icon: Calendar, label: 'End Date', value: new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-[#BA2027]', isDate: true }
          ].map((card, index) => (
            <motion.div
              key={card.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl p-6 border transition-all hover:shadow-2xl" 
              style={cardStyle}
            >
              <div className="flex items-center gap-3 mb-2">
                <card.icon className={`w-5 h-5 ${card.color}`} />
                <span className={`text-sm font-medium ${isDark ? 'text-[#E0E0E0]' : 'text-[#4A4A4A]'}`}>{card.label}</span>
              </div>
              <div className={`${card.isDate ? 'text-xl' : 'text-3xl'} font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                {card.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - 60% */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donut Chart */}
            <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
              <h3 className={`text-lg font-normal mb-6 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Campaign Progress</h3>
              <div className="flex items-center justify-center">
                <AnimatedDonutChart
                  progress={progress}
                  accepted={accepted}
                  target={campaign.target}
                  isDark={isDark}
                />
              </div>
            </div>

            {/* Campaign Details */}
            <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
              <h3 className={`text-lg font-normal mb-6 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Campaign Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`text-sm mb-1 font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Geography</div>
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{campaign.targeting?.geography || 'United States'}</div>
                </div>
                <div>
                  <div className={`text-sm mb-1 font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Industry</div>
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{campaign.targeting?.industry || 'Technology'}</div>
                </div>
                <div>
                  <div className={`text-sm mb-1 font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Revenue Range</div>
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{campaign.targeting?.revenue || '$10M - $50M'}</div>
                </div>
                <div>
                  <div className={`text-sm mb-1 font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Employee Count</div>
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{campaign.targeting?.employees || '50-200'}</div>
                </div>
                <div>
                  <div className={`text-sm mb-1 font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Job Titles</div>
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>{campaign.targeting?.jobTitles || 'VP, Director'}</div>
                </div>
                <div>
                  <div className={`text-sm mb-1 font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Pricing</div>
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>${campaign.pricing?.cpl || 45}/lead</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 40% */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
              <h3 className={`text-lg font-normal mb-4 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Actions</h3>
              <div className="space-y-3">
                <button className={`w-full px-4 py-3 rounded-xl text-sm font-normal transition-all flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border border-[#EF4444]/30 text-[#FF6B6B]'
                    : 'bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/20 text-[#EF4444]'
                }`}>
                  <Pause className="w-4 h-4" />
                  Request Pause
                </button>
                <button className={`w-full px-4 py-3 rounded-xl text-sm font-normal transition-all flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'bg-[#0891B2]/20 hover:bg-[#0891B2]/30 border border-[#0891B2]/30 text-[#0891B2]'
                    : 'bg-[#0891B2]/10 hover:bg-[#0891B2]/20 border border-[#0891B2]/20 text-[#0891B2]'
                }`}>
                  <Headphones className="w-4 h-4" />
                  Contact Support
                </button>
              </div>
            </div>

            {/* Documents Card */}
            <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
              <h3 className={`text-lg font-normal mb-4 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Documents</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowJobCard(true)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-normal transition-all flex items-center justify-between ${
                    isDark 
                      ? 'bg-[#BA2027]/20 hover:bg-[#BA2027]/30 border border-[#BA2027]/30 text-[#FF6B6B]'
                      : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 border border-[#BA2027]/20 text-[#BA2027]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Job Card
                  </div>
                  <Download className="w-4 h-4" />
                </button>
                <button className={`w-full px-4 py-3 rounded-xl text-sm font-normal transition-all flex items-center justify-between ${
                  isDark 
                    ? 'bg-[#BA2027]/20 hover:bg-[#BA2027]/30 border border-[#BA2027]/30 text-[#FF6B6B]'
                    : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 border border-[#BA2027]/20 text-[#BA2027]'
                }`}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Lead File
                  </div>
                  <Download className="w-4 h-4" />
                </button>
                <button className={`w-full px-4 py-3 rounded-xl text-sm font-normal transition-all flex items-center justify-between ${
                  isDark 
                    ? 'bg-[#BA2027]/20 hover:bg-[#BA2027]/30 border border-[#BA2027]/30 text-[#FF6B6B]'
                    : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 border border-[#BA2027]/20 text-[#BA2027]'
                }`}>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Invoice
                  </div>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="rounded-2xl p-6 border transition-all hover:shadow-2xl" style={cardStyle}>
          <h3 className={`text-lg font-normal mb-6 ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Activity Timeline</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className={`absolute left-6 top-8 bottom-8 w-0.5 ${isDark ? 'bg-[#BA2027]/30' : 'bg-[#BA2027]/20'}`}></div>
            
            {/* Timeline Items */}
            <div className="space-y-6">
              <div className="relative flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark 
                    ? 'bg-[#10B981]/20 border border-[#10B981]/30'
                    : 'bg-[#10B981]/10 border border-[#10B981]/20'
                }`}>
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="flex-1">
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>RFP Received</div>
                  <div className={`text-sm font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Campaign requirements received and reviewed</div>
                  <div className={`text-xs mt-1 font-light ${isDark ? 'text-[#808080]' : 'text-[#9E9E9E]'}`}>
                    {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark 
                    ? 'bg-[#10B981]/20 border border-[#10B981]/30'
                    : 'bg-[#10B981]/10 border border-[#10B981]/20'
                }`}>
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="flex-1">
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Job Card Signed</div>
                  <div className={`text-sm font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Agreement signed by both parties</div>
                  <div className={`text-xs mt-1 font-light ${isDark ? 'text-[#808080]' : 'text-[#9E9E9E]'}`}>
                    {new Date(new Date(campaign.startDate).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark 
                    ? 'bg-[#10B981]/20 border border-[#10B981]/30'
                    : 'bg-[#10B981]/10 border border-[#10B981]/20'
                }`}>
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <div className="flex-1">
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Campaign Started</div>
                  <div className={`text-sm font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Lead generation campaign initiated</div>
                  <div className={`text-xs mt-1 font-light ${isDark ? 'text-[#808080]' : 'text-[#9E9E9E]'}`}>
                    {new Date(new Date(campaign.startDate).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark 
                    ? 'bg-[#BA2027]/20 border border-[#BA2027]/30'
                    : 'bg-[#BA2027]/10 border border-[#BA2027]/20'
                }`}>
                  <TrendingUp className="w-5 h-5 text-[#BA2027]" />
                </div>
                <div className="flex-1">
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>Batches Delivered</div>
                  <div className={`text-sm font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>{campaign.delivered} leads delivered in multiple batches</div>
                  <div className={`text-xs mt-1 font-light ${isDark ? 'text-[#808080]' : 'text-[#9E9E9E]'}`}>Ongoing</div>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDark 
                    ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/30'
                    : 'bg-[#F59E0B]/10 border border-[#F59E0B]/20'
                }`}>
                  <Target className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <div className={`font-normal ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>In Progress</div>
                  <div className={`text-sm font-light ${isDark ? 'text-[#B0B0B0]' : 'text-[#757575]'}`}>Campaign currently active and delivering leads</div>
                  <div className={`text-xs mt-1 font-light ${isDark ? 'text-[#808080]' : 'text-[#9E9E9E]'}`}>Current Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Card Modal */}
      {showJobCard && (
        <JobCardModal 
          campaign={campaign}
          onClose={() => setShowJobCard(false)}
        />
      )}
    </div>
  );
}