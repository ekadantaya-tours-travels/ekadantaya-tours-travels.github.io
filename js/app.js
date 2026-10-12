/* =====================================================================
   Ekadantaya Tours & Travels — app logic (no dependencies)
   All content comes from window.SITE_CONFIG (config.js).
   ===================================================================== */
(function () {
  'use strict';

  var C = window.SITE_CONFIG;
  var B = C.brand;
  var SETUP = !!C.setupMode;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TRIP_TYPES = [
    { id: 'Local', icon: 'compass' },
    { id: 'One-Way', icon: 'arrowRight' },
    { id: 'Round Trip', icon: 'route' },
    { id: 'Outstation', icon: 'mountain' },
    { id: 'Airport Transfer', icon: 'plane' },
    { id: 'Customized Tour', icon: 'sparkles' }
  ];

  /* ---------------- helpers ---------------- */
  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function $$(s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); }
  function icon(n, c) { return window.iconSvg(n, c); }
  function isSet(v) { return v !== null && v !== undefined && v !== ''; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function ph(label) { return SETUP ? '<span class="ph">[Add ' + esc(label) + ']</span>' : ''; }
  function money(n) { return C.pricing.currency + Math.round(n).toLocaleString('en-IN'); }
  function num(v, d) { var n = parseFloat(v); return isFinite(n) && n >= 0 ? n : (d || 0); }
  function waUrl(text) { return 'https://wa.me/' + B.whatsapp + '?text=' + encodeURIComponent(text); }
  function openWa(text) { window.open(waUrl(text), '_blank', 'noopener'); }
  function todayStr() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function fmtDate(s) {
    if (!s) return '';
    var d = new Date(s + 'T00:00:00');
    return isNaN(d) ? s : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }
  function fmtTime(t) {
    if (!t) return '';
    var p = t.split(':'), h = +p[0], m = p[1];
    return ((h % 12) || 12) + ':' + m + ' ' + (h < 12 ? 'AM' : 'PM');
  }
  function normaliseMobile(v) {
    var d = String(v || '').replace(/\D/g, '');
    if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
    if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return d;
  }
  function validMobile(v) { return /^[6-9]\d{9}$/.test(normaliseMobile(v)); }
  function media(src, alt, iconName, label, eager) {
    if (src) return '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '"' + (eager ? '' : ' loading="lazy" decoding="async"') + '>';
    return '<div class="art" role="img" aria-label="' + esc(label || alt || 'Image coming soon') + '"><div class="art__inner">' +
      icon(iconName || 'image') + (label ? '<span class="art__label">' + esc(label) + '</span>' : '') +
      (SETUP ? '<span class="ph">[Add photo]</span>' : '') + '</div></div>';
  }
  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('is-show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('is-show'); }, 3200);
  }
  function scrollToEl(el) { el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
  function hydrateIcons(ctx) {
    $$('[data-icon]', ctx).forEach(function (el) { if (!el.firstChild) el.innerHTML = icon(el.getAttribute('data-icon')); });
  }

  /* ---------------- email delivery (FormSubmit) ---------------- */
  // Resolves when the message reached the inbox; rejects otherwise.
  function sendEmail(form, subject, fields) {
    var F = C.forms || {}, key = F.web3formsKey, url, body;
    var hp = form && form.querySelector('[name=_honey]');
    if (hp && hp.value) return Promise.resolve({ spam: true }); // bot filled the hidden field
    if (key) { // Web3Forms
      url = 'https://api.web3forms.com/submit';
      body = { access_key: key, subject: subject, from_name: B.name + ' Website' };
      if (fields._replyto) body.replyto = fields._replyto;
    } else {  // FormSubmit
      url = F.emailEndpoint;
      body = { _subject: subject, _template: 'table', _captcha: 'false' };
      if (fields._replyto) body._replyto = fields._replyto;
    }
    if (!url || !window.fetch) return Promise.reject(new Error('Email delivery is not configured'));
    Object.keys(fields).forEach(function (k) { if (k.charAt(0) !== '_' && isSet(fields[k])) body[k] = fields[k]; });
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          if (!r.ok || String(d.success) !== 'true') throw new Error(d.message || 'Could not send');
          return d;
        });
      });
  }
  function setLoading(btn, on) { if (btn) { btn.classList.toggle('is-loading', on); btn.disabled = on; } }
  function successPopup(title, text, extra) {
    openModal('<div class="success-icon success-icon--pop">' + icon('check') + '</div>' +
      '<h2 id="modalTitle">' + esc(title) + '</h2><p>' + text + '</p>' + (extra || '') +
      '<div class="modal__actions"><button type="button" class="btn btn--gold" data-close>Done</button></div>');
  }

  /* ---------------- opening intro ---------------- */
  // Synthesised "vroom + whoosh" — no audio file needed. Browsers may block
  // sound until the visitor interacts, so a tap during the intro also plays it.
  function zoomSound() {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    var ctx = new AC(), played = false;
    function play() {
      if (played) return; played = true;
      var t = ctx.currentTime, out = ctx.createGain(); out.gain.value = 0.55; out.connect(ctx.destination);
      var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pan) { pan.pan.setValueAtTime(-0.9, t); pan.pan.linearRampToValueAtTime(0, t + 0.8); pan.connect(out); }
      var bus = pan || out;
      // engine
      var eng = ctx.createOscillator(), engF = ctx.createBiquadFilter(), engG = ctx.createGain();
      eng.type = 'sawtooth';
      eng.frequency.setValueAtTime(55, t); eng.frequency.exponentialRampToValueAtTime(190, t + 0.55); eng.frequency.exponentialRampToValueAtTime(90, t + 1.2);
      engF.type = 'lowpass'; engF.frequency.value = 700;
      engG.gain.setValueAtTime(0.0001, t); engG.gain.exponentialRampToValueAtTime(0.5, t + 0.35); engG.gain.exponentialRampToValueAtTime(0.0001, t + 1.25);
      eng.connect(engF); engF.connect(engG); engG.connect(bus); eng.start(t); eng.stop(t + 1.3);
      // whoosh
      var len = Math.floor(ctx.sampleRate * 1.3), buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0);
      for (var i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
      var noise = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), ng = ctx.createGain();
      noise.buffer = buf; bp.type = 'bandpass'; bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(350, t); bp.frequency.exponentialRampToValueAtTime(2600, t + 0.55); bp.frequency.exponentialRampToValueAtTime(500, t + 1.2);
      ng.gain.setValueAtTime(0.0001, t); ng.gain.exponentialRampToValueAtTime(0.9, t + 0.5); ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.25);
      noise.connect(bp); bp.connect(ng); ng.connect(bus); noise.start(t); noise.stop(t + 1.3);
      setTimeout(function () { try { ctx.close(); } catch (e) {} }, 2000);
    }
    return {
      tryPlay: function () {
        var p = ctx.resume ? ctx.resume() : null;
        if (ctx.state === 'running') play();
        else if (p && p.then) p.then(function () { if (ctx.state === 'running') play(); });
      },
      fromGesture: function () { if (ctx.resume) ctx.resume().then(play); else play(); }
    };
  }

  function initIntro() {
    var el = $('#intro');
    if (!el) return;
    if (!document.documentElement.classList.contains('has-intro')) { el.remove(); return; }
    document.body.classList.add('intro-lock');
    var sound = zoomSound(), done = false, timers = [];
    timers.push(setTimeout(function () { if (sound) sound.tryPlay(); }, 650)); // in time with the car
    function finish() {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      el.classList.add('is-leaving');
      document.body.classList.remove('intro-lock');
      document.documentElement.classList.remove('has-intro');
      setTimeout(function () { el.remove(); }, 950);
      ['pointerdown', 'keydown'].forEach(function (ev) { window.removeEventListener(ev, skip, true); });
    }
    function skip(e) {
      if (sound && e.type === 'pointerdown' && !done) sound.fromGesture(); // first tap unlocks audio
      finish();
    }
    ['pointerdown', 'keydown'].forEach(function (ev) { window.addEventListener(ev, skip, true); });
    timers.push(setTimeout(finish, 2900));
  }

  /* ---------------- brand bindings ---------------- */
  function bindBrand() {
    var map = {
      name: B.name, phoneDisplay: B.phoneDisplay, email: B.email, city: B.city, district: B.district,
      location: B.address || (B.city + ', ' + B.district + ', ' + B.state),
      serviceAreas: B.serviceAreas.join(', ') + ' & more',
      ownerName: B.ownerName
    };
    $$('[data-bind]').forEach(function (el) { var k = el.getAttribute('data-bind'); if (map[k] != null) el.textContent = map[k]; });
    $$('.js-tel').forEach(function (a) { a.href = 'tel:' + B.phone; });
    $$('.js-mail').forEach(function (a) { a.href = 'mailto:' + B.email; });
    $$('.js-wa').forEach(function (a) {
      a.href = waUrl(a.getAttribute('data-wa-text') || 'Hello ' + B.name + '!');
      a.target = '_blank'; a.rel = 'noopener';
    });
    $('#year').textContent = new Date().getFullYear();
  }

  /* ---------------- hero ---------------- */
  function renderHero() {
    if (C.hero.carImage) {
      var img = $('#heroCar'); img.src = C.hero.carImage; img.alt = C.hero.carImageAlt || '';
      $('#heroCarWrap').hidden = false;
      init360();
    }
    var pts = [];
    var seats = C.vehicle.specs.filter(function (s) { return s.label === 'Seating Capacity'; })[0];
    if (seats && isSet(seats.value)) pts.push(['users', seats.value + ' Seater']);
    C.amenities.forEach(function (a) {
      if (a.enabled && (a.icon === 'snowflake' || a.icon === 'userCheck')) pts.push([a.icon, a.title]);
    });
    pts.push(['mapPin', B.serviceAreas.slice(0, 3).join(' · ') + ' +']);
    $('#heroPoints').innerHTML = pts.map(function (p) { return '<li>' + icon(p[0]) + esc(p[1]) + '</li>'; }).join('');

    // subtle parallax on the hero background
    if (!reduceMotion) {
      var bg = $('.hero__bg'), car = $('#heroCarWrap'), ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          var y = Math.min(window.scrollY, window.innerHeight);
          bg.style.transform = 'translate3d(0,' + (y * 0.25) + 'px,0)';
          if (car) car.style.transform = 'translate3d(0,' + (y * 0.12) + 'px,0)';
          ticking = false;
        });
      }, { passive: true });
    }
  }

  /* ---------------- hero 360° / drag-to-rotate viewer ---------------- */
  function init360() {
    var box = $('#car360'), stage = $('#car360Stage'), img = $('#heroCar');
    var frames = (C.hero.spinFrames || []).filter(Boolean);
    var spin = frames.length > 1;
    var angle = 0, dragging = false, startX = 0, startAngle = 0, lastInteract = 0, t0 = performance.now();
    box.setAttribute('aria-label', (C.hero.carImageAlt || 'Our car') + '. Drag or use the arrow keys to rotate.');
    $('#car360Badge').textContent = spin ? '360° View · drag to spin' : 'Drag to rotate';
    if (spin) frames.forEach(function (src) { var i = new Image(); i.src = src; });

    function render() {
      if (spin) {
        var n = frames.length, idx = Math.round((((angle % 360) + 360) % 360) / 360 * n) % n;
        if (img.getAttribute('src') !== frames[idx]) img.src = frames[idx];
      } else {
        angle = Math.max(-38, Math.min(38, angle));
        stage.style.transform = 'perspective(1400px) rotateY(' + angle.toFixed(2) + 'deg)';
      }
    }
    box.addEventListener('pointerdown', function (e) {
      dragging = true; startX = e.clientX; startAngle = angle; box.setPointerCapture(e.pointerId); box.classList.add('is-dragging');
    });
    box.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      angle = startAngle + (e.clientX - startX) * (spin ? 0.6 : 0.25); lastInteract = performance.now(); render();
    });
    function end() { dragging = false; lastInteract = performance.now(); box.classList.remove('is-dragging'); }
    box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
    box.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); angle += (e.key === 'ArrowRight' ? 1 : -1) * (spin ? 360 / frames.length : 8);
      lastInteract = performance.now(); render();
    });
    if (reduceMotion) return;
    // idle: gentle turntable sway (or slow spin when frames exist)
    (function idle(now) {
      if (!dragging && now - lastInteract > 2500) {
        if (spin) angle += 0.25;
        else angle += ((Math.sin((now - t0) / 2200) * 16) - angle) * 0.04;
        render();
      }
      requestAnimationFrame(idle);
    })(t0);
  }

  /* ---------------- navigation ---------------- */
  function initNav() {
    var nav = $('#nav'), toggle = $('#navToggle'), links = $('#navLinks');
    function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 30); }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    function setMenu(open) {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);
    }
    toggle.addEventListener('click', function () { setMenu(!links.classList.contains('is-open')); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && links.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });

    // active section highlighting
    var navAnchors = $$('#navLinks a:not(.btn)');
    var sections = navAnchors.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            navAnchors.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }
  }

  /* ---------------- reveal on scroll ---------------- */
  var revealIO = null;
  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) { $$('.reveal').forEach(function (e) { e.classList.add('is-in'); }); return; }
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (e) { revealIO.observe(e); });
  }
  function observeNew(ctx) {
    $$('.reveal', ctx).forEach(function (e) { if (revealIO) revealIO.observe(e); else e.classList.add('is-in'); });
  }

  /* ---------------- vehicle ---------------- */
  function renderCar() {
    var v = C.vehicle;
    $('#carMedia').innerHTML = media(v.showcaseImage, v.showcaseAlt, 'car', v.makeModel || 'Our Car');
    if (v.showcaseImage && v.showcaseIsCutout) $('#carMedia').classList.add('stage');
    if (isSet(v.makeModel)) {
      var parts = v.makeModel.split(' '), brand = parts.shift(), model = parts.join(' ') || brand;
      var spec = function (label) { var s = v.specs.filter(function (x) { return x.label === label; })[0]; return s && isSet(s.value) ? s.value : null; };
      var chips = [spec('Seating Capacity') && spec('Seating Capacity') + ' Seater', spec('Fuel Type'), spec('Registration')].filter(Boolean);
      $('#carMedia').insertAdjacentHTML('afterbegin',
        '<div class="car__name"><small>' + esc(brand) + '</small><strong>' + esc(model) + '</strong></div>' +
        (chips.length ? '<div class="car__chips">' + chips.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div>' : ''));
    }
    var line = $('#carModelLine');
    if (isSet(v.makeModel)) {
      line.innerHTML = 'Meet our <strong>' + esc(v.makeModel) + '</strong>' + (isSet(v.registrationYear) ? ' (' + esc(v.registrationYear) + ')' : '') +
        ' — clean, comfortable and ready for every kind of journey, from quick city errands to long family road trips.';
    } else if (SETUP) {
      line.innerHTML += ' ' + ph('car make & model in config.js');
    }

    var html = v.specs.map(function (s) {
      if (!isSet(s.value)) {
        return SETUP ? '<div class="spec"><span class="spec__icon">' + icon(s.icon) + '</span><div><dt>' + esc(s.label) + '</dt><dd>' + ph('value') + '</dd></div></div>' : '';
      }
      var val = (s.counter && typeof s.value === 'number')
        ? '<span class="num" data-count="' + s.value + '">0</span>' + esc(s.unit || '')
        : esc(s.value) + (s.unit ? ' ' + esc(s.unit) : '');
      return '<div class="spec"><span class="spec__icon">' + icon(s.icon) + '</span><div><dt>' + esc(s.label) + '</dt><dd>' + val + '</dd></div></div>';
    }).join('');
    if (!html.trim()) html = '<p class="note specs__empty">' + icon('info') + 'Full vehicle details coming soon — call or WhatsApp us for specifications.</p>';
    $('#specs').innerHTML = html;
    $$('.spec', $('#specs')).forEach(function (el, i) { el.classList.add('reveal'); el.style.setProperty('--i', i % 6); });

    // animated counters (verified numbers only)
    var counters = $$('[data-count]');
    if (!counters.length) return;
    function run(el) {
      var target = +el.getAttribute('data-count');
      if (reduceMotion) { el.textContent = target; return; }
      var start = performance.now(), dur = 1400;
      (function step(now) {
        var p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }); }, { threshold: 0.6 });
      counters.forEach(function (c) { io.observe(c); });
    } else counters.forEach(run);
  }

  /* ---------------- amenities ---------------- */
  function renderAmenities() {
    var list = C.amenities.filter(function (a) { return a.enabled || SETUP; });
    $('#amenities').innerHTML = list.map(function (a, i) {
      return '<article class="amenity reveal' + (a.enabled ? '' : ' amenity--off') + '" style="--i:' + (i % 4) + '">' +
        (a.enabled ? '' : '<span class="badge badge--amber">Disabled</span>') +
        '<div class="amenity__icon">' + icon(a.icon) + '</div><h3>' + esc(a.title) + '</h3><p>' + esc(a.desc) + '</p></article>';
    }).join('');
  }

  /* ---------------- packages ---------------- */
  var pkgState = { cat: '', dur: '', dest: '' };
  function uniq(arr) { return arr.filter(function (v, i) { return v && arr.indexOf(v) === i; }); }

  function priceHtml(p) {
    if (isSet(p.startingPrice)) return '<div class="price"><small>Starting from</small><strong>' + money(p.startingPrice) + '</strong></div>';
    return '<div class="price price--quote"><small>Price</small><strong>Get a Quote</strong></div>';
  }

  function renderPackages() {
    if (!$('#packagesGrid')) return; // Tour Packages section removed from the page
    var P = C.packages;
    var cats = uniq(P.map(function (p) { return p.category; }));
    $('#pkgCats').innerHTML = ['All'].concat(cats).map(function (c) {
      return '<button type="button" data-cat="' + (c === 'All' ? '' : esc(c)) + '" aria-pressed="' + (c === 'All') + '">' + esc(c) + '</button>';
    }).join('');
    uniq(P.map(function (p) { return p.durationGroup; })).forEach(function (d) { $('#pkgDuration').insertAdjacentHTML('beforeend', '<option>' + esc(d) + '</option>'); });
    uniq(P.map(function (p) { return p.destination; })).forEach(function (d) { $('#pkgDest').insertAdjacentHTML('beforeend', '<option>' + esc(d) + '</option>'); });

    $('#packagesGrid').innerHTML = P.map(function (p, i) {
      return '<article class="pkg reveal" style="--i:' + (i % 3) + '" data-id="' + esc(p.id) + '">' +
        '<div class="pkg__media"><span class="badge">' + esc(p.category) + '</span>' + media(p.image, p.name + ' — ' + p.route, p.icon, '') + '</div>' +
        '<div class="pkg__body">' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p class="pkg__route">' + icon('mapPin') + '<span>' + esc(p.route) + '</span></p>' +
          '<div class="pkg__meta"><span>' + icon('clock') + esc(p.duration) + '</span>' + (isSet(p.distance) ? '<span>' + icon('route') + esc(p.distance) + '</span>' : '') + '</div>' +
          (p.includes && p.includes.length ? '<ul class="pkg__inc">' + p.includes.slice(0, 2).map(function (x) { return '<li>' + icon('check') + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
          '<div class="pkg__foot">' + priceHtml(p) +
            '<div class="pkg__btns"><button type="button" class="btn btn--ghost" data-details="' + esc(p.id) + '">View Details</button>' +
            '<button type="button" class="btn btn--gold" data-book="' + esc(p.id) + '">Book</button></div>' +
          '</div>' +
        '</div></article>';
    }).join('');

    $('#pkgCats').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('#pkgCats button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      pkgState.cat = b.getAttribute('data-cat'); filterPackages();
    });
    $('#pkgDuration').addEventListener('change', function () { pkgState.dur = this.value; filterPackages(); });
    $('#pkgDest').addEventListener('change', function () { pkgState.dest = this.value; filterPackages(); });
    $('#pkgReset').addEventListener('click', function () {
      pkgState = { cat: '', dur: '', dest: '' }; $('#pkgDuration').value = ''; $('#pkgDest').value = '';
      $$('#pkgCats button').forEach(function (x, i) { x.setAttribute('aria-pressed', i === 0); }); filterPackages();
    });

    $('#packagesGrid').addEventListener('click', function (e) {
      var d = e.target.closest('[data-details]'), b = e.target.closest('[data-book]');
      if (d) showPackage(d.getAttribute('data-details'));
      if (b) bookPackage(b.getAttribute('data-book'));
    });
  }

  function filterPackages() {
    var shown = 0;
    C.packages.forEach(function (p) {
      var ok = (!pkgState.cat || p.category === pkgState.cat) && (!pkgState.dur || p.durationGroup === pkgState.dur) && (!pkgState.dest || p.destination === pkgState.dest);
      var el = $('.pkg[data-id="' + p.id + '"]');
      if (ok) { shown++; el.hidden = false; el.classList.add('is-in'); requestAnimationFrame(function () { el.classList.remove('is-hiding'); }); }
      else { el.classList.add('is-hiding'); el.hidden = true; }
    });
    $('#pkgEmpty').hidden = shown > 0;
    $('#pkgCount').textContent = shown + ' package' + (shown === 1 ? '' : 's') + ' shown';
  }

  function findPkg(id) { return C.packages.filter(function (p) { return p.id === id; })[0]; }

  function showPackage(id) {
    var p = findPkg(id); if (!p) return;
    var inc = p.includes && p.includes.length ? '<ul class="list list--yes">' + p.includes.map(function (x) { return '<li>' + icon('check') + esc(x) + '</li>'; }).join('') + '</ul>' : '<p>Inclusions are confirmed with your quote.</p>';
    var exc = p.excludes && p.excludes.length ? '<ul class="list list--no">' + p.excludes.map(function (x) { return '<li>' + icon('x') + esc(x) + '</li>'; }).join('') + '</ul>' : '<p>Exclusions are confirmed with your quote.</p>';
    openModal(
      '<span class="badge">' + esc(p.category) + '</span>' +
      '<h2 id="modalTitle">' + esc(p.name) + '</h2>' +
      '<p>' + esc(p.description) + '</p>' +
      '<dl class="summary">' +
        '<dt>Route</dt><dd>' + esc(p.route) + '</dd>' +
        '<dt>Duration</dt><dd>' + esc(p.duration) + '</dd>' +
        (isSet(p.distance) ? '<dt>Approx. distance</dt><dd>' + esc(p.distance) + '</dd>' : '') +
        '<dt>Price</dt><dd>' + (isSet(p.startingPrice) ? 'Starting from ' + money(p.startingPrice) : 'Get a quote') + '</dd>' +
        (isSet(p.extraCharges) ? '<dt>Extra km / hour</dt><dd>' + esc(p.extraCharges) + '</dd>' : (SETUP ? '<dt>Extra km / hour</dt><dd>' + ph('extra charges') + '</dd>' : '')) +
      '</dl>' +
      '<h3>Included</h3>' + inc + '<h3>Not included</h3>' + exc +
      '<p class="note small" style="margin-top:20px">' + icon('info') + 'Prices, availability and inclusions are confirmed at the time of booking.</p>' +
      '<div class="modal__actions"><button type="button" class="btn btn--gold" data-modal-book="' + esc(p.id) + '">Book This Package ' + icon('arrowRight') + '</button>' +
      '<a class="btn btn--ghost" target="_blank" rel="noopener" href="' + esc(waUrl('Hello ' + B.name + ', I would like details for the "' + p.name + '" package (' + p.route + ').')) + '">' + icon('whatsapp') + ' Ask on WhatsApp</a></div>'
    );
    $('[data-modal-book]', $('#modalBody')).addEventListener('click', function () { closeModal(); bookPackage(p.id); });
  }

  /* ---------------- services ---------------- */
  function renderServices() {
    var grid = $('#servicesGrid'); if (!grid || !C.services) return;
    grid.innerHTML = C.services.map(function (s, i) {
      return '<article class="svc reveal' + (s.highlight ? ' svc--highlight' : '') + '" style="--i:' + (i % 4) + '">' +
        (s.highlight ? '<span class="badge svc__badge">Wedding special</span>' : '') +
        '<span class="svc__icon">' + icon(s.icon) + '</span>' +
        '<h3>' + esc(s.title) + '</h3>' + (s.subtitle ? '<p class="svc__sub" lang="hi">' + esc(s.subtitle) + '</p>' : '') +
        '<p class="svc__text">' + esc(s.text) + '</p>' +
        (s.tags && s.tags.length ? '<ul class="svc__tags">' + s.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        '<button type="button" class="svc__btn" data-svc="' + i + '">Enquire now ' + icon('arrowRight') + '</button></article>';
    }).join('');
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-svc]'); if (!b) return;
      var s = C.services[+b.getAttribute('data-svc')];
      $('#bf-package').value = s.title;
      $('#bf-package-name').textContent = s.title;
      $('#bf-package-chip').hidden = false;
      setTripType(s.tripType);
      goToBooking();
      toast('“' + s.title + '” added to your enquiry');
    });
  }

  function bookPackage(id) {
    var p = findPkg(id); if (!p) return;
    $('#bf-package').value = p.name + ' — ' + p.route;
    $('#bf-package-name').textContent = p.name;
    $('#bf-package-chip').hidden = false;
    setTripType(p.tripType);
    if (p.destination && p.destination !== 'Custom' && !$('#bf-destination').value) $('#bf-destination').value = p.destination;
    goToBooking();
    toast('“' + p.name + '” added to your booking enquiry');
  }

  /* ---------------- modal ---------------- */
  var modal, lastFocus;
  function openModal(html) {
    lastFocus = document.activeElement;
    $('#modalBody').innerHTML = html;
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    var f = $('#modalBody .btn, #modalBody a'); if (f) f.focus();
  }
  function closeModal() { if (modal.open) { modal.close ? modal.close() : modal.removeAttribute('open'); } }
  function initModal() {
    modal = $('#modal');
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
    modal.addEventListener('close', function () { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
    document.addEventListener('click', function (e) {
      var l = e.target.closest('[data-legal]'); if (!l) return;
      var k = l.getAttribute('data-legal');
      var titles = { privacy: 'Privacy Policy', terms: 'Terms & Conditions', cancellation: 'Cancellation Policy' };
      openModal('<h2 id="modalTitle">' + titles[k] + '</h2>' + (C.legal[k] || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
        '<p class="small" style="margin-top:20px">Questions? Contact us at <a class="link" href="mailto:' + esc(B.email) + '">' + esc(B.email) + '</a> or ' + esc(B.phoneDisplay) + '.</p>');
    });
  }

  /* ---------------- booking form ---------------- */
  var currentType = 'Round Trip';
  function setTripType(t) {
    if (!TRIP_TYPES.some(function (x) { return x.id === t; })) t = 'Round Trip';
    currentType = t;
    $$('#bf-tripTypes button').forEach(function (b) {
      var on = b.getAttribute('data-type') === t;
      b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1;
    });
    $$('#bookingForm .cond').forEach(function (f) {
      var show = f.getAttribute('data-show').split(',').indexOf(t) > -1;
      f.hidden = !show;
      if (!show) clearError(f.querySelector('input,select,textarea'));
    });
    $('.req-dest').hidden = t === 'Local';
  }

  function goToBooking() {
    scrollToEl($('#book'));
    setTimeout(function () {
      var first = $$('#bookingForm input:not([type=hidden]), #bookingForm select').filter(function (el) {
        return !el.closest('[hidden]') && !el.value && el.required;
      })[0] || $('#bf-pickup');
      first.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 650);
  }

  function setError(el, msg) {
    if (!el) return;
    var wrap = el.closest('.field'), id = el.id + '-err', e = document.getElementById(id);
    if (!e) { e = document.createElement('span'); e.className = 'field-error'; e.id = id; wrap.appendChild(e); }
    e.textContent = msg; el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', id);
  }
  function clearError(el) {
    if (!el) return;
    var e = document.getElementById(el.id + '-err'); if (e) e.remove();
    el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby');
  }

  function initBooking() {
    var form = $('#bookingForm');
    var seg = $('#bf-tripTypes');
    seg.innerHTML = TRIP_TYPES.map(function (t) {
      return '<button type="button" role="radio" data-type="' + t.id + '" aria-checked="false">' + icon(t.icon) + t.id + '</button>';
    }).join('');
    seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setTripType(b.getAttribute('data-type')); });
    seg.addEventListener('keydown', function (e) {
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(e.key) < 0) return;
      e.preventDefault();
      var i = TRIP_TYPES.findIndex(function (t) { return t.id === currentType; });
      i = (i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + TRIP_TYPES.length) % TRIP_TYPES.length;
      setTripType(TRIP_TYPES[i].id); $('#bf-tripTypes button[data-type="' + TRIP_TYPES[i].id + '"]').focus();
    });
    setTripType('Round Trip');

    var today = todayStr();
    $('#bf-date').min = today; $('#bf-return').min = today; $('#qf-date').min = today;
    $('#bf-date').addEventListener('change', function () { $('#bf-return').min = this.value || today; });

    if (C.vehicle.maxPassengers) $('#bf-passengers').max = C.vehicle.maxPassengers;

    $('#bf-package-clear').addEventListener('click', function () { $('#bf-package').value = ''; $('#bf-package-chip').hidden = true; });
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid')) clearError(e.target); });
    form.addEventListener('change', function (e) { if (e.target.getAttribute('aria-invalid')) clearError(e.target); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('#bf-status'); status.textContent = ''; status.className = 'form-status';
      var errors = validateBooking();
      if (errors.length) {
        status.textContent = 'Please correct the highlighted field' + (errors.length > 1 ? 's' : '') + '.';
        status.classList.add('is-error');
        errors[0].focus();
        return;
      }
      var data = collectBooking();
      var msg = bookingMessage(data);
      var btn = $('#bf-submit'); btn.classList.add('is-loading');
      openWa(msg); // opened synchronously so pop-up blockers allow it
      status.textContent = 'Enquiry submitted successfully.';
      status.classList.add('is-success');
      showSummary(data, msg);
      var fields = {};
      data.forEach(function (r) { fields[r[0]] = r[1]; });
      sendEmail($('#bookingForm'), 'New booking enquiry — ' + (fields.Name || '') + ' (' + currentType + ')', fields)
        .then(function () { emailState('ok'); }, function () { emailState('fail'); })
        .then(function () { btn.classList.remove('is-loading'); });
    });
  }

  function validateBooking() {
    var errs = [];
    function req(id, msg) { var el = $(id); clearError(el); if (!el.value.trim()) { setError(el, msg); errs.push(el); return false; } return true; }
    req('#bf-pickup', 'Please enter a pickup location.');
    if (currentType !== 'Local') req('#bf-destination', 'Please enter your destination.'); else clearError($('#bf-destination'));
    var today = todayStr();
    if (req('#bf-date', 'Please choose a pickup date.') && $('#bf-date').value < today) { setError($('#bf-date'), 'Pickup date cannot be in the past.'); errs.push($('#bf-date')); }
    if (req('#bf-time', 'Please choose a pickup time.') && $('#bf-date').value === today) {
      var now = new Date(), hm = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
      if ($('#bf-time').value < hm) { setError($('#bf-time'), 'This time has already passed today.'); errs.push($('#bf-time')); }
    }
    if (!$('#bf-return').closest('.cond').hidden) {
      if (req('#bf-return', 'Please choose a return date.') && $('#bf-return').value < $('#bf-date').value) {
        setError($('#bf-return'), 'Return date must be on or after the pickup date.'); errs.push($('#bf-return'));
      }
    }
    var pax = $('#bf-passengers'); clearError(pax);
    var n = parseInt(pax.value, 10), max = parseInt(pax.max, 10) || 20;
    if (!n || n < 1) { setError(pax, 'Please enter the number of passengers.'); errs.push(pax); }
    else if (n > max) { setError(pax, 'Our car seats up to ' + max + ' passengers. Contact us for larger groups.'); errs.push(pax); }
    req('#bf-name', 'Please enter your name.');
    var mob = $('#bf-mobile');
    if (req('#bf-mobile', 'Please enter your mobile number.') && !validMobile(mob.value)) { setError(mob, 'Enter a valid 10-digit Indian mobile number.'); errs.push(mob); }
    // keep DOM order for focus
    return errs.sort(function (a, b) { return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
  }

  function collectBooking() {
    function v(id) { return $(id).value.trim(); }
    var d = [
      ['Trip type', currentType],
      ['Service', v('#bf-package')],
      ['Pickup', v('#bf-pickup')],
      ['Destination', v('#bf-destination') || (currentType === 'Local' ? 'Local sightseeing' : '')],
      ['Pickup date', fmtDate(v('#bf-date'))],
      ['Pickup time', fmtTime(v('#bf-time'))]
    ];
    var show = function (id) { return !$(id).closest('.cond').hidden; };
    if (show('#bf-return')) d.push(['Return date', fmtDate(v('#bf-return'))]);
    if (show('#bf-hours')) d.push(['Hours required', v('#bf-hours')]);
    if (show('#bf-airportDir')) d.push(['Transfer', v('#bf-airportDir')]);
    if (show('#bf-flight')) d.push(['Flight / train no.', v('#bf-flight')]);
    if (show('#bf-stops')) d.push(['Places to cover', v('#bf-stops')]);
    d.push(['Passengers', v('#bf-passengers')], ['Luggage', v('#bf-luggage')], ['Name', v('#bf-name')], ['Mobile', normaliseMobile(v('#bf-mobile'))], ['Requirements', v('#bf-notes')]);
    return d.filter(function (r) { return isSet(r[1]); });
  }

  function bookingMessage(data) {
    return '*New Booking Enquiry — ' + B.name + '*\n\n' +
      data.map(function (r) { return '• *' + r[0] + ':* ' + r[1]; }).join('\n') +
      '\n\nPlease confirm availability and the final fare. Thank you!';
  }

  function showSummary(data, msg) {
    openModal(
      '<div class="success-icon">' + icon('check') + '</div>' +
      '<h2 id="modalTitle">Enquiry submitted successfully!</h2>' +
      '<p>Thank you! WhatsApp should have opened with your details — press <strong>Send</strong> there to reach us instantly.</p>' +
      '<p class="email-state" id="emailState">' + icon('mail') + '<span>Sending a copy to our email…</span></p>' +
      '<dl class="summary">' + data.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' +
      '<p class="note small" style="margin-top:16px">' + icon('info') + 'This is a booking enquiry, not a confirmed reservation. We will confirm availability and the final price with you.</p>' +
      '<div class="modal__actions"><a class="btn btn--gold" target="_blank" rel="noopener" href="' + esc(waUrl(msg)) + '">' + icon('whatsapp') + ' Open WhatsApp</a>' +
      '<a class="btn btn--ghost" href="tel:' + esc(B.phone) + '">' + icon('phone') + ' Call instead</a>' +
      '<button type="button" class="btn btn--ghost" data-close>Edit details</button></div>'
    );
  }

  function emailState(s) {
    var el = $('#emailState'); if (!el) return;
    el.className = 'email-state is-' + s;
    el.querySelector('span').textContent = s === 'ok'
      ? 'Your enquiry has also been sent to our email. We will contact you soon.'
      : 'Email copy could not be sent — please make sure you press Send in WhatsApp, or call us.';
  }

  function initQuickForm() {
    $('#quickForm').addEventListener('submit', function (e) {
      e.preventDefault();
      setTripType($('#qf-type').value);
      if ($('#qf-pickup').value) $('#bf-pickup').value = $('#qf-pickup').value;
      if ($('#qf-dest').value) $('#bf-destination').value = $('#qf-dest').value;
      if ($('#qf-date').value) $('#bf-date').value = $('#qf-date').value;
      goToBooking();
    });
  }

  /* ---------------- fare estimator ---------------- */
  function activeRates() {
    var P = C.pricing;
    if (isSet(P.perKm)) return { rates: P, sample: false };
    if (SETUP && P.sample) return { rates: P.sample, sample: true };
    return null;
  }

  var lastEstimate = null;
  function calcEstimate() {
    var ar = activeRates();
    var type = $('#es-type').value;
    $('#es-days-wrap').hidden = type !== 'round';
    var out = $('#es-output');
    if (!ar) {
      $('#es-sample').hidden = true; lastEstimate = null;
      out.innerHTML = '<p class="est-empty">Online rates are being finalised. Share your route and we\'ll send you an exact quote on WhatsApp.</p>';
      return;
    }
    var R = ar.rates;
    $('#es-sample').hidden = !ar.sample;
    var km = num($('#es-km').value), days = type === 'round' ? Math.max(1, Math.round(num($('#es-days').value, 1))) : 1;
    if (!km) {
      lastEstimate = null;
      out.innerHTML = '<p class="est-empty">Enter your estimated total kilometres to see a fare breakdown.</p>';
      return;
    }
    var rate = R.perKm, minKm = 0, minLabel = '';
    if (type === 'oneway') { rate = isSet(R.oneWayPerKm) ? R.oneWayPerKm : R.perKm; minKm = num(R.oneWayMinKm); minLabel = 'Minimum ' + minKm + ' km for one-way trips'; }
    else if (type === 'local') { minKm = num(R.localMinKm); minLabel = 'Minimum ' + minKm + ' km for local trips'; }
    else { minKm = num(R.minKmPerDay) * days; minLabel = 'Minimum ' + num(R.minKmPerDay) + ' km/day × ' + days + ' day' + (days > 1 ? 's' : ''); }
    var chargeKm = Math.max(km, minKm);
    var rows = [];
    rows.push(['Distance fare', chargeKm + ' km × ' + money(rate) + (chargeKm > km ? ' · ' + minLabel : ''), chargeKm * rate]);
    if ($('#es-driver').checked && isSet(R.driverAllowancePerDay) && type !== 'local') rows.push(['Driver allowance', days + ' day' + (days > 1 ? 's' : '') + ' × ' + money(R.driverAllowancePerDay), days * R.driverAllowancePerDay]);
    var stops = Math.round(num($('#es-stops').value));
    if (stops && isSet(R.perStopCharge)) rows.push(['Additional stops', stops + ' × ' + money(R.perStopCharge), stops * R.perStopCharge]);
    var hrs = num($('#es-hours').value);
    if (hrs && isSet(R.extraHourRate)) rows.push(['Extra hours', hrs + ' hr × ' + money(R.extraHourRate), hrs * R.extraHourRate]);
    var tolls = num($('#es-tolls').value);
    if (tolls) rows.push(['Tolls & parking', 'As entered by you', tolls]);
    var total = rows.reduce(function (s, r) { return s + r[2]; }, 0);
    lastEstimate = { rows: rows, total: total, km: km, days: days, sample: ar.sample };
    out.innerHTML = '<div class="breakdown">' + rows.map(function (r) {
      return '<div class="breakdown__row"><span>' + esc(r[0]) + '<small>' + esc(r[1]) + '</small></span><span>' + money(r[2]) + '</span></div>';
    }).join('') + '<div class="breakdown__total"><span>Estimated total</span><span class="total-num">' + money(total) + '</span></div></div>' +
    (ar.sample ? '<p class="ph" style="margin-top:12px">Preview with SAMPLE rates — set your real rates in config.js → pricing</p>' : '');
  }

  function estimateText() {
    var typeLabel = $('#es-type').selectedOptions[0].textContent;
    var t = 'Hello ' + B.name + ', I would like an exact quote.\n\n' +
      '• *Trip type:* ' + typeLabel + '\n' +
      ($('#es-pickup').value ? '• *Pickup:* ' + $('#es-pickup').value + '\n' : '') +
      ($('#es-dest').value ? '• *Destination:* ' + $('#es-dest').value + '\n' : '') +
      ($('#es-km').value ? '• *Estimated km:* ' + $('#es-km').value + '\n' : '') +
      ($('#es-type').value === 'round' ? '• *Days:* ' + ($('#es-days').value || 1) + '\n' : '') +
      (+$('#es-stops').value ? '• *Additional stops:* ' + $('#es-stops').value + '\n' : '') +
      (+$('#es-hours').value ? '• *Extra hours:* ' + $('#es-hours').value + '\n' : '');
    if (lastEstimate && !lastEstimate.sample) t += '• *Website estimate:* ' + money(lastEstimate.total) + '\n';
    return t + '\nPlease confirm the final fare and availability.';
  }

  function initEstimator() {
    if (!$('#estForm')) return; // Fare Estimator section removed from the page
    $('#estForm').addEventListener('input', calcEstimate);
    $('#estForm').addEventListener('change', calcEstimate);
    $('#estForm').addEventListener('submit', function (e) { e.preventDefault(); });
    $('#es-wa').addEventListener('click', function () { openWa(estimateText()); });
    $('#es-book').addEventListener('click', function () {
      var map = { round: 'Round Trip', oneway: 'One-Way', local: 'Local' };
      setTripType(map[$('#es-type').value]);
      if ($('#es-pickup').value) $('#bf-pickup').value = $('#es-pickup').value;
      if ($('#es-dest').value) $('#bf-destination').value = $('#es-dest').value;
      var extra = [];
      if ($('#es-km').value) extra.push('Estimated distance: ' + $('#es-km').value + ' km');
      if (lastEstimate && !lastEstimate.sample) extra.push('Website estimate: ' + money(lastEstimate.total));
      if (+$('#es-stops').value) extra.push('Additional stops: ' + $('#es-stops').value);
      if (extra.length) { var n = $('#bf-notes'); n.value = (n.value ? n.value + '\n' : '') + extra.join(' · '); }
      goToBooking();
      toast('Estimate details copied to the booking form');
    });
    calcEstimate();
  }

  /* ---------------- destinations ---------------- */
  function renderDestinations() {
    $('#destGrid').innerHTML = C.destinations.map(function (d, i) {
      return '<article class="dest reveal" style="--i:' + (i % 3) + '">' +
        '<div class="dest__media">' + media(d.image, d.alt || d.name + ' — travel destination', d.icon, '') + '</div>' +
        (d.image && d.credit ? '<a class="dest__credit" href="' + esc(d.credit.url) + '" target="_blank" rel="noopener">Photo: ' + esc(d.credit.by) + ' · ' + esc(d.credit.license) + '</a>' : '') +
        '<div class="dest__body"><h3>' + esc(d.name) + '</h3><p>' + esc(d.description) + '</p>' +
        '<div class="dest__meta">' + (isSet(d.suggested) ? '<span>' + icon('clock') + 'Suggested: ' + esc(d.suggested) + '</span>' : '') +
        (isSet(d.startingPrice) ? '<span>' + icon('rupee') + 'From ' + money(d.startingPrice) + '</span>' : '') + '</div>' +
        '<button type="button" class="btn btn--glass btn--sm" data-plan="' + i + '">Plan This Trip ' + icon('arrowRight') + '</button></div></article>';
    }).join('');
    $('#destGrid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-plan]'); if (!b) return;
      var d = C.destinations[+b.getAttribute('data-plan')];
      $('#bf-destination').value = d.name;
      setTripType(d.tripType || 'Round Trip');
      goToBooking();
      toast('Destination set to ' + d.name);
    });
  }

  /* ---------------- gallery + lightbox ---------------- */
  var lbIndex = 0;
  function renderGallery() {
    // Placeholders only show in setup mode; the live site shows real photos only
    // and hides the whole Gallery section until at least 2 photos are added.
    var G = SETUP ? C.gallery : C.gallery.filter(function (g) { return g.src; });
    if (G.length < 2 && !SETUP) {
      $('#gallery').hidden = true;
      $$('a[href="#gallery"]').forEach(function (a) { a.hidden = true; });
      return;
    }
    $('#galleryGrid').innerHTML = G.map(function (g, i) {
      return '<button type="button" class="gallery__item reveal' + (g.cutout ? ' stage' : '') + '" style="--i:' + (i % 4) + '" data-lb="' + i + '" aria-label="Open image: ' + esc(g.label) + '">' +
        media(g.src, g.alt, i === 0 ? 'car' : 'image', g.src ? '' : g.label) +
        (g.src ? '<figcaption>' + esc(g.label) + '</figcaption>' : '') + '</button>';
    }).join('');

    var lb = $('#lightbox');
    function show(i) {
      lbIndex = (i + G.length) % G.length;
      var g = G[lbIndex];
      $('#lbMedia').className = g.cutout ? 'stage' : '';
      $('#lbMedia').innerHTML = g.src ? '<img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '">' : media(null, g.alt, 'image', g.label);
      $('#lbCap').textContent = g.label + '  ·  ' + (lbIndex + 1) + ' / ' + G.length;
    }
    $('#galleryGrid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-lb]'); if (!b) return;
      lastFocus = b; show(+b.getAttribute('data-lb'));
      if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
    });
    $('.lightbox__prev').addEventListener('click', function () { show(lbIndex - 1); });
    $('.lightbox__next').addEventListener('click', function () { show(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('[data-close]')) lb.close(); });
    lb.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(lbIndex - 1);
      if (e.key === 'ArrowRight') show(lbIndex + 1);
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(lbIndex + (dx < 0 ? 1 : -1)); sx = null;
    });
  }

  /* ---------------- reviews ---------------- */
  function renderReviews() {
    var preview = /[?&]preview\b/.test(location.search);
    var R = (C.reviews || []).filter(function (r) { return r.text && (r.approved || preview || SETUP); });
    var html;
    var links = (B.googleBusinessUrl ? '<a class="btn btn--ghost" target="_blank" rel="noopener" href="' + esc(B.googleBusinessUrl) + '">' + icon('external') + ' View us on Google</a>' : '') +
      (B.googleReviewUrl ? '<a class="btn btn--gold" target="_blank" rel="noopener" href="' + esc(B.googleReviewUrl) + '">' + icon('star') + ' Write a Google Review</a>' : '');
    if (R.length) {
      html = '<div class="swiper reveal" role="region" aria-roledescription="carousel" aria-label="Customer reviews">' +
        '<div class="swiper__track" id="revTrack" tabindex="0">' + R.map(function (r, i) {
          var stars = '';
          for (var s = 0; s < 5; s++) stars += s < (r.rating || 0) ? icon('star') : '';
          var initials = r.name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
          return '<article class="review" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + R.length + '">' +
            (r.approved ? '' : '<span class="badge badge--amber review__draft">Draft – not live</span>') +
            '<span class="review__mark" aria-hidden="true">“</span>' +
            (r.rating ? '<div class="review__stars" aria-label="' + r.rating + ' out of 5 stars">' + stars + '</div>' : '') +
            '<blockquote>' + esc(r.text) + '</blockquote>' +
            '<footer><span class="review__avatar" aria-hidden="true">' + esc(initials) + '</span><span><strong>' + esc(r.name) + '</strong>' +
            '<small>' + esc(r.trip ? r.trip + (r.place ? ' · ' + r.place : '') : 'Happy traveller') + '</small>' + '</span></footer></article>';
        }).join('') + '</div>' +
        '<div class="swiper__nav"><button type="button" class="swiper__btn" data-dir="-1" aria-label="Previous review">' + icon('chevronLeft') + '</button>' +
        '<div class="swiper__dots" id="revDots"></div>' +
        '<button type="button" class="swiper__btn" data-dir="1" aria-label="Next review">' + icon('chevronRight') + '</button></div></div>' +
        (links ? '<div class="reviews__links">' + links + '</div>' : '');
    } else {
      html = '<div class="reviews-empty glass reveal">' + icon('heart') +
        '<h3>We\'re just getting started</h3><p>Our brand-new car is ready for its first journeys. Travel with us and be among the first to share your experience.</p>' +
        (links ? '<div class="reviews__links" style="margin-top:6px">' + links + '</div>' : '') + '</div>';
    }
    $('#reviewsWrap').innerHTML = html;
    if (R.length) initSwiper();
  }

  function initSwiper() {
    var track = $('#revTrack'), dotsBox = $('#revDots'), slides = $$('.review', track);
    function perView() { return Math.max(1, Math.round(track.clientWidth / slides[0].getBoundingClientRect().width)); }
    function pages() { return Math.max(1, slides.length - perView() + 1); }
    function current() { return Math.round(track.scrollLeft / (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : 1)); }
    function go(i) {
      var n = pages(); i = (i + n) % n;
      track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    function drawDots() {
      var n = pages(), c = Math.min(current(), n - 1), out = '';
      for (var i = 0; i < n; i++) out += '<button type="button" aria-label="Go to review ' + (i + 1) + '"' + (i === c ? ' aria-current="true"' : '') + ' data-i="' + i + '"></button>';
      dotsBox.innerHTML = out;
    }
    $$('.swiper__btn').forEach(function (b) { b.addEventListener('click', function () { go(current() + (+b.getAttribute('data-dir'))); }); });
    dotsBox.addEventListener('click', function (e) { var d = e.target.closest('[data-i]'); if (d) go(+d.getAttribute('data-i')); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
    });
    var t; track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(drawDots, 80); }, { passive: true });
    window.addEventListener('resize', drawDots);
    drawDots();
    // autoplay; pauses while hovered, focused or off-screen
    if (reduceMotion) return;
    var paused = false, visible = false, box = track.parentNode;
    ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { box.addEventListener(ev, function () { paused = true; }, { passive: true }); });
    ['mouseleave', 'focusout'].forEach(function (ev) { box.addEventListener(ev, function () { paused = false; }); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(box);
    setInterval(function () { if (!paused && visible && !document.hidden) go(current() + 1); }, 4500);
  }

  function initReviewForm() {
    var form = $('#reviewForm'); if (!form) return;
    form.addEventListener('input', function (e) { clearError(e.target); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var st = $('#rf-status'); st.className = 'form-status'; st.textContent = '';
      var name = $('#rf-name'), text = $('#rf-text'), rating = $('input[name=rating]:checked', form), errs = [];
      [name, text].forEach(clearError);
      if (!name.value.trim()) { setError(name, 'Please enter your name.'); errs.push(name); }
      if (!text.value.trim()) { setError(text, 'Please write your review.'); errs.push(text); }
      if (!rating) { st.textContent = 'Please choose a star rating.'; st.classList.add('is-error'); $('#rf-r5').focus(); return; }
      if (errs.length) { st.textContent = 'Please fill in the highlighted fields.'; st.classList.add('is-error'); errs[0].focus(); return; }
      var stars = new Array(+rating.value + 1).join('⭐');
      var rBtn = $('#rf-submit'), review = { Name: name.value.trim(), Rating: rating.value + ' / 5', Trip: $('#rf-trip').value.trim(), Review: text.value.trim() };
      openWa('*New Customer Review — ' + B.name + '*\n\n' +
        '• *Name:* ' + name.value.trim() + '\n' +
        '• *Rating:* ' + stars + ' (' + rating.value + '/5)\n' +
        ($('#rf-trip').value.trim() ? '• *Trip:* ' + $('#rf-trip').value.trim() + '\n' : '') +
        '• *Review:* ' + text.value.trim() + '\n\nI am happy for this review to be shown on your website.');
      setLoading(rBtn, true);
      sendEmail(form, 'New website review — ' + review.Name + ' (' + review.Rating + ')', review)
        .then(function () { return true; }, function () { return false; })
        .then(function (mailed) {
          setLoading(rBtn, false);
          form.reset();
          st.textContent = 'Review submitted successfully. Thank you!'; st.classList.add('is-success');
          successPopup('Thank you for your review!',
            mailed ? 'Your review has been sent to us successfully. It will appear on our website soon.'
                   : 'WhatsApp has opened with your review — please press <strong>Send</strong> there so it reaches us.');
        });
    });
  }

  /* ---------------- FAQ ---------------- */
  function renderFaq() {
    var lang = 'en';
    try { lang = localStorage.getItem('eka-faq-lang') || 'en'; } catch (e) {}
    function draw(l) {
      lang = ['en', 'mr', 'hi'].indexOf(l) > -1 ? l : 'en';
      var t = (C.faqTitle && C.faqTitle[lang]) || ['Frequently asked', 'questions'];
      $('#faq-title').innerHTML = esc(t[0]) + ' <span class="gold-text">' + esc(t[1]) + '</span>';
      $('#faq-title').setAttribute('lang', lang);
      $('#faqList').setAttribute('lang', lang);
      $$('#faqLang button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang); });
      $('#faqList').innerHTML = C.faqs.map(function (f, i) {
        var tr = lang !== 'en' && f[lang] ? f[lang] : f;
        return '<div class="faq__item"><h3><button type="button" class="faq__q" aria-expanded="false" aria-controls="faq-a-' + i + '" id="faq-q-' + i + '">' +
          '<span>' + esc(tr.q) + '</span>' + icon('chevronDown') + '</button></h3>' +
          '<div class="faq__a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '"><div><p>' + esc(tr.a) + '</p></div></div></div>';
      }).join('');
    }
    draw(lang);
    $('#faqLang').addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]'); if (!b) return;
      draw(b.getAttribute('data-lang'));
      try { localStorage.setItem('eka-faq-lang', lang); } catch (err) {}
    });
    $('#faqList').addEventListener('click', function (e) {
      var q = e.target.closest('.faq__q'); if (!q) return;
      var item = q.closest('.faq__item'), open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open); q.setAttribute('aria-expanded', open);
    });
  }

  /* ---------------- contact ---------------- */
  function renderContactExtras() {
    var map = $('#mapBox');
    if (B.mapEmbedUrl) map.innerHTML = '<iframe src="' + esc(B.mapEmbedUrl) + '" title="Map showing our location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
    else if (B.mapLinkUrl) map.innerHTML = '<a class="map__link" target="_blank" rel="noopener" href="' + esc(B.mapLinkUrl) + '"><span>' + icon('mapPin') + ' View ' + esc(B.city) + ' on Google Maps</span>' + icon('external') + '</a>';
    else map.hidden = true;
    var s = B.social || {};
    var cards = [
      { key: 'instagram', name: 'Instagram', sub: s.instagramHandle || 'Follow us', url: s.instagram, cta: 'Follow' },
      { key: 'google', name: 'Google Business', sub: B.googleBusinessUrl ? 'View our profile' : 'Coming soon', url: B.googleBusinessUrl, cta: 'View' }
    ].filter(Boolean);
    $('#socials').innerHTML =
      '<div class="social__head"><h3>Follow our journey</h3><p>Trip moments, happy travellers and travel updates — stay connected with us.</p></div>' +
      '<div class="social__grid">' + cards.map(function (c) {
        var inner = '<span class="social__icon social__icon--' + c.key + '">' + icon(c.key) + '</span>' +
          '<span class="social__text"><strong>' + c.name + '</strong><small>' + esc(c.sub) + '</small></span>';
        return c.url
          ? '<a class="social__card" href="' + esc(c.url) + '" target="_blank" rel="noopener" aria-label="' + c.name + ' — ' + esc(c.sub) + ' (opens in new tab)">' + inner + '<span class="social__cta">' + c.cta + ' ' + icon('arrowRight') + '</span></a>'
          : '<div class="social__card is-soon" aria-label="' + c.name + ' — coming soon">' + inner + '</div>';
      }).join('') + '</div>';
  }

  function initContact() {
    var form = $('#contactForm');
    form.addEventListener('input', function (e) { clearError(e.target); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var st = $('#cf-status'); st.className = 'form-status'; st.textContent = '';
      var name = $('#cf-name'), mob = $('#cf-mobile'), msg = $('#cf-msg'), errs = [];
      [name, mob, msg].forEach(clearError);
      if (!name.value.trim()) { setError(name, 'Please enter your name.'); errs.push(name); }
      if (!mob.value.trim()) { setError(mob, 'Please enter your mobile number.'); errs.push(mob); }
      else if (!validMobile(mob.value)) { setError(mob, 'Enter a valid 10-digit Indian mobile number.'); errs.push(mob); }
      if (!msg.value.trim()) { setError(msg, 'Please write a short message.'); errs.push(msg); }
      if (errs.length) { st.textContent = 'Please fill in the highlighted fields.'; st.classList.add('is-error'); errs[0].focus(); return; }
      var email = $('#cf-email');
      clearError(email);
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, 'Please enter a valid email or leave it empty.'); email.focus(); return; }
      var fields = { Name: name.value.trim(), Mobile: normaliseMobile(mob.value), Email: email.value.trim(), Message: msg.value.trim() };
      if (fields.Email) fields._replyto = fields.Email;
      var btn = $('#cf-submit'); setLoading(btn, true);
      st.textContent = 'Sending your message…';
      sendEmail(form, 'New website message — ' + fields.Name, fields).then(function () {
        setLoading(btn, false); form.reset();
        st.textContent = 'Message sent successfully!'; st.classList.add('is-success');
        successPopup('Message sent successfully!', 'Thank you, ' + esc(fields.Name) + '. We have received your message and will contact you on <strong>' + esc(fields.Mobile) + '</strong> soon.');
      }, function () {
        setLoading(btn, false);
        st.textContent = 'Sorry, the message could not be sent right now.'; st.classList.add('is-error');
        var text = '*Website enquiry — ' + B.name + '*\n\nName: ' + fields.Name + '\nMobile: ' + fields.Mobile + (fields.Email ? '\nEmail: ' + fields.Email : '') + '\n\n' + fields.Message;
        openModal('<h2 id="modalTitle">Message not sent</h2><p>Something went wrong while sending. Please send it on WhatsApp or by email instead — your text is ready.</p>' +
          '<div class="modal__actions"><a class="btn btn--gold" target="_blank" rel="noopener" href="' + esc(waUrl(text)) + '">' + icon('whatsapp') + ' Send on WhatsApp</a>' +
          '<a class="btn btn--ghost" href="mailto:' + esc(B.email) + '?subject=' + encodeURIComponent('Website enquiry — ' + fields.Name) + '&body=' + encodeURIComponent(text.replace(/\*/g, '')) + '">' + icon('mail') + ' Send by email</a></div>');
      });
    });
  }

  /* ---------------- analytics consent ---------------- */
  function initConsent() {
    var id = C.analytics && C.analytics.gaMeasurementId;
    if (!id) return;
    var key = 'eka-consent', val = null;
    try { val = localStorage.getItem(key); } catch (e) {}
    function loadGA() {
      var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', id, { anonymize_ip: true });
    }
    if (val === 'yes') { loadGA(); return; }
    if (val === 'no') return;
    var box = $('#consent'); box.hidden = false;
    $('#consentYes').addEventListener('click', function () { try { localStorage.setItem(key, 'yes'); } catch (e) {} box.hidden = true; loadGA(); });
    $('#consentNo').addEventListener('click', function () { try { localStorage.setItem(key, 'no'); } catch (e) {} box.hidden = true; });
  }

  /* ---------------- boot ---------------- */
  function boot() {
    initIntro();
    bindBrand();
    renderHero();
    renderCar();
    renderAmenities();
    renderPackages();
    renderServices();
    renderDestinations();
    renderGallery();
    renderReviews();
    renderFaq();
    renderContactExtras();
    hydrateIcons(document);
    initNav();
    initModal();
    initBooking();
    initQuickForm();
    initEstimator();
    initContact();
    initReviewForm();
    initConsent();
    initReveal();
    if (SETUP) console.info('[Ekadantaya] setupMode is ON — amber [Add …] hints and sample fare rates are visible. Set setupMode:false in config.js before launch.');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
