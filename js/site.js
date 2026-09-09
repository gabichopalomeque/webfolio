// ============================================================================
// GABRIEL PALOMEQUE — PORTAFOLIO
// site.js — carga el contenido desde Supabase y arma cada sección.
// No se edita esto para cambiar textos/fotos: eso se hace desde /admin.
// ============================================================================

var AREA_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9v6h3l8 4V5L6 9H3Z"/><path d="M16 9a3 3 0 0 1 0 6"/><path d="M19 6.5a6.5 6.5 0 0 1 0 11"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5V8.5Z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><path d="M8 13.5l-2 2 2 2M16 13.5l2 2-2 2M13 12.5l-2 6"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.4"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="12" cy="11" r="2"/><path d="M7.6 7l3 2.6M16.4 7l-3 2.6M12 13v3"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M12 12v9M12 12l8-4.5M12 12 4 7.5"/></svg>'
];

function esc(str){
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(str){
  return esc(str).replace(/"/g, '&quot;');
}
function pad2(n){ return n < 10 ? '0' + n : String(n); }
function setText(id, value){
  var el = document.getElementById(id);
  if(el && value != null) el.textContent = value;
}
function buildWhatsAppLink(settings, message){
  var number = String((settings && settings.whatsapp_number) || '').replace(/\D/g, '');
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
}

document.addEventListener('DOMContentLoaded', init);

async function init(){
  if(typeof SUPABASE_URL === 'undefined' || !window.supabase){
    console.error('Falta config.js o la librería de Supabase.');
    return;
  }
  var db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try{
    var results = await Promise.all([
      db.from('site_settings').select('*').eq('id', 1).single(),
      db.from('sections').select('*'),
      db.from('formacion_timeline').select('*').order('sort_order'),
      db.from('formacion_areas').select('*').order('sort_order'),
      db.from('formacion_tools').select('*').order('sort_order'),
      db.from('experiencia_items').select('*').order('sort_order'),
      db.from('experiencia_references').select('*').order('sort_order'),
      db.from('showreels_items').select('*').order('sort_order'),
      db.from('work_categories').select('*').order('sort_order'),
      db.from('work_items').select('*').order('sort_order')
    ]);

    results.forEach(function(r, i){
      if(r.error) console.error('Error consultando tabla #' + i, r.error);
    });

    var settings = results[0].data;
    var sectionsRaw = results[1].data || [];
    var sections = {};
    sectionsRaw.forEach(function(s){ sections[s.slug] = s; });

    renderHero(sections.hero);
    renderFormacion(sections.formacion, results[2].data, results[3].data, results[4].data);
    renderExperiencia(sections.experiencia, results[5].data, results[6].data);
    renderShowreels(sections.showreels, results[7].data, settings);
    renderMiTrabajo(sections.mi_trabajo, results[8].data, results[9].data);
    renderContacto(sections.contacto, settings);

  }catch(err){
    console.error('No se pudo cargar el contenido desde Supabase:', err);
  }

  // El comportamiento (carruseles, arrastre, lightboxes) se activa DESPUÉS
  // de que el contenido ya está en el DOM.
  initNavToggle();
  initHeroReducedMotion();
  initExperienciaReducedMotion();
  initShowreelsCarousel();
  initShowreelsParallax();
  initMiTrabajoOrbit();
  initEmbedCards();
}

// ============================================================================
// RENDER — HERO
// ============================================================================
function renderHero(hero){
  if(!hero) return;
  var extra = hero.extra || {};
  setText('hero-eyebrow', hero.eyebrow);
  setText('hero-title', hero.title);
  setText('hero-wordmark', extra.wordmark);
  setText('hero-tagline', hero.lead_text);
  setText('hero-cta-label', extra.cta_label);
  setText('hero-stat-number', extra.stat_number);

  var statTextEl = document.getElementById('hero-stat-text');
  if(statTextEl && extra.stat_text){
    var words = String(extra.stat_text).trim().split(' ');
    var last = words.pop();
    statTextEl.innerHTML = esc(words.join(' ')) + '<br>' + esc(last);
  }

  var photo = document.getElementById('hero-photo');
  if(photo && extra.photo_url) photo.src = extra.photo_url;

  var video = document.getElementById('heroVideo');
  if(video && extra.video_url){
    var source = video.querySelector('source');
    if(source && source.src.indexOf(extra.video_url) === -1){
      source.src = extra.video_url;
      video.load();
    }
  }

  var specialties = extra.specialties || [];
  ['hero-marquee-1', 'hero-marquee-2'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = specialties.map(function(s){
      return '<span class="marquee-item"><span class="dot" aria-hidden="true"></span>' + esc(s) + '</span>';
    }).join('');
  });
}

// ============================================================================
// RENDER — FORMACIÓN
// ============================================================================
function renderFormacion(section, timeline, areas, tools){
  if(section){
    setText('formacion-eyebrow', section.eyebrow);
    setText('formacion-title', section.title);
    setText('formacion-lead', section.lead_text);
  }
  timeline = timeline || [];
  fillTimeline('timeline-educacion', timeline.filter(function(t){ return t.group_name === 'educacion'; }));
  fillTimeline('timeline-continua', timeline.filter(function(t){ return t.group_name === 'continua'; }));

  var areasGrid = document.getElementById('areas-grid');
  if(areasGrid){
    areasGrid.innerHTML = (areas || []).map(function(a, i){
      return '<li class="area-card">' +
        '<span class="area-icon" aria-hidden="true">' + AREA_ICONS[i % AREA_ICONS.length] + '</span>' +
        '<span class="area-label">' + esc(a.title) + '</span></li>';
    }).join('');
  }

  var toolsGrid = document.getElementById('tools-grid');
  if(toolsGrid){
    toolsGrid.innerHTML = (tools || []).map(function(t){
      return '<li class="tool-card"><span class="tool-icon" aria-hidden="true">' + esc(t.monogram) + '</span>' +
        '<span class="tool-name">' + esc(t.label) + '</span></li>';
    }).join('');
  }
}

function fillTimeline(id, items){
  var el = document.getElementById(id);
  if(!el) return;
  el.innerHTML = items.map(function(item){
    return '<li class="timeline-item">' +
      '<span class="timeline-marker" aria-hidden="true"></span>' +
      '<p class="timeline-meta"><span class="timeline-date">' + esc(item.date_label) + '</span></p>' +
      '<h4 class="timeline-role">' + esc(item.title) + '</h4>' +
      '<p class="timeline-org">' + esc(item.institution) + '</p>' +
      '</li>';
  }).join('');
}

// ============================================================================
// RENDER — EXPERIENCIA
// ============================================================================
function renderExperiencia(section, items, refs){
  if(section){
    setText('experiencia-eyebrow', section.eyebrow);
    setText('experiencia-title', section.title);
    setText('experiencia-lead', section.lead_text);
    var extra = section.extra || {};
    var video = document.getElementById('expHeadVideo');
    if(video && extra.video_url){
      var source = video.querySelector('source');
      if(source && source.src.indexOf(extra.video_url) === -1){
        source.src = extra.video_url;
        video.load();
      }
    }
  }

  var list = document.getElementById('exp-list');
  if(list){
    list.innerHTML = (items || []).map(function(item, i){
      return '<li class="exp-item reveal" style="--delay:' + (0.2 + i * 0.05).toFixed(2) + 's">' +
        '<span class="exp-index" aria-hidden="true">' + pad2(i + 1) + '</span>' +
        '<div class="exp-item-body">' +
        '<div class="exp-item-top"><h3 class="exp-role">' + esc(item.role) + '</h3>' +
        '<span class="exp-date">' + esc(item.date_range) + '</span></div>' +
        '<p class="exp-org">' + esc(item.organization) + '</p>' +
        '<p class="exp-desc">' + esc(item.description) + '</p>' +
        '</div></li>';
    }).join('');
  }

  var refsGrid = document.getElementById('refs-grid');
  if(refsGrid){
    refsGrid.innerHTML = (refs || []).map(function(r){
      var nameForInitials = String(r.name || '').replace(/^\s*(ing|lic|arq|dr|dra|mgtr|msc|sr|sra|srta)\.?\s+/i, '');
      var nameParts = nameForInitials.split(' ').filter(Boolean);
      var initials = nameParts.slice(0, 2).map(function(w){ return w[0]; }).join('').toUpperCase();
      if(!initials){ initials = String(r.name || '??').slice(0, 2).toUpperCase(); }
      var digits = String(r.phone || '').replace(/\D/g, '').replace(/^0/, '');
      return '<li class="ref-card">' +
        '<span class="ref-avatar" aria-hidden="true">' + esc(initials) + '</span>' +
        '<div class="ref-body"><p class="ref-name">' + esc(r.name) + '</p>' +
        '<p class="ref-role">' + esc(r.role) + ' · ' + esc(r.organization) + '</p>' +
        '<a class="ref-phone" href="tel:+593' + esc(digits) + '">' + esc(r.phone) + '</a></div></li>';
    }).join('');
  }
}

// ============================================================================
// RENDER — SHOWREELS
// ============================================================================
function renderShowreels(section, items, settings){
  if(section){
    setText('showreels-eyebrow', section.eyebrow);
    setText('showreels-title', section.title);
    setText('showreels-lead', section.lead_text);
  }
  items = items || [];

  var track = document.getElementById('reelTrack');
  if(track){
    track.innerHTML = items.map(function(item, i){
      var id = item.youtube_id;
      return '<li class="reel-card" data-video="' + escAttr(id) + '" role="button" tabindex="0" aria-label="Reproducir reel ' + (i + 1) + ' de ' + items.length + '">' +
        '<img class="reel-thumb-bg" src="https://img.youtube.com/vi/' + escAttr(id) + '/hqdefault.jpg" alt="" loading="lazy">' +
        '<img class="reel-thumb" src="https://img.youtube.com/vi/' + escAttr(id) + '/hqdefault.jpg" alt="" loading="lazy">' +
        '<div class="reel-scrim" aria-hidden="true"></div>' +
        '<span class="reel-index" aria-hidden="true">' + pad2(i + 1) + '</span>' +
        '<span class="reel-play" aria-hidden="true"><span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor"/></svg></span></span>' +
        '</li>';
    }).join('');
  }

  var dots = document.getElementById('reelDots');
  if(dots){
    dots.innerHTML = items.map(function(_, i){
      return '<button class="reel-dot" role="tab" aria-label="Ir al reel ' + (i + 1) + '"></button>';
    }).join('');
  }

  var waCta = document.getElementById('showreels-whatsapp-cta');
  if(waCta && settings){
    waCta.href = buildWhatsAppLink(settings, 'Hola Gabriel, vi tu showreel y me gustaría conversar sobre un proyecto de diseño y fotografía. ¿Tienes disponibilidad para conversar?');
  }
}

// ============================================================================
// RENDER — MI TRABAJO
// ============================================================================
function renderMiTrabajo(section, categories, allItems){
  if(section){
    setText('mitrabajo-eyebrow', section.eyebrow);
    setText('mitrabajo-title', section.title);
    setText('mitrabajo-lead', section.lead_text);
  }

  var container = document.getElementById('work-categories-container');
  if(!container) return;

  var itemsByCategory = {};
  (allItems || []).forEach(function(item){
    (itemsByCategory[item.category_id] = itemsByCategory[item.category_id] || []).push(item);
  });

  var html = '';
  (categories || []).forEach(function(cat){
    var items = itemsByCategory[cat.id] || [];
    html += (cat.layout === 'orbit') ? renderOrbitBlock(items) : renderWorkBlock(cat, items);
  });
  container.innerHTML = html;
}

function renderOrbitBlock(items){
  var cards = items.map(function(item, i){
    var title = item.title || '';
    return '<div class="orbit-card" data-index="' + i + '" data-title="' + escAttr(title) + '" role="button" tabindex="0" aria-label="Ver proyecto: ' + escAttr(title) + '">' +
      '<div class="orbit-card-inner"><img class="orbit-card-img" src="' + escAttr(item.image_url) + '" alt="' + escAttr(title) + '" loading="lazy"></div>' +
      '<div class="orbit-card-scrim" aria-hidden="true"></div></div>';
  }).join('');

  return '<div class="orbit reveal" style="--delay:0.25s">' +
    '<div class="orbit-stage" id="orbitStage" role="group" aria-label="Galería giratoria de trabajos, ' + items.length + ' piezas — arrastra para rotar">' +
    '<div class="orbit-sphere" id="orbitSphere">' + cards + '</div></div>' +
    '<div class="orbit-controls"><p class="orbit-hint">Arrastra la esfera para explorar</p></div></div>';
}

function renderWorkBlock(cat, items){
  var gridClass = cat.layout === 'grid-1' ? 'work-grid--1' : 'work-grid--2';
  var itemsHtml = items.map(function(item){
    return cat.layout === 'embeds' ? renderEmbedCard(item) : renderImageCard(item);
  }).join('');
  var noteHtml = cat.note_text ? '<p class="work-block-note">' + esc(cat.note_text) + '</p>' : '';

  return '<div class="work-block reveal" style="--delay:0.05s">' +
    '<p class="work-block-label">' + esc(cat.number_label || '') + '</p>' +
    '<h3 class="work-block-title">' + esc(cat.title) + '</h3>' +
    '<p class="work-block-text">' + esc(cat.lead_text || '') + '</p>' +
    '<div class="work-grid ' + gridClass + '">' + itemsHtml + '</div>' +
    noteHtml +
    '</div>';
}

function renderImageCard(item){
  var title = item.title || '';
  return '<div class="work-card" data-title="' + escAttr(title) + '" role="button" tabindex="0" aria-label="Ver: ' + escAttr(title) + '">' +
    '<img src="' + escAttr(item.image_url) + '" alt="' + escAttr(title) + '" loading="lazy"></div>';
}

function renderEmbedCard(item){
  var title = item.title || '';
  return '<div>' +
    '<div class="embed-card" data-embed-src="' + escAttr(item.embed_url) + '" data-embed-title="' + escAttr(title) + '">' +
    '<div class="embed-card-poster" role="button" tabindex="0" aria-label="Cargar: ' + escAttr(title) + '">' +
    '<img src="' + escAttr(item.image_url) + '" alt="" loading="lazy">' +
    '<div class="embed-card-poster-scrim" aria-hidden="true"></div>' +
    '<div class="embed-card-poster-content">' +
    '<span class="embed-card-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor"/></svg></span>' +
    '<span class="embed-card-poster-label">' + esc(title) + '</span>' +
    '<span class="embed-card-poster-sub">' + esc(item.subtitle || '') + '</span>' +
    '</div></div></div>' +
    '<a class="work-embed-link" href="' + escAttr(item.embed_url) + '" target="_blank" rel="noopener noreferrer">Abrir en pestaña nueva' +
    '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3h7v7M13 3 5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
    '</div>';
}

// ============================================================================
// RENDER — CONTACTO
// ============================================================================
function renderContacto(section, settings){
  if(section){
    setText('contacto-eyebrow', section.eyebrow);
    setText('contacto-title', section.title);
    setText('contacto-lead', section.lead_text);
  }
  if(!settings) return;

  var waCta = document.getElementById('contacto-whatsapp-cta');
  if(waCta) waCta.href = buildWhatsAppLink(settings, settings.whatsapp_message);

  setText('contacto-email-text', settings.email);
  var emailLink = document.getElementById('contacto-email-link');
  if(emailLink) emailLink.href = 'mailto:' + settings.email + '?subject=' + encodeURIComponent('Consulta de proyecto — portafolio');

  setText('contacto-phone-text', settings.phone_display);
  var phoneLink = document.getElementById('contacto-phone-link');
  if(phoneLink) phoneLink.href = 'tel:+' + String(settings.whatsapp_number || '').replace(/\D/g, '');

  var behanceLink = document.getElementById('contacto-behance-link');
  if(behanceLink) behanceLink.href = settings.behance_url;

  setText('contacto-city', settings.city_text);
}

// ============================================================================
// COMPORTAMIENTO — nav / video / carruseles / arrastre / lightboxes
// (idéntico al de las secciones aprobadas; solo se activa después del render)
// ============================================================================

function initNavToggle(){
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if(!toggle || !menu) return;
  toggle.addEventListener('click', function(){
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('is-open', !open);
  });
  menu.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    });
  });
}

