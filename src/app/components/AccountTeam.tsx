import { motion } from 'motion/react';
import { Mail, MessageCircle } from 'lucide-react';

interface AccountTeamMember {
  name: string;
  role: string;
  email: string;
  initials: string;
}

interface AccountTeamProps {
  manager: AccountTeamMember;
  backup: AccountTeamMember;
}

export function AccountTeam({ manager, backup }: AccountTeamProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[#1F2937] dark:text-white">
        My Account Team
      </h3>
      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
        Your dedicated team is here to support your success
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign Manager Card */}
        <TeamMemberCard member={manager} />

        {/* Campaign Backup Card */}
        <TeamMemberCard member={backup} />
      </div>
    </div>
  );
}

function TeamMemberCard({ member }: { member: AccountTeamMember }) {
  return (
    <motion.div
      className="bg-white dark:bg-[#1A1A2E] rounded-xl p-6 border border-[#E5E7EB] dark:border-[#2A2A3E]"
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#BA2027] to-[#D32F2F] flex items-center justify-center shadow-lg">
            <span className="font-semibold text-white">
              {member.initials}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-[#1F2937] dark:text-white mb-1">
            {member.name}
          </h4>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-2">
            {member.role}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            <Mail className="w-3.5 h-3.5" />
            <a
              href={`mailto:${member.email}`}
              className="hover:text-[#BA2027] transition-colors truncate"
            >
              {member.email}
            </a>
          </div>
        </div>
      </div>

      {/* Send Message Button */}
      <motion.button
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#1E3A5F] bg-[#1E3A5F]/10 hover:bg-[#1E3A5F]/20 rounded-lg transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <MessageCircle className="w-4 h-4" />
        Send Message
      </motion.button>
    </motion.div>
  );
}
