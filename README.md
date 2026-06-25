# Badword Filter 🚫🤬

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D14-green" />
  <img src="https://img.shields.io/badge/license-MIT-blue" />
  <img src="https://img.shields.io/badge/status-active-success" />
</p>

**Badword Filter** adalah library Node.js untuk mendeteksi kata kasar Bahasa Indonesia menggunakan **normalisasi teks**, **deteksi leet speak**, dan **Levenshtein similarity** dengan threshold adaptif.

Dirancang ringan, minim false positive, dan mudah dikonfigurasi.

---

## ✨ Fitur
- Normalisasi teks (simbol, karakter berulang, leet speak `4nj1ng` → `anjing`)
- Threshold adaptif — kata pendek butuh kecocokan lebih tinggi
- Whitelist mendukung **frasa multi-kata** (`"anjing laut"`)
- Exact match via `Set` (fast path) + fuzzy match (fallback)
- Quick reject berdasarkan perbedaan panjang kata
- Consonant skeleton matching dengan threshold minimum
- Bisa dikustomisasi (dictionary, whitelist, threshold)
- 3 mode: `flag()`, `censor()`, `analyze()`

---

## 📦 Instalasi

```bash
git clone <repository-url>
cd badword-filter
```

Atau salin manual: `index.js`, `words.json`, `whitelist.json`

---

## 🚀 Penggunaan

### Import & Inisialisasi
```js
const Badwords = require('./index');
const bw = new Badwords();
```

### Kustomisasi Threshold
```js
const bw = new Badwords({
  simThreshold: 0.85,       // threshold similarity umum (default: 0.82)
  consonantThreshold: 0.80, // threshold dengan consonant match (default: 0.75)
});
```

### Kustomisasi Dictionary & Whitelist
```js
const bw = new Badwords({
  dictionary: ['anjing', 'bangsat', 'tolol'],
  whitelist: ['anjing laut', 'konyol'],
});
```

---

### `flag(text)`
```js
bw.flag('anjir tolol banget');
// true

bw.flag('ini anjing laut');
// false (frasa whitelist)

bw.flag('4nj1ng lo');
// true (leet speak terdeteksi)
```

### `censor(text, replacement?)`
```js
bw.censor('anjir tolol banget');
// "*** *** banget"

bw.censor('dasar gblk', '[SENSOR]');
// "dasar [SENSOR]"
```

### `analyze(text)`
```js
bw.analyze('anjir tolol banget');
```
```js
{
  text: 'anjir tolol banget',
  words: 3,
  badwords: ['anjir', 'tolol'],
  count: 2,
  censored: '*** *** banget',
  locations: [0, 1]
}
```

### `badwords(text)`
```js
bw.badwords('asu lo bangsat');
// ['asu', 'bangsat']
```

---

## 🧠 Cara Kerja

1. **Normalisasi** — lowercase, hapus simbol, konversi leet speak (`4→a`, `1→i`, `3→e`, `0→o`, `5→s`, `7→t`), kompres karakter berulang
2. **Whitelist frasa** — cek frasa multi-kata (mis. `"anjing laut"`) di level kalimat, posisi yang cocok dilewati
3. **Whitelist kata** — cek kata tunggal yang aman
4. **Exact match** — pencocokan langsung via `Set` (O(1))
5. **Fuzzy match** — Levenshtein similarity dengan:
   - **Quick reject**: perbedaan panjang > 2 → lewati
   - **Threshold adaptif**: kata ≤4 huruf butuh ≥0.90, kata panjang ≥0.82
   - **Consonant match**: kerangka konsonan identik + similarity ≥ threshold

---

## 🗂️ Manajemen Kamus

### words.json
```json
["anjing", "bangsat", "kontol", "tolol"]
```

### whitelist.json
Mendukung kata tunggal dan frasa multi-kata:
```json
["anjing laut", "konyol", "anything"]
```

---

## ⚠️ Catatan
- Library ini berbasis heuristik, bukan NLP
- Sesuaikan threshold dengan konteks aplikasi
- Gunakan whitelist untuk kasus spesifik

---

## 🤝 Kontribusi
Kontribusi sangat terbuka 🙌

- Fork → branch baru → perubahan → **Pull Request**
- Laporkan bug atau ajukan saran via **Issues**

---

## 📄 Lisensi
MIT License
