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
}

// ===================== Simple contact form validation feedback =====================
const form = document.querySelector('.contact-form');
if(form){
  const inputs = form.querySelectorAll('input');

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
