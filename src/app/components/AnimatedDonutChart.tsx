import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

interface AnimatedDonutChartProps {
  progress: number;
  accepted: number;
  target: number;
  isDark: boolean;
}

export function AnimatedDonutChart({ progress, accepted, target, isDark }: AnimatedDonutChartProps) {
  const animatedProgress = useMotionValue(0);
  const circumference = 2 * Math.PI * 100;
  
  const strokeDashoffset = useTransform(
    animatedProgress,
    [0, 100],
    [circumference, 0]
  );

  useEffect(() => {
    const controls = animate(animatedProgress, progress, {
      duration: 2,
      ease: [0.4, 0.0, 0.2, 1]
    });

    return controls.stop;
  }, [progress, animatedProgress]);

  return (
    <div className="relative w-64 h-64">
      <svg className="w-64 h-64 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="128"
          cy="128"
          r="100"
          stroke={isDark ? 'rgba(186, 32, 39, 0.2)' : 'rgba(186, 32, 39, 0.1)'}
          strokeWidth="24"
          fill="none"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx="128"
          cy="128"
          r="100"
          stroke="#BA2027"
          strokeWidth="24"
          fill="none"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div 
          className={`text-5xl font-light ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
        <motion.div 
          className={`text-sm mt-2 font-light ${isDark ? 'text-[#E0E0E0]' : 'text-[#4A4A4A]'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {accepted}/{target}
        </motion.div>
      </div>
    </div>
  );
}
