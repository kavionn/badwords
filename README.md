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

---

## 📁 Struktur Proyek
```text
.
├── index.js        # Core badword filter
└── words.json      # Daftar kata terlarang
```

---

## 🚀 Penggunaan

### Import
```js
const badwords = require('./index');
```

### `flag(text)`
```js
badwords.flag('anjir gokil banget');
// true
```

### `censor(text, replacement?)`
```js
badwords.censor('anjir gokil banget');
// "*** *** banget"

badwords.censor('anjir gokil banget', '###');
// "### ### banget"
```

### `analyze(text)`
```js
badwords.analyze('anjir gokil banget');
```

Output:
```js
{
  text: 'anjir gokil banget',
  words: 3,
  badwords: ['anjir', 'gokil'],
  count: 2,
  censored: '*** *** banget',
  locations: [0, 1]
}
```

---

## 🧠 Cara Kerja Singkat
1. Normalisasi teks (lowercase, hapus simbol, kompres karakter)
2. Pencocokan konsonan
3. Hitung **Levenshtein similarity**
4. Kata dianggap terlarang jika melewati threshold

Contoh:
```
gOKiL → gokil ≈ cokil → similarity 0.8 → terdeteksi
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

## 🗂️ Manajemen Kata Terlarang
Edit `words.json`:
```json
[
  "anjing",
  "bangsat",
  "cokil"
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
- Tidak semua kata mirip ejaan bermakna negatif
- Sesuaikan threshold dengan konteks aplikasi
- Gunakan `analyze` untuk logging tanpa menyensor UI

---

## 📄 Lisensi
MIT License — bebas digunakan dan dimodifikasi untuk keperluan pribadi maupun komersial.
