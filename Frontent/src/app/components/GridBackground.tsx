export default function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 242, 254, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 242, 254, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          animation: 'gridMove 20s linear infinite, gridPulse 4s ease-in-out infinite',
        }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0, 242, 254, 0.02) 50%)',
          backgroundSize: '100% 4px',
          animation: 'scanline 12s linear infinite',
        }}
      />

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.08; }
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(120px, 120px); }
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
