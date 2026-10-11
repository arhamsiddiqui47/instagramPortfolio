// ---------- Mobile nav ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

// ---------- Scroll reveal ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
} else {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
}

// ---------- Hero stat count-up ----------
function countUp(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

if (!reduceMotion) {
    document.querySelectorAll('.stat-num[data-count]').forEach(countUp);
}

// ---------- Reel filter ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const reelCards = document.querySelectorAll('.reel-container');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        reelCards.forEach(card => {
            card.hidden = filter !== 'all' && card.dataset.series !== filter;
        });
    });
});

// ---------- Copy email ----------
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

document.getElementById('copy-email').addEventListener('click', async e => {
    const email = e.currentTarget.dataset.email;
    try {
        await navigator.clipboard.writeText(email);
        showToast('Email copied to clipboard!');
    } catch {
        // Clipboard API is blocked on some browsers / non-https pages
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(ok ? 'Email copied to clipboard!' : email);
    }
});
