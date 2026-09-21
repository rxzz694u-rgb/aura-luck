import confetti from 'canvas-confetti';

export const triggerRestrainedConfetti = () => {
  // Elegant, restrained celebration confetti
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#C8FF00', '#FFFFFF', '#F5D67B', '#19D37A'],
    ticks: 200,
    gravity: 1.2,
    scalar: 0.9,
    shapes: ['circle', 'square'],
    disableForReducedMotion: true,
  });
};

export const triggerPackWinConfetti = () => {
  // Clean PackDraw-style win moment: one soft burst from the winning card,
  // plus a small delayed pop. No full-screen blast.
  const colors = ['#C8FF00', '#FFFFFF', '#F5D67B'];
  confetti({
    particleCount: 45,
    spread: 55,
    startVelocity: 32,
    origin: { y: 0.32 },
    colors,
    ticks: 160,
    gravity: 1.1,
    scalar: 0.85,
    shapes: ['circle', 'square'],
    disableForReducedMotion: true,
  });
  window.setTimeout(() => {
    confetti({
      particleCount: 20,
      spread: 70,
      startVelocity: 24,
      origin: { y: 0.32 },
      colors,
      ticks: 140,
      gravity: 1.1,
      scalar: 0.7,
      shapes: ['circle'],
      disableForReducedMotion: true,
    });
  }, 320);
};

export const triggerWinnerRevealConfetti = () => {
  // Rich golden & pastel confetti for grand winner reveal
  const end = Date.now() + 1.8 * 1000;
  const colors = ['#8B5CF6', '#F59E0B', '#10B981', '#0071E3', '#EC4899'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
      disableForReducedMotion: true,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};
