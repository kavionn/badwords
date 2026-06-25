'use strict';

const LEET = { '4': 'a', '1': 'i', '3': 'e', '0': 'o', '5': 's', '7': 't' };
const LEET_RE = /[401357]/g;

class Badwords {
  constructor(options = {}) {
    const dict = options.dictionary ?? require('./words.json');
    const wl = options.whitelist ?? require('./whitelist.json');

    this.simThreshold = options.simThreshold ?? 0.82;
    this.consonantThreshold = options.consonantThreshold ?? 0.75;

    // Pre-compute normalized dictionary
    this._exactSet = new Set();
    this._entries = [];
    for (const w of dict) {
      const norm = this._normalize(w);
      this._exactSet.add(norm);
      this._entries.push({ norm, cons: this._consonants(norm) });
    }

    // Pisahkan whitelist: kata tunggal vs frasa
    this._wlWords = new Set();
    this._wlPhrases = [];
    for (const entry of wl) {
      const parts = entry.toLowerCase().trim().split(/\s+/);
      if (parts.length > 1) {
        this._wlPhrases.push(parts);
      } else {
        this._wlWords.add(this._normalize(parts[0]));
      }
    }
  }

  _normalize(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(LEET_RE, c => LEET[c])
      .replace(/(.)\1+/g, '$1');
  }

  _consonants(str) {
    return str.replace(/[aiueo]/g, '');
  }

  _similarity(a, b) {
    const la = a.length, lb = b.length;
    if (!la || !lb) return 0;

    let prev = Array.from({ length: lb + 1 }, (_, j) => j);
    for (let i = 1; i <= la; i++) {
      const curr = [i];
      for (let j = 1; j <= lb; j++) {
        curr[j] = Math.min(
          prev[j] + 1,
          curr[j - 1] + 1,
          prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
      prev = curr;
    }
    return 1 - prev[lb] / Math.max(la, lb);
  }

  // Cari posisi kata yang dilindungi frasa whitelist
  _whitelistedPositions(words) {
    const pos = new Set();
    const lower = words.map(w => w.toLowerCase());
    for (const phrase of this._wlPhrases) {
      const pLen = phrase.length;
      for (let i = 0; i <= lower.length - pLen; i++) {
        if (phrase.every((pw, j) => lower[i + j] === pw)) {
          for (let j = 0; j < pLen; j++) pos.add(i + j);
        }
      }
    }
    return pos;
  }

  _isBadword(word) {
    const norm = this._normalize(word);
    if (!norm || norm.length <= 1) return false;
    if (this._wlWords.has(norm)) return false;

    // Fast path: exact match setelah normalisasi
    if (this._exactSet.has(norm)) return true;

    // Kata <=2 huruf terlalu pendek untuk fuzzy
    if (norm.length <= 2) return false;

    // Threshold adaptif — kata pendek butuh kecocokan lebih tinggi
    const short = norm.length <= 4;
    const simT = short ? 0.90 : this.simThreshold;
    const conT = short ? 0.90 : this.consonantThreshold;
    const wCons = this._consonants(norm);

    for (const { norm: dNorm, cons: dCons } of this._entries) {
      // Quick reject: perbedaan panjang terlalu jauh
      if (Math.abs(norm.length - dNorm.length) > 2) continue;

      const sim = this._similarity(norm, dNorm);

      // Consonant skeleton match (minimal 3 karakter konsonan)
      if (wCons.length >= 3 && wCons === dCons && sim >= conT) return true;

      if (sim >= simT) return true;
    }
    return false;
  }

  // Inti deteksi — mengembalikan kata + indeks yang terdeteksi
  _detect(text) {
    if (!text) return { words: [], indices: [] };
    const words = text.split(/\s+/).filter(Boolean);
    const wl = this._whitelistedPositions(words);
    const indices = [];
    for (let i = 0; i < words.length; i++) {
      if (!wl.has(i) && this._isBadword(words[i])) indices.push(i);
    }
    return { words, indices };
  }

  badwords(text) {
    const { words, indices } = this._detect(text);
    return indices.map(i => words[i]);
  }

  flag(text) {
    return this._detect(text).indices.length > 0;
  }

  censor(text, replacement = '***') {
    if (!text) return text;
    const { words, indices } = this._detect(text);
    const bad = new Set(indices);
    return words.map((w, i) => bad.has(i) ? replacement : w).join(' ');
  }

  analyze(text) {
    if (!text) return { text: '', words: 0, badwords: [], count: 0, censored: '', locations: [] };
    const { words, indices } = this._detect(text);
    const bad = new Set(indices);
    return {
      text,
      words: words.length,
      badwords: indices.map(i => words[i]),
      count: indices.length,
      censored: words.map((w, i) => bad.has(i) ? '***' : w).join(' '),
      locations: indices,
    };
  }
}

module.exports = Badwords;
