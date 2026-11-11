/**
 * Ansoneri - notice when someone finishes the full profile (profils.html).
 *
 * Runs as a Google Apps Script web app in Kristers's own Google account:
 *  - sends the report to his Gmail (from himself, subject "Jauns profils: ...")
 *  - keeps one row per profile in the Google Sheet the script is attached to (sheet "Profili")
 *  - a few seconds later the page sends the PDF of the same report (type "pdf"); it arrives as a second e-mail
 *    with the same subject (so Gmail keeps both in one thread) and the PDF attached
 *
 * Setup (about 5 minutes, once):
 *  1. Google Drive -> New -> Google Sheets. Name it "Ansoneri profili".
 *  2. In the sheet: Extensions -> Apps Script. Delete the sample code, paste this whole file, Save.
 *  3. Deploy -> New deployment -> type "Web app".
 *       Execute as: Me.   Who has access: Anyone.   -> Deploy.
 *     Google asks to authorise: choose your account -> "Advanced" -> "Go to ... (unsafe)" -> Allow.
 *     (It is your own script; Google shows this warning for every script that is not published.)
 *  4. Copy the "Web app URL" (https://script.google.com/macros/s/.../exec) and put it in profils.html:
 *       const NOTIFY_URL = "https://script.google.com/macros/s/.../exec";
 *     or send it to Claude to add.
 *  5. Test: open the URL in a browser - it should say "Ansoneri profils: gatavs".
 *
 * If you change this code later: Deploy -> Manage deployments -> edit (pencil) -> Version: New version -> Deploy.
 * The URL stays the same.
 */

const SHEET = 'Profili';
// The deployed script is a standalone project, so it opens the sheet by ID (from the sheet's URL).
const SHEET_ID = ''; // ID of the Google Sheet "Ansoneri profili"
const HEAD = ['Laiks', 'ID', 'Vārds', 'Dzimums', 'Vecums', 'Profils', 'Potenciāls', 'Treniņi', 'Miegs', 'Atjaunošanās',
  'Motivācija', 'Veselība', 'Mentālās prasmes', 'Ieteikums', 'Lead', 'Uzlabošanai', 'Piekrišana', 'Kopsavilkums', 'Visas atbildes'];

function doGet() {
  return ContentService.createTextOutput('Ansoneri profils: gatavs');
}

function subjectOf(d) {
  const clip = (v, max) => String(v == null ? '' : v).slice(0, max || 500);
  return 'Jauns profils: ' + (clip(d.name, 60) || 'bez vārda') + ' · ' + clip(d.profile, 80) + ' · ' + (Number(d.readiness) || '-') + '/100 · ' + clip(d.lead, 20);
}

/* the PDF of a report: a second e-mail in the same thread, PDF attached (at most 8 MB, at most 40 an hour) */
function doPdf(d) {
  const cache = CacheService.getScriptCache();
  const n = Number(cache.get('p') || 0);
  if (n >= 40) return out('busy');
  cache.put('p', String(n + 1), 3600);
  const b64 = String(d.pdf || '');
  if (!b64 || b64.length > 11000000 || !/^[A-Za-z0-9+/=]+$/.test(b64)) return out('bad pdf');
  const name = String(d.filename || ('Pilnais profils ' + d.id + '.pdf')).replace(/[\\/:*?"<>|]+/g, '').slice(0, 120);
  const blob = Utilities.newBlob(Utilities.base64Decode(b64), 'application/pdf', /\.pdf$/i.test(name) ? name : name + '.pdf');
  const me = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail({ to: me, subject: subjectOf(d), body: 'PDF atskaite pielikumā (tieši tā, ko redzēja klients).\n' + (d.view ? '\nAtvērt atskaiti: ' + String(d.view).slice(0, 8000) : ''), name: 'Ansoneri profils', attachments: [blob] });
  return out('ok');
}

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (raw.length > 12000000) return out('too big');
    const d = JSON.parse(raw);
    if (!/^AP-\d{1,6}$/.test(String(d.id || ''))) return out('bad id');
    if (d.type === 'pdf') return doPdf(d);
    if (raw.length > 60000) return out('too big');

    // simple guard against floods: at most 40 notices an hour
    const cache = CacheService.getScriptCache();
    const n = Number(cache.get('n') || 0);
    if (n >= 40) return out('busy');
    cache.put('n', String(n + 1), 3600);

    const clip = (v, max) => String(v == null ? '' : v).slice(0, max || 500);
    const dom = d.domains || {};
    const answers = (d.details || []).slice(0, 120).map((x) => clip(x[0], 40) + ' | ' + clip(x[1], 200) + ': ' + clip(x[2], 600)).join('\n');

    const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
    if (sh.getLastRow() === 0) { sh.appendRow(HEAD); sh.setFrozenRows(1); }
    sh.appendRow([new Date(), clip(d.id, 20), clip(d.name, 60), clip(d.sex, 20), clip(d.age, 5), clip(d.profile, 80), Number(d.readiness) || '',
      dom['Treniņi'], dom['Miegs'], dom['Atjaunošanās'], dom['Motivācija'], dom['Veselība'], dom['Mentālās prasmes'],
      clip(d.rec, 80), clip(d.lead, 20), d.improve ? 'jā' : 'nē', clip(d.consentAt, 40), clip(d.summary, 6000), answers]);

    const me = Session.getEffectiveUser().getEmail();
    const subject = subjectOf(d);
    const body = clip(d.summary, 6000) + '\n\n--- Visas atbildes ---\n' + answers + '\n\nVisi profili: ' + ss.getUrl();
    MailApp.sendEmail({ to: me, subject: subject, body: body, name: 'Ansoneri profils' });
    return out('ok');
  } catch (err) {
    console.error(err);
    return out('error');
  }
}

function out(t) {
  return ContentService.createTextOutput(t);
}
