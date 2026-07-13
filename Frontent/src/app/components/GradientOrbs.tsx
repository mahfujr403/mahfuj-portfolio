import { motion } from "motion/react";

export default function GradientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Purple orb - top left */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.02) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 200, -100, 0],
          y: [0, 100, 150, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Cyan orb - top right */}
      <motion.div
        className="absolute top-1/3 -right-1/4 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0, 242, 254, 0.1) 0%, rgba(0, 242, 254, 0.02) 40%, transparent 70%)",
          filter: "blur(120px)",
        }}
        animate={{
          x: [0, -150, 50, 0],
          y: [0, 120, -80, 0],
          scale: [1, 1.3, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Pink orb - bottom */}
      <motion.div
        className="absolute -bottom-1/4 left-1/3 w-[650px] h-[650px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, rgba(236, 72, 153, 0.01) 40%, transparent 70%)",
          filter: "blur(110px)",
        }}
        animate={{
          x: [0, -100, 80, 0],
          y: [0, -150, -50, 0],
          scale: [1, 1.25, 0.95, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blue orb - center (moving) */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.01) 40%, transparent 70%)",
          filter: "blur(130px)",
        }}
        animate={{
          x: [-100, 100, -50, -100],
          y: [-80, 80, 120, -80],
          scale: [1, 1.4, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
