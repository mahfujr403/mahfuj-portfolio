import { useEffect, useRef } from "react";

interface DataPacket {
  lane: number;
  offset: number;
  speed: number;
  size: number;
  phase: number;
}

const GRID_STEP = 96;
const LANE_COUNT = 5;
const PACKET_COUNT = 18;

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const packetsRef = useRef<DataPacket[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const createPackets = () => {
      packetsRef.current = Array.from({ length: PACKET_COUNT }, () => ({
        lane: Math.floor(Math.random() * LANE_COUNT),
        offset: Math.random(),
        speed: 0.05 + Math.random() * 0.1,
        size: 10 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createPackets();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawVisionGrid = (time: number) => {
      const xOffset = (time * 8) % GRID_STEP;
      const yOffset = (time * 5) % GRID_STEP;

      ctx.strokeStyle = "rgba(0, 242, 254, 0.07)";
      ctx.lineWidth = 1;

      for (let x = -GRID_STEP; x <= canvas.width + GRID_STEP; x += GRID_STEP) {
        ctx.beginPath();
        ctx.moveTo(x + xOffset, 0);
        ctx.lineTo(x + xOffset, canvas.height);
        ctx.stroke();
      }

      for (let y = -GRID_STEP; y <= canvas.height + GRID_STEP; y += GRID_STEP) {
        ctx.beginPath();
        ctx.moveTo(0, y + yOffset);
        ctx.lineTo(canvas.width, y + yOffset);
        ctx.stroke();
      }
    };

    const drawDataflowLanes = () => {
      const startX = canvas.width * 0.08;
      const endX = canvas.width * 0.78;
      const topY = canvas.height * 0.24;
      const gap = Math.max(46, canvas.height * 0.11);

      for (let lane = 0; lane < LANE_COUNT; lane += 1) {
        const y = topY + lane * gap;
        const gradient = ctx.createLinearGradient(startX, y, endX, y);
        gradient.addColorStop(0, "rgba(0, 242, 254, 0.06)");
        gradient.addColorStop(0.7, "rgba(0, 242, 254, 0.14)");
        gradient.addColorStop(1, "rgba(0, 242, 254, 0.05)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(startX - 8, y - 4, 8, 8);
      }
    };

    const drawPackets = (time: number) => {
      const startX = canvas.width * 0.08;
      const endX = canvas.width * 0.78;
      const topY = canvas.height * 0.24;
      const gap = Math.max(46, canvas.height * 0.11);
      const laneLength = endX - startX;

      packetsRef.current.forEach((packet) => {
        const progress = (packet.offset + time * packet.speed) % 1;
        const x = startX + progress * laneLength;
        const y = topY + packet.lane * gap + Math.sin(time * 1.4 + packet.phase) * 1.5;

        ctx.fillStyle = "rgba(0, 242, 254, 0.28)";
        ctx.fillRect(x, y - 3, packet.size, 6);

        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(x + 2, y - 1, Math.max(3, packet.size * 0.45), 2);
      });
    };

    const drawOutcomePanel = (time: number) => {
      const panelX = canvas.width * 0.8;
      const panelY = canvas.height * 0.18;
      const panelW = Math.max(170, canvas.width * 0.14);
      const panelH = Math.max(260, canvas.height * 0.52);

      ctx.fillStyle = "rgba(8, 24, 44, 0.38)";
      ctx.fillRect(panelX, panelY, panelW, panelH);

      ctx.strokeStyle = "rgba(0, 242, 254, 0.16)";
      ctx.lineWidth = 1;
      ctx.strokeRect(panelX, panelY, panelW, panelH);

      const barCount = LANE_COUNT;
      const barGap = panelH / (barCount + 1);
      for (let i = 0; i < barCount; i += 1) {
        const y = panelY + barGap * (i + 1);
        const value = 0.25 + 0.7 * (0.5 + 0.5 * Math.sin(time * 1.1 + i * 0.7));
        const barW = (panelW - 26) * value;

        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(panelX + 12, y - 5, panelW - 26, 10);

        ctx.fillStyle = "rgba(0, 242, 254, 0.24)";
        ctx.fillRect(panelX + 12, y - 5, barW, 10);
      }
    };

    const drawConnectors = () => {
      const startX = canvas.width * 0.78;
      const endX = canvas.width * 0.8;
      const topY = canvas.height * 0.24;
      const gap = Math.max(46, canvas.height * 0.11);
      const panelTop = canvas.height * 0.18;
      const panelHeight = Math.max(260, canvas.height * 0.52);
      const barGap = panelHeight / (LANE_COUNT + 1);

      for (let lane = 0; lane < LANE_COUNT; lane += 1) {
        const y1 = topY + lane * gap;
        const y2 = panelTop + barGap * (lane + 1);
        ctx.strokeStyle = "rgba(0, 242, 254, 0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, y1);
        ctx.lineTo(endX, y2);
        ctx.stroke();
      }
    };

    const animate = (now: number) => {
      const time = now * 0.001;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(4, 8, 18, 0.76)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawVisionGrid(time);
      drawDataflowLanes();
      drawPackets(time);
      drawOutcomePanel(time);
      drawConnectors();

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ opacity: 0.5 }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 72% 28%, rgba(0, 242, 254, 0.08) 0%, transparent 38%), linear-gradient(112deg, rgba(4, 8, 20, 0.42), rgba(8, 12, 30, 0.1), rgba(4, 8, 20, 0.42))",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
