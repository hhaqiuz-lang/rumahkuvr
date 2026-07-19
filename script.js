// RumahKuVR portfolio interactions
// Replace only the links/images/content marked in index.html. No external libraries are required.

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];

navToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation');
  });
});

// Subtle scroll reveal animation.
const revealItems = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Highlight the active navigation section while scrolling.
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.remove('active'));
      const activeLink = navLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`);
      activeLink?.classList.add('active');
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

// Gallery image modal.
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.querySelector('.modal-close');
let lastFocusedElement = null;

function openModal(imageSrc, title, trigger) {
  lastFocusedElement = trigger;
  modalImage.src = imageSrc;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modal.hidden = true;
  modalImage.src = '';
  document.body.style.overflow = '';
  lastFocusedElement?.focus();
}

document.querySelectorAll('.gallery-card').forEach((card) => {
  const image = card.querySelector('img');

  // Keep gallery cards visually usable even before screenshots are added.
  image.addEventListener('error', () => {
    image.style.display = 'none';
    card.classList.add('missing-image');
  });

  card.addEventListener('click', () => {
    const imageSrc = card.dataset.image;
    const title = card.dataset.title || 'RumahKuVR gameplay screenshot';

    // Only open the modal if the actual image loaded successfully.
    if (image.complete && image.naturalWidth > 0) {
      openModal(imageSrc, title, card);
    }
  });
});

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

// Frontend-only contact/demo request form.
// IMPORTANT: This does not send data anywhere until you connect a backend/form service.
const demoForm = document.getElementById('demo-form');
const formStatus = document.getElementById('form-status');

demoForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!demoForm.checkValidity()) {
    formStatus.textContent = 'Please complete the required fields before continuing.';
    demoForm.reportValidity();
    return;
  }

  formStatus.textContent = 'Demo request form is currently frontend-only. Connect this form to your preferred backend or form service before publishing.';
});