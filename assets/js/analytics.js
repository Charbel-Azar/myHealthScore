// Hidden Analytics Loader
// This file contains tracking codes that are loaded dynamically to prevent easy inspection

(function() {
    'use strict';
    
    // Google Analytics Configuration
    const GA_TRACKING_ID = 'G-H2LEQ4605J';
    
    // Meta Pixel Configuration  
    const FB_PIXEL_ID = '1262147982127732';
    
    // Load Google Analytics
    function loadGoogleAnalytics() {
        // Create and load gtag script
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_TRACKING_ID;
        document.head.appendChild(gtagScript);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_TRACKING_ID);
    }
    
    // Load Meta Pixel
    function loadMetaPixel() {
        // Create and load Facebook Pixel script
        const fbScript = document.createElement('script');
        fbScript.innerHTML = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
        `;
        document.head.appendChild(fbScript);
        
        // Add noscript fallback
        const noscript = document.createElement('noscript');
        const img = document.createElement('img');
        img.height = 1;
        img.width = 1;
        img.style.display = 'none';
        img.src = 'https://www.facebook.com/tr?id=' + FB_PIXEL_ID + '&ev=PageView&noscript=1';
        noscript.appendChild(img);
        document.head.appendChild(noscript);
    }
    
    // Initialize analytics when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            loadGoogleAnalytics();
            loadMetaPixel();
        });
    } else {
        loadGoogleAnalytics();
        loadMetaPixel();
    }
    
})();
