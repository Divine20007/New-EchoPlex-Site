/* ============================================
   EchoPlex — Ecosystem Page Interactions
   ============================================ */

// --- Ecosystem SVG Node Interactions ---
function initEcosystemMap() {
  const svg = document.querySelector('.ecosystem-svg');
  if (!svg) return;

  const nodes = svg.querySelectorAll('.eco-node-group');

  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      nodes.forEach(n => {
        if (n !== node) n.style.opacity = '0.4';
      });
    });

    node.addEventListener('mouseleave', () => {
      nodes.forEach(n => n.style.opacity = '');
    });
  });

  // Animate connectors drawing in
  const connectors = svg.querySelectorAll('.eco-connector');
  connectors.forEach((conn, i) => {
    conn.style.opacity = '0';
    setTimeout(() => {
      conn.style.transition = 'opacity 0.6s ease';
      conn.style.opacity = '1';
    }, 300 + i * 150);
  });
}

// --- Flywheel Animation ---
function initFlywheel() {
  const flywheel = document.querySelector('.flywheel');
  if (!flywheel) return;

  const steps = flywheel.querySelectorAll('.flywheel-step');
  if (steps.length === 0) return;

  let activeIndex = 0;

  function highlight() {
    steps.forEach((step, i) => {
      step.classList.toggle('flywheel-active', i === activeIndex);
    });
    activeIndex = (activeIndex + 1) % steps.length;
  }

  highlight();
  setInterval(highlight, 1800);
}

initEcosystemMap();
initFlywheel();
