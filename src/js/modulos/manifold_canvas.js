/**
 * src/js/modulos/manifold_canvas.js
 * ----------------------------------
 * Motor de Animación Manifold Data Flow & Relational Topological Network
 * Genera una red neuronal geoespacial interactiva con partículas, líneas de flujo
 * relacionales, pulsos fotónicos en las conexiones y curvas topológicas dinámicas.
 * Totalmente optimizado y responsivo.
 */

window.ManifoldCanvas = (function () {
  let canvas = null;
  let ctx = null;
  let animId = null;
  let width = 0;
  let height = 0;
  let particles = [];
  let pulses = [];
  let mouse = { x: -1000, y: -1000, radius: 180 };
  let isEnabled = true;

  const NUM_PARTICLES = 75;
  const CONNECT_DIST = 140;

  function Particle(x, y) {
    this.x = x || Math.random() * width;
    this.y = y || Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.9;
    this.vy = (Math.random() - 0.5) * 0.9;
    this.radius = Math.random() * 2.5 + 1.2;
    this.color = Math.random() > 0.35 ? "#06b6d4" : Math.random() > 0.5 ? "#10b981" : "#a855f7";
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.03 + Math.random() * 0.02;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    this.pulse += this.pulseSpeed;

    // Repulsión / atracción interactiva del mouse
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouse.radius && dist > 0) {
      const force = (mouse.radius - dist) / mouse.radius;
      this.x -= (dx / dist) * force * 3.0;
      this.y -= (dy / dist) * force * 3.0;
    }
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    const currentRadius = this.radius + Math.sin(this.pulse) * 0.7;
    ctx.arc(this.x, this.y, Math.max(0.6, currentRadius), 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  function Pulse(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.progress = 0;
    this.speed = 0.015 + Math.random() * 0.02;
    this.color = Math.random() > 0.5 ? "#38bdf8" : "#10b981";
  }

  Pulse.prototype.update = function () {
    this.progress += this.speed;
    return this.progress <= 1;
  };

  Pulse.prototype.draw = function () {
    const x = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
    const y = this.p1.y + (this.p2.y - this.p1.y) * this.progress;

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  function init(containerId) {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = "manifold-bg-container";
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100vw";
      container.style.height = "100vh";
      container.style.pointerEvents = "none";
      container.style.zIndex = "0";
      container.style.opacity = "0.5";
      document.body.prepend(container);
    }

    canvas = document.createElement("canvas");
    canvas.id = "manifold-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    ctx = canvas.getContext("2d");
    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    createParticles();
    loop();
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.38;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          // Generar pulsos ocasionales
          if (Math.random() < 0.0008) {
            pulses.push(new Pulse(p1, p2));
          }
        }
      }
    }
  }

  function drawTopologicalWaves() {
    const time = Date.now() * 0.0008;
    ctx.lineWidth = 1.5;

    // Onda 1: Cyan Neón
    ctx.beginPath();
    ctx.moveTo(0, height * 0.85);
    for (let x = 0; x <= width; x += 40) {
      const y = height * 0.85 + Math.sin(x * 0.004 + time) * 20 + Math.cos(x * 0.002 - time) * 12;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";
    ctx.stroke();

    // Onda 2: Esmeralda
    ctx.beginPath();
    ctx.moveTo(0, height * 0.9);
    for (let x = 0; x <= width; x += 40) {
      const y = height * 0.9 + Math.cos(x * 0.003 - time * 1.2) * 25 + Math.sin(x * 0.005 + time) * 10;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
    ctx.stroke();
  }

  function loop() {
    if (!isEnabled) return;
    ctx.clearRect(0, 0, width, height);

    drawTopologicalWaves();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    drawConnections();

    // Actualizar y dibujar pulsos fotónicos
    pulses = pulses.filter(p => {
      const alive = p.update();
      if (alive) p.draw();
      return alive;
    });

    animId = requestAnimationFrame(loop);
  }

  function triggerDataBurst(x, y) {
    const targetX = x || width / 2;
    const targetY = y || height / 2;
    for (let i = 0; i < 12; i++) {
      const p = new Particle(targetX, targetY);
      p.vx = (Math.random() - 0.5) * 5.0;
      p.vy = (Math.random() - 0.5) * 5.0;
      particles.push(p);
      if (particles.length > NUM_PARTICLES + 30) {
        particles.shift();
      }
    }
  }

  return {
    init: init,
    triggerDataBurst: triggerDataBurst
  };
})();
