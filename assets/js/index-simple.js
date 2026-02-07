// DNA Loading Screen Functionality
window.addEventListener("load", function () {
    const Loader = document.querySelector(".Loader");
    if (Loader) {
        // Wait for 2.5 seconds then fade out
        setTimeout(() => {
            Loader.classList.add("hidden");
        }, 2500);
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

// One number everywhere
const PHONE = '79069834'; // full international, no "+"
console.log('PHONE variable defined:', PHONE);

// Opens WhatsApp without showing the "install Business" box
function openWhatsApp(phone = PHONE, text = '') {
    console.log('openWhatsApp called with:', { phone, text });
    const n = String(phone).replace(/[^\d]/g, '');
    const msg = encodeURIComponent(text || '');
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    console.log('Device detection:', { isMobile, phoneNumber: n, message: msg });

    if (!isMobile) {
        // Desktop → Web WhatsApp
        window.open(`https://web.whatsapp.com/send?phone=${n}&text=${msg}`, '_blank', 'noopener');
        return;
    }

    // Mobile: try native scheme first (no package = no "install" dialog)
    const scheme = `whatsapp://send?phone=${n}&text=${msg}`;
    const web    = `https://api.whatsapp.com/send?phone=${n}&text=${msg}`;

    let fallbackTimer;

    // If the app opens, the page goes hidden → cancel fallback
    const cancelFallback = () => { if (fallbackTimer) clearTimeout(fallbackTimer); };
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelFallback();
    }, { once: true });

    // Attempt native app
    location.href = scheme;

    // If nothing handled it, quietly fall back to the web endpoint
    fallbackTimer = setTimeout(() => {
        location.href = web;
    }, 900);
}

// Share button functionality
(() => {
    console.log('Initializing share functionality...');
    const shareBtn = document.getElementById('shareBtn');
    const panel    = document.getElementById('sharePanel');
    const toast    = document.getElementById('copyToast');
    const pageUrl  = window.location.href;
    const pageTitle= document.title;

    console.log('Share elements found:', { shareBtn: !!shareBtn, panel: !!panel, toast: !!toast });

    if (!shareBtn || !panel || !toast) {
        console.warn('Share elements not found');
        return;
    }

    function closePanel(){
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden','true');
    }

    shareBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        console.log('Share button clicked');
        
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            console.log('gtag available, tracking event');
            gtag('event', 'share_click', {
                label: 'Heart Share',
                location: 'floating_left',
                channel: 'panel_open'
            });
        } else {
            console.warn('gtag not available');
        }
        
        const shareData = { title: pageTitle, text: 'I love this test! you should check it out', url: pageUrl };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return; // native share succeeded
            } catch (err) {
                // If user cancels, we do nothing; otherwise fall back
            }
        }
        // Fallback panel
        const willOpen = !panel.classList.contains('open');
        panel.classList.toggle('open', willOpen);
        panel.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
    });

    panel.addEventListener('click', async (e) => {
        const btn = e.target.closest('.share-option');
        if (!btn) return;

        const action = btn.dataset.action;
        if (action === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(pageUrl)}`, '_blank', 'noopener');
        } else if (action === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
                        '_blank', 'noopener,width=600,height=460');
        } else if (action === 'telegram') {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`,
                        '_blank', 'noopener');
        } else if (action === 'copy') {
            try {
                await navigator.clipboard.writeText(pageUrl);
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 1500);
            } catch (err) { /* ignore */ }
            }
        closePanel();
    });

    // Close on outside click / ESC
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== shareBtn && !shareBtn.contains(e.target)) {
            closePanel();
        }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
})();

// Check if functions are available globally
console.log('Functions available:', {
    openWhatsApp: typeof openWhatsApp,
    PHONE: typeof PHONE !== 'undefined' ? PHONE : 'undefined'
});
