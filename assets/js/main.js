/**
 * CLÍNICA DEMO • JARDINS
 * Main JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initServicesFilter();
  initProtocolQuiz();
  initFaqAccordion();
  initBookingModal();
  initScrollAnimations();
});

/* -------------------------------------------------------------
   1. NAVBAR STICKY GLASSMORPHISM EFFECT
   ------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* -------------------------------------------------------------
   2. MOBILE MENU TOGGLE
   ------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('active');
  });

  // Close drawer when clicking any link
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  });
}

/* -------------------------------------------------------------
   3. SERVICES FILTER TABS
   ------------------------------------------------------------- */
function initServicesFilter() {
  const tabs = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
   4. INTERACTIVE PROTOCOL QUIZ
   ------------------------------------------------------------- */
function initProtocolQuiz() {
  const steps = document.querySelectorAll('.quiz-step');
  const dots = document.querySelectorAll('.quiz-step-dot');
  const nextBtn = document.getElementById('quizNextBtn');
  const prevBtn = document.getElementById('quizPrevBtn');
  const resultBox = document.getElementById('quizResultBox');
  const quizFormArea = document.getElementById('quizFormArea');
  
  if (!steps.length || !nextBtn) return;

  let currentStep = 1;
  const totalSteps = 3;

  const userSelections = {
    foco: 'Rejuvenescimento e Firmeza',
    regiao: 'Face e Pescoço',
    experiencia: 'Primeira vez com procedimentos'
  };

  // Option selection
  document.querySelectorAll('.quiz-option-card').forEach(option => {
    option.addEventListener('click', function() {
      const parentStep = this.closest('.quiz-step');
      const stepNum = parentStep.getAttribute('data-step');
      
      parentStep.querySelectorAll('.quiz-option-card').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');

      const val = this.getAttribute('data-value');
      if (stepNum === '1') userSelections.foco = val;
      if (stepNum === '2') userSelections.regiao = val;
      if (stepNum === '3') userSelections.experiencia = val;
    });
  });

  function updateQuizUI() {
    steps.forEach(step => {
      step.classList.remove('active');
      if (step.getAttribute('data-step') === String(currentStep)) {
        step.classList.add('active');
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.remove('active', 'completed');
      if (idx + 1 === currentStep) {
        dot.classList.add('active');
      } else if (idx + 1 < currentStep) {
        dot.classList.add('completed');
      }
    });

    if (prevBtn) {
      prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      if (currentStep === totalSteps) {
        nextBtn.innerHTML = 'Ver Meu Protocolo Personalizado <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      } else {
        nextBtn.innerHTML = 'Próximo Passo <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      }
    }
  }

  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateQuizUI();
    } else {
      // Calculate and display personalized recommendation
      quizFormArea.style.display = 'none';
      renderQuizRecommendation(userSelections);
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateQuizUI();
      }
    });
  }

  updateQuizUI();
}

function renderQuizRecommendation(selections) {
  const resultBox = document.getElementById('quizResultBox');
  if (!resultBox) return;

  let protocolName = 'Protocolo Glow & Firmeza Jardins';
  let treatments = 'Limpeza de Pele Profunda + Rejuvenescimento Facial com Estímulo de Colágeno';
  let explanation = 'Com base no seu objetivo de ' + selections.foco + ' para ' + selections.regiao + ', desenhamos um protocolo individualizado com tecnologia não-invasiva e cuidados botânicos exclusivos.';

  if (selections.foco.includes('Harmonização') || selections.foco.includes('Contorno')) {
    protocolName = 'Protocolo Harmonização Sublime Jardins';
    treatments = 'Avaliação Visagista + Harmonização Sutil & Procedimentos Especializados';
  } else if (selections.foco.includes('Laser') || selections.regiao.includes('Corpo')) {
    protocolName = 'Protocolo Silhueta & Pele de Seda';
    treatments = 'Depilação a Laser Tecnológica + Tratamentos Corporais de Alta Performance';
  }

  const encodedMsg = encodeURIComponent(
    `Olá, Clínica Demo Jardins! Realizei o teste de protocolo no site.\n` +
    `Meu objetivo: ${selections.foco}\n` +
    `Região: ${selections.regiao}\n` +
    `Perfil: ${selections.experiencia}\n` +
    `Gostaria de agendar uma avaliação para o ${protocolName}.`
  );

  resultBox.innerHTML = `
    <div style="text-align: center;">
      <span class="badge-pill" style="margin-bottom: 16px;"><span class="dot"></span> Protocolo Exclusivo Gerado</span>
      <h3 class="quiz-result-title">${protocolName}</h3>
      <p class="quiz-result-desc">${explanation}</p>
      
      <div style="background: rgba(255, 255, 255, 0.9); border: 1px dashed var(--lilac-300); border-radius: var(--radius-sm); padding: 18px; margin-bottom: 28px; max-width: 580px; margin-left: auto; margin-right: auto;">
        <strong style="color: var(--lilac-700); font-size: 0.92rem; display: block; margin-bottom: 4px;">Indicação Primária:</strong>
        <span style="color: var(--text-headline); font-weight: 600;">${treatments}</span>
      </div>

      <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <a href="https://wa.me/5511948594859?text=${encodedMsg}" target="_blank" class="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.477-.15-.678.15-.2.301-.779.98-.955 1.18-.175.201-.351.226-.652.075s-1.272-.469-2.424-1.496c-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.239-.244-.589-.493-.509-.678-.519l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.124 3.243 5.145 4.548.719.311 1.28.497 1.718.636.722.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.125-.276-.2-.577-.35zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.96.57 3.86 1.65 5.48L2 22l4.67-1.62c1.57.99 3.39 1.52 5.37 1.52 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2z"/></svg>
          Agendar Protocolo via WhatsApp
        </a>
        <button type="button" class="btn btn-secondary" onclick="window.resetQuiz()">
          Refazer Teste
        </button>
      </div>
    </div>
  `;
  resultBox.style.display = 'block';
}

window.resetQuiz = function() {
  const quizFormArea = document.getElementById('quizFormArea');
  const resultBox = document.getElementById('quizResultBox');
  if (quizFormArea) quizFormArea.style.display = 'block';
  if (resultBox) resultBox.style.display = 'none';
  initProtocolQuiz();
};

/* -------------------------------------------------------------
   5. FAQ ACCORDION
   ------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherContent = other.querySelector('.faq-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });
}

/* -------------------------------------------------------------
   6. BOOKING CONCIERGE MODAL
   ------------------------------------------------------------- */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const bookingForm = document.getElementById('bookingForm');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'Avaliação Personalizada';
      const select = document.getElementById('modalServiceSelect');
      if (select && serviceName) {
        select.value = serviceName;
      }
      modal.classList.add('open');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  // Handle Form Submission -> WhatsApp Link
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const service = document.getElementById('modalServiceSelect').value;
      const notes = document.getElementById('clientNotes').value.trim();

      const message = 
        `Olá, Clínica Demo Jardins! Gostaria de agendar uma avaliação:\n` +
        `• Nome: ${name}\n` +
        `• Telefone: ${phone}\n` +
        `• Procedimento de Interesse: ${service}` +
        (notes ? `\n• Mensagem: ${notes}` : '');

      const whatsappUrl = `https://wa.me/5511948594859?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      modal.classList.remove('open');
      bookingForm.reset();
    });
  }
}

/* -------------------------------------------------------------
   7. SCROLL OBSERVER (FADE-IN ANIMATIONS)
   ------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.service-card, .pillar-card, .testimonial-card, .step-card-item');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });
  }
}