function initHeroReducedMotion(){
  var video = document.getElementById('heroVideo');
  if(video && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    video.pause();
  }
}

function initExperienciaReducedMotion(){
  var video = document.getElementById('expHeadVideo');
  if(video && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    video.pause();
    video.removeAttribute('autoplay');
  }
}

function initShowreelsCarousel(){
  var stage = document.getElementById('reelStage');
  var track = document.getElementById('reelTrack');
  if(!stage || !track) return;

  var cards = Array.prototype.slice.call(track.querySelectorAll('.reel-card'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('#reelDots .reel-dot'));
  var prevBtn = document.getElementById('reelPrev');
  var nextBtn = document.getElementById('reelNext');
  var statusEl = document.getElementById('reelStatus');
  var counterEl = document.getElementById('reelCounter');
  var total = cards.length;
  if(total === 0) return;
  var active = Math.min(9, total - 1);
  var ignoreClick = false;

  function render(){
    var cardWidth = cards[0].offsetWidth || 200;
    var narrow = window.innerWidth < 700;
    var maxOffset = narrow ? 1 : 2;
    var stepX = cardWidth * 0.62;

    cards.forEach(function(card, i){
      var raw = i - active;
      if(raw > total / 2) raw -= total;
      if(raw < -total / 2) raw += total;
      var abs = Math.abs(raw);

      card.classList.toggle('is-active', raw === 0);
      card.classList.toggle('is-hidden', abs > maxOffset);
      card.tabIndex = abs > maxOffset ? -1 : 0;

      var scale = Math.max(1 - abs * 0.19, 0.3);
      var rotate = raw === 0 ? 0 : (raw > 0 ? -28 : 28);
      var translateX = raw * stepX;
      var blur = Math.min(abs * 2.4, 8);
      var opacity = abs === 0 ? 1 : abs === 1 ? 0.82 : abs === 2 ? 0.45 : 0;

      card.style.transform = 'translate(-50%,-50%) translateX(' + translateX + 'px) rotateY(' + rotate + 'deg) scale(' + scale + ')';
      card.style.filter = blur ? 'blur(' + blur + 'px)' : 'none';
      card.style.opacity = opacity;
      card.style.zIndex = String(100 - abs);
    });

    dots.forEach(function(d, i){ d.classList.toggle('is-active', i === active); });
    if(statusEl) statusEl.textContent = 'Reel ' + (active + 1) + ' de ' + total + '.';
    if(counterEl) counterEl.innerHTML = pad2(active + 1) + '<span>/</span>' + pad2(total);
  }

  function goTo(index){
    var next = ((index % total) + total) % total;
    if(next === active) return;
    active = next;
    render();
  }

  var lightbox = document.getElementById('reelLightbox');
  var lightboxBackdrop = document.getElementById('reelLightboxBackdrop');
  var lightboxClose = document.getElementById('reelLightboxClose');
  var lightboxFrameWrap = document.getElementById('reelLightboxFrameWrap');
  var lastFocused = null;

  function onLightboxKeydown(e){ if(e.key === 'Escape') closeLightbox(); }

  function openLightbox(index){
    var card = cards[index];
    var id = card.getAttribute('data-video');
    lightboxFrameWrap.innerHTML = '';
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    iframe.title = 'Reel ' + (index + 1);
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    lightboxFrameWrap.appendChild(iframe);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lastFocused = document.activeElement;
    lightboxClose.focus();
    document.addEventListener('keydown', onLightboxKeydown);
  }

  function closeLightbox(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxFrameWrap.innerHTML = '';
    document.removeEventListener('keydown', onLightboxKeydown);
    if(lastFocused && lastFocused.focus) lastFocused.focus();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  function activate(index){
    if(index !== active){ goTo(index); return; }
    openLightbox(index);
  }

  track.addEventListener('click', function(e){
    if(ignoreClick){ ignoreClick = false; return; }
    var card = e.target.closest ? e.target.closest('.reel-card') : null;
    if(!card) return;
    var idx = cards.indexOf(card);
    if(idx > -1) activate(idx);
  });

  track.addEventListener('keydown', function(e){
    var card = e.target.closest ? e.target.closest('.reel-card') : null;
    if(!card) return;
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      var idx = cards.indexOf(card);
      if(idx > -1) activate(idx);
    }
  });

  dots.forEach(function(dot, i){ dot.addEventListener('click', function(){ goTo(i); }); });
  if(prevBtn) prevBtn.addEventListener('click', function(){ goTo(active - 1); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ goTo(active + 1); });

  stage.addEventListener('keydown', function(e){
    if(e.target.closest('.reel-card')) return;
    if(e.key === 'ArrowLeft'){ goTo(active - 1); }
    if(e.key === 'ArrowRight'){ goTo(active + 1); }
  });

  var startX = null, dragging = false, dragged = false, pointerDownCard = null;
  track.addEventListener('pointerdown', function(e){
    startX = e.clientX;
    dragging = true;
    dragged = false;
    pointerDownCard = e.target.closest ? e.target.closest('.reel-card') : null;
    try{ track.setPointerCapture(e.pointerId); }catch(err){}
  });
  track.addEventListener('pointermove', function(e){
    if(!dragging) return;
    if(Math.abs(e.clientX - startX) > 6) dragged = true;
  });
  track.addEventListener('pointerup', function(e){
    if(!dragging) return;
    dragging = false;
    ignoreClick = true;
    var dx = e.clientX - startX;
    if(Math.abs(dx) > 40){
      if(dx < 0){ goTo(active + 1); } else { goTo(active - 1); }
    } else if(!dragged && pointerDownCard){
      var idx = cards.indexOf(pointerDownCard);
      if(idx > -1) activate(idx);
    }
    pointerDownCard = null;
  });
  track.addEventListener('pointercancel', function(){ dragging = false; pointerDownCard = null; });

  window.addEventListener('resize', render);
  render();
}

function initShowreelsParallax(){
  var section = document.getElementById('showreels');
  var glintWrap = document.getElementById('showreelsGlintWrap');
  if(!section || !glintWrap) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ticking = false;
  function updateParallax(){
    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var progress = (vh - rect.top) / (vh + rect.height) * 2 - 1;
    var offset = progress * 60;
    glintWrap.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
    ticking = false;
  }
  function onScroll(){
    if(!ticking){ window.requestAnimationFrame(updateParallax); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateParallax();
}

function initMiTrabajoOrbit(){
  var stage = document.getElementById('orbitStage');
  var sphere = document.getElementById('orbitSphere');
  if(!stage || !sphere) return;

  var cards = Array.prototype.slice.call(sphere.querySelectorAll('.orbit-card'));
  var n = cards.length;
  if(n === 0) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var golden = Math.PI * (3 - Math.sqrt(5));
  var basePoints = cards.map(function(_, i){
    var yv = n > 1 ? 1 - (i / (n - 1)) * 2 : 0;
    var radiusAtY = Math.sqrt(Math.max(0, 1 - yv * yv));
    var theta = golden * i;
    return { x: Math.cos(theta) * radiusAtY, y: yv, z: Math.sin(theta) * radiusAtY };
  });

  var angleY = 0.4;
  var angleX = -0.18;
  var autoSpeed = 0.0009;
  var dragging = false;
  var lastX = 0, lastY = 0, dragMoved = false, downCard = null;
  var lastInteraction = 0;
  var resumeDelay = 1400;
  var R = 220;
  var velocity = 0;
  var friction = 0.945;

  function measure(){
    var rect = stage.getBoundingClientRect();
    R = Math.min(rect.width, rect.height) * 0.42;
  }

  function render(){
    var cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    var cosX = Math.cos(angleX), sinX = Math.sin(angleX);

    cards.forEach(function(card, i){
      var p = basePoints[i];
      var x1 = p.x * cosY + p.z * sinY;
      var z1 = -p.x * sinY + p.z * cosY;
      var y1 = p.y;
      var y2 = y1 * cosX - z1 * sinX;
      var z2 = y1 * sinX + z1 * cosX;
      var x2 = x1;

      var X = x2 * R, Y = y2 * R, Z = z2 * R;
      var norm = (Z + R) / (2 * R);

      card.style.transform = 'translate3d(' + X.toFixed(1) + 'px,' + Y.toFixed(1) + 'px,' + Z.toFixed(1) + 'px) translate(-50%,-50%)';
      card.style.opacity = String(0.35 + norm * 0.65);
      card.style.filter = norm < 0.92 ? 'blur(' + ((1 - norm) * 3.2).toFixed(1) + 'px)' : 'none';
      card.style.zIndex = String(Math.round(Z));
      card.tabIndex = norm > 0.15 ? 0 : -1;
    });
  }

  function loop(now){
    if(dragging){
      // el ángulo ya se actualiza en pointermove
    } else if(Math.abs(velocity) > 0.00005){
      angleY += velocity;
      velocity *= friction;
      lastInteraction = now;
    } else if(!reduceMotion && (now - lastInteraction > resumeDelay)){
      angleY += autoSpeed;
    }
    render();
    window.requestAnimationFrame(loop);
  }

  var lightbox = document.getElementById('orbitLightbox');
  var lightboxBackdrop = document.getElementById('orbitLightboxBackdrop');
  var lightboxClose = document.getElementById('orbitLightboxClose');
  var lightboxContent = document.getElementById('orbitLightboxContent');
  var lastFocused = null;

  function onLightboxKeydown(e){ if(e.key === 'Escape') closeLightbox(); }

  function openLightbox(card){
    var img = card.querySelector('img');
    var title = card.getAttribute('data-title') || '';
    var safeTitle = escAttr(title);
    lightboxContent.innerHTML =
      (img ? '<img src="' + img.src + '" alt="' + safeTitle + '">' : '') +
      (title ? '<div class="orbit-lightbox-caption">' + esc(title) + '</div>' : '');
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lastFocused = document.activeElement;
    lightboxClose.focus();
    document.addEventListener('keydown', onLightboxKeydown);
  }

  function closeLightbox(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onLightboxKeydown);
    if(lastFocused && lastFocused.focus) lastFocused.focus();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  stage.addEventListener('pointerdown', function(e){
    dragging = true;
    dragMoved = false;
    lastX = e.clientX;
    lastY = e.clientY;
    downCard = e.target.closest ? e.target.closest('.orbit-card') : null;
    stage.classList.add('is-dragging');
    try{ stage.setPointerCapture(e.pointerId); }catch(err){}
  });

  stage.addEventListener('pointermove', function(e){
    if(!dragging) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    if(Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
    var deltaAngle = dx * 0.006;
    angleY += deltaAngle;
    angleX = Math.max(-0.6, Math.min(0.6, angleX + dy * 0.004));
    velocity = velocity * 0.7 + deltaAngle * 0.3;
    lastX = e.clientX;
    lastY = e.clientY;
    lastInteraction = performance.now();
  });

  stage.addEventListener('pointerup', function(){
    dragging = false;
    stage.classList.remove('is-dragging');
    lastInteraction = performance.now();
    if(!dragMoved && downCard){
      velocity = 0;
      openLightbox(downCard);
    }
    downCard = null;
  });
  stage.addEventListener('pointercancel', function(){
    dragging = false;
    stage.classList.remove('is-dragging');
    downCard = null;
  });

  stage.addEventListener('keydown', function(e){
    var card = e.target.closest ? e.target.closest('.orbit-card') : null;
    if(card && (e.key === 'Enter' || e.key === ' ')){
      e.preventDefault();
      openLightbox(card);
      return;
    }
    if(e.key === 'ArrowLeft'){ angleY -= 0.28; lastInteraction = performance.now(); }
    if(e.key === 'ArrowRight'){ angleY += 0.28; lastInteraction = performance.now(); }
  });

  document.querySelectorAll('.work-card').forEach(function(card){
    card.addEventListener('click', function(){ openLightbox(card); });
    card.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openLightbox(card); }
    });
  });

  window.addEventListener('resize', measure);
  measure();
  render();
  window.requestAnimationFrame(loop);
}

function initEmbedCards(){
  document.querySelectorAll('.embed-card').forEach(function(card){
    function load(){
      if(card.classList.contains('is-loaded')) return;
      var src = card.getAttribute('data-embed-src');
      if(!src) return;
      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('allow', 'accelerometer; gyroscope; fullscreen');
      iframe.setAttribute('allowfullscreen', '');
      iframe.title = card.getAttribute('data-embed-title') || 'Contenido interactivo';
      card.appendChild(iframe);
      card.classList.add('is-loaded');
    }
    var trigger = card.querySelector('.embed-card-poster');
    if(trigger){
      trigger.addEventListener('click', load);
      trigger.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); load(); }
      });
    }
  });
}
