const root = document.documentElement;
const themeButtons = document.querySelectorAll('[data-theme-choice]');
const glassButtons = document.querySelectorAll('[data-glass-choice]');
const navigation = document.querySelector('[data-nav]');

themeButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const value = event.currentTarget.getAttribute('data-theme-choice');
    root.setAttribute('data-theme', value);
    themeButtons.forEach((item) => {
      item.setAttribute('aria-pressed', String(item.getAttribute('data-theme-choice') === value));
    });
  });
});

glassButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const value = event.currentTarget.getAttribute('data-glass-choice');
    root.setAttribute('data-glass', value);
    glassButtons.forEach((item) => {
      item.setAttribute('aria-pressed', String(item.getAttribute('data-glass-choice') === value));
    });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

function updateNavigation() {
  navigation?.classList.toggle('is-scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();

if (matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.spotlight').forEach((card) => {
    let frame;
    card.addEventListener('pointermove', (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
      });
    });
  });
}
