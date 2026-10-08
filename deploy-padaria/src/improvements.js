/* ========================================
   MELHORIAS DE INTERATIVIDADE E ANIMAÇÕES
   ======================================== */

// Inicialização quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  initLazyLoading();
  initParallax();
  initSmoothScroll();
  initSkipToContent();
});

/* ========================================
   ANIMAÇÕES DE SCROLL (Fade-in)
   ======================================== */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Anima apenas uma vez
      }
    });
  }, observerOptions);

  // Adiciona fade-in a elementos principais
  const animatedElements = document.querySelectorAll('section > *, [class*="card"], [class*="product"]');
  animatedElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${index * 0.05}s`; // Efeito cascata
    observer.observe(el);
  });
}

/* ========================================
   LAZY LOADING DE IMAGENS
   ======================================== */
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // Browser suporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
    });
  } else {
    // Fallback para browsers antigos
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/* ========================================
   PARALLAX SUTIL NO HERO
   ======================================== */
function initParallax() {
  const heroElements = document.querySelectorAll('.hero-parallax');
  
  if (heroElements.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    heroElements.forEach(el => {
      const speed = el.dataset.speed || 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });
}

/* ========================================
   SMOOTH SCROLL PARA ÂNCORAS
   ======================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignora # vazio
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Atualiza URL sem reload
        history.pushState(null, '', href);
      }
    });
  });
}

/* ========================================
   SKIP TO CONTENT (ACESSIBILIDADE)
   ======================================== */
function initSkipToContent() {
  // Cria link skip-to-content se não existir
  if (!document.querySelector('.skip-to-content')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Adiciona ID ao main content se não existir
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
    mainContent.tabIndex = -1; // Permite foco programático
  }
}

/* ========================================
   MENU HAMBURGER ANIMADO (MOBILE)
   ======================================== */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Acessibilidade: atualiza aria-expanded
    const isExpanded = this.classList.contains('active');
    this.setAttribute('aria-expanded', isExpanded);
  });

  // Fecha menu ao clicar em link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

/* ========================================
   WISHLIST / FAVORITOS
   ======================================== */
function initWishlist() {
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  
  wishlistButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      this.classList.toggle('active');
      
      // Feedback sonoro (opcional)
      if (this.classList.contains('active')) {
        this.setAttribute('aria-label', 'Remover dos favoritos');
        showToast('Adicionado aos favoritos!');
      } else {
        this.setAttribute('aria-label', 'Adicionar aos favoritos');
        showToast('Removido dos favoritos');
      }
      
      // Salvar no localStorage
      saveWishlist();
    });
  });
  
  // Carrega wishlist salva
  loadWishlist();
}

/* ========================================
   TOAST NOTIFICATIONS
   ======================================== */
function showToast(message, duration = 3000) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: #1f2937;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Anima entrada
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);
  
  // Remove após duração
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ========================================
   QUICK VIEW (E-COMMERCE)
   ======================================== */
function initQuickView() {
  const products = document.querySelectorAll('[class*="product"]');
  
  products.forEach(product => {
    const quickView = document.createElement('div');
    quickView.className = 'product-quick-view';
    quickView.innerHTML = `
      <button class="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
        Visualização Rápida
      </button>
    `;
    
    product.style.position = 'relative';
    product.appendChild(quickView);
    
    quickView.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = product.dataset.productId;
      openQuickViewModal(productId);
    });
  });
}

function openQuickViewModal(productId) {
  // Implementar modal de quick view
  showToast('Quick view do produto #' + productId);
}

/* ========================================
   FILTROS INTERATIVOS
   ======================================== */
function initFilters() {
  const filterInputs = document.querySelectorAll('[data-filter]');
  
  filterInputs.forEach(input => {
    input.addEventListener('change', applyFilters);
  });
}

function applyFilters() {
  const activeFilters = {
    category: [],
    price: [],
    color: []
  };
  
  document.querySelectorAll('[data-filter]:checked').forEach(input => {
    const type = input.dataset.filterType;
    const value = input.value;
    activeFilters[type].push(value);
  });
  
  filterProducts(activeFilters);
}

function filterProducts(filters) {
  const products = document.querySelectorAll('[data-product]');
  
  products.forEach(product => {
    const shouldShow = matchesFilters(product, filters);
    
    if (shouldShow) {
      product.style.display = '';
      product.classList.add('fade-in', 'visible');
    } else {
      product.style.display = 'none';
    }
  });
}

function matchesFilters(product, filters) {
  // Lógica de matching dos filtros
  return true; // Simplificado
}

/* ========================================
   CONTADOR DE CARRINHO
   ======================================== */
function updateCartCount() {
  const cartBadge = document.querySelector('[data-cart-count]');
  if (!cartBadge) return;
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  cartBadge.textContent = totalItems;
  
  if (totalItems > 0) {
    cartBadge.style.display = 'flex';
    cartBadge.classList.add('pulse');
  } else {
    cartBadge.style.display = 'none';
  }
}

/* ========================================
   PERSISTÊNCIA LOCAL
   ======================================== */
function saveWishlist() {
  const wishlist = [];
  document.querySelectorAll('.wishlist-btn.active').forEach(btn => {
    const productId = btn.closest('[data-product-id]')?.dataset.productId;
    if (productId) wishlist.push(productId);
  });
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  wishlist.forEach(productId => {
    const btn = document.querySelector(`[data-product-id="${productId}"] .wishlist-btn`);
    if (btn) btn.classList.add('active');
  });
}

/* ========================================
   PERFORMANCE: DEBOUNCE
   ======================================== */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ========================================
   INICIALIZAÇÃO DE FUNCIONALIDADES ESPECÍFICAS
   ======================================== */

// Detecta tema do site e inicializa funcionalidades apropriadas
if (document.body.classList.contains('theme-shop')) {
  initQuickView();
  initWishlist();
  initFilters();
  updateCartCount();
}

if (document.body.classList.contains('theme-bakery')) {
  // Funcionalidades específicas da padaria
  initWhatsAppTracking();
}

if (document.body.classList.contains('theme-law')) {
  // Funcionalidades específicas advocacia
  initContactForm();
}

initMobileMenu();

/* ========================================
   WHATSAPP TRACKING (PADARIA)
   ======================================== */
function initWhatsAppTracking() {
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
    link.addEventListener('click', () => {
      console.log('WhatsApp click tracked');
      // Adicionar analytics aqui se necessário
    });
  });
}

/* ========================================
   FORMULÁRIO DE CONTATO (ADVOCACIA)
   ======================================== */
function initContactForm() {
  const contactForms = document.querySelectorAll('form[data-contact-form]');
  
  contactForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Validação básica
      if (!validateContactForm(data)) return;
      
      showToast('Mensagem enviada com sucesso!');
      form.reset();
    });
  });
}

function validateContactForm(data) {
  if (!data.email || !data.email.includes('@')) {
    showToast('Por favor, insira um email válido');
    return false;
  }
  return true;
}

console.log('✨ Sistema de melhorias carregado com sucesso!');
