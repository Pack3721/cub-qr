import { QRCodeStyling, browserUtils } from 'https://cdn.jsdelivr.net/npm/@liquid-js/qr-code-styling@5.5.0/lib/qr-code-styling.js';
import BorderPlugin from 'https://cdn.jsdelivr.net/npm/@liquid-js/qr-code-styling@5.5.0/lib/border-plugin.js';

// Subset of Iconify icons offered in the icon picker. Add more here as needed —
// the dropdown and QR rendering both read from this list automatically.
var ICONS = [
  { key: 'join',     label: 'Join / Add Person', iconify: 'mdi:account-plus'          },
  { key: 'calendar', label: 'Calendar Sync',      iconify: 'hugeicons:calendar-sync'   },
  { key: 'app',      label: 'App Download',       iconify: 'mdi:cellphone-arrow-down'  },
  { key: 'facebook', label: 'Facebook',            iconify: 'mdi:facebook'              },
  { key: 'list',     label: 'List / Info',        iconify: 'mdi:format-list-bulleted'  },
  { key: 'cost',     label: 'Cost / Dollar',       iconify: 'mdi:currency-usd'          },
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
  {
    key: 'green-gold', label: 'Green & Gold', shape: 'circle',
    dotsColor: '#1B5E20', dotsType: 'dots',
    backgroundColor: '#ffffff',
    cornersSquareColor: '#FFC72C', cornersSquareType: 'extra-rounded',
    cornersDotColor: '#1B5E20', cornersDotType: 'dot',
    borderColor: '#1B5E20', borderTextColor: '#FFC72C',
    iconColor: '#1B5E20',
  },
  {
    key: 'blue-red', label: 'Blue & Red', shape: 'circle',
    dotsColor: '#0D47A1', dotsType: 'dots',
    backgroundColor: '#ffffff',
    cornersSquareColor: '#C62828', cornersSquareType: 'extra-rounded',
    cornersDotColor: '#0D47A1', cornersDotType: 'dot',
    borderColor: '#0D47A1', borderTextColor: '#ffffff',
    iconColor: '#0D47A1',
  },
  {
    key: 'purple-gold', label: 'Purple & Gold', shape: 'circle',
    dotsColor: '#4A148C', dotsType: 'dots',
    backgroundColor: '#ffffff',
    cornersSquareColor: '#FFC72C', cornersSquareType: 'extra-rounded',
    cornersDotColor: '#4A148C', cornersDotType: 'dot',
    borderColor: '#4A148C', borderTextColor: '#FFC72C',
    iconColor: '#4A148C',
  },
  {
    key: 'teal-orange', label: 'Teal & Orange', shape: 'circle',
    dotsColor: '#00695C', dotsType: 'dots',
    backgroundColor: '#ffffff',
    cornersSquareColor: '#FF6F00', cornersSquareType: 'extra-rounded',
    cornersDotColor: '#00695C', cornersDotType: 'dot',
    borderColor: '#00695C', borderTextColor: '#FFB74D',
    iconColor: '#00695C',
  },
];

// Suggested QR codes offered to every user. Each is seeded into the user's
// list exactly once (tracked by id in SEEDED_STORAGE_KEY, independent of
// STORAGE_KEY) — so adding an entry here rolls it out to existing users on
// their next visit without touching anything they've already customized or
// removed, and without ever re-adding one they deleted. The Calendar entry
// presets to scout-cal's exact icon and color scheme defaults.
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
  {
    id: 'scout-app', label: 'Download Scout App', url: '',
    icon: 'app', colorScheme: 'navy-gold',
    topText: '', bottomText: 'DOWNLOAD THE APP',
  },
  {
    id: 'facebook', label: 'Pack Facebook Group', url: '',
    icon: 'facebook', colorScheme: 'navy-gold',
    topText: '', bottomText: 'JOIN OUR FACEBOOK GROUP',
  },
  {
    id: 'den-info', label: 'Den Information at a Glance', url: '',
    icon: 'list', colorScheme: 'navy-gold',
    topText: '', bottomText: 'DEN INFO',
  },
  {
    id: 'pack-costs', label: 'Pack Costs Explained', url: '',
    icon: 'cost', colorScheme: 'navy-gold',
    topText: '', bottomText: 'PACK COSTS EXPLAINED',
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

// Coerces one imported record into a valid entry: unknown/missing icon and
// colorScheme fall back to the first option, non-string text fields become
// '', and ids are kept if present (deduped against everything seen so far
// in this import) or generated fresh otherwise.
function sanitizeEntry(raw, seenIds) {
  raw = raw && typeof raw === 'object' ? raw : {};
  var id = typeof raw.id === 'string' && raw.id && !seenIds[raw.id] ? raw.id : makeId();
  while (seenIds[id]) id = makeId();
  seenIds[id] = true;

  return {
    id: id,
    label: typeof raw.label === 'string' ? raw.label : NEW_ENTRY_LABEL,
    url: typeof raw.url === 'string' ? raw.url : '',
    icon: findByKey(ICONS, raw.icon).key,
    colorScheme: findByKey(COLOR_SCHEMES, raw.colorScheme).key,
    topText: typeof raw.topText === 'string' ? raw.topText : '',
    bottomText: typeof raw.bottomText === 'string' ? raw.bottomText : '',
  };
}

var STORAGE_KEY = 'cubQrGenerator';
var SEEDED_STORAGE_KEY = 'cubQrGeneratorSeeded';
var STORED_FIELDS = ['id', 'label', 'url', 'icon', 'colorScheme', 'topText', 'bottomText'];

function readJson(key, fallback) {
  try {
    var raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupt/unavailable storage */ }
  return fallback;
}

function writeJson(key, value) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore unavailable storage */ }
}

