/**
 * CLÍNICA DEMO • JARDINS
 * Script Principal de Interações & Acessibilidade
 * Em conformidade com a skill beauty-landing-pages-seo-geo
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();

  initServicesFilter();
  initProtocolQuiz();
  initFaqAccordion();
  initBookingModal();
  initScrollAnimations();
});

/* -------------------------------------------------------------
   1. NAVBAR SCROLL
   ------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* -------------------------------------------------------------
   2. MENU MOBILE ACESSÍVEL (ARIA + FOCO)
   ------------------------------------------------------------- */

/* -------------------------------------------------------------
   3. FILTRO DE PROCEDIMENTOS (COM ATUALIZAÇÃO ARIA)
   ------------------------------------------------------------- */
function initServicesFilter() {
  const tabs = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.service-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');

      const filterValue = tab.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.classList.remove('is-filtering');
          void card.offsetWidth; // Forçar reflow para reiniciar animação
          card.classList.add('is-filtering');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
   4. GUIA INTERATIVO DE PROTOCOLO (CONSULTORIA TRANSPARENTE)
   ------------------------------------------------------------- */
function initProtocolQuiz() {
  const steps = document.querySelectorAll('.quiz-step');
  const dots = document.querySelectorAll('.quiz-step-dot');
  const nextBtn = document.getElementById('quizNextBtn');
  const prevBtn = document.getElementById('quizPrevBtn');
  const resultBox = document.getElementById('quizResultBox');
  const quizFormArea = document.getElementById('quizFormArea');
  
  if (!steps.length || !nextBtn || !quizFormArea) return;

  let currentStep = 1;
  const totalSteps = 3;

  const selections = {
    foco: 'Rejuvenescimento e Firmeza',
    regiao: 'Face e Pescoço',
    experiencia: 'Primeira vez com procedimentos'
  };

  // Seleção de opções acessíveis
  document.querySelectorAll('.quiz-options-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.quiz-option-card');
    cards.forEach(card => {
      card.addEventListener('click', function() {
        cards.forEach(c => {
          c.classList.remove('selected');
          c.setAttribute('aria-checked', 'false');
        });
        this.classList.add('selected');
        this.setAttribute('aria-checked', 'true');

        const parentStep = this.closest('.quiz-step');
        const stepNum = parentStep?.getAttribute('data-step');
        const val = this.getAttribute('data-value') || '';

        if (stepNum === '1') selections.foco = val;
        if (stepNum === '2') selections.regiao = val;
        if (stepNum === '3') selections.experiencia = val;
      });
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
        nextBtn.innerHTML = 'Concluir e Ver Orientação <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      } else {
        nextBtn.innerHTML = 'Próximo Passo <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      }
    }
  }

  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateQuizUI();
    } else {
      quizFormArea.style.display = 'none';
      renderQuizRecommendation(selections);
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

  window.resetQuizProtocol = () => {
    currentStep = 1;
    quizFormArea.style.display = 'block';
    resultBox.style.display = 'none';
    document.querySelectorAll('.quiz-options-grid').forEach((grid, index) => {
      const options = [...grid.querySelectorAll('.quiz-option-card')];
      options.forEach((c,i) => { c.classList.toggle('selected',i === 0); c.setAttribute('aria-checked',String(i === 0)); });
      selections[['foco','regiao','experiencia'][index]] = options[0]?.dataset.value || '';
    });
    updateQuizUI();
    steps[0].querySelector('button')?.focus();
  };
  updateQuizUI();
}

function renderQuizRecommendation(selections) {
  const resultBox = document.getElementById('quizResultBox');
  if (!resultBox) return;

  let protocolTitle = 'Plano de Cuidados Faciais & Rejuvenescimento';
  let suggestedTreatments = 'Higienização Profunda Personalizada + Estímulo de Colágeno e Firmeza';
  let explanation = `Com base no seu foco prioritário de ${selections.foco} na área de ${selections.regiao}, recomendamos agendar uma avaliação individualizada para calibrar as etapas terapêuticas e esclarecer cada procedimento.`;

  if (selections.foco.includes('Harmonização') || selections.foco.includes('Contorno')) {
    protocolTitle = 'Avaliação Visagista & Harmonizações Sutis';
    suggestedTreatments = 'Mapeamento Anatômico e Harmonizações Naturais sem Artificialismo';
    explanation = 'Indicamos uma consulta de visagismo com nossa equipe nos Jardins para planejar proporções e refinamento sem excessos.';
  } else if (selections.foco.includes('Laser') || selections.regiao.includes('Silhueta') || selections.regiao.includes('Laser')) {
    protocolTitle = 'Protocolo Laser & Cuidados Corporais';
    suggestedTreatments = 'Depilação a Laser Tecnológica e/ou Drenagem Corporal Especializada';
    explanation = 'Recomendamos a avaliação para mapeamento do fototipo ou definição das manobras corporais indicadas para o seu bem-estar.';
  }

  const encodedMsg = encodeURIComponent(
    `Olá, Clínica Demo Jardins! Preenchi o guia de protocolo no site.\n` +
    `• Foco principal: ${selections.foco}\n` +
    `• Área de interesse: ${selections.regiao}\n` +
    `• Perfil: ${selections.experiencia}\n` +
    `Gostaria de agendar uma avaliação para entender mais sobre: ${protocolTitle}.`
  );

  resultBox.innerHTML = `
    <div class="text-center" style="padding: 10px 0;">
      <span class="badge-pill" style="margin-bottom: 14px;">
        <span class="dot" aria-hidden="true"></span>
        Orientação Preliminar Gerada
      </span>
      <h3 class="quiz-result-title">${protocolTitle}</h3>
      <p class="quiz-result-desc">${explanation}</p>
      
      <div style="background: var(--white); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 18px 24px; margin: 0 auto 28px; max-width: 580px; text-align: left;">
        <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: var(--lilac-700); letter-spacing: 0.06em; display: block; margin-bottom: 4px;">Procedimentos Sugeridos:</span>
        <strong style="color: var(--text-headline); font-size: 0.96rem;">${suggestedTreatments}</strong>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">* A indicação final é confirmada exclusivamente após consulta diagnóstica presencial.</p>
      </div>

      <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
        <a href="https://wa.me/5511971979342?text=${encodedMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.477-.15-.678.15-.2.301-.779.98-.955 1.18-.175.201-.351.226-.652.075s-1.272-.469-2.424-1.496c-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.201-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.239-.244-.589-.493-.509-.678-.519l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.124 3.243 5.145 4.548.719.311 1.28.497 1.718.636.722.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.125-.276-.2-.577-.35zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.96.57 3.86 1.65 5.48L2 22l4.67-1.62c1.57.99 3.39 1.52 5.37 1.52 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2z"/></svg>
          Agendar Avaliação via WhatsApp
        </a>
        <button type="button" class="btn btn-secondary" onclick="window.resetQuizProtocol()">
          Refazer Perguntas
        </button>
      </div>
    </div>
  `;
  resultBox.style.display = 'block';
  resultBox.setAttribute('tabindex', '-1');
  resultBox.focus();
}


/* -------------------------------------------------------------
   5. ACORDEÃO DE FAQ ACESSÍVEL (ARIA EXPANDED + ROLES)
   ------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const headerBtn = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    if (!headerBtn || !content) return;

    headerBtn.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Fechar outros itens abertos
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-header');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Alternar o item atual
      if (!isCurrentlyActive) {
        item.classList.add('active');
        headerBtn.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        headerBtn.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });
}

/* -------------------------------------------------------------
   6. MODAL DE AGENDAMENTO (GESTÃO DE FOCO + TECLA ESC)
   ------------------------------------------------------------- */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const bookingForm = document.getElementById('bookingForm');
  let lastActiveElement = null;

  if (!modal) return;

  function openModal(serviceName) {
    lastActiveElement = document.activeElement;
    const select = document.getElementById('modalServiceSelect');
    if (select && serviceName) {
      // Tentar selecionar a opção correspondente
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.includes(serviceName) || select.options[i].text.includes(serviceName)) {
          select.selectedIndex = i;
          break;
        }
      }
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focar no primeiro campo
    const firstInput = modal.querySelector('input');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  window.DemoUI.bindForm(bookingForm);
}

/* -------------------------------------------------------------
   7. ANIMAÇÕES DE SCROLL RESPEITANDO PREFERS-REDUCED-MOTION
   ------------------------------------------------------------- */
function initScrollAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const elements = document.querySelectorAll(
    '.reveal-on-scroll, .service-card, .pillar-card, .step-card-item, .safety-item, .location-details-card, .location-map-visual, .faq-item'
  );
  if (!elements.length || !('IntersectionObserver' in window)) return;

  elements.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
