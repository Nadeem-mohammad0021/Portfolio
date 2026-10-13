// ===== Mobile navigation toggle =====
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const hamIcon = hamburger.querySelector('.hamburger-icon');
const crossIcon = hamburger.querySelector('.cross-icon');

function toggleMenu(open) {
    menu.classList.toggle('open', open);
    hamIcon.style.display = open ? 'none' : 'inline-block';
    crossIcon.style.display = open ? 'inline-block' : 'none';
}

hamburger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hamburger.click(); }
});

// Close menu when a link is clicked
menu.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => toggleMenu(false))
);

// ===== Sticky header + back-to-top on scroll =====
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('show', window.scrollY > 500);
    if (scrollProgress) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress.style.width = (scrollTop / height) * 100 + '%';
    }
});

backToTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
);

// ===== Active nav link based on section in view =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.menu .links');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) =>
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
            );
        }
    });
}, { rootMargin: '-45% 0px -55% 0px' });

sections.forEach((sec) => sectionObserver.observe(sec));

// ===== Scroll reveal animation =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ===== Typing effect in hero =====
const typedEl = document.getElementById('typed');
const roles = [
    'Data Science Enthusiast',
    'Machine Learning Explorer',
    'Web Developer',
    'Python Analyst'
];
let roleIndex = 0, charIndex = 0, deleting = false;

function type() {
    const current = roles[roleIndex];
    typedEl.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
        charIndex++;
        setTimeout(type, 80);
    } else if (deleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 40);
    } else if (!deleting && charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1600);
    } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 300);
    }
}
if (typedEl) type();

// ===== Certificate viewer (secure modal) =====
(function () {
    const modal = document.getElementById('certModal');
    if (!modal) return;
    const box = modal.querySelector('.cert-modal-box');
    const bodyEl = document.getElementById('certModalBody');
    const titleEl = document.getElementById('certModalTitle');
    const closeBtn = document.getElementById('certModalClose');
    const items = document.querySelectorAll('.cert-item');

    function openModal(item) {
        const type = item.dataset.type;
        const file = item.dataset.file;
        titleEl.textContent = item.dataset.title || 'Certificate';
        bodyEl.innerHTML = '';
        bodyEl.classList.remove('is-pdf', 'is-img');

        if (type === 'pdf') {
            bodyEl.classList.add('is-pdf');
            const frame = document.createElement('iframe');
            // Hide the toolbar / download UI where the viewer supports it.
            // (No sandbox here — Chrome blocks its built-in PDF viewer inside sandboxed frames.)
            frame.src = file + '#toolbar=0&navpanes=0&view=FitH';
            frame.setAttribute('title', titleEl.textContent);
            bodyEl.appendChild(frame);
        } else {
            bodyEl.classList.add('is-img');
            const img = document.createElement('img');
            img.src = file;
            img.alt = titleEl.textContent + ' (view only)';
            img.setAttribute('draggable', 'false');
            img.setAttribute('oncontextmenu', 'return false');
            bodyEl.appendChild(img);
        }

        // Watermark overlay (deters screenshots / re-use)
        const wm = document.createElement('div');
        wm.className = 'cert-watermark';
        bodyEl.appendChild(wm);

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('cert-modal-open');
        closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('cert-modal-open');
        bodyEl.innerHTML = ''; // unload the file
        bodyEl.classList.remove('is-pdf', 'is-img');
        bodyEl.style.filter = '';
    }

    items.forEach((item) => {
        item.addEventListener('click', () => openModal(item));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(item); }
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (!box.contains(e.target)) closeModal(); });

    // Block right-click / save inside the viewer
    bodyEl.addEventListener('contextmenu', (e) => e.preventDefault());
    bodyEl.addEventListener('dragstart', (e) => e.preventDefault());

    // Keyboard: Esc closes; block Ctrl+S / Ctrl+P; obscure PrintScreen captures
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') { closeModal(); return; }
        if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'S', 'P'].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key === 'PrintScreen') {
            navigator.clipboard && navigator.clipboard.writeText('').catch(() => {});
        }
    });
})();
