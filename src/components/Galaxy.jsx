import { useEffect, useRef } from "react";

function detectParticleCount() {
  const isMobile = window.innerWidth < 768;
  const memory = window.navigator?.deviceMemory;
  const isLowEnd = (memory && memory < 4) || isMobile;

  if (isLowEnd) {
    return 50;
  }

  const hasHighPerf = (memory && memory >= 8) || window.screen.width >= 1920;
  if (hasHighPerf) {
    return 200;
  }

  return 100;
}

export default function Galaxy({ isDark = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const container = ref.current;
    if (!container) return;
    container.appendChild(canvas);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Reduced motion support (Requirement 6.2)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      ctx.fillStyle = isDark ? "black" : "#add8e6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return () => {
        window.removeEventListener("resize", resize);
        if (container && container.contains(canvas)) {
          container.removeChild(canvas);
        }
      };
    }

    const particleCount = detectParticleCount();

    let stars = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 2 + 0.5
    }));

    let frame;
    const draw = () => {
      // Background: Pitch cosmic dark for dark mode, crisp slate for bright mode
      ctx.fillStyle = isDark ? "#080C19" : "#F8FAFC"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars: White for dark mode, soft indigo dots for bright mode
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(99, 102, 241, 0.35)";
      stars.forEach((s) => {
        ctx.fillRect(s.x, s.y, s.z, s.z);
        s.y += s.z * 0.25;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
      });
      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      if (container && container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [isDark]);

  return <div ref={ref} style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }} />;
}

