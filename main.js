import { QRCodeStyling, browserUtils } from 'https://cdn.jsdelivr.net/npm/@liquid-js/qr-code-styling@5.5.0/lib/qr-code-styling.js';
import BorderPlugin from 'https://cdn.jsdelivr.net/npm/@liquid-js/qr-code-styling@5.5.0/lib/border-plugin.js';

// Subset of Iconify icons offered in the icon picker. Add more here as needed —
// the dropdown and QR rendering both read from this list automatically.
var ICONS = [
  { key: 'join',     label: 'Join / Add Person', iconify: 'mdi:account-plus'          },
  { key: 'calendar', label: 'Calendar Sync',      iconify: 'hugeicons:calendar-sync'   },
  { key: 'link',     label: 'Link',               iconify: 'mdi:link-variant'         },
  { key: 'location', label: 'Location Pin',       iconify: 'mdi:map-marker'           },
  { key: 'info',     label: 'Info',               iconify: 'mdi:information-outline'  },
];

// Color schemes offered in the color scheme picker. "Navy & Gold" mirrors
// scout-cal's calendar QR defaults exactly (dots/corners/border colors, shape).
var COLOR_SCHEMES = [
  {
    key: 'navy-gold', label: 'Navy & Gold', shape: 'circle',
    dotsColor: '#003F87', dotsType: 'dots',
    backgroundColor: '#ffffff',
    cornersSquareColor: '#FFC72C', cornersSquareType: 'extra-rounded',
    cornersDotColor: '#003F87', cornersDotType: 'dot',
    borderColor: '#003F87', borderTextColor: '#FFC72C',
    iconColor: '#003F87',
  },
  {
    key: 'black-white', label: 'Classic Black & White', shape: 'square',
    dotsColor: '#000000', dotsType: 'square',
    backgroundColor: '#ffffff',
    cornersSquareColor: '#000000', cornersSquareType: 'square',
    cornersDotColor: '#000000', cornersDotType: 'square',
    borderColor: '#000000', borderTextColor: '#ffffff',
    iconColor: '#000000',
  },
  {
    key: 'forest-green', label: 'Forest Green', shape: 'circle',
    dotsColor: '#1B4332', dotsType: 'dots',
    backgroundColor: '#ffffff',
    cornersSquareColor: '#2D6A4F', cornersSquareType: 'extra-rounded',
    cornersDotColor: '#1B4332', cornersDotType: 'dot',
    borderColor: '#1B4332', borderTextColor: '#B7E4C7',
    iconColor: '#1B4332',
  },
  {
    key: 'scarlet-red', label: 'Scarlet Red', shape: 'circle',
    dotsColor: '#7A0C1E', dotsType: 'dots',
    backgroundColor: '#ffffff',
    cornersSquareColor: '#B22234', cornersSquareType: 'extra-rounded',
    cornersDotColor: '#7A0C1E', cornersDotType: 'dot',
    borderColor: '#7A0C1E', borderTextColor: '#FFD700',
    iconColor: '#7A0C1E',
  },
];

// Default QR codes the page starts with (first run only — after that, the
// user's own list in localStorage takes over, including any renames,
// additions, or removals). The Calendar entry presets to scout-cal's exact
// icon and color scheme defaults.
var DEFAULT_ENTRIES = [
  {
    id: 'join', label: 'Pack Join Link', url: '',
    icon: 'join', colorScheme: 'navy-gold',
    topText: '', bottomText: 'SCAN TO JOIN',
  },
  {
    id: 'calendar', label: 'Pack Calendar Link', url: '',
    icon: 'calendar', colorScheme: 'navy-gold',
    topText: '', bottomText: 'SCAN TO SUBSCRIBE',
  },
];

var URL_PLACEHOLDER = 'https://example.com/your-link';
var NEW_ENTRY_LABEL = 'New QR Code';

function findByKey(list, key) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].key === key) return list[i];
  }
  return list[0];
}

function makeId() {
  return 'qr-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

var STORAGE_KEY = 'cubQrGenerator';
var STORED_FIELDS = ['id', 'label', 'url', 'icon', 'colorScheme', 'topText', 'bottomText'];

function loadEntries() {
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var saved = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length) return saved;
    }
  } catch (e) { /* ignore corrupt/unavailable storage */ }
  return DEFAULT_ENTRIES.map(function (def) { return Object.assign({}, def); });
}

