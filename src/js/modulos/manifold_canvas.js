/**
 * src/js/modulos/manifold_canvas.js
 * ----------------------------------
 * Motor de Animación Interactivo Manifold Data Flow
 * Genera una red neuronal de datos geoespaciales relacionales (partículas, nodos
 * topológicos, ondas de densidad VGI y líneas de flujo manifold) en HTML5 Canvas.
 * Reacciona dinámicamente al movimiento del mouse, selección de capas y navegación.
 */

window.ManifoldCanvas = (function () {
  let canvas = null;
  let ctx = null;
  let animId = null;
  let width = 0;
  let height = 0;
  let particles = [];
  let mouse = { x: -1000, y: -1000, radius: 150 };
  let isEnabled = true;

  const NUM_PARTICLES = 65;
  const CONNECT_DIST = 130;

  function Particle(x, y) {
    this.x = x || Math.random() * width;
    this.y = y || Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.radius = Math.random() * 2.2 + 1.2;
    this.color = Math.random() > 0.4 ? "#06b6d4" : Math.random() > 0.5 ? "#10b981" : "#8b5cf6";
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.03 + Math.random() * 0.02;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    this.pulse += this.pulseSpeed;

    // Interacción con mouse
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouse.radius && dist > 0) {
      const force = (mouse.radius - dist) / mouse.radius;
      this.x -= (dx / dist) * force * 2.5;
      this.y -= (dy / dist) * force * 2.5;
    }
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    const currentRadius = this.radius + Math.sin(this.pulse) * 0.6;
    ctx.arc(this.x, this.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
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
      container.style.opacity = "0.45";
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
          const alpha = (1 - dist / CONNECT_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function drawManifoldWaves() {
    const time = Date.now() * 0.001;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.8);
    for (let x = 0; x <= width; x += 30) {
      const y = height * 0.85 + Math.sin(x * 0.005 + time) * 15 + Math.cos(x * 0.003 - time * 0.8) * 10;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function loop() {
    if (!isEnabled) return;
    ctx.clearRect(0, 0, width, height);

    drawManifoldWaves();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    drawConnections();

    animId = requestAnimationFrame(loop);
  }

  function pulseBurst(x, y) {
    for (let i = 0; i < 8; i++) {
      const p = new Particle(x, y);
      p.vx = (Math.random() - 0.5) * 4;
      p.vy = (Math.random() - 0.5) * 4;
      particles.push(p);
      if (particles.length > NUM_PARTICLES + 20) {
        particles.shift();
      }
    }
  }

  return {
    init: init,
    pulseBurst: pulseBurst
  };
})();
