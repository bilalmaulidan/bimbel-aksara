const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const navLinks = navigation ? [...navigation.querySelectorAll('.nav-link')] : [];

function setActiveLink(link) {
  if (!link) return;

  navLinks.forEach((item) => {
    const active = item === link;
    item.classList.toggle('is-active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });

  if (navigation && window.matchMedia('(min-width: 768px)').matches) {
    navigation.style.setProperty('--active-left', `${link.offsetLeft}px`);
    navigation.style.setProperty('--active-width', `${link.offsetWidth}px`);
    const activeColors = {
      '#beranda': '#7dd3fc',
      '#tentang': '#86efac',
      '#jadwal': '#7dd3fc',
      '#perkembangan': '#fcd34d',
      '#kontak': '#fda4af'
    };
    navigation.style.setProperty('--active-color', activeColors[link.hash] || '#0f172a');
  }
}

function updateActiveSection() {
  const headerHeight = document.querySelector('.site-header')?.offsetHeight ?? 0;
  const activationLine = headerHeight + window.innerHeight * 0.25;
  const sections = navLinks
    .map((link) => ({ link, section: document.querySelector(link.hash) }))
    .filter((item) => item.section);

  const current = sections
    .filter(({ section }) => section.getBoundingClientRect().top <= activationLine
      && section.getBoundingClientRect().bottom > headerHeight + 24)
    .at(-1);

  if (current && !current.link.classList.contains('is-active')) {
    setActiveLink(current.link);
  }
}

if (navigation) {


  setActiveLink(navLinks.find((link) => link.hash === window.location.hash) || navLinks[0]);
  updateActiveSection();
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveSection();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', () => {
    const activeLink = navLinks.find((link) => link.classList.contains('is-active'));
    if (activeLink) setActiveLink(activeLink);
  });
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Buka menu' : 'Tutup menu');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && window.matchMedia('(max-width: 767px)').matches) {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Buka menu');
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Buka menu');
    }
  });
}

const revealItems = document.querySelectorAll('[data-reveal]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => revealObserver.observe(item));
}






