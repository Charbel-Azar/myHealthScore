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
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Simple risk chart using Canvas
const canvas = document.getElementById('riskChart');
const ctx = canvas.getContext('2d');

// Chart data
const ages = [35, 40, 45, 50, 55, 60, 65, 70, 75];
const generalPop = [2, 3, 5, 8, 12, 18, 25, 35, 45];
const highRisk = [5, 8, 12, 18, 25, 35, 45, 60, 75];

// Chart dimensions
const padding = 40;
const chartWidth = canvas.width - 2 * padding;
const chartHeight = canvas.height - 2 * padding;

// Draw chart
function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw grid lines and labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // X-axis labels (ages)
    for (let i = 0; i < ages.length; i++) {
        const x = padding + (i * chartWidth) / (ages.length - 1);
        ctx.fillText(ages[i], x, canvas.height - padding + 20);
    }
    
    // Y-axis labels (percentages)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 80; i += 20) {
        const y = canvas.height - padding - (i * chartHeight) / 80;
        ctx.fillText(i, padding - 10, y + 4);
    }
    
    // Draw lines
    function drawLine(data, color, label) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i < data.length; i++) {
            const x = padding + (i * chartWidth) / (data.length - 1);
            const y = canvas.height - padding - (data[i] * chartHeight) / 80;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Add legend
        const legendY = padding + (label === 'General population' ? 0 : 20);
        ctx.fillStyle = color;
        ctx.fillRect(padding + 150, legendY, 20, 3);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(label, padding + 180, legendY + 8);
    }
    
    drawLine(generalPop, '#667eea', 'General population');
    drawLine(highRisk, '#4ecdc4', 'People with this PRS');
}

// Draw the chart when page loads
window.addEventListener('load', drawChart);

// Smooth scrolling for any future navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ---------- DOB selects: populate & sync ---------- */
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function daysInMonth(year, monthIndex /* 0-11 */) {
  return new Date(year || 2000, (monthIndex ?? 0) + 1, 0).getDate(); // safe default
}

function populateYears(select, lastYear = new Date().getFullYear(), firstYear = 1900) {
  for (let y = lastYear; y >= firstYear; y--) {
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = String(y);
    select.appendChild(opt);
  }
}

function populateMonths(select) {
  monthNames.forEach((name, i) => {
    const opt = document.createElement('option');
    opt.value = String(i + 1); // 1..12
    opt.textContent = name;
    select.appendChild(opt);
  });
}

function populateDays(select, year, monthIndex) {
  const prev = select.value;
  select.innerHTML = '<option value="" selected>Day</option>';
  if (!year || !Number.isInteger(monthIndex)) return;
  const count = daysInMonth(year, monthIndex);
  for (let d = 1; d <= count; d++) {
    const opt = document.createElement('option');
    opt.value = String(d);
    opt.textContent = String(d);
    select.appendChild(opt);
  }
  if (prev && Number(prev) <= count) select.value = prev;
}

document.addEventListener('DOMContentLoaded', () => {
  const yearSel  = document.getElementById('dobYear');
  const monthSel = document.getElementById('dobMonth');
  const daySel   = document.getElementById('dobDay');

  populateYears(yearSel);   // current year → 1900
  populateMonths(monthSel); // Jan..Dec

  const updateDays = () => {
    const y = Number(yearSel.value);
    const mIndex = Number(monthSel.value) ? Number(monthSel.value) - 1 : undefined;
    populateDays(daySel, y, mIndex);
  };

  yearSel.addEventListener('change', updateDays);
  monthSel.addEventListener('change', updateDays);
});

/* ---------- Form submission ---------- */
document.getElementById('userForm').addEventListener('submit', e => {
  e.preventDefault();

  const name   = document.getElementById('name').value.trim();
  const doctor = document.getElementById('doctor').value.trim();
  const y = document.getElementById('dobYear').value;
  const m = document.getElementById('dobMonth').value;
  const d = document.getElementById('dobDay').value;

  const orNA = v => v ? v : 'Not provided';

  let dobStr = 'Not provided';
  if (y && m && d) {
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    const valid = dt.getFullYear() == y && (dt.getMonth() + 1) == Number(m) && dt.getDate() == Number(d);
    dobStr = valid
      ? `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      : 'Invalid date';
  }

  const msg = `Hi! I am interested in your myHealthScore test. Here are my details:

Name: ${orNA(name)}
Date of Birth: ${dobStr}
Referring Doctor: ${orNA(doctor)}

Please contact me to schedule my genetic testing appointment.`;

  // === NEW: use the JS opener (works for Business & regular) ===
  openWhatsApp(PHONE, msg);
});

/* ---------- (Optional) other code you already have ---------- */
/* Share on Facebook */
function shareOnFacebook() {
  const url = window.location.href;
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    '_blank',
    'width=600,height=400'
  );
}

/* Smooth scrolling for in-page links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

/* Fade-in animation only if an IntersectionObserver named `observer` exists */
if (typeof observer !== 'undefined') {
  document.querySelectorAll('.stat-card, .user-info-card, .social-proof, .share-section')
    .forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });
}

(() => {
  const shareBtn = document.getElementById('shareBtn');
  const panel    = document.getElementById('sharePanel');
  const toast    = document.getElementById('copyToast');
  const pageUrl  = window.location.href;
  const pageTitle= document.title;

  function closePanel(){
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
  }

  shareBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share_click', {
        label: 'Heart Share',
        location: 'floating_left',
        channel: 'panel_open'
      });
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

// One number everywhere
const PHONE = '79069834'; // full international, no "+"

// Opens WhatsApp without showing the "install Business" box
function openWhatsApp(phone = PHONE, text = '') {
  const n = String(phone).replace(/[^\d]/g, '');
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
