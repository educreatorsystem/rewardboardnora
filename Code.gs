const SHEET_ID = '1JvuW8r2qYc1jaMWv6C2V8i1Zdy8LzcWXObpkB7cf7CA';
const STATE_KEY = 'reward-board-state-v3';
const LOG_SHEET_NAME = 'Rekod Reward';

function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || '');
    const callback = String((e && e.parameter && e.parameter.callback) || '');

    if (action === 'getState') {
      const savedState = readState_();
      const payload = savedState
        ? {
            ok: true,
            initialized: true,
            scores: savedState.scores || {},
            groups: savedState.groups || {},
            revision: Number(savedState.revision || 0),
            updatedAt: savedState.updatedAt || ''
          }
        : {
            ok: true,
            initialized: false,
            scores: {},
            groups: {},
            revision: 0,
            updatedAt: ''
          };
      return callback ? jsonpOutput_(callback, payload) : jsonOutput_(payload);
    }

    return jsonOutput_({
      ok: true,
      message: 'Sistem Reward Board Apps Script aktif.'
    });
  } catch (error) {
    return jsonOutput_({ ok: false, error: error.message });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const payload = parsePayload_(e);
    const actions = payload.action === 'batch' && Array.isArray(payload.actions)
      ? payload.actions
      : [payload];

    let state = readState_() || defaultState_();
    const logRows = [];

    actions.forEach(function(actionPayload) {
      if (!actionPayload || typeof actionPayload !== 'object') return;
      applyAction_(state, actionPayload);
      const row = makeLogRow_(actionPayload);
      if (row) logRows.push(row);
    });

    state.revision = Number(state.revision || 0) + 1;
    state.updatedAt = new Date().toISOString();
    saveState_(state);
    appendLogRows_(logRows);

    return jsonOutput_({
      ok: true,
      revision: state.revision,
      updatedAt: state.updatedAt
    });
  } catch (error) {
    return jsonOutput_({
      ok: false,
      error: error.message
    });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function applyAction_(state, payload) {
  const action = String(payload.action || '');

  if (action === 'replaceState') {
    state.scores = isPlainObject_(payload.scores) ? payload.scores : {};
    state.groups = isPlainObject_(payload.groups) ? payload.groups : {};
    return;
  }

  if (action === 'studentReward') {
    const studentId = String(payload.studentId || '');
    if (!studentId) return;
    state.scores[studentId] = Math.max(0, Number(payload.score || 0));
    return;
  }

  if (action === 'groupReward') {
    const className = String(payload.className || '');
    if (className && Array.isArray(payload.groups)) {
      // Snapshot paling baharu dari browser adalah authoritative untuk kumpulan.
      state.groups[className] = payload.groups;
    }
    if (Array.isArray(payload.affectedStudentRecords)) {
      payload.affectedStudentRecords.forEach(function(student) {
        const id = String((student && student.id) || '');
        if (!id) return;
        state.scores[id] = Math.max(0, Number(student.score || 0));
      });
    }
    return;
  }

  if (action === 'saveGroups') {
    const className = String(payload.className || '');
    if (className && Array.isArray(payload.groups)) {
      state.groups[className] = payload.groups;
    }
    return;
  }

  if (action === 'resetScores') {
    Object.keys(state.scores || {}).forEach(function(studentId) {
      state.scores[studentId] = 0;
    });
    Object.keys(state.groups || {}).forEach(function(className) {
      (state.groups[className] || []).forEach(function(group) {
        group.stars = 0;
      });
    });
  }
}

function makeLogRow_(payload) {
  // replaceState hanyalah proses bootstrap sync; tidak perlu memenuhi Rekod Reward.
  if (payload.action === 'replaceState') return null;

  return [
    payload.timestamp || new Date().toISOString(),
    payload.action || '',
    payload.type || '',
    payload.className || '',
    payload.targetName || '',
    Number(payload.delta || 0),
    Number(payload.score || 0),
    Array.isArray(payload.affectedStudents)
      ? payload.affectedStudents.join(', ')
      : String(payload.affectedStudents || '')
  ];
}

function appendLogRows_(rows) {
  if (!rows.length) return;
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = getOrCreateSheet_(ss, LOG_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 8).setValues([[
      'Timestamp',
      'Action',
      'Jenis',
      'Kelas',
      'Sasaran',
      'Perubahan Bintang',
      'Jumlah Terkini',
      'Murid Terlibat'
    ]]);
  }

  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 8).setValues(rows);
}

function readState_() {
  const raw = PropertiesService.getScriptProperties().getProperty(STATE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return {
      scores: isPlainObject_(parsed.scores) ? parsed.scores : {},
      groups: isPlainObject_(parsed.groups) ? parsed.groups : {},
      revision: Number(parsed.revision || 0),
      updatedAt: String(parsed.updatedAt || '')
    };
  } catch (error) {
    return null;
  }
}

function saveState_(state) {
  PropertiesService.getScriptProperties().setProperty(STATE_KEY, JSON.stringify(state));
}

function defaultState_() {
  return {
    scores: {},
    groups: {},
    revision: 0,
    updatedAt: ''
  };
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function isPlainObject_(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function jsonOutput_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonpOutput_(callback, data) {
  if (!/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return jsonOutput_(data);
  }
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(data) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
