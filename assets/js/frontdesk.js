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

// Copy buttons (works for divs and textareas)
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.getAttribute('data-copy');
    const el = document.getElementById(id);
    if (!el) return;
    let text = '';
    if (el.tagName.toLowerCase() === 'textarea') {
      text = el.value;
    } else {
      // gather innerText from the element excluding the copy button
      const clone = el.cloneNode(true);
      clone.querySelectorAll('.copy-btn').forEach(b => b.remove());
      text = clone.innerText.trim();
    }
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = 'Copy'), 1200);
    } catch (e) {
      alert('Copy not available on this browser.');
    }
  });
});

// Open WhatsApp with the textarea content
const openWA = document.getElementById('openWA');
openWA?.addEventListener('click', (e) => {
  e.preventDefault();
  const txt = document.getElementById('waText').value;
  gtag && gtag('event','whatsapp_click_template',{label:'WA Template',location:'guide'});
  openWhatsApp(PHONE, txt);
});

// One number everywhere
const PHONE = '79069834'; // full international, no "+"

// Opens WhatsApp without showing the "install Business" box
function openWhatsApp(phone = PHONE, text = '') {
  const n = String(phone).replace(/[^0-9]/g, '');
  const msg = encodeURIComponent(text || '');
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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
