// Active nav highlighting + accessible current page
(function(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu a').forEach(a=>{
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.setAttribute('aria-current','page');
      }
    });
  })();
  
  // Fish tabs behavior (only on fun/fish page if present)
  (function(){
    const tabBtns = document.querySelectorAll('[role="tab"]');
    if (!tabBtns.length) return;
  
    const panels = document.querySelectorAll('[role="tabpanel"]');
    function activate(id){
      tabBtns.forEach(b=>{
        const selected = b.id === id;
        b.setAttribute('aria-selected', selected ? 'true' : 'false');
        b.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(p=>{
        p.dataset.active = (p.getAttribute('aria-labelledby') === id).toString();
      });
    }
  
    tabBtns.forEach(btn=>{
      btn.addEventListener('click', ()=>activate(btn.id));
      btn.addEventListener('keydown', e=>{
        const idx = [...tabBtns].indexOf(btn);
        if (e.key === 'ArrowRight') tabBtns[(idx+1)%tabBtns.length].focus();
        if (e.key === 'ArrowLeft')  tabBtns[(idx-1+tabBtns.length)%tabBtns.length].focus();
      });
    });
  
    // init
    activate(tabBtns[0].id);
  })();
  
  // Basic reservation form handling (client-side demo)
  (function(){
    const form = document.querySelector('#reservation-form');
    const toast = (msg)=>{
      const t = document.createElement('div');
      t.textContent = msg;
      Object.assign(t.style,{
        position:'fixed', left:'50%', bottom:'90px', transform:'translateX(-50%)',
        background:'#0fb5b3', color:'#fff', padding:'10px 14px', borderRadius:'10px',
        boxShadow:'0 10px 20px rgba(0,0,0,.15)', zIndex:'3000', fontWeight:'800'
      });
      document.body.appendChild(t);
      setTimeout(()=>t.remove(), 2200);
    };
  
    if(!form) return;
  
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if (!form.checkValidity()){
        form.reportValidity();
        return;
      }
      const data = Object.fromEntries(new FormData(form).entries());
      // persist demo data
      const store = JSON.parse(localStorage.getItem('taniti_reservations')||'[]');
      store.push({...data, createdAt:new Date().toISOString()});
      localStorage.setItem('taniti_reservations', JSON.stringify(store));
      toast('Reservation request sent 🏝️');
      form.reset();
    });
  })();
// Mobile nav toggle
(function(){
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('primary-menu');
    if(!toggle || !menu) return;
  
    const body = document.body;
    const links = menu.querySelectorAll('a');
  
    function openMenu(){
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Close menu');
      menu.classList.add('open');
      body.classList.add('body-lock');
    }
    function closeMenu(){
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open menu');
      menu.classList.remove('open');
      body.classList.remove('body-lock');
    }
    function isOpen(){ return menu.classList.contains('open'); }
  
    toggle.addEventListener('click', ()=>{
      isOpen() ? closeMenu() : openMenu();
    });
  
    // Close when a link is clicked
    links.forEach(a=>a.addEventListener('click', closeMenu));
  
    // Close on Escape
    window.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && isOpen()) closeMenu();
    });
  
    // Click outside to close (mobile)
    document.addEventListener('click', (e)=>{
      if(!isOpen()) return;
      const within = e.target.closest('#primary-menu') || e.target.closest('.nav-toggle');
      if(!within) closeMenu();
    });
  })();  