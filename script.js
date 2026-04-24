/* ═══════════════════════════════════════════════
   Sparkle Particle System
═══════════════════════════════════════════════ */
(function initSparkles() {
  const canvas = document.getElementById("sparkles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const PARTICLE_COUNT = 55;
  const GOLD_COLORS = [
    "rgba(212, 175, 55, ALPHA)",
    "rgba(238, 220, 130, ALPHA)",
    "rgba(247, 231, 206, ALPHA)",
    "rgba(168, 137, 26, ALPHA)",
  ];

  let particles = [];
  let W = 0;
  let H = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle() {
    const colorTemplate =
      GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
    return {
      x: randBetween(0, W),
      y: randBetween(0, H),
      r: randBetween(0.8, 2.4),
      alpha: randBetween(0.1, 0.7),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      alphaSpeed: randBetween(0.003, 0.009),
      vx: randBetween(-0.12, 0.12),
      vy: randBetween(-0.25, -0.06),
      colorTemplate,
    };
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawStar(x, y, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const px = x + Math.cos(angle) * r * 2.5;
      const py = y + Math.sin(angle) * r * 2.5;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      const midAngle = angle + Math.PI / 4;
      ctx.lineTo(
        x + Math.cos(midAngle) * r * 0.9,
        y + Math.sin(midAngle) * r * 0.9
      );
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p) => {
      // Breathe alpha
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (p.alpha >= 0.75 || p.alpha <= 0.05) p.alphaDir *= -1;

      // Float upward
      p.x += p.vx;
      p.y += p.vy;

      // Wrap vertically
      if (p.y < -10) p.y = H + 10;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      const color = p.colorTemplate.replace("ALPHA", p.alpha.toFixed(2));

      // Alternate between circle and star
      if (p.r > 1.8) {
        drawStar(p.x, p.y, p.r, color);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });

    requestAnimationFrame(tick);
  }

  resize();
  initParticles();
  tick();

  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });
})();

/* ═══════════════════════════════════════════════
   Scroll Reveal (IntersectionObserver)
═══════════════════════════════════════════════ */
(function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  // Stagger delays for sequential reveal
  const delays = [0, 150, 300, 450, 600];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const index = Array.from(elements).indexOf(el);
          const delay = delays[index] ?? 0;
          setTimeout(() => {
            el.classList.add("visible");
          }, delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
})();