// Loads the user's saved list, then appends any DEFAULT_ENTRIES that have
// never been seeded before (first-ever run seeds all of them). Entries the
// user has since deleted or renamed are left alone — seeding is a one-time
// "add if new" merge, not a sync.
function loadEntries() {
  var entries   = readJson(STORAGE_KEY, []);
  var seededIds = readJson(SEEDED_STORAGE_KEY, []);
  if (!Array.isArray(entries))   entries = [];
  if (!Array.isArray(seededIds)) seededIds = [];

  var seededSet = {};
  seededIds.forEach(function (id) { seededSet[id] = true; });
  var presentSet = {};
  entries.forEach(function (e) { presentSet[e.id] = true; });

  var changed = false;
  DEFAULT_ENTRIES.forEach(function (def) {
    if (seededSet[def.id]) return;
    seededIds.push(def.id);
    changed = true;
    if (!presentSet[def.id]) {
      entries.push(Object.assign({}, def));
      presentSet[def.id] = true;
    }
  });

  if (changed) {
    writeJson(STORAGE_KEY, entries);
    writeJson(SEEDED_STORAGE_KEY, seededIds);
  }
  return entries;
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
      importMessage: '',
      importError: '',
    },
  });

  function saveEntries() {
    var toSave = ractive.get('entries').map(function (entry) {
      var record = {};
      STORED_FIELDS.forEach(function (f) { record[f] = entry[f]; });
      return record;
    });
    writeJson(STORAGE_KEY, toSave);
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

  // Re-render every entry when the list itself changes shape (add/remove,
  // via push/splice below) or on first load.
  ractive.observe('entries', function () {
    saveEntries();
    renderAll();
  }, { init: true });

  // In-place edits to a single entry's fields only re-render *that* entry —
  // otherwise every keystroke in one box would tear down and rebuild every
  // other entry's QR code too (each re-fetching its icon over the network),
  // and a Save PNG click could land mid-rebuild on an entry you never touched.
  var editPattern = STORED_FIELDS
    .filter(function (f) { return f !== 'id'; })
    .map(function (f) { return 'entries.*.' + f; })
    .join(' ');

  ractive.observe(editPattern, function (newValue, oldValue, keypath) {
    saveEntries();
    var index = keypath.split('.')[1];
    var entry = ractive.get('entries.' + index);
    if (entry) renderEntry(entry);
  }, { init: false });

  ractive.on('add', function () {
    ractive.push('entries', {
      id: makeId(), label: NEW_ENTRY_LABEL, url: '',
      icon: ICONS[0].key, colorScheme: COLOR_SCHEMES[0].key,
      topText: '', bottomText: '',
    });
  });

  // Called via on-click="@this.removeEntry(id)" / "@this.savePng(id)" rather
  // than proxy-event colon syntax (on-click="name:{{id}}") — the latter
  // never actually fired its handler in this Ractive version, which was the
  // real cause of "Save PNG" (and Remove) silently doing nothing.
  ractive.removeEntry = function (id) {
    var entries = ractive.get('entries');
    var index = entries.findIndex(function (e) { return e.id === id; });
    if (index !== -1) ractive.splice('entries', index, 1);
  };

  ractive.savePng = function (id) {
    var qr = currentQrCodes[id];
    if (!qr) return;
    var entry = ractive.get('entries').find(function (e) { return e.id === id; });
    var name = (entry.label || 'qr-code').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'qr-code';
    browserUtils.download(qr, { name: name, extension: 'png' }, { width: 1024, height: 1024, margin: 0 });
  };

  ractive.exportSettings = function () {
    var payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      entries: ractive.get('entries').map(function (entry) {
        var record = {};
        STORED_FIELDS.forEach(function (f) { record[f] = entry[f]; });
        return record;
      }),
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'cub-qr-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Bound to the hidden <input type="file"> via on-change="@this.handleImportFile(@node)".
  ractive.handleImportFile = function (inputNode) {
    var file = inputNode.files && inputNode.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        var imported = Array.isArray(parsed) ? parsed : parsed.entries;
        if (!Array.isArray(imported)) throw new Error('expected an "entries" array');

        var seenIds = {};
        var sanitized = imported.map(function (raw) { return sanitizeEntry(raw, seenIds); });

        ractive.set('entries', sanitized);
        ractive.set('importError', '');
        ractive.set('importMessage', 'Imported ' + sanitized.length + ' QR code' + (sanitized.length === 1 ? '' : 's') + '.');

        // Treat the import as authoritative: mark every suggested default as
        // already-seeded so loadEntries() won't append one back on top of
        // whatever was just imported (including ones the import omits).
        var seededIds = readJson(SEEDED_STORAGE_KEY, []);
        if (!Array.isArray(seededIds)) seededIds = [];
        DEFAULT_ENTRIES.forEach(function (def) {
          if (seededIds.indexOf(def.id) === -1) seededIds.push(def.id);
        });
        writeJson(SEEDED_STORAGE_KEY, seededIds);
      } catch (e) {
        ractive.set('importMessage', '');
        ractive.set('importError', 'Could not import file: ' + e.message);
      }
      inputNode.value = '';
    };
    reader.onerror = function () {
      ractive.set('importMessage', '');
      ractive.set('importError', 'Could not read the file.');
      inputNode.value = '';
    };
    reader.readAsText(file);
  };
});
