const SHEET_ID = '1JvuW8r2qYc1jaMWv6C2V8i1Zdy8LzcWXObpkB7cf7CA';

function doGet() {
  return jsonOutput({
    ok: true,
    message: 'Sistem Reward Board Apps Script aktif.'
  });
}

function doPost(e) {
  try {
    const payload = parsePayload(e);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = getOrCreateSheet_(ss, 'Rekod Reward');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Action',
        'Jenis',
        'Kelas',
        'Sasaran',
        'Perubahan Bintang',
        'Jumlah Terkini',
        'Murid Terlibat'
      ]);
    }

    sheet.appendRow([
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
    ]);

    return jsonOutput({ ok: true });
  } catch (error) {
    return jsonOutput({
      ok: false,
      error: error.message
    });
  }
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

function getOrCreateSheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
