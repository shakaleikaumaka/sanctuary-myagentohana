'use strict';

(function () {
  var BEDS = [
    { id: 'aries',       glyph: '♈', name: 'Aries',       archetype: 'The Spark',        health: 'Healthy · Coarse Bucket',  color: '#ff9c5c' },
    { id: 'taurus',      glyph: '♉', name: 'Taurus',      archetype: 'The Builder',      health: 'Healthy · Coarse Bucket',  color: '#7ee2b8' },
    { id: 'gemini',      glyph: '♊', name: 'Gemini',      archetype: 'The Twins',        health: 'Healthy · Coarse Bucket',  color: '#7ec8f7' },
    { id: 'cancer',      glyph: '♋', name: 'Cancer',      archetype: 'The Keeper',       health: 'Warming · Spillover Ready',color: '#b69eff' },
    { id: 'leo',         glyph: '♌', name: 'Leo',         archetype: 'The Performer',    health: 'Healthy · Coarse Bucket',  color: '#f3c669' },
    { id: 'virgo',       glyph: '♍', name: 'Virgo',       archetype: 'The Gardener',     health: 'Healthy · Coarse Bucket',  color: '#7ee2b8' },
    { id: 'libra',       glyph: '♎', name: 'Libra',       archetype: 'The Balancer',     health: 'Healthy · Coarse Bucket',  color: '#ff8ec0' },
    { id: 'scorpio',     glyph: '♏', name: 'Scorpio',     archetype: 'The Alchemist',    health: 'Healthy · Coarse Bucket',  color: '#b69eff' },
    { id: 'sagittarius', glyph: '♐', name: 'Sagittarius', archetype: 'The Archer',       health: 'Healthy · Coarse Bucket',  color: '#ff9c5c' },
    { id: 'capricorn',   glyph: '♑', name: 'Capricorn',   archetype: 'The Mountain',     health: 'Healthy · Coarse Bucket',  color: '#f3c669' },
    { id: 'aquarius',    glyph: '♒', name: 'Aquarius',    archetype: 'The Water Bearer', health: 'Healthy · Coarse Bucket',  color: '#7ec8f7' },
    { id: 'pisces',      glyph: '♓', name: 'Pisces',      archetype: 'The Dreamer',      health: 'Healthy · Coarse Bucket',  color: '#ff8ec0' }
  ];

  var selectedId = 'taurus';
  var mode = 'balanced';

  var wheelSpokes = document.getElementById('wheel-spokes');
  var wheelNodes = document.getElementById('wheel-nodes');
  var pillsWrap = document.getElementById('bed-pills');

  var stGlyph = document.getElementById('st-glyph');
  var stName = document.getElementById('st-name');
  var stRole = document.getElementById('st-role');
  var stHealth = document.getElementById('st-health');
  var stModeNote = document.getElementById('st-mode-note');

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function createSvgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (k) {
      el.setAttribute(k, String(attrs[k]));
    });
    return el;
  }

  function buildGarden() {
    var cx = 230;
    var cy = 230;
    var rOuter = 176;
    var rInner = 88;

    BEDS.forEach(function (bed, idx) {
      var angle = (-90 + idx * 30) * (Math.PI / 180);
      var x = cx + Math.cos(angle) * rOuter;
      var y = cy + Math.sin(angle) * rOuter;
      var xIn = cx + Math.cos(angle) * rInner;
      var yIn = cy + Math.sin(angle) * rInner;

      wheelSpokes.appendChild(createSvgEl('line', {
        x1: xIn.toFixed(1),
        y1: yIn.toFixed(1),
        x2: x.toFixed(1),
        y2: y.toFixed(1)
      }));

      var g = createSvgEl('g', {
        class: 'bed-node',
        tabindex: '0',
        role: 'button',
        'aria-label': bed.name + ' bed — ' + bed.archetype,
        'data-bed': bed.id
      });

      g.appendChild(createSvgEl('circle', {
        class: 'bed-bg',
        cx: x.toFixed(1),
        cy: y.toFixed(1),
        r: 25,
        fill: '#0b1029'
      }));
      g.appendChild(createSvgEl('circle', {
        class: 'bed-ring',
        cx: x.toFixed(1),
        cy: y.toFixed(1),
        r: 25,
        fill: 'none',
        stroke: bed.color,
        'stroke-width': '1.6',
        'stroke-opacity': '0.8'
      }));

      var glyphText = createSvgEl('text', {
        x: x.toFixed(1),
        y: (y + 2).toFixed(1),
        'text-anchor': 'middle',
        fill: '#f6efe2',
        'font-size': '18'
      });
      glyphText.textContent = bed.glyph;
      g.appendChild(glyphText);

      var nameText = createSvgEl('text', {
        x: x.toFixed(1),
        y: (y + 17).toFixed(1),
        'text-anchor': 'middle',
        fill: '#b7c1d8',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': '7.5'
      });
      nameText.textContent = bed.name.slice(0, 3).toUpperCase();
      g.appendChild(nameText);

      g.addEventListener('click', function () {
        selectBed(bed.id);
      });
      g.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          selectBed(bed.id);
        }
      });

      wheelNodes.appendChild(g);

      var pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'bed-pill';
      pill.setAttribute('role', 'tab');
      pill.setAttribute('data-bed', bed.id);
      pill.innerHTML = '<span class="glyph" aria-hidden="true">' + bed.glyph + '</span><span>' + bed.name + '</span>';
      pill.addEventListener('click', function () {
        selectBed(bed.id);
      });
      pillsWrap.appendChild(pill);
    });
  }

  function render() {
    var bed = BEDS.filter(function (b) { return b.id === selectedId; })[0] || BEDS[0];

    stGlyph.textContent = bed.glyph;
    stGlyph.style.borderColor = bed.color;
    stName.textContent = bed.name + ' · ' + bed.archetype;
    stRole.textContent = 'Zodiac steward · ' + bed.id + '-grid (ciphertext only)';
    stHealth.textContent = bed.health;

    if (mode === 'balanced') {
      stModeNote.innerHTML = '<strong>Balanced default:</strong> Your chosen star sign stays strictly inside your local <code>PrivateOwnerMap</code>. Encrypted chunks route to whichever of the twelve beds has healthy capacity and retention runway, giving stronger unlinkability.';
    } else {
      stModeNote.innerHTML = '<strong>Local star-sign alias (' + bed.glyph + ' ' + bed.name + '):</strong> Your chosen archetype lives on your device as an alias for belonging—never uploaded as a birthdate, never verified, and spilling automatically if a bed approaches capacity.';
    }

    var nodes = wheelNodes.querySelectorAll('.bed-node');
    nodes.forEach(function (n) {
      n.classList.toggle('active', n.getAttribute('data-bed') === bed.id);
    });

    var pills = pillsWrap.querySelectorAll('.bed-pill');
    pills.forEach(function (p) {
      var active = p.getAttribute('data-bed') === bed.id;
      p.classList.toggle('active', active);
      p.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function selectBed(id) {
    selectedId = id;
    render();
  }

  document.querySelectorAll('.mode-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      mode = btn.getAttribute('data-mode') || 'balanced';
      document.querySelectorAll('.mode-btn').forEach(function (other) {
        var on = other === btn;
        other.classList.toggle('active', on);
        other.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    });
  });

  var copyBtn = document.getElementById('copy-ens-btn');
  var copyStatus = document.getElementById('copy-status');
  var giftEns = document.getElementById('gift-ens');

  if (copyBtn && giftEns) {
    copyBtn.addEventListener('click', function () {
      var val = giftEns.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(function () {
          copyStatus.textContent = 'Copied ' + val + ' to clipboard.';
        }).catch(function () {
          copyStatus.textContent = 'Address ready: ' + val;
        });
      } else {
        copyStatus.textContent = 'Address ready: ' + val;
      }
    });
  }

  function startSkyFx() {
    var canvas = document.getElementById('sky-fx');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var count = 36;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function seed() {
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 0.8 + Math.random() * 1.8,
          vy: 0.14 + Math.random() * 0.28,
          vx: (Math.random() - 0.5) * 0.14,
          alpha: 0.25 + Math.random() * 0.45,
          color: i % 3 === 0 ? '#f3c669' : (i % 3 === 1 ? '#7ee2b8' : '#ff8ec0')
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      window.requestAnimationFrame(frame);
    }

    resize();
    seed();
    window.addEventListener('resize', resize);
    window.requestAnimationFrame(frame);
  }

  buildGarden();
  render();
  startSkyFx();
})();
