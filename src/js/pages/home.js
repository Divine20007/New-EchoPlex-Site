/* ============================================
   EchoPlex — Home Page Interactions
   ============================================ */

// --- Hero Orb Animation ---
function initHeroOrb() {
  const orb = document.querySelector('.hero-orb');
  if (!orb) return;

  // Subtle parallax on mouse move
  const hero = document.querySelector('.hero-home');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      orb.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      orb.style.transform = 'translate(0, 0)';
    });
  }

  // Tooltip on node hover
  const nodes = orb.querySelectorAll('.orb-node');
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      node.setAttribute('title', node.dataset.tooltip || '');
    });
  });
}

initHeroOrb();
