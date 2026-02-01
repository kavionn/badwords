# Badword Filter 🚫🤬

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D14-green" />
  <img src="https://img.shields.io/badge/license-MIT-blue" />
  <img src="https://img.shields.io/badge/status-active-success" />
</p>

**Badword Filter** adalah library Node.js sederhana untuk mendeteksi kata kasar atau tidak pantas menggunakan pendekatan **normalisasi teks** dan **perhitungan similarity (Levenshtein Distance)**.  
Dirancang ringan, fleksibel, dan cocok untuk bot chat, REST API, maupun aplikasi teks lainnya.

---

## ✨ Fitur
- Case insensitive (tidak sensitif huruf besar/kecil)
- Normalisasi karakter non-alfanumerik
- Deteksi kata hasil modifikasi (typo, plesetan, variasi penulisan)
- Threshold similarity dapat dikonfigurasi
- 3 mode utama:
  - `flag(text)` → boolean deteksi
  - `censor(text)` → sensor otomatis
  - `analyze(text)` → analisis detail
- Mudah diintegrasikan

---

## 📦 Instalasi

### Clone repository
```bash
git clone <repository-url>
cd badword-filter
```

Atau salin manual file:
- `index.js`
- `words.json`
- `whitelist.json`

---

## 📁 Struktur Proyek
```text
.
├── index.js
├── words.json
└── whitelist.json
```

---

## 🚀 Penggunaan

### Import
```js
const badwords = require('./index');
```

---

### `flag(text)`
```js
badwords.flag('anjir tolol banget');
// true
```

```js
badwords.flag('assassin creed');
// false (whitelist)
```

---

### `censor(text)`
```js
badwords.censor('anjir tolol banget');
// "*** *** banget"
```

---

### `analyze(text)`
```js
badwords.analyze('anjir tolol banget');
```

Output:
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

---

## 🧠 Cara Kerja Singkat
1. Normalisasi teks (lowercase, hapus simbol, kompres karakter)
2. Cek whitelist (jika ada → aman)
3. Hilangkan vokal untuk pencocokan konsonan
4. Hitung **Levenshtein similarity**
5. Kata dianggap terlarang jika melewati threshold bawaan

Contoh normalisasi:
```
anjiiir → anjir
ngentttod → ngentod
```

---

## ⚙️ Konfigurasi Sensitivitas
Atur threshold di `index.js`:

```js
if (consonantMatch && sim >= 0.70) return true;
if (sim >= 0.75) return true;
```

Lebih ketat:
```js
if (consonantMatch && sim >= 0.80) return true;
if (sim >= 0.85) return true;
```

---

## 🗂️ Manajemen Kamus

### words.json
Berisi daftar kata kasar, contoh:
```json
[
  "anjing",
  "bangsat",
  "kontol",
  "memek",
  "tolol"
]
```

### whitelist.json
Berisi kata aman:
```json
[
  "anjing laut",
  "konyol"
]
```

---

## 🤝 Kontribusi
Kontribusi sangat terbuka dan dihargai 🙌  

- Fork repository ini
- Buat branch baru
- Lakukan perubahan
- Ajukan **Pull Request**

Atau:
- Laporkan bug
- Ajukan ide / saran

melalui **Issues** GitHub.

---

## ⚠️ Catatan
- Library ini berbasis heuristik, bukan NLP
- Tidak semua kata mirip ejaan bermakna negatif
- Sesuaikan threshold dengan konteks aplikasi
- Gunakan whitelist untuk menghindari false-positive

---

## 📄 Lisensi
MIT License



