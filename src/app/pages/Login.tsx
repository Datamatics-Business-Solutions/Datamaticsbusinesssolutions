import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, Quote, Check, Loader2, ChevronDown } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useParallax } from '../hooks/useParallax';
import { useAuth, mockUsers } from '../context/AuthContext';
import certifications from 'figma:asset/b24b9bef2212c68559759883c7aca917e374398b.png';

// Testimonials data with sophisticated red gradients
const testimonials = [
  {
    id: 1,
    quote: "Datamatics increased our lead acceptance rate by 34% in the first quarter. Absolutely transformed how we manage our pipeline.",
    author: "Sarah Mitchell",
    role: "VP of Sales, TechCorp",
    initials: "SM",
    image: "https://images.unsplash.com/photo-1758518727888-ffa196002e59?w=400&h=400&fit=crop",
    headline: "Transforming Business with Data",
    gradient: "from-[#BA2027] via-[#D32F2F] to-[#C62828]"
  },
  {
    id: 2,
    quote: "The analytics dashboard gives us real-time insights that drive our decision-making. Absolutely game-changing for our business.",
    author: "Michael Chen",
    role: "CEO, InnovateCorp",
    initials: "MC",
    image: "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?w=400&h=400&fit=crop",
    headline: "Data-Driven Excellence",
    gradient: "from-[#C62828] via-[#B71C1C] to-[#8B0000]"
  },
  {
    id: 3,
    quote: "Working with Datamatics has been a pleasure. Their platform is intuitive, powerful, and delivers measurable results.",
    author: "Emily Thompson",
    role: "Head of Business Development, InnovateCorp",
    initials: "ET",
    image: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?w=400&h=400&fit=crop",
    headline: "Empowering Sales Teams",
    gradient: "from-[#D32F2F] via-[#BA2027] to-[#A01C22]"
  }
];

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentUser, getDefaultRoute } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState('u1'); // Default to first user
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [userSelectorFocused, setUserSelectorFocused] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Login page is always light theme
  const parallax = useParallax();

  // Page load animation
  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  // Auto-rotate testimonials every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading) {
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!selectedUserId) {
      setError('Please select a user');
      setIsLoading(false);
      // Shake animation
      formRef.current?.classList.add('animate-shake');
      setTimeout(() => formRef.current?.classList.remove('animate-shake'), 500);
      return;
    }

    // Find and set the selected user
    const selectedUser = mockUsers.find(u => u.id === selectedUserId);
    if (selectedUser) {
      setCurrentUser(selectedUser);
      
      setIsLoading(false);
      setShowSuccess(true);
      
      // Success animation then navigate based on role
      const route = selectedUser.role === 'ops_manager' ? '/dashboard/ops' :
                    selectedUser.role === 'campaign_manager' ? '/dashboard/manager' :
                    selectedUser.role === 'campaign_backup' ? '/dashboard/manager' :
                    '/dashboard';
      
      setTimeout(() => {
        navigate(route);
      }, 1200);
    }
  };

  const activeTesti = testimonials[currentTestimonial];

  if (!activeTesti) {
    return null;
  }

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left Side - Login Form - Always Light Theme */}
      <div 
        className="flex-1 flex items-center justify-center px-6 py-8 relative bg-white overflow-y-auto"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(186, 32, 39, 0.02) 0%, transparent 50%)'
        }}
      >
        {/* Animated Background Orbs */}
        <div 
          className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-20 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(186, 32, 39, 0.1) 0%, transparent 70%)',
            transform: `translate(${parallax.x}px, ${parallax.y}px)`
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-10 animate-float-delayed"
          style={{
            background: 'radial-gradient(circle, rgba(186, 32, 39, 0.08) 0%, transparent 70%)',
            transform: `translate(${-parallax.x}px, ${-parallax.y}px)`
          }}
        />

        {/* Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(circle, #BA2027 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />

        {/* Glassmorphism Form Container */}
        <div 
          className="w-full max-w-[440px] relative z-10 p-8 rounded-3xl transition-all duration-500 bg-white/60 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_rgba(186,32,39,0.08)] my-auto"
          style={{
            transform: pageLoaded ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          {/* Logo with Glow */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div 
                className="absolute inset-0 blur-2xl opacity-30"
                style={{
                  background: 'radial-gradient(circle, #BA2027 0%, transparent 70%)'
                }}
              />
              <Logo className="h-10 relative z-10" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-[#1A1A1A]">
              Welcome Back!
            </h1>
            <p className="text-[15px] leading-relaxed text-[#6B7280]">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 animate-shake">
              <p className="text-red-500 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 animate-scaleIn">
              <div className="flex items-center justify-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5 animate-checkmark" />
                <p className="text-sm font-medium">Login successful! Redirecting...</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form ref={formRef} onSubmit={handleLogin} className="space-y-4">
            {/* User Selector Label */}
            <div className="mb-2">
              <label className="text-sm font-semibold text-[#374151] block mb-3">
                Select your account to continue
              </label>
            </div>

            {/* User Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                onFocus={() => setUserSelectorFocused(true)}
                onBlur={() => setUserSelectorFocused(false)}
                className={`w-full pl-4 pr-10 py-3.5 rounded-xl border-2 transition-all duration-300 text-sm bg-white border-[#E5E7EB] text-[#1F2937] focus:outline-none appearance-none cursor-pointer ${
                  userSelectorFocused ? 'border-[#BA2027] shadow-[0_0_20px_rgba(186,32,39,0.1)] scale-[1.02]' : ''
                } shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]`}
              >
                {mockUsers.map(user => {
                  const roleLabel = 
                    user.role === 'client' ? `Client (${user.company})` :
                    user.role === 'campaign_manager' ? 'Campaign Manager' :
                    user.role === 'campaign_backup' ? 'Campaign Backup' :
                    'Ops Manager';
                  
                  return (
                    <option key={user.id} value={user.id}>
                      {user.name} – {roleLabel}
                    </option>
                  );
                })}
              </select>
              <ChevronDown 
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-all duration-300 ${
                  userSelectorFocused ? 'text-[#BA2027]' : 'text-[#9CA3AF]'
                }`}
              />
            </div>

            {/* Sign In Button with Pulse */}
            <button
              type="submit"
              disabled={isLoading || showSuccess}
              className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-6 ${
                isLoading || showSuccess
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:scale-[1.02] hover:shadow-2xl'
              } bg-gradient-to-r from-[#BA2027] to-[#D32F2F] shadow-[0_4px_20px_rgba(186,32,39,0.25)] animate-button-pulse`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Success!</span>
                </>
              ) : (
                <span>Sign me in</span>
              )}
            </button>

            {/* Keyboard Shortcut Hint */}
            {!isLoading && !showSuccess && (
              <div className="flex items-center justify-center gap-2 text-xs text-[#9CA3AF] animate-fadeIn mt-3">
                <span>Press</span>
                <kbd className="px-2 py-1 rounded bg-[#F3F4F6] font-mono">
                  Enter ↵
                </kbd>
                <span>to login</span>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-xs bg-white/60 text-[#9CA3AF]">
                  Or sign in with
                </span>
              </div>
            </div>

            {/* Social Login Buttons with Enhanced Hover */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white border-[#E5E7EB] hover:border-[#BA2027]/20 hover:shadow-[0_0_20px_rgba(186,32,39,0.08)] text-[#374151]"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white border-[#E5E7EB] hover:border-[#BA2027]/20 hover:shadow-[0_0_20px_rgba(186,32,39,0.08)] text-[#374151]"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-[14px] mt-6 text-[#9CA3AF]">
            Don't have an account?{' '}
            <a 
              href="#" 
              className="font-semibold transition-colors text-[#BA2027] hover:text-[#A01C22]"
            >
              Sign Up
            </a>
          </p>

          {/* Certifications */}
          <div className="mt-6 pt-6 border-t border-gray-200/20">
            <p className="text-center text-[11px] uppercase tracking-wider font-semibold mb-4 text-[#9CA3AF]">
              Certified & Compliant
            </p>
            <div className="flex items-center justify-center">
              <img 
                src={certifications} 
                alt="ISO 27001:2022, ISO 9001:2015, SOC 1 & 2 Type II, GDPR Certified" 
                className="h-12 opacity-80"
              />
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] mt-4 text-[#9CA3AF]">
            © 2026 Datamatics Business Solutions Limited
          </p>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden lg:block w-px bg-[rgba(0,0,0,0.08)]" />

      {/* Right Side - Testimonial Panel - Always Light Theme */}
      <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center p-12 relative overflow-hidden transition-all duration-1000 bg-gradient-to-br from-[#BA2027] via-[#D32F2F] to-[#BA2027]">
        {/* Animated Background Elements */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`
          }}
        />
        
        {/* Floating Orbs */}
        <div 
          className="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl opacity-30 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
            transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)`
          }}
        />
        <div 
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float-delayed"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
            transform: `translate(${-parallax.x * 0.3}px, ${-parallax.y * 0.3}px)`
          }}
        />

        {/* Center Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-lg w-full">
          {/* Testimonial Card with Red Gradient */}
          <div 
            key={activeTesti.id}
            className={`rounded-3xl p-12 shadow-2xl animate-slideInUp bg-gradient-to-br w-full flex flex-col justify-center items-center text-center ${activeTesti.gradient}`}
          >
            {/* Quote Icon */}
            <div className="mb-8 animate-scaleIn flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Quote className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Quote */}
            <p className="text-white text-xl mb-12 leading-relaxed font-light">
              "{activeTesti.quote}"
            </p>

            {/* Author */}
            <div className="flex flex-col items-center gap-4 mb-10">
              <img 
                src={activeTesti.image} 
                alt={activeTesti.author}
                className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-white/30"
              />
              <div>
                <div className="text-white font-bold text-xl">{activeTesti.author}</div>
                <div className="text-white/80 text-base mt-1">{activeTesti.role}</div>
              </div>
            </div>

            {/* Testimonial Dots */}
            <div className="flex items-center justify-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${ 
                    index === currentTestimonial 
                      ? 'w-12 bg-white shadow-lg'
                      : 'w-2.5 bg-white/30 hover:bg-white/50 hover:w-4'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Trust Badges - Below testimonial card */}
          <div className="w-full">
            <div className="text-xs uppercase tracking-widest font-bold mb-5 text-center text-white/90">
              Trusted By Industry Leaders
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-[#059669]" strokeWidth={2.5} />
                <span className="text-sm font-semibold whitespace-nowrap text-[#1A1A1A]">Fortune 500</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-[#059669]" strokeWidth={2.5} />
                <span className="text-sm font-semibold whitespace-nowrap text-[#1A1A1A]">Enterprise SaaS</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-[#059669]" strokeWidth={2.5} />
                <span className="text-sm font-semibold whitespace-nowrap text-[#1A1A1A]">Global Tech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}