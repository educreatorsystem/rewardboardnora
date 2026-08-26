SISTEM REWARD BOARD — VERSI LEBIH RESPONSIF

FAIL GITHUB
1. index.html
2. app.js
3. styles.css

FAIL GOOGLE APPS SCRIPT
4. Code.gs

PEMBAIKAN UTAMA
- Paparan bintang dikemas kini serta-merta tanpa render semula seluruh sistem.
- Klik berturut-turut dikumpulkan seketika dan dihantar ke Apps Script secara batch.
- Google Sheet ditulis menggunakan setValues() untuk beberapa rekod sekali gus.
- Endpoint getState kini benar-benar menyimpan/memulangkan skor dan kumpulan untuk sync.
- Perlindungan ditambah supaya sync backend lama tidak mengosongkan skor tempatan.
- Cache busting pada app.js/styles.css ditambah supaya GitHub Pages memuat versi baharu.

CARA KEMAS KINI GITHUB
1. Gantikan index.html, app.js dan styles.css dalam repository GitHub dengan fail baharu.
2. Commit perubahan.
3. Tunggu GitHub Pages selesai deploy, kemudian refresh halaman (hard refresh jika perlu).

CARA KEMAS KINI APPS SCRIPT
1. Buka projek Apps Script yang menggunakan URL web app sedia ada.
2. Gantikan keseluruhan kandungan Code.gs dengan Code.gs baharu ini.
3. Save.
4. Pergi Deploy > Manage deployments.
5. Edit deployment web app sedia ada > pilih New version > Deploy.
6. Gunakan deployment yang sama supaya URL /exec kekal sama.

NOTA
- APPSCRIPT_URL dalam app.js dikekalkan seperti sistem asal.
- SHEET_ID dalam Code.gs juga dikekalkan seperti sistem asal.
- Untuk mendapat fungsi batch + sync penuh, kemas kini GitHub dan Code.gs bersama-sama.
