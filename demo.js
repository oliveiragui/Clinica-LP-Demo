/* Local-only demo interactions. No storage, network or real appointments. */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let opener;
  function preview(title, body) {
    let dialog = $('#demo-preview');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'demo-preview';
      dialog.className = 'demo-dialog';
      dialog.setAttribute('aria-labelledby', 'demo-preview-title');
      dialog.innerHTML = '<h2 id="demo-preview-title"></h2><p class="demo-message"></p><button type="button" autofocus>Voltar à página</button>';
      dialog.querySelector('button').onclick = () => dialog.close();
      dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
      document.body.append(dialog);
    }
    $('#demo-preview-title').textContent = title;
    $('.demo-message', dialog).textContent = body;
    dialog.showModal();
  }
  function contact(url) {
    const text = new URL(url, location.href).searchParams.get('text');
    preview('Prévia da conversa', 'Este é um exemplo do contato pelo WhatsApp. Nenhuma mensagem será enviada.\n\n' + (text || 'Olá! Gostaria de saber mais sobre o atendimento.'));
  }
  function bindForm(form) {
    if (!form || form.dataset.demoBound) return;
    form.dataset.demoBound = 'true';
    const clearPreview = () => form.querySelector('.demo-feedback')?.remove();
    form.addEventListener('change', clearPreview);
    form.addEventListener('input', e => {
      clearPreview();
      if (e.target.type === 'tel') e.target.setCustomValidity('');
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      $$('input[type="tel"]', form).forEach(input => {
        input.setCustomValidity(input.required && !/^\d{10,11}$/.test(input.value.replace(/\D/g, '')) ? 'Informe um telefone com DDD e 10 ou 11 dígitos.' : '');
      });
      if (!form.reportValidity()) return;
      const submit = $('button[type="submit"]', form);
      const original = submit.innerHTML;
      submit.disabled = true;
      submit.textContent = 'Preparando sua prévia…';
      let feedback = $('.demo-feedback', form);
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'demo-feedback';
        feedback.setAttribute('role', 'status');
        feedback.setAttribute('aria-live', 'polite');
        form.append(feedback);
      }
      feedback.textContent = '';
      window.setTimeout(() => {
        submit.disabled = false;
        submit.innerHTML = original;
        feedback.textContent = 'Prévia concluída. Em um site ativo, esta etapa encaminharia a solicitação à equipe. Nesta demonstração, nada foi enviado e seus dados não foram armazenados.';
        const wa = $$('a[href*="wa.me"]').find(a => !a.closest('#demo-preview'));
        if (wa) {
          const link = document.createElement('a');
          const u = new URL(wa.href);
          const lines = ['Olá! Gostaria de informações sobre atendimento.'];
          $$('input:not([type="checkbox"]):not([type="radio"]):not([type="file"]), select, textarea', form).forEach(input => {
            if (!input.value) return;
            const label = input.labels?.[0]?.textContent.trim().replace(/\s+/g, ' ') || 'Interesse';
            lines.push(label.replace(/\s*\*$/, '') + ': ' + input.value);
          });
          u.searchParams.set('text', lines.join('\n'));
          link.href = u.href;
          link.textContent = 'Ver exemplo da mensagem no WhatsApp';
          feedback.append(document.createElement('br'), link);
        }
      }, 350);
    });
  }
  window.DemoUI = { preview, contact, bindForm };
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    if (a.href.includes('wa.me/')) { e.preventDefault(); contact(a.href); }
    else if (a.matches('[data-demo-policy]')) {
      e.preventDefault();
      preview(a.textContent.trim(), 'Projeto demonstrativo com identidade, dados e imagens ilustrativos. Os formulários funcionam apenas nesta página: não enviam solicitações e não guardam dados.\n\nAntes de ativar um site real, os dados do negócio, seus canais de contato, termos de atendimento e a política de privacidade devem ser definidos pelo responsável.');
    }
  });
  // Manage focus and the inactive background for the existing custom dialogs.
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-modal], .open-treatment-modal')) opener = document.activeElement;
  }, true);
  function activeModal() { return $('.modal-overlay.open, .modal-backdrop.open'); }
  function focusable(modal) { return $$('a[href], button, input, select, textarea, [tabindex="0"]', modal).filter(e => !e.disabled && e.getClientRects().length); }
  document.addEventListener('keydown', e => {
    const modal = activeModal();
    if (!modal || e.key !== 'Tab' || document.querySelector('dialog[open]')) return;
    const items = focusable(modal), first = items[0], last = items.at(-1);
    if (!items.length) return;
    if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('DOMContentLoaded', () => {
    $$('form').forEach(bindForm);
    $$('button[aria-expanded][aria-controls]').forEach(button => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel || !panel.matches('.faq-content,.faq-panel,.faq-answer-pane,.faq-answer')) return;
      const sync = () => {
        const open = button.getAttribute('aria-expanded') === 'true';
        panel.hidden = !open;
        if (panel.classList.contains('faq-content')) panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '';
      };
      sync();new MutationObserver(sync).observe(button,{attributes:true,attributeFilter:['aria-expanded']});
    });
    $$('.goal-tab-btn,.service-toggle-btn,#segment-selector .seg-btn').forEach(button => {
      if (button.getAttribute('role') !== 'tab') button.setAttribute('aria-pressed',String(button.classList.contains('active')));
    });

    $$('input[type="tel"]').forEach(e => e.setAttribute('inputmode', 'tel'));
    $$('a[target="_blank"]').forEach(a => a.rel = 'noopener noreferrer');
    $$('.modal-overlay, .modal-backdrop').forEach(modal => {
      let blocked = [];
      new MutationObserver(() => {
        if (modal.classList.contains('open')) {
          if (!blocked.length) blocked = [...document.body.children].filter(e => e !== modal && !['SCRIPT','DIALOG'].includes(e.tagName) && !e.inert);
          blocked.forEach(e => e.inert = true);
          if (!modal.contains(document.activeElement)) focusable(modal)[0]?.focus();
        } else {
          blocked.forEach(e => e.inert = false);
          blocked = [];
          opener?.focus();
        }
      }).observe(modal, {attributes: true, attributeFilter: ['class']});
    });
    // Tabs use one keyboard stop per group; radio-like actions announce selection.
    $$('[role="tablist"]').forEach(group => {
      const tabs = $$('[role="tab"]', group);
      tabs.forEach((tab,i) => {
        tab.id ||= 'demo-tab-'+group.className.split(' ')[0]+'-'+i;
        let panel = tab.dataset.target ? document.getElementById(tab.dataset.target) : group.classList.contains('goal-tabs-container') ? $('.goal-content-card') : null;
        if (panel) {
          panel.id ||= 'goal-panel';
          panel.setAttribute('role','tabpanel');tab.setAttribute('aria-controls',panel.id);
          const label = () => {if(tab.getAttribute('aria-selected')==='true')panel.setAttribute('aria-labelledby',tab.id);};
          label();tab.addEventListener('click',()=>queueMicrotask(label));
        }
      });
      const sync = () => tabs.forEach(t => t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1);
      sync();
      tabs.forEach((tab,i) => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
          sync();
        });
        tab.addEventListener('keydown', e => {
          const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length-1 : e.key === 'ArrowRight' ? (i+1)%tabs.length : e.key === 'ArrowLeft' ? (i-1+tabs.length)%tabs.length : -1;
          if (next < 0) return;
          e.preventDefault(); tabs[next].click(); tabs[next].focus();
        });
      });
    });
    $$('button[role="radio"]').forEach(button => {
      const group = button.closest('[role="radiogroup"]') || button.parentElement;
      const radios = $$('button[role="radio"]', group);
      if (!group.hasAttribute('role')) group.setAttribute('role','radiogroup');
      if (!group.hasAttribute('aria-label') && !group.hasAttribute('aria-labelledby')) group.setAttribute('aria-label','Selecione uma opção');
      const sync = () => radios.forEach(b => b.tabIndex=b.getAttribute('aria-checked')==='true'?0:-1);
      sync();
      button.addEventListener('click', () => {radios.forEach(b => b.setAttribute('aria-checked',String(b===button)));sync();});
      button.addEventListener('keydown', e => {const i=radios.indexOf(button),next=['ArrowRight','ArrowDown'].includes(e.key)?(i+1)%radios.length:['ArrowLeft','ArrowUp'].includes(e.key)?(i-1+radios.length)%radios.length:-1;if(next>=0){e.preventDefault();radios[next].click();radios[next].focus();}});
    });

  });
})();
