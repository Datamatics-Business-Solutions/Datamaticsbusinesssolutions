import { useTheme } from '../context/ThemeContext';

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const footerLinks = [
    { label: 'Terms of Use', url: 'https://www.datamaticsbpm.com/terms-of-use/' },
    { label: 'Privacy Policy', url: 'https://www.datamaticsbpm.com/privacy-policy/' },
    { label: 'Cookie Policy', url: 'https://www.datamaticsbpm.com/cookie-policy/' },
    { label: 'Legal', url: 'https://www.datamaticsbpm.com/legal/' },
  ];

  const footerStyle = isDark
    ? {
        background: '#0F172A',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }
    : {
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
      };

  return (
    <footer style={footerStyle} className="mt-auto">
      <div className="max-w-[1400px] mx-auto px-8 h-14 md:h-14 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
        {/* Copyright Text */}
        <p
          className={`text-[11px] text-center md:text-left ${
            isDark ? 'text-[#64748B]' : 'text-[#94A3B8]'
          }`}
        >
          © 2026 Datamatics Business Solutions Limited. All Rights Reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-3 md:gap-5">
          {footerLinks.map((link, index) => (
            <div key={link.label} className="flex items-center gap-3 md:gap-5">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[11px] transition-colors no-underline hover:underline ${
                  isDark ? 'text-[#64748B] hover:text-[#BA2027]' : 'text-[#64748B] hover:text-[#BA2027]'
                }`}
              >
                {link.label}
              </a>
              {index < footerLinks.length - 1 && (
                <span className="text-[#334155] text-[11px]">|</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout - Adjust height */}
      <style>{`
        @media (max-width: 768px) {
          footer {
            height: 72px !important;
          }
        }
      `}</style>
    </footer>
  );
}
