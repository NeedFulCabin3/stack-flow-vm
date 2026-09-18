const KEYWORDS = ['let', 'print', 'if', 'else', 'while', 'true', 'false'];

function tokenize(src) {
  const tokens = [];
  let i = 0;
  let line = 1;

  while (i < src.length) {
    const ch = src[i];

    if (ch === '\n') { line++; i++; continue; }
    if (ch === ' ' || ch === '\t' || ch === '\r') { i++; continue; }

    if (ch === '/' && src[i + 1] === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      let start = i;
      while (i < src.length && /[0-9.]/.test(src[i])) i++;
      tokens.push({ type: 'NUMBER', value: parseFloat(src.slice(start, i)), line });
      continue;
    }

    if (ch === '"') {
      let start = ++i;
      while (i < src.length && src[i] !== '"') i++;
      const str = src.slice(start, i);
      i++;
      tokens.push({ type: 'STRING', value: str, line });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let start = i;
      while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) i++;
      const word = src.slice(start, i);
      if (KEYWORDS.includes(word)) {
        tokens.push({ type: word.toUpperCase(), value: word, line });
      } else {
        tokens.push({ type: 'IDENT', value: word, line });
      }
      continue;
    }

    const two = src.slice(i, i + 2);
    if (['==', '!=', '<=', '>=', '&&', '||'].includes(two)) {
      tokens.push({ type: two, value: two, line });
      i += 2;
      continue;
    }

    const singles = '+-*/%=<>!(){};,';
    if (singles.includes(ch)) {
      tokens.push({ type: ch, value: ch, line });
      i++;
      continue;
    }

    throw new Error(`unexpected character '${ch}' on line ${line}`);
  }

  tokens.push({ type: 'EOF', value: null, line });
  return tokens;
}