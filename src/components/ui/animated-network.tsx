import { useEffect, useRef } from "react";

type NetworkNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

export type AnimatedNetworkProps = {
  /** Palette of the constellation. The NXT hero is always dark. */
  mode?: "dark" | "light";
  className?: string;
};

const CONNECTION_DISTANCE = 135;
const MOUSE_RADIUS = 180;

/**
 * Subtle drifting neural network: silver particles, hairline connections,
 * occasional node glow, gentle mouse repulsion. Static frame under
 * prefers-reduced-motion; pauses when offscreen or the tab is hidden.
 */
export function AnimatedNetwork({
  mode = "dark",
  className = "",
}: AnimatedNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dark = mode === "dark";
    const lineInk = dark ? "190,195,200" : "40,42,46";
    const nodeInk = dark ? "220,225,230" : "30,32,36";
    const glowInk = dark ? "255,255,255" : "30,32,36";
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let hostVisible = true;
    let nodes: NetworkNode[] = [];
    const mouse = { x: -1000, y: -1000 };

    // Pre-rendered glow sprite — avoids building a radial gradient per node
    // per frame (identical look, far cheaper).
    const GLOW = 14;
    const sprite = document.createElement("canvas");
    sprite.width = GLOW;
    sprite.height = GLOW;
    {
      const sctx = sprite.getContext("2d");
      if (sctx) {
        const g = sctx.createRadialGradient(
          GLOW / 2,
          GLOW / 2,
          0,
          GLOW / 2,
          GLOW / 2,
          GLOW / 2,
        );
        g.addColorStop(0, `rgba(${glowInk},${dark ? 0.42 : 0.3})`);
        g.addColorStop(1, `rgba(${glowInk},0)`);
        sctx.fillStyle = g;
        sctx.fillRect(0, 0, GLOW, GLOW);
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        100,
        Math.max(45, Math.floor((width * height) / 15000)),
      );
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: Math.random() * 1.3 + 0.5,
      }));

      if (reduce) render();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Very subtle radial glow behind the constellation
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65,
      );
      gradient.addColorStop(0, `rgba(${glowInk},${dark ? 0.035 : 0.02})`);
      gradient.addColorStop(0.45, `rgba(${glowInk},${dark ? 0.012 : 0.008})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < CONNECTION_DISTANCE) {
            const opacity =
              (1 - distance / CONNECTION_DISTANCE) * (dark ? 0.14 : 0.1);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${lineInk},${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Nodes (soft glow sprite + crisp core)
      const half = GLOW / 2;
      nodes.forEach((node) => {
        ctx.drawImage(sprite, node.x - half, node.y - half);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeInk},${dark ? 0.58 : 0.5})`;
        ctx.fill();
      });
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65,
      );
      gradient.addColorStop(0, `rgba(${glowInk},${dark ? 0.035 : 0.02})`);
      gradient.addColorStop(0.45, `rgba(${glowInk},${dark ? 0.012 : 0.008})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;

        // Slight mouse repulsion
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < MOUSE_RADIUS && distance > 0.001) {
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
          node.x -= (dx / distance) * force * 0.12;
          node.y -= (dy / distance) * force * 0.12;
        }
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < CONNECTION_DISTANCE) {
            const opacity =
              (1 - distance / CONNECTION_DISTANCE) * (dark ? 0.14 : 0.1);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${lineInk},${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      const half = GLOW / 2;
      nodes.forEach((node) => {
        ctx.drawImage(sprite, node.x - half, node.y - half);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeInk},${dark ? 0.58 : 0.5})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    const sync = () => {
      if (hostVisible && !document.hidden) start();
      else stop();
    };

    resize();

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            hostVisible = entry?.isIntersecting ?? true;
            sync();
          });
    observer?.observe(canvas);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    if (!reduce) start();

    return () => {
      stop();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

export default AnimatedNetwork;
