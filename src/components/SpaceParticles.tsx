import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
}

interface NebulaPuff {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
  phase: number;
  speed: number;
  drift: number;
}

const SpaceParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nebulaeRef = useRef<NebulaPuff[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNebulae();
    };

    const colors = [
      "180, 220, 255",
      "195, 230, 255",
      "255, 200, 140",
      "200, 160, 255",
      "255, 180, 220",
    ];

    const initNebulae = () => {
      nebulaeRef.current = Array.from({ length: 5 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 100 + Math.random() * 250,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0003 + Math.random() * 0.0005,
        drift: (Math.random() - 0.5) * 0.1,
      }));
    };

    const spawnParticle = () => {
      if (particlesRef.current.length > 80) return;
      const maxLife = 200 + Math.random() * 400;
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife,
      });
    };

    const spawnShootingStar = () => {
      if (shootingStarsRef.current.length > 2) return;
      if (Math.random() > 0.005) return;
      const angle = -0.3 - Math.random() * 0.5;
      const speed = 4 + Math.random() * 6;
      shootingStarsRef.current.push({
        x: Math.random() * canvas.width * 1.2,
        y: -20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * -1,
        length: 60 + Math.random() * 100,
        opacity: 0.6 + Math.random() * 0.4,
        life: 0,
      });
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Nebula puffs
      for (const n of nebulaeRef.current) {
        const pulse = 0.7 + 0.3 * Math.sin(time * n.speed + n.phase);
        n.x += n.drift;
        if (n.x > canvas.width + n.radius) n.x = -n.radius;
        if (n.x < -n.radius) n.x = canvas.width + n.radius;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * pulse);
        grad.addColorStop(0, `rgba(${n.color}, ${n.opacity * pulse})`);
        grad.addColorStop(0.5, `rgba(${n.color}, ${n.opacity * pulse * 0.4})`);
        grad.addColorStop(1, `rgba(${n.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
      }

      // Floating particles
      spawnParticle();
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        p.opacity = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1;
        p.opacity *= 0.6;

        if (p.life > p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();

        // Soft glow
        if (p.size > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.opacity * 0.08})`;
          ctx.fill();
        }
      }

      // Shooting stars
      spawnShootingStar();
      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const s = shootingStarsRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        if (s.y > canvas.height + 50 || s.x < -50 || s.x > canvas.width + 50 || s.life > 120) {
          shootingStarsRef.current.splice(i, 1);
          continue;
        }

        const fade = Math.max(0, 1 - s.life / 120);
        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - s.vx * (s.length / Math.hypot(s.vx, s.vy)),
          s.y - s.vy * (s.length / Math.hypot(s.vx, s.vy))
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity * fade})`);
        grad.addColorStop(0.3, `rgba(180, 220, 255, ${s.opacity * fade * 0.6})`);
        grad.addColorStop(1, `rgba(180, 220, 255, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - s.vx * (s.length / Math.hypot(s.vx, s.vy)),
          s.y - s.vy * (s.length / Math.hypot(s.vx, s.vy))
        );
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity * fade})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default SpaceParticles;
