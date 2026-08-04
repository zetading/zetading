// ===================== Mobile menu toggle =====================
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
if(menuBtn){
  menuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

// ===================== Carousel dot navigation =====================
const carousel = document.getElementById('carousel');
const dotsNav = document.getElementById('dotsNav');
if(carousel && dotsNav){
  const cards = Array.from(carousel.querySelectorAll('.card'));
  const dots = Array.from(dotsNav.querySelectorAll('.dot'));

  function setActiveDot(index){
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function currentIndex(){
    const scrollLeft = carousel.scrollLeft;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - carousel.offsetLeft - scrollLeft);
      if(dist < closestDist){ closestDist = dist; closest = i; }
    });
    return closest;
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.dataset.index, 10);
      const card = cards[i];
      if(card){
        const target = card.offsetLeft - carousel.offsetLeft;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const clamped = Math.max(0, Math.min(target, maxScroll));
        if('scrollBehavior' in document.documentElement.style){
          carousel.scrollTo({ left: clamped, behavior: 'smooth' });
        } else {
          carousel.scrollLeft = clamped;
        }
        setActiveDot(i);
      }
    });
  });

  let ticking = false;
  carousel.addEventListener('scroll', () => {
    if(!ticking){
      window.requestAnimationFrame(() => {
        setActiveDot(currentIndex());
        ticking = false;
      });
      ticking = true;
    }
  });

  setActiveDot(0);

  // ---- 滑鼠拖曳捲動(含慣性減速,拖曳更順暢) ----
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let rafId = null;

  function stopInertia(){
    if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
  }

  function inertiaStep(){
    velocity *= 0.94; // 摩擦力,數值越接近1滑得越久
    if(Math.abs(velocity) < 0.5){
      rafId = null;
      return;
    }
    carousel.scrollLeft -= velocity;
    rafId = requestAnimationFrame(inertiaStep);
  }

  cards.forEach((card) => {
    card.setAttribute('draggable', 'false');
    card.querySelectorAll('img').forEach((img) => img.setAttribute('draggable', 'false'));
  });

  carousel.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDown = true;
    moved = false;
    stopInertia();
    carousel.classList.add('dragging');
    startX = e.pageX;
    startScroll = carousel.scrollLeft;
    lastX = e.pageX;
    lastT = performance.now();
    velocity = 0;
  });

  window.addEventListener('mouseup', () => {
    if(isDown && Math.abs(velocity) > 0.5){
      rafId = requestAnimationFrame(inertiaStep);
    }
    isDown = false;
    carousel.classList.remove('dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    if(Math.abs(dx) > 5) moved = true;
    carousel.scrollLeft = startScroll - dx;

    const now = performance.now();
    const dt = now - lastT;
    if(dt > 0){
      velocity = (e.pageX - lastX) / dt * 16; // 換算成每個 frame 的速度
    }
    lastX = e.pageX;
    lastT = now;
  });

  // 拖曳放開後,如果確實拖動過,就攔截該次點擊,避免不小心點到卡片連結
  carousel.addEventListener('click', (e) => {
    if(moved){
      e.preventDefault();
      moved = false;
    }
  }, true);
}

// ===================== Service Type 下拉建議清單(可打字,也可點選) =====================
const SERVICE_OPTIONS = [
  'Banner Design',
  'Illustration',
  'Video',
  'Animation',
  'Landing Page',
  'UI Design'
];
const serviceInput = document.getElementById('service');
const serviceList = document.getElementById('serviceList');
if(serviceInput && serviceList){
  function renderServiceOptions(filter){
    const q = filter.trim().toLowerCase();
    const matches = SERVICE_OPTIONS.filter((o) => o.toLowerCase().includes(q));
    serviceList.innerHTML = '';
    if(matches.length === 0){
      serviceList.classList.remove('open');
      return;
    }
    matches.forEach((opt) => {
      const li = document.createElement('li');
      li.textContent = opt;
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        serviceInput.value = opt;
        serviceList.classList.remove('open');
      });
      serviceList.appendChild(li);
    });
    serviceList.classList.add('open');
  }
  serviceInput.addEventListener('focus', () => renderServiceOptions(serviceInput.value));
  serviceInput.addEventListener('input', () => renderServiceOptions(serviceInput.value));
  serviceInput.addEventListener('blur', () => {
    setTimeout(() => serviceList.classList.remove('open'), 100);
  });
}

// ===================== Simple contact form validation feedback =====================
const form = document.querySelector('.contact-form');
if(form){
  const inputs = form.querySelectorAll('.field input');

  function validateField(input){
    const value = input.value.trim();
    let valid = value.length > 0;
    if(valid && input.type === 'email'){
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if(valid && input.type === 'tel'){
      valid = /^[0-9+\-\s()]{6,}$/.test(value);
    }
    const field = input.closest('.field');
    if(valid){
      input.classList.remove('error');
      field.classList.remove('has-error');
    } else {
      input.classList.add('error');
      field.classList.add('has-error');
    }
    return valid;
  }

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      if(input.classList.contains('error')) validateField(input);
    });
    input.addEventListener('blur', () => {
      if(input.value.trim()) validateField(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstInvalid = null;
    inputs.forEach((input) => {
      const ok = validateField(input);
      if(!ok && !firstInvalid) firstInvalid = input;
    });
    if(firstInvalid){
      firstInvalid.focus();
      return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '傳送中...';
    submitBtn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then((response) => {
      if(response.ok){
        form.reset();
        alert('感謝您的訊息!我會盡快回覆您 🙂');
      } else {
        alert('傳送失敗,請稍後再試一次,或直接寄信給我。');
      }
    })
    .catch(() => {
      alert('傳送失敗,請確認網路連線後再試一次。');
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}
