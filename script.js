// ─── RETICLE ───
    const reticle = document.getElementById('reticle');
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop(){
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      reticle.style.left = rx + 'px';
      reticle.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();

    // ─── BARCODE GENERATOR ───
    const barcode = document.getElementById('barcode');
    if(barcode){
      const heights = [40,60,30,80,50,70,40,90,35,65,55,80,45,70,30,60,85,40,75,50,65,30,80,55];
      heights.forEach(h => {
        const d = document.createElement('div');
        d.style.height = h + 'px';
        barcode.appendChild(d);
      });
    }

    // ─── NAV SCROLL ───
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ─── PARALLAX ───
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    function applyParallax(){
      const sy = window.scrollY;
      parallaxEls.forEach(el => {
        const factor = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.parentElement.getBoundingClientRect();
        const offset = (rect.top + sy) * factor;
        el.style.transform = `translateY(${offset * 0.25}px) scale(1.2)`;
      });
    }
    window.addEventListener('scroll', applyParallax, { passive: true });
    applyParallax();

    // ─── TIMELINE INTERSECTION OBSERVER ───
    const timelineEntries = document.querySelectorAll('.timeline-entry');
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if(entry.isIntersecting){
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
        }
      });
    }, { threshold: 0.15 });
    timelineEntries.forEach(el => observer.observe(el));

    // ─── SMOOTH ANCHOR SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // ─── COUNTER ANIMATION ───
    function animateCount(el, target, suffix=''){
      let start = 0;
      const duration = 1800;
      const step = timestamp => {
        if(!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if(progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          document.querySelector('.stat-item:nth-child(1) .stat-number').innerHTML = '<span id="s1">0</span><span class="stat-unit">+</span>';
          document.querySelector('.stat-item:nth-child(2) .stat-number').innerHTML = '<span id="s2">0</span>';
          document.querySelector('.stat-item:nth-child(3) .stat-number').innerHTML = '<span id="s3">0</span><span class="stat-unit">M+</span>';
          document.querySelector('.stat-item:nth-child(4) .stat-number').innerHTML = '<span id="s4">0</span><span class="stat-unit">+</span>';
          animateCount(document.getElementById('s1'), 25);
          animateCount(document.getElementById('s2'), 9);
          animateCount(document.getElementById('s3'), 50);
          animateCount(document.getElementById('s4'), 300);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    const statsEl = document.getElementById('stats');
    if(statsEl) statsObserver.observe(statsEl);

    // ─── SCROLL TO TOP ───
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });