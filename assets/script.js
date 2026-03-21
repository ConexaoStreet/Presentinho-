const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const loader = document.getElementById('loader');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseModal = document.getElementById('surpriseModal');
const closeModal = document.getElementById('closeModal');
const reveals = document.querySelectorAll('.reveal');

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hide'), 700);
});

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => menu.classList.toggle('open'));

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

reveals.forEach((item) => observer.observe(item));

if (surpriseBtn && surpriseModal && closeModal) {
  const openModal = () => {
    surpriseModal.classList.add('show');
    document.body.classList.add('modal-open');
    surpriseModal.setAttribute('aria-hidden', 'false');
  };

  const hideModal = () => {
    surpriseModal.classList.remove('show');
    document.body.classList.remove('modal-open');
    surpriseModal.setAttribute('aria-hidden', 'true');
  };

  surpriseBtn.addEventListener('click', openModal);
  closeModal.addEventListener('click', hideModal);

  surpriseModal.addEventListener('click', (e) => {
    if (e.target === surpriseModal) hideModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
  });
}

if (musicToggle && bgMusic) {
  let playing = false;

  musicToggle.addEventListener('click', async () => {
    try {
      if (!playing) {
        await bgMusic.play();
        playing = true;
        musicToggle.textContent = '🎵 pausar musiquinha';
      } else {
        bgMusic.pause();
        playing = false;
        musicToggle.textContent = '🎵 ligar musiquinha';
      }
    } catch {
      musicToggle.textContent = '🎵 coloca sua música em assets/music.mp3';
    }
  });
}
