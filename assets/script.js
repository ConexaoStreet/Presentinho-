const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const loader = document.getElementById('loader');
const musicToggle = document.getElementById('musicToggle');
const musicEntry = document.getElementById('musicEntry');
const bgMusic = document.getElementById('bgMusic');
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseModal = document.getElementById('surpriseModal');
const closeModal = document.getElementById('closeModal');
const reveals = document.querySelectorAll('.reveal');
const expiredScreen = document.getElementById('expiredScreen');
const giftTimer = document.getElementById('giftTimer');

const GIFT_KEY = 'lupyta_present_start_v1';
const GIFT_DURATION = 10 * 60 * 1000;
let siteExpired = false;
let timerInterval = null;

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
    if (siteExpired) return;
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

  const setStoppedUI = () => {
    playing = false;
    musicToggle.textContent = '🎵 tocar nossa musiquinha';
    musicToggle.setAttribute('aria-pressed', 'false');
    if (musicEntry) {
      musicEntry.textContent = '🎵 tocar nossa musiquinha';
      musicEntry.setAttribute('aria-pressed', 'false');
    }
  };

  const setPlayingUI = () => {
    playing = true;
    musicToggle.textContent = '🎵 pausar nossa musiquinha';
    musicToggle.setAttribute('aria-pressed', 'true');
    if (musicEntry) {
      musicEntry.textContent = '🎵 pausar nossa musiquinha';
      musicEntry.setAttribute('aria-pressed', 'true');
    }
  };

  const toggleMusic = async () => {
    if (siteExpired) return;

    try {
      if (!playing) {
        const playPromise = bgMusic.play();

        if (playPromise && typeof playPromise.then === 'function') {
          await playPromise;
        }

        setPlayingUI();
      } else {
        bgMusic.pause();
        setStoppedUI();
      }
    } catch {
      setStoppedUI();
      musicToggle.textContent = '🎵 toca aqui de novo pra ligar a música';
      if (musicEntry) musicEntry.textContent = '🎵 toca aqui de novo pra ligar a música';
    }
  };

  bgMusic.autoplay = false;
  bgMusic.preload = 'metadata';
  bgMusic.playsInline = true;
  bgMusic.setAttribute('playsinline', '');
  bgMusic.pause();
  setStoppedUI();

  musicToggle.addEventListener('click', toggleMusic);
  if (musicEntry) musicEntry.addEventListener('click', toggleMusic);

  bgMusic.addEventListener('play', setPlayingUI);
  bgMusic.addEventListener('pause', () => {
    if (bgMusic.ended) return;
    setStoppedUI();
  });
  bgMusic.addEventListener('ended', setStoppedUI);
}

function formatLeft(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const min = String(Math.floor(total / 60)).padStart(2, '0');
  const sec = String(total % 60).padStart(2, '0');
  return `${min} ${sec}`;
}

function showExpiredState() {
  siteExpired = true;
  if (timerInterval) clearInterval(timerInterval);
  if (giftTimer) {
    giftTimer.hidden = true;
    giftTimer.textContent = '⏳ 00 00';
  }
  if (bgMusic) bgMusic.pause();
  if (menu) menu.classList.remove('open');
  if (surpriseModal) {
    surpriseModal.classList.remove('show');
    surpriseModal.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('modal-open');
  if (expiredScreen) {
    expiredScreen.classList.add('show');
    expiredScreen.setAttribute('aria-hidden', 'false');
  }
}

function initGiftTimer() {
  let start = localStorage.getItem(GIFT_KEY);

  if (!start) {
    start = String(Date.now());
    localStorage.setItem(GIFT_KEY, start);
  }

  const startTime = Number(start);
  const endTime = startTime + GIFT_DURATION;

  const tick = () => {
    const left = endTime - Date.now();

    if (left <= 0) {
      showExpiredState();
      return;
    }

    if (giftTimer) {
      giftTimer.hidden = false;
      giftTimer.textContent = `⏳ ${formatLeft(left)}`;
    }
  };

  tick();
  timerInterval = setInterval(tick, 1000);
}

initGiftTimer();
