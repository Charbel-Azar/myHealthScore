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

const CLINIC_PHONE = '79069834';
const WA_MESSAGE = 'Hi, I am interested in a consultation.';

function openWhatsApp(phone, text){
    const n = String(phone);
    const msg = encodeURIComponent(text || '');
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const web = 'https://web.whatsapp.com/send?phone=' + n + '&text=' + msg;
    const api = 'https://api.whatsapp.com/send?phone=' + n + '&text=' + msg;
    
    if(!isMobile){
        window.open(web, '_blank','noopener');
        return;
    }
    
    location.href = 'whatsapp://send?phone=' + n + '&text=' + msg;
    setTimeout(function(){
        location.href = api;
    }, 700);
}

// WhatsApp button event listeners
[['waHero'],['waGen'],['floatWA'],['waDoctor']].forEach(function(pair){
    var id = pair[0];
    var el = document.getElementById(id);
    if(el){
        el.addEventListener('click', function(e){
            e.preventDefault();
            openWhatsApp(CLINIC_PHONE, WA_MESSAGE);
        });
    }
});

// Share functionality
(function(){
    var shareBtn = document.getElementById('floatShare');
    var panel = document.getElementById('sharePanel');
    var toast = document.getElementById('toast');
    
    function toggle(open){
        panel.classList.toggle('open', open);
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    
    shareBtn.addEventListener('click', function(e){
        e.preventDefault();
        toggle(!panel.classList.contains('open'));
    });
    
    panel.addEventListener('click', async function(e){
        var btn = e.target.closest('.share-option');
        if(!btn) return;
        
        var url = location.href;
        var action = btn.dataset.action;
        
        if(action==='copy'){
            try{
                await navigator.clipboard.writeText(url);
                toast.classList.add('show');
                setTimeout(function(){
                    toast.classList.remove('show');
                }, 1400);
            }catch(err){}
        } else if(action==='whatsapp'){
            window.open('https://wa.me/?text=' + encodeURIComponent(url),'_blank','noopener');
        } else if(action==='telegram'){
            window.open('https://t.me/share/url?url=' + encodeURIComponent(url),'_blank','noopener');
        } else if(action==='facebook'){
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url),'_blank','noopener,width=600,height=460');
        }
        
        toggle(false);
    });
    
    document.addEventListener('keydown', function(e){
        if(e.key==='Escape') toggle(false);
    });
    
    document.addEventListener('click', function(e){
        if(!panel.contains(e.target) && e.target!==shareBtn) toggle(false);
    });
})();

// Imaging Partners Data
const PARTNERS = [
    {
        name: 'CMC Women Clinic (Clemenceau Medical Center)',
        city: 'Beirut',
        wa: '79069834',
        site: 'https://www.cmc.com.lb/',
        img: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Clemenceau_Medical_Center_bilingual_logo.jpg'
    },
    {
        name: 'Keserwan Medical Center (KMC)',
        city: 'Ghazir',
        wa: '79069834',
        site: 'https://www.kmc.com.lb/',
        img: 'https://www.kmc.com.lb/assets/logo.png'
    },
    {
        name: 'CEMA — Centre d\'Exploration Médicale Avancée',
        city: 'Beirut',
        wa: '79069834',
        site: 'https://cema.com.lb/',
        img: 'https://cema.com.lb/wp-content/uploads/2018/08/3d-mammogram-1.jpg'
    }
];

var partnersWrap = document.getElementById('partners');

function renderPartners(){
    partnersWrap.innerHTML = '';
    PARTNERS.forEach(function(p, idx){
        var card = document.createElement('div');
        card.className = 'card partner-card';
        card.innerHTML = 
            '<img src="' + p.img + '" alt="' + p.name + ' logo or photo" loading="lazy">' +
            '<h3 style="margin:.6rem 0 0">' + p.name + '</h3>' +
            '<div class="muted">' + p.city + '</div>' +
            '<div class="cta-row" style="margin-top:.6rem">' +
            '  <a href="' + p.site + '" target="_blank" rel="noopener" class="btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Website</a>' +
            '  <a href="#" data-idx="' + idx + '" class="btn btn-wa partner-book"><i class="fa-brands fa-whatsapp"></i> Book via WhatsApp</a>' +
            '</div>';
        partnersWrap.appendChild(card);
    });
}

function bookWith(idx){
    var p = PARTNERS[idx];
    if(!p) return;
    openWhatsApp(p.wa, WA_MESSAGE);
}

renderPartners();

document.addEventListener('click', function(e){
    var a = e.target.closest('.partner-book');
    if(a){
        e.preventDefault();
        var idx = Number(a.dataset.idx);
        bookWith(idx);
    }
});

// FAQ functionality
document.addEventListener('click', function(e){
    if(e.target.matches('.faq-question') || e.target.closest('.faq-question')){
        e.preventDefault();
        var button = e.target.matches('.faq-question') ? e.target : e.target.closest('.faq-question');
        var answer = button.nextElementSibling;
        var icon = button.querySelector('i');
        
        answer.classList.toggle('show');
        icon.style.transform = answer.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
    }
});

// Doctor name from URL parameter
(function(){
    var params = new URLSearchParams(location.search);
    var dr = params.get('dr');
    if(dr){
        var n = document.getElementById('doctor-name');
        if(n) n.textContent = 'Dr. ' + dr;
    }
})();
