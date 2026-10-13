/* Shared responsive navigation; each standalone landing has its own copy. */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById(header.dataset.menuToggle);
  const drawer = document.getElementById(header.dataset.menuPanel);
  const desktop = matchMedia('(min-width: 1024px)');
  if (!toggle || !drawer) return;
  let frame;
  function measure() {
    const rect = header.getBoundingClientRect();
    document.documentElement.style.setProperty('--header-bottom', Math.max(0, rect.bottom) + 'px');
    document.documentElement.style.setProperty('--header-height', rect.height + 'px');
  }
  function close(open = false) {
    const expanded = open && !desktop.matches;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    const shared = drawer.classList.contains('nav-links');
    drawer.hidden = desktop.matches ? !shared : !expanded;
    drawer.setAttribute('aria-hidden', String(drawer.hidden));
    drawer.classList.toggle('is-open', expanded);
    drawer.classList.toggle('open', expanded);
    drawer.classList.toggle('active', expanded);
    toggle.classList.toggle('active', expanded);
    if (expanded) drawer.scrollTop = 0;
    document.body.style.overflow = '';
    measure();
  }
  toggle.addEventListener('click', () => close(toggle.getAttribute('aria-expanded') !== 'true'));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close()));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); }
  });
  document.addEventListener('click', e => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !drawer.contains(e.target) && !toggle.contains(e.target)) close();
  });
  desktop.addEventListener('change', () => close());
  new ResizeObserver(measure).observe(header);
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', () => { if (frame) return; frame = requestAnimationFrame(() => { measure(); frame = null; }); }, {passive:true});
  close();
  document.fonts.ready.then(measure);
});
