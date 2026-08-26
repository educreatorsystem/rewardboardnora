SISTEM REWARD BOARD — VERSI RESPONSIF + SAMBUNGAN BAHARU

FAIL GITHUB
1. index.html
2. app.js
3. styles.css

FAIL GOOGLE APPS SCRIPT
4. Code.gs

SAMBUNGAN YANG TELAH DIMASUKKAN
SHEET ID:
1xAKv8t4g7pQSOcrI2MVcxjR13OCAMwZqlhS-BeqEu7o

URL CSV NAMA MURID:
https://docs.google.com/spreadsheets/d/e/2PACX-1vSOSGvm7JZCxASyNKA_Gg-40rGuSWl-hbMutFR18yL_VTCGR_dHvgfwKupSANNn01orAimnmKU0Z2it/pub?gid=0&single=true&output=csv

URL APPS SCRIPT:
https://script.google.com/macros/s/AKfycbwg0TwtcZxNH7xAn5_cKpNmYvdq3mue9tgk7wN4fSPsVEBZclF1P3wYf8yqXeCW5mVO/exec

PEMBAIKAN KEKAL
- Paparan bintang dikemas kini serta-merta tanpa render semula seluruh sistem.
- Klik berturut-turut dihantar ke Apps Script secara batch.
- Google Sheet ditulis menggunakan setValues() untuk beberapa rekod sekali gus.
- Endpoint getState menyimpan/memulangkan skor dan kumpulan untuk sync.
- Perlindungan sync mengelakkan skor baharu ditimpa state lama.
- Cache busting pada app.js/styles.css untuk GitHub Pages.

SEMAKAN STRUKTUR GOOGLE SHEET
- Tab: KELAS MURID
- Lajur A: KELAS
- Lajur B: NAMA MURID
- Struktur ini serasi dengan app.js.

CARA DEPLOY GITHUB
1. Gantikan index.html, app.js dan styles.css di repository GitHub.
2. Commit perubahan.
3. Selepas GitHub Pages deploy, buat hard refresh jika browser masih memaparkan versi lama.

CARA DEPLOY APPS SCRIPT
1. Buka projek Apps Script yang berkaitan dengan URL baharu.
2. Gantikan keseluruhan Code.gs dengan fail Code.gs dalam pakej ini.
3. Save.
4. Deploy > Manage deployments.
5. Edit deployment web app > New version > Deploy.
6. Pastikan Execute as = Me dan akses web app membenarkan pengguna sistem mengaksesnya.
