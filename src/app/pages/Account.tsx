import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Building2, MapPin, Globe, Lock, Bell, Shield,
  Smartphone, Monitor, Users, UserPlus, Trash2, Edit, Check, X,
  Key, Activity, Chrome, Calendar, CreditCard, Eye, EyeOff, Save
} from 'lucide-react';
import { GlassNavigation } from '../components/GlassNavigation';
import { useTheme } from '../context/ThemeContext';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { toast } from 'sonner';

export default function Account() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [pageLoaded, setPageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'team' | 'security' | 'notifications'>('company');
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  const backgroundStyle = isDark
    ? { background: 'linear-gradient(135deg, #0F1117 0%, #1a1025 100%)', minHeight: '100vh' }
    : { background: '#F2F4F7', minHeight: '100vh' };

  const cardStyle = isDark
    ? { 
        background: '#1C1F2E', 
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }
    : { 
        background: '#FFFFFF', 
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)'
      };

  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'John Smith', email: 'john.smith@acmesales.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15', lastActive: '2 hours ago', avatar: 'JS' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@acmesales.com', role: 'Manager', status: 'Active', joinDate: '2024-03-20', lastActive: '5 minutes ago', avatar: 'SJ' },
    { id: '3', name: 'Michael Chen', email: 'm.chen@acmesales.com', role: 'Member', status: 'Active', joinDate: '2025-06-10', lastActive: 'Just now', avatar: 'MC' },
    { id: '4', name: 'Emily Rodriguez', email: 'emily.r@acmesales.com', role: 'Member', status: 'Inactive', joinDate: '2025-09-15', lastActive: '3 days ago', avatar: 'ER' },
  ]);

  const sessions = [
    { id: '1', device: 'Chrome on MacOS', location: 'San Francisco, CA', ip: '192.168.1.1', lastActive: '2 hours ago', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'San Francisco, CA', ip: '192.168.1.2', lastActive: '1 day ago', current: false },
    { id: '3', device: 'Firefox on Windows', location: 'New York, NY', ip: '192.168.1.3', lastActive: '3 days ago', current: false }
  ];

  const activityLog = [
    { id: '1', action: 'Logged in', timestamp: '2026-02-28 09:45 AM', device: 'Chrome on MacOS' },
    { id: '2', action: 'Updated profile', timestamp: '2026-02-27 03:20 PM', device: 'Chrome on MacOS' },
    { id: '3', action: 'Added team member', timestamp: '2026-02-26 11:30 AM', device: 'Safari on iPhone' },
    { id: '4', action: 'Changed password', timestamp: '2026-02-25 02:15 PM', device: 'Chrome on MacOS' }
  ];

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-red-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-indigo-500',
      'from-orange-500 to-amber-500'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let strength = 0;
    if (value.length > 6) strength += 25;
    if (value.length > 10) strength += 25;
    if (/[A-Z]/.test(value)) strength += 25;
    if (/[0-9]/.test(value)) strength += 25;
    setPasswordStrength(strength);
  };

  return (
    <div style={backgroundStyle} className={`transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <GlassNavigation />
      
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className={`${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-2`}>
            Account Settings
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl p-2 border transition-all animate-slideInLeft" style={cardStyle}>
              {[
                { id: 'profile', icon: User, label: 'Profile' },
                { id: 'company', icon: Building2, label: 'Company Info' },
                { id: 'team', icon: Users, label: 'Team' },
                { id: 'security', icon: Lock, label: 'Security' },
                { id: 'notifications', icon: Bell, label: 'Notifications' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? isDark ? 'bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/20' : 'bg-[#BA2027]/10 text-[#BA2027] border border-[#BA2027]/20'
                      : `${isDark ? 'text-[#A0A0A0]' : 'text-[#6B6B6B]'} hover:${isDark ? 'bg-[#E63946]/5' : 'bg-[#BA2027]/5'}`
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Security Status Widget */}
            <div className="rounded-2xl p-5 border mt-4 transition-all animate-fadeIn" style={{...cardStyle, animationDelay: '100ms'}}>
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Shield className="w-4 h-4" />
                Security Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>2FA</span>
                  <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-500">Disabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Password</span>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500">Strong</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sessions</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{sessions.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="rounded-2xl border p-6 transition-all hover:shadow-2xl" style={cardStyle}>
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-6`}>
                    Profile Information
                  </h2>

                  <div className="flex items-center gap-6 mb-8">
                    <div className={`w-24 h-24 bg-gradient-to-br ${getAvatarColor('John Smith')} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl font-semibold text-white">JS</span>
                    </div>
                    <div>
                      <button 
                        onClick={() => toast.info('Avatar upload coming soon')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isDark ? 'bg-[#E63946]/20 hover:bg-[#E63946]/30 text-[#E63946]' : 'bg-[#BA2027]/10 hover:bg-[#BA2027]/20 text-[#BA2027]'
                        }`}
                      >
                        Change Photo
                      </button>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John"
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Smith"
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="john.smith@acmesales.com"
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } outline-none`}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success('Profile updated successfully')}
                    className="mt-6 px-6 py-2.5 rounded-lg text-white transition-all flex items-center gap-2"
                    style={{ background: '#1E3A5F' }}
                  >
                    <Save className="w-4 h-4" />
                    Save my changes
                  </button>
                </div>
              </div>
            )}

            {/* Company Tab */}
            {activeTab === 'company' && (
              <div className="rounded-2xl border p-6 transition-all hover:shadow-2xl animate-fadeIn" style={cardStyle}>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-6`}>
                  Company Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Acme Sales Inc."
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } outline-none`}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Industry
                      </label>
                      <select
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } outline-none`}
                      >
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Finance</option>
                        <option>Retail</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Company Size
                      </label>
                      <select
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } outline-none`}
                      >
                        <option>1-10 employees</option>
                        <option>11-50 employees</option>
                        <option>51-200 employees</option>
                        <option>201+ employees</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Website
                    </label>
                    <input
                      type="url"
                      defaultValue="https://acmesales.com"
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } outline-none`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue="123 Business St, San Francisco, CA 94105"
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } outline-none`}
                    />
                  </div>
                </div>

                <button
                  onClick={() => toast.success('Company info updated')}
                  className="mt-6 px-6 py-2.5 rounded-lg text-white transition-all"
                  style={{ background: '#1E3A5F' }}
                >
                  Save my changes
                </button>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="rounded-2xl border p-6 transition-all hover:shadow-2xl" style={cardStyle}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                      Team Members
                    </h2>
                    <button
                      onClick={() => setShowAddMemberForm(true)}
                      className={`px-4 py-2 rounded-lg text-white transition-all flex items-center gap-2 ${
                        isDark ? 'bg-[#E63946]' : 'bg-[#BA2027]'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Member
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamMembers.map((member, index) => (
                      <div
                        key={member.id}
                        className={`p-4 rounded-xl border transition-all hover:scale-105 animate-slideInUp ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(member.name)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <span className="text-sm font-semibold text-white">{member.avatar}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {member.name}
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                                  {member.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                member.role === 'Admin'
                                  ? 'bg-[#E63946]/10 text-[#E63946]'
                                  : member.role === 'Manager'
                                  ? 'bg-[#F4B400]/10 text-[#F4B400]'
                                  : 'bg-[#0891B2]/10 text-[#0891B2]'
                              }`}>
                                {member.role}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                member.status === 'Active'
                                  ? 'bg-[#0F9D58]/10 text-[#0F9D58]'
                                  : 'bg-gray-500/10 text-gray-500'
                              }`}>
                                {member.status}
                              </span>
                            </div>
                            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              Last active: {member.lastActive}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Password Change */}
                <div className="rounded-2xl border p-6 transition-all hover:shadow-2xl" style={cardStyle}>
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-6`}>
                    Change Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className={`w-full px-4 py-2.5 pr-10 rounded-lg border transition-all ${
                            isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                          } outline-none`}
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        onChange={handlePasswordChange}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                          isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } outline-none`}
                      />
                      {passwordStrength > 0 && (
                        <div className="mt-2">
                          <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordStrength >= 75 ? 'bg-green-500' : passwordStrength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Password strength: {passwordStrength >= 75 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success('Password changed successfully')}
                    className={`mt-6 px-6 py-2.5 rounded-lg text-white transition-all ${
                      isDark ? 'bg-gradient-to-r from-[#E63946] to-[#FF4D5A]' : 'bg-gradient-to-r from-[#BA2027] to-[#D32F2F]'
                    }`}
                  >
                    Update Password
                  </button>
                </div>

                {/* 2FA */}
                <div className="rounded-2xl border p-6 transition-all hover:shadow-2xl" style={cardStyle}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                        Two-Factor Authentication
                      </h2>
                      <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button
                      onClick={() => setShow2FASetup(true)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        isDark ? 'bg-[#E63946] text-white' : 'bg-[#BA2027] text-white'
                      }`}
                    >
                      Enable 2FA
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="rounded-2xl border p-6 transition-all hover:shadow-2xl" style={cardStyle}>
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-4`}>
                    Active Sessions
                  </h2>
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-4 rounded-lg border ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Monitor className="w-5 h-5 text-[#4285F4] mt-0.5" />
                            <div>
                              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {session.device}
                              </h3>
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {session.location} • {session.ip}
                              </p>
                              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                Last active: {session.lastActive}
                              </p>
                            </div>
                          </div>
                          {session.current ? (
                            <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-500">
                              Current
                            </span>
                          ) : (
                            <button
                              onClick={() => toast.success('Session terminated')}
                              className="text-sm text-red-500 hover:text-red-600"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Log */}
                <div className="rounded-2xl border p-6 transition-all hover:shadow-2xl" style={cardStyle}>
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-4`}>
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {activityLog.map((log) => (
                      <div
                        key={log.id}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          isDark ? 'bg-white/5' : 'bg-gray-50'
                        }`}
                      >
                        <Activity className="w-4 h-4 text-[#4285F4] mt-0.5" />
                        <div className="flex-1">
                          <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {log.action}
                          </p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {log.timestamp} • {log.device}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="rounded-2xl border p-6 transition-all hover:shadow-2xl animate-fadeIn" style={cardStyle}>
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-[#1E1E1E]'} mb-6`}>
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications for new leads', checked: true },
                    { label: 'Campaign performance updates', checked: true },
                    { label: 'Invoice reminders', checked: false },
                    { label: 'Team activity notifications', checked: true },
                    { label: 'Security alerts', checked: true },
                    { label: 'Weekly performance summary', checked: false }
                  ].map((pref, index) => (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                        isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{pref.label}</span>
                      <input
                        type="checkbox"
                        defaultChecked={pref.checked}
                        className={`w-5 h-5 rounded cursor-pointer transition-all appearance-none ${
                          isDark 
                            ? 'bg-white/10 border-2 border-white/20 hover:border-white/40' 
                            : 'bg-white border-2 border-gray-300 hover:border-gray-400'
                        } checked:bg-[#E63946] checked:border-[#E63946] focus:ring-2 focus:ring-offset-0 focus:ring-[#E63946]/50 relative`}
                        style={{
                          backgroundImage: pref.checked
                            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")`
                            : 'none',
                          backgroundSize: '100% 100%',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => toast.success('Preferences saved')}
                  className={`mt-6 px-6 py-2.5 rounded-lg text-white transition-all ${
                    isDark ? 'bg-gradient-to-r from-[#E63946] to-[#FF4D5A]' : 'bg-gradient-to-r from-[#BA2027] to-[#D32F2F]'
                  }`}
                >
                  Save Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}