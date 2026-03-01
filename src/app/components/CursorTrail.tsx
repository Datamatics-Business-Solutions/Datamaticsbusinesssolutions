import { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
  timestamp: number;
}

export function CursorTrail() {
  const [positions, setPositions] = useState<CursorPosition[]>([]);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      };

      setPositions(prev => {
        const updated = [...prev, newPosition].slice(-8);
        return updated;
      });
    };

    const cleanup = () => {
      const now = Date.now();
      setPositions(prev => prev.filter(pos => now - pos.timestamp < 500));
    };

    const animate = () => {
      cleanup();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {positions.map((pos, index) => (
        <div
          key={`${pos.timestamp}-${index}`}
          className="fixed pointer-events-none rounded-full bg-white/10 blur-xl"
          style={{
            left: pos.x - 20,
            top: pos.y - 20,
            width: 40,
            height: 40,
            opacity: (index + 1) / positions.length * 0.3,
            transform: `scale(${(index + 1) / positions.length})`,
            transition: 'opacity 0.3s, transform 0.3s',
            zIndex: 0
          }}
        />
      ))}
    </>
  );
}
