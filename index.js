class Badwords {
    constructor() {
        const dictionary = require('./words.json');
        const whitelist = require('./whitelist.json');

        this.dictionary = dictionary.map(w => w.toLowerCase());
        this.whitelist = whitelist.map(w => w.toLowerCase());
    }
    
    _compressRepeatedChars(str) {
        if (str.length <= 3) return '';
        return str.replace(/(.)\1+/g, '$1');
    }

    _normalize(str) {
        if (!str) return '';
        return this._compressRepeatedChars(
            str.toLowerCase().replace(/[^a-z0-9]/gi, '')
        );
    }

    _removeVowels(str) {
        return str.replace(/[aiueo]/gi, '');
    }

    _similarity(a, b) {
        if (!a || !b) return 0;
        const matrix = [];
        const lenA = a.length;
        const lenB = b.length;

        for (let i = 0; i <= lenA; i++) matrix[i] = [i];
        for (let j = 0; j <= lenB; j++) matrix[0][j] = j;

        for (let i = 1; i <= lenA; i++) {
            for (let j = 1; j <= lenB; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        const distance = matrix[lenA][lenB];
        const maxLen = Math.max(lenA, lenB);
        return 1 - distance / maxLen;
    }

    _isWhitelisted(word) {
        if (!word) return false;
        const cleaned = this._normalize(word);
        if (!cleaned) return false;
        return this.whitelist.includes(cleaned);
    }

    _isBadword(word) {
        if (!word) return false;

        if (this._isWhitelisted(word)) return false;

        const cleaned = this._normalize(word);
        if (!cleaned) return false;
        if (cleaned.length <= 2) return false;

        const nv = this._removeVowels(cleaned);

        for (const bad of this.dictionary) {
            const badNV = this._removeVowels(bad);
            const consonantMatch = nv === badNV;
            const sim = this._similarity(cleaned, bad);

            if (consonantMatch && sim >= 0.70) return true;
            if (sim >= 0.75) return true;
        }
        return false;
    }

    badwords(text) {
        if (!text) return [];
        return text.split(/\s+/).filter(w => this._isBadword(w));
    }

    flag = (text) => {
        return this.badwords(text).length > 0;
    }

    censor = (text, replacement = "***") => {
        if (!text) return text;
        return text
            .split(/\s+/)
            .map(w => this._isBadword(w) ? replacement : w)
            .join(" ");
    }

    analyze = (text) => {
        const words = text.split(/\s+/);
        const bad = this.badwords(text);
        return {
            text,
            words: words.length,
            badwords: bad,
            count: bad.length,
            censored: this.censor(text),
            locations: words
                .map((w, i) => bad.includes(w) ? i : -1)
                .filter(i => i >= 0)
        };
    }
}

module.exports = new Badwords();
