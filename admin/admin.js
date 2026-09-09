// ============================================================================
// GABRIEL PALOMEQUE — PANEL DE ADMINISTRACIÓN
// admin.js — login, formularios y listas conectados a Supabase.
// ============================================================================

var db;
var STATE = {};

// ---------------------------------------------------------------------------
// utilidades
// ---------------------------------------------------------------------------
function esc(str){ return String(str == null ? '' : str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(str){ return esc(str).replace(/"/g,'&quot;'); }
function getPath(obj, path){
  return path.split('.').reduce(function(o,k){ return (o || {})[k]; }, obj);
}
function setPath(obj, path, value){
  var parts = path.split('.');
  var cur = obj;
  for(var i = 0; i < parts.length - 1; i++){
    cur[parts[i]] = cur[parts[i]] || {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}
function resolveUrl(value){
  if(!value) return '';
  if(/^https?:\/\//i.test(value)) return value;
  return '..' + (value.charAt(0) === '/' ? value : '/' + value);
}
function throwIfError(res){ if(res && res.error) throw res.error; return res; }
function stripId(obj){ var c = Object.assign({}, obj); delete c.id; return c; }

// ---------------------------------------------------------------------------
// especificación de campos por tabla/sección
// ---------------------------------------------------------------------------
var SETTINGS_FIELDS = [
  { key: 'brand_name', label: 'Nombre / marca', type: 'text' },
  { key: 'whatsapp_number', label: 'WhatsApp (solo números, con código de país, sin +)', type: 'text' },
  { key: 'whatsapp_message', label: 'Mensaje predeterminado de WhatsApp', type: 'textarea', full: true },
  { key: 'email', label: 'Correo', type: 'text' },
  { key: 'phone_display', label: 'Teléfono (para mostrar)', type: 'text' },
  { key: 'behance_url', label: 'Link de Behance', type: 'text', full: true },
  { key: 'city_text', label: 'Ciudad', type: 'text' }
];

var HERO_FIELDS = [
  { key: 'eyebrow', label: 'Eyebrow (texto pequeño)', type: 'text' },
  { key: 'title', label: 'Título (tu nombre)', type: 'text' },
  { key: 'extra.wordmark', label: 'Palabra grande', type: 'text' },
  { key: 'lead_text', label: 'Párrafo de presentación', type: 'textarea', full: true },
  { key: 'extra.cta_label', label: 'Texto del botón', type: 'text' },
  { key: 'extra.stat_number', label: 'Número (ej. 3)', type: 'text' },
  { key: 'extra.stat_text', label: 'Texto junto al número', type: 'text' },
  { key: 'extra.photo_url', label: 'Foto', type: 'image' },
  { key: 'extra.video_url', label: 'Video de fondo', type: 'video' },
  { key: 'extra.specialties', label: 'Especialidades (una por línea)', type: 'list', full: true }
];

var SECTION_BASIC_FIELDS = [
  { key: 'eyebrow', label: 'Eyebrow (texto pequeño)', type: 'text' },
  { key: 'title', label: 'Título', type: 'text', full: true },
  { key: 'lead_text', label: 'Párrafo', type: 'textarea', full: true }
];

var EXPERIENCIA_SECTION_FIELDS = SECTION_BASIC_FIELDS.concat([
  { key: 'extra.video_url', label: 'Video de fondo', type: 'video' }
]);

var TIMELINE_FIELDS = [
  { key: 'date_label', label: 'Fecha (ej. Feb 2024)', type: 'text' },
  { key: 'title', label: 'Título', type: 'text', full: true },
  { key: 'institution', label: 'Institución', type: 'text', full: true },
  { key: 'sort_order', label: 'Orden', type: 'number' }
];
var AREA_FIELDS = [
  { key: 'title', label: 'Área', type: 'text', full: true },
  { key: 'sort_order', label: 'Orden', type: 'number' }
];
var TOOL_FIELDS = [
  { key: 'label', label: 'Nombre', type: 'text' },
  { key: 'monogram', label: 'Sigla (2 letras)', type: 'text' },
  { key: 'sort_order', label: 'Orden', type: 'number' }
];
var EXP_ITEM_FIELDS = [
  { key: 'date_range', label: 'Fechas', type: 'text' },
  { key: 'role', label: 'Cargo', type: 'text' },
  { key: 'organization', label: 'Empresa', type: 'text', full: true },
  { key: 'description', label: 'Descripción', type: 'textarea', full: true },
  { key: 'sort_order', label: 'Orden', type: 'number' }
];
var EXP_REF_FIELDS = [
  { key: 'name', label: 'Nombre', type: 'text' },
  { key: 'role', label: 'Cargo', type: 'text' },
  { key: 'organization', label: 'Empresa', type: 'text' },
  { key: 'phone', label: 'Teléfono', type: 'text' },
  { key: 'sort_order', label: 'Orden', type: 'number' }
];
var REEL_FIELDS = [
  { key: 'youtube_id', label: 'ID de YouTube (no el link completo)', type: 'text' },
  { key: 'title', label: 'Título (opcional)', type: 'text' },
  { key: 'sort_order', label: 'Orden', type: 'number' }
];
var CATEGORY_FIELDS = [
  { key: 'number_label', label: 'Número (ej. 02)', type: 'text' },
  { key: 'title', label: 'Título', type: 'text', full: true },
  { key: 'lead_text', label: 'Párrafo', type: 'textarea', full: true },
  { key: 'layout', label: 'Formato', type: 'select', options: [
    { value: 'orbit', label: 'Esfera 3D (orbit)' },
    { value: 'grid-1', label: 'Una imagen grande' },
    { value: 'grid-2', label: 'Cuadrícula' },
    { value: 'embeds', label: 'Sitios / recorridos interactivos' }
  ]},
  { key: 'note_text', label: 'Nota pequeña (opcional)', type: 'textarea', full: true },
  { key: 'sort_order', label: 'Orden', type: 'number' }
];
var WORK_ITEM_FIELDS = [
  { key: 'title', label: 'Título', type: 'text', full: true },
  { key: 'item_type', label: 'Tipo', type: 'select', options: [
    { value: 'image', label: 'Imagen' },
    { value: 'embed', label: 'Sitio / recorrido interactivo' }
  ]},
  { key: 'subtitle', label: 'Subtítulo (solo si es interactivo)', type: 'text', full: true },
  { key: 'image_url', label: 'Imagen / portada', type: 'image' },
  { key: 'embed_url', label: 'Link (solo si es interactivo)', type: 'text', full: true },
  { key: 'sort_order', label: 'Orden', type: 'number' }
];

var ADD_DEFAULTS = {
  'timeline-educacion': { table: 'formacion_timeline', defaults: { group_name: 'educacion', date_label: '', title: 'Nuevo', institution: '' }, fields: TIMELINE_FIELDS, listId: 'list-timeline-educacion' },
  'timeline-continua': { table: 'formacion_timeline', defaults: { group_name: 'continua', date_label: '', title: 'Nuevo', institution: '' }, fields: TIMELINE_FIELDS, listId: 'list-timeline-continua' },
  'areas': { table: 'formacion_areas', defaults: { title: 'Nueva área' }, fields: AREA_FIELDS, listId: 'list-areas' },
  'tools': { table: 'formacion_tools', defaults: { label: 'Nueva herramienta', monogram: '??' }, fields: TOOL_FIELDS, listId: 'list-tools' },
  'exp-items': { table: 'experiencia_items', defaults: { date_range: '', role: 'Nuevo cargo', organization: '', description: '' }, fields: EXP_ITEM_FIELDS, listId: 'list-exp-items' },
  'exp-refs': { table: 'experiencia_references', defaults: { name: 'Nuevo nombre', role: '', organization: '', phone: '' }, fields: EXP_REF_FIELDS, listId: 'list-exp-refs' },
  'reels': { table: 'showreels_items', defaults: { youtube_id: '' }, fields: REEL_FIELDS, listId: 'list-reels' },
  'categories': { table: 'work_categories', defaults: { number_label: '', title: 'Nueva categoría', lead_text: '', layout: 'grid-2' }, fields: CATEGORY_FIELDS, listId: 'list-categories' }
};

// ---------------------------------------------------------------------------
// render de campos (HTML) + montaje de campos de imagen/video
// ---------------------------------------------------------------------------
function fieldInputHTML(f, value){
  if(f.type === 'textarea'){
    return '<div class="field' + (f.full ? ' full' : '') + '"><label>' + esc(f.label) + '</label><textarea data-key="' + f.key + '">' + esc(value || '') + '</textarea></div>';
  }
  if(f.type === 'select'){
    var opts = f.options.map(function(o){
      return '<option value="' + escAttr(o.value) + '"' + (o.value === value ? ' selected' : '') + '>' + esc(o.label) + '</option>';
    }).join('');
    return '<div class="field' + (f.full ? ' full' : '') + '"><label>' + esc(f.label) + '</label><select data-key="' + f.key + '">' + opts + '</select></div>';
  }
  if(f.type === 'number'){
    return '<div class="field' + (f.full ? ' full' : '') + '"><label>' + esc(f.label) + '</label><input type="number" data-key="' + f.key + '" value="' + escAttr(value == null ? '' : value) + '"></div>';
  }
  if(f.type === 'list'){
    var text = Array.isArray(value) ? value.join('\n') : '';
    return '<div class="field full"><label>' + esc(f.label) + '</label><textarea data-key="' + f.key + '" data-list="1">' + esc(text) + '</textarea></div>';
  }
  if(f.type === 'image' || f.type === 'video'){
    return '<div class="field full" data-media-field="' + f.key + '" data-media-type="' + f.type + '"><label>' + esc(f.label) + '</label></div>';
  }
  return '<div class="field' + (f.full ? ' full' : '') + '"><label>' + esc(f.label) + '</label><input type="text" data-key="' + f.key + '" value="' + escAttr(value == null ? '' : value) + '"></div>';
}

function mountMediaFields(root, getValue){
  root.querySelectorAll('[data-media-field]').forEach(function(el){
    var key = el.getAttribute('data-media-field');
    var type = el.getAttribute('data-media-type');
    var value = getValue(key) || '';
    var previewTag = type === 'image'
      ? '<img class="img-preview" src="' + escAttr(resolveUrl(value)) + '" onerror="this.style.visibility=\'hidden\'">'
      : '<video class="img-preview" src="' + escAttr(resolveUrl(value)) + '" muted playsinline></video>';
    el.insertAdjacentHTML('beforeend',
      previewTag +
      '<div class="upload-row">' +
      '<input type="file" accept="' + (type === 'image' ? 'image/*' : 'video/*') + '" data-upload="' + key + '">' +
      '<span class="upload-status" data-upload-status="' + key + '"></span>' +
      '</div>' +
      '<input type="hidden" data-key="' + key + '" value="' + escAttr(value) + '">'
    );
  });
}

// subida de archivos: un único listener delegado para todo el panel
document.addEventListener('change', async function(e){
  var input = e.target.closest('[data-upload]');
  if(!input) return;
  var key = input.getAttribute('data-upload');
  var file = input.files[0];
  if(!file) return;
  var fieldWrap = input.closest('[data-media-field]');
  var statusEl = fieldWrap.querySelector('[data-upload-status="' + key + '"]');
  if(statusEl) statusEl.textContent = 'Subiendo...';
  try{
    var path = 'uploads/' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    var upRes = await db.storage.from('media').upload(path, file, { upsert: true });
    if(upRes.error) throw upRes.error;
    var pub = db.storage.from('media').getPublicUrl(path);
    var url = pub.data.publicUrl;
    var hidden = fieldWrap.querySelector('[data-key="' + key + '"]');
    if(hidden) hidden.value = url;
    var preview = fieldWrap.querySelector('.img-preview');
    if(preview){ preview.src = url; preview.style.visibility = 'visible'; }
    if(statusEl) statusEl.textContent = 'Listo ✓ (recuerda darle Guardar)';
  }catch(err){
    console.error(err);
    if(statusEl) statusEl.textContent = 'Error al subir';
  }
});

// ---------------------------------------------------------------------------
// formulario singleton (Ajustes / Hero / encabezados de sección)
// ---------------------------------------------------------------------------
function buildForm(container, row, fields, saveFn){
  if(!container || !row) return;
  container.innerHTML = fields.map(function(f){ return fieldInputHTML(f, getPath(row, f.key)); }).join('') +
    '<div class="row-actions"><button type="button" class="btn save-btn">Guardar cambios</button><span class="save-status"></span></div>';

  mountMediaFields(container, function(key){ return getPath(row, key); });

  container.querySelector('.save-btn').addEventListener('click', async function(){
    var statusEl = container.querySelector('.save-status');
    statusEl.textContent = 'Guardando...'; statusEl.className = 'save-status';
    var updated = JSON.parse(JSON.stringify(row));
    container.querySelectorAll('[data-key]').forEach(function(input){
      var key = input.getAttribute('data-key');
      var val = input.value;
      if(input.hasAttribute('data-list')){
        val = val.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
      }
      setPath(updated, key, val);
    });
    try{
      await saveFn(updated);
      Object.assign(row, updated);
      statusEl.textContent = 'Guardado ✓'; statusEl.className = 'save-status ok';
    }catch(err){
      console.error(err);
      statusEl.textContent = 'Error al guardar'; statusEl.className = 'save-status err';
    }
  });
}

function sectionSaver(slug){
  return function(updated){
    return db.from('sections')
      .update({ eyebrow: updated.eyebrow, title: updated.title, lead_text: updated.lead_text, extra: updated.extra })
      .eq('slug', slug).then(throwIfError);
  };
}

// ---------------------------------------------------------------------------
// listas simples (timeline, áreas, herramientas, experiencia, referencias, reels)
// ---------------------------------------------------------------------------
function renderList(containerId, tableName, rows, fields){
  var container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  rows.forEach(function(row){ container.appendChild(buildListItem(tableName, row, fields)); });
}

function buildListItem(tableName, row, fields){
  var wrap = document.createElement('div');
  wrap.className = 'list-item';
  wrap.innerHTML = '<div class="field-grid">' + fields.map(function(f){ return fieldInputHTML(f, getPath(row, f.key)); }).join('') + '</div>' +
    '<div class="row-actions"><button type="button" class="btn secondary small save-item-btn">Guardar</button>' +
    '<button type="button" class="btn danger small delete-item-btn">Eliminar</button><span class="save-status"></span></div>';

  mountMediaFields(wrap, function(key){ return getPath(row, key); });

  wrap.querySelector('.save-item-btn').addEventListener('click', async function(){
    var statusEl = wrap.querySelector('.save-status');
    statusEl.textContent = 'Guardando...'; statusEl.className = 'save-status';
    var updated = {};
    wrap.querySelectorAll('[data-key]').forEach(function(input){
      var val = input.tagName === 'SELECT' ? input.value : input.value;
      if(input.type === 'number') val = Number(val);
      setPath(updated, input.getAttribute('data-key'), val);
    });
    try{
      var res = await db.from(tableName).update(updated).eq('id', row.id);
      throwIfError(res);
      Object.assign(row, updated);
      statusEl.textContent = 'Guardado ✓'; statusEl.className = 'save-status ok';
    }catch(err){
      console.error(err);
      statusEl.textContent = 'Error al guardar'; statusEl.className = 'save-status err';
    }
  });

  wrap.querySelector('.delete-item-btn').addEventListener('click', async function(){
    if(!confirm('¿Eliminar este elemento? No se puede deshacer.')) return;
    try{
      var res = await db.from(tableName).delete().eq('id', row.id);
      throwIfError(res);
      wrap.remove();
    }catch(err){
      console.error(err);
      alert('No se pudo eliminar.');
    }
  });

  return wrap;
}

// ---------------------------------------------------------------------------
// Mi Trabajo: categorías + piezas anidadas
// ---------------------------------------------------------------------------
function renderCategories(categories, itemsByCategory){
  var container = document.getElementById('list-categories');
  if(!container) return;
  container.innerHTML = '';
  categories.forEach(function(cat){
    container.appendChild(buildCategoryItem(cat, itemsByCategory[cat.id] || []));
  });
}

function buildCategoryItem(cat, items){
  var wrap = document.createElement('div');
  wrap.className = 'list-item';
  wrap.innerHTML = '<div class="field-grid">' + CATEGORY_FIELDS.map(function(f){ return fieldInputHTML(f, getPath(cat, f.key)); }).join('') + '</div>' +
    '<div class="row-actions"><button type="button" class="btn secondary small save-item-btn">Guardar categoría</button>' +
    '<button type="button" class="btn danger small delete-item-btn">Eliminar categoría</button><span class="save-status"></span></div>' +
    '<div style="margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid var(--line);">' +
    '<h4 style="font-size:0.85rem;margin-bottom:0.75rem;color:var(--fg-dim);">Piezas de esta categoría</h4>' +
    '<div class="items-list"></div>' +
    '<button type="button" class="btn secondary small add-work-item-btn">+ Agregar pieza</button>' +
    '</div>';

  mountMediaFields(wrap, function(key){ return getPath(cat, key); });

  var itemsList = wrap.querySelector('.items-list');
  items.forEach(function(item){ itemsList.appendChild(buildWorkItem(item)); });

  wrap.querySelector('.save-item-btn').addEventListener('click', async function(){
    var statusEl = wrap.querySelector('.save-status');
    statusEl.textContent = 'Guardando...'; statusEl.className = 'save-status';
    var updated = {};
    Array.prototype.forEach.call(wrap.querySelectorAll('.field-grid[data-cat-fields] [data-key], :scope > .field-grid [data-key]'), function(input){});
    // leer solo los campos DIRECTOS de la categoría (no los de las piezas anidadas)
    var directGrid = wrap.querySelector(':scope > .field-grid');
    directGrid.querySelectorAll('[data-key]').forEach(function(input){
      var val = input.value;
      if(input.type === 'number') val = Number(val);
      setPath(updated, input.getAttribute('data-key'), val);
    });
    try{
      var res = await db.from('work_categories').update(updated).eq('id', cat.id);
      throwIfError(res);
      Object.assign(cat, updated);
      statusEl.textContent = 'Guardado ✓'; statusEl.className = 'save-status ok';
    }catch(err){
      console.error(err);
      statusEl.textContent = 'Error al guardar'; statusEl.className = 'save-status err';
    }
  });

  wrap.querySelector('.delete-item-btn').addEventListener('click', async function(){
    if(!confirm('¿Eliminar esta categoría y TODAS sus piezas? No se puede deshacer.')) return;
    try{
      var res = await db.from('work_categories').delete().eq('id', cat.id);
      throwIfError(res);
      wrap.remove();
    }catch(err){
      console.error(err);
      alert('No se pudo eliminar.');
    }
  });

  wrap.querySelector('.add-work-item-btn').addEventListener('click', async function(ev){
    var btn = ev.currentTarget;
    btn.disabled = true;
    try{
      var sortOrder = itemsList.children.length + 1;
      var payload = {
        category_id: cat.id,
        item_type: cat.layout === 'embeds' ? 'embed' : 'image',
        title: 'Nueva pieza',
        sort_order: sortOrder
      };
      var res = await db.from('work_items').insert(payload).select().single();
      throwIfError(res);
      itemsList.appendChild(buildWorkItem(res.data));
    }catch(err){
      console.error(err);
      alert('No se pudo agregar la pieza.');
    }
    btn.disabled = false;
  });

  return wrap;
}

function buildWorkItem(item){
  var wrap = document.createElement('div');
  wrap.className = 'list-item';
  wrap.style.background = 'var(--panel-2)';
  wrap.innerHTML = '<div class="field-grid">' + WORK_ITEM_FIELDS.map(function(f){ return fieldInputHTML(f, getPath(item, f.key)); }).join('') + '</div>' +
    '<div class="row-actions"><button type="button" class="btn secondary small save-item-btn">Guardar pieza</button>' +
    '<button type="button" class="btn danger small delete-item-btn">Eliminar pieza</button><span class="save-status"></span></div>';

  mountMediaFields(wrap, function(key){ return getPath(item, key); });

  wrap.querySelector('.save-item-btn').addEventListener('click', async function(){
    var statusEl = wrap.querySelector('.save-status');
    statusEl.textContent = 'Guardando...'; statusEl.className = 'save-status';
    var updated = {};
    wrap.querySelectorAll('[data-key]').forEach(function(input){
      var val = input.value;
      if(input.type === 'number') val = Number(val);
      setPath(updated, input.getAttribute('data-key'), val);
    });
    try{
      var res = await db.from('work_items').update(updated).eq('id', item.id);
      throwIfError(res);
      Object.assign(item, updated);
      statusEl.textContent = 'Guardado ✓'; statusEl.className = 'save-status ok';
    }catch(err){
      console.error(err);
      statusEl.textContent = 'Error al guardar'; statusEl.className = 'save-status err';
    }
  });

  wrap.querySelector('.delete-item-btn').addEventListener('click', async function(){
    if(!confirm('¿Eliminar esta pieza?')) return;
    try{
      var res = await db.from('work_items').delete().eq('id', item.id);
      throwIfError(res);
      wrap.remove();
    }catch(err){
      console.error(err);
      alert('No se pudo eliminar.');
    }
  });

  return wrap;
}

// ---------------------------------------------------------------------------
// botones "+ Agregar" de las listas simples
// ---------------------------------------------------------------------------
document.addEventListener('click', async function(e){
  var btn = e.target.closest('[data-add]');
  if(!btn) return;
  var key = btn.getAttribute('data-add');
  var cfg = ADD_DEFAULTS[key];
  if(!cfg) return;
  btn.disabled = true;
  try{
    var container = document.getElementById(cfg.listId);
    var sortOrder = container.children.length + 1;
    var payload = Object.assign({}, cfg.defaults, { sort_order: sortOrder });
    var res = await db.from(cfg.table).insert(payload).select().single();
    throwIfError(res);
    container.appendChild(buildListItem(cfg.table, res.data, cfg.fields));
  }catch(err){
    console.error(err);
    alert('No se pudo agregar.');
  }
  btn.disabled = false;
});

// ---------------------------------------------------------------------------
// carga de datos y render general
// ---------------------------------------------------------------------------
async function loadAll(){
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
  results.forEach(function(r, i){ if(r.error) console.error('Error cargando tabla #' + i, r.error); });

  var sectionsArr = results[1].data || [];
  var sections = {};
  sectionsArr.forEach(function(s){ sections[s.slug] = s; });

  STATE = {
    settings: results[0].data,
    sections: sections,
    timeline: results[2].data || [],
    areas: results[3].data || [],
    tools: results[4].data || [],
    expItems: results[5].data || [],
    expRefs: results[6].data || [],
    reels: results[7].data || [],
    categories: results[8].data || [],
    items: results[9].data || []
  };

  renderAllForms();
}

function renderAllForms(){
  buildForm(document.getElementById('form-settings'), STATE.settings, SETTINGS_FIELDS, function(updated){
    return db.from('site_settings').update(stripId(updated)).eq('id', 1).then(throwIfError);
  });
  buildForm(document.getElementById('form-hero'), STATE.sections.hero, HERO_FIELDS, sectionSaver('hero'));
  buildForm(document.getElementById('form-formacion'), STATE.sections.formacion, SECTION_BASIC_FIELDS, sectionSaver('formacion'));
  buildForm(document.getElementById('form-experiencia'), STATE.sections.experiencia, EXPERIENCIA_SECTION_FIELDS, sectionSaver('experiencia'));
  buildForm(document.getElementById('form-showreels'), STATE.sections.showreels, SECTION_BASIC_FIELDS, sectionSaver('showreels'));
  buildForm(document.getElementById('form-mitrabajo'), STATE.sections.mi_trabajo, SECTION_BASIC_FIELDS, sectionSaver('mi_trabajo'));
  buildForm(document.getElementById('form-contacto'), STATE.sections.contacto, SECTION_BASIC_FIELDS, sectionSaver('contacto'));

  renderList('list-timeline-educacion', 'formacion_timeline', STATE.timeline.filter(function(t){ return t.group_name === 'educacion'; }), TIMELINE_FIELDS);
  renderList('list-timeline-continua', 'formacion_timeline', STATE.timeline.filter(function(t){ return t.group_name === 'continua'; }), TIMELINE_FIELDS);
  renderList('list-areas', 'formacion_areas', STATE.areas, AREA_FIELDS);
  renderList('list-tools', 'formacion_tools', STATE.tools, TOOL_FIELDS);
  renderList('list-exp-items', 'experiencia_items', STATE.expItems, EXP_ITEM_FIELDS);
  renderList('list-exp-refs', 'experiencia_references', STATE.expRefs, EXP_REF_FIELDS);
  renderList('list-reels', 'showreels_items', STATE.reels, REEL_FIELDS);

  var itemsByCategory = {};
  STATE.items.forEach(function(item){ (itemsByCategory[item.category_id] = itemsByCategory[item.category_id] || []).push(item); });
  renderCategories(STATE.categories, itemsByCategory);
}

// ---------------------------------------------------------------------------
// autenticación
// ---------------------------------------------------------------------------
function wireLogin(){
  document.getElementById('login-form').addEventListener('submit', async function(e){
    e.preventDefault();
    var email = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;
    var errEl = document.getElementById('login-error');
    errEl.textContent = '';
    var res = await db.auth.signInWithPassword({ email: email, password: password });
    if(res.error){ errEl.textContent = 'Correo o contraseña incorrectos.'; return; }
    showDashboard(res.data.session);
  });
}

function wireLogout(){
  document.getElementById('logout-btn').addEventListener('click', async function(){
    await db.auth.signOut();
    location.reload();
  });
}

function wireTabs(){
  document.getElementById('tabs').addEventListener('click', function(e){
    var btn = e.target.closest('button[data-tab]');
    if(!btn) return;
    document.querySelectorAll('#tabs button').forEach(function(b){ b.classList.toggle('is-active', b === btn); });
    var tab = btn.getAttribute('data-tab');
    document.querySelectorAll('.panel').forEach(function(p){ p.classList.toggle('is-active', p.id === 'panel-' + tab); });
  });
}

async function showDashboard(session){
  document.getElementById('login-screen').hidden = true;
  document.getElementById('dashboard').hidden = false;
  document.getElementById('user-email').textContent = session.user.email;
  await loadAll();
}

async function checkExistingSession(){
  var res = await db.auth.getSession();
  if(res.data && res.data.session){
    await showDashboard(res.data.session);
  }
}

document.addEventListener('DOMContentLoaded', function(){
  if(typeof SUPABASE_URL === 'undefined' || !window.supabase){
    console.error('Falta config.js o la librería de Supabase.');
    return;
  }
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  wireLogin();
  wireLogout();
  wireTabs();
  checkExistingSession();
});