function buildBorderPlugin(scheme, topText, bottomText) {
  var text = {
    font: 'sans-serif',
    color: scheme.borderTextColor,
    size: 0.075,
    fontWeight: 'bold',
  };
  topText    = (topText    || '').trim();
  bottomText = (bottomText || '').trim();
  if (topText)    text.top    = { content: topText };
  if (bottomText) text.bottom = { content: bottomText };

  return new BorderPlugin({
    proportional: true,
    size: 0.12,
    round: 1,
    margin: 0,
    color: scheme.borderColor,
    text: (topText || bottomText) ? text : undefined,
  });
}

function qrOptionsFor(entry) {
  var icon   = findByKey(ICONS, entry.icon);
  var scheme = findByKey(COLOR_SCHEMES, entry.colorScheme);

  return {
    data: entry.url,
    shape: scheme.shape,
    image: 'https://api.iconify.design/' + icon.iconify + '.svg?color=' + encodeURIComponent(scheme.iconColor),
    imageOptions: {
      margin: 1,
      imageSize: 0.38,
    },
    dotsOptions: {
      color: scheme.dotsColor,
      type: scheme.dotsType,
    },
    backgroundOptions: {
      color: scheme.backgroundColor,
      round: 1,
      margin: 3,
    },
    cornersSquareOptions: {
      type: scheme.cornersSquareType,
      color: scheme.cornersSquareColor,
    },
    cornersDotOptions: {
      type: scheme.cornersDotType,
      color: scheme.cornersDotColor,
    },
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
    plugins: [buildBorderPlugin(scheme, entry.topText, entry.bottomText)],
  };
}

window.addEventListener('DOMContentLoaded', function () {
  var ractive = new Ractive({
    target: '#app',
    template: '#generator-template',
    data: {
      entries: loadEntries(),
      icons: ICONS,
      colorSchemes: COLOR_SCHEMES,
      urlPlaceholder: URL_PLACEHOLDER,
    },
  });

  function saveEntries() {
    var toSave = ractive.get('entries').map(function (entry) {
      var record = {};
      STORED_FIELDS.forEach(function (f) { record[f] = entry[f]; });
      return record;
    });
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); } catch (e) { /* ignore unavailable storage */ }
  }

  // Rebuild the whole QRCodeStyling instance on every change (rather than
  // calling .update() on a shared instance) so stale plugin/text state from
  // qr-code-styling's async draw pipeline can't accumulate on the SVG.
  var currentQrCodes = {};
  function renderEntry(entry) {
    var container = document.getElementById('qr-' + entry.id);
    if (!container) return;
    container.innerHTML = '';
    if (entry.url && entry.url.trim()) {
      var qr = new QRCodeStyling(qrOptionsFor(entry));
      qr.append(container);
      currentQrCodes[entry.id] = qr;
      container.style.display = '';
    } else {
      currentQrCodes[entry.id] = null;
      container.style.display = 'none';
    }
  }
  function renderAll() {
    var liveIds = {};
    ractive.get('entries').forEach(function (entry) {
      liveIds[entry.id] = true;
      renderEntry(entry);
    });
    Object.keys(currentQrCodes).forEach(function (id) {
      if (!liveIds[id]) delete currentQrCodes[id];
    });
  }

  // 'entries' itself catches add/remove/reorder (via push/splice below);
  // the field-level patterns catch in-place edits to an entry's properties.
  var editPattern = STORED_FIELDS
    .filter(function (f) { return f !== 'id'; })
    .map(function (f) { return 'entries.*.' + f; })
    .join(' ');

  ractive.observe('entries ' + editPattern, function () {
    saveEntries();
    renderAll();
  }, { init: true });

  ractive.on('add', function () {
    ractive.push('entries', {
      id: makeId(), label: NEW_ENTRY_LABEL, url: '',
      icon: ICONS[0].key, colorScheme: COLOR_SCHEMES[0].key,
      topText: '', bottomText: '',
    });
  });

  ractive.on('remove', function (event, id) {
    var entries = ractive.get('entries');
    var index = entries.findIndex(function (e) { return e.id === id; });
    if (index !== -1) ractive.splice('entries', index, 1);
  });

  ractive.on('savePng', function (event, id) {
    var qr = currentQrCodes[id];
    if (!qr) return;
    var entry = ractive.get('entries').find(function (e) { return e.id === id; });
    var name = (entry.label || 'qr-code').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'qr-code';
    browserUtils.download(qr, { name: name, extension: 'png' }, { width: 1024, height: 1024, margin: 0 });
  });
});
