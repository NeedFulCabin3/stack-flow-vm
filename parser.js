function parse(tokens) {
  let pos = 0;

  function peek() { return tokens[pos]; }
  function next() { return tokens[pos++]; }
  function check(type) { return peek().type === type; }

  function expect(type) {
    if (!check(type)) {
      throw new Error(`expected '${type}' but got '${peek().type}' on line ${peek().line}`);
    }
    return next();
  }

  function parseProgram() {
    const body = [];
    while (!check('EOF')) {
      body.push(parseStatement());
    }
    return { type: 'Program', body };
  }

  function parseStatement() {
    if (check('LET')) return parseLet();
    if (check('PRINT')) return parsePrint();
    if (check('IF')) return parseIf();
    if (check('WHILE')) return parseWhile();
    if (check('{')) return parseBlock();
    if (check('IDENT') && tokens[pos + 1] && tokens[pos + 1].type === '=') return parseAssign();
    return parseExprStatement();
  }

  function parseLet() {
    expect('LET');
    const name = expect('IDENT').value;
    expect('=');
    const init = parseExpression();
    expect(';');
    return { type: 'Let', name, init };
  }

  function parseAssign() {
    const name = expect('IDENT').value;
    expect('=');
    const value = parseExpression();
    expect(';');
    return { type: 'Assign', name, value };
  }

  function parsePrint() {
    expect('PRINT');
    const expr = parseExpression();
    expect(';');
    return { type: 'Print', expr };
  }

  function parseBlock() {
    expect('{');
    const body = [];
    while (!check('}')) {
      body.push(parseStatement());
    }
    expect('}');
    return { type: 'Block', body };
  }

  function parseIf() {
    expect('IF');
    expect('(');
    const test = parseExpression();
    expect(')');
    const cons = parseBlock();
    let alt = null;
    if (check('ELSE')) {
      next();
      alt = check('IF') ? parseIf() : parseBlock();
    }
    return { type: 'If', test, cons, alt };
  }

  function parseWhile() {
    expect('WHILE');
    expect('(');
    const test = parseExpression();
    expect(')');
    const body = parseBlock();
    return { type: 'While', test, body };
  }

  function parseExprStatement() {
    const expr = parseExpression();
    expect(';');
    return { type: 'ExprStmt', expr };
  }

  function parseExpression() { return parseOr(); }

  function parseOr() {
    let left = parseAnd();
    while (check('||')) {
      next();
      left = { type: 'Logical', op: '||', left, right: parseAnd() };
    }
    return left;
  }

  function parseAnd() {
    let left = parseEquality();
    while (check('&&')) {
      next();
      left = { type: 'Logical', op: '&&', left, right: parseEquality() };
    }
    return left;
  }

  function parseEquality() {
    let left = parseRelational();
    while (check('==') || check('!=')) {
      const op = next().type;
      left = { type: 'Binary', op, left, right: parseRelational() };
    }
    return left;
  }

  function parseRelational() {
    let left = parseAdditive();
    while (['<', '>', '<=', '>='].includes(peek().type)) {
      const op = next().type;
      left = { type: 'Binary', op, left, right: parseAdditive() };
    }
    return left;
  }

  function parseAdditive() {
    let left = parseMultiplicative();
    while (peek().type === '+' || peek().type === '-') {
      const op = next().type;
      left = { type: 'Binary', op, left, right: parseMultiplicative() };
    }
    return left;
  }

  function parseMultiplicative() {
    let left = parseUnary();
    while (['*', '/', '%'].includes(peek().type)) {
      const op = next().type;
      left = { type: 'Binary', op, left, right: parseUnary() };
    }
    return left;
  }

  function parseUnary() {
    if (peek().type === '!' || peek().type === '-') {
      const op = next().type;
      return { type: 'Unary', op, arg: parseUnary() };
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const tok = peek();

    if (tok.type === 'NUMBER') { next(); return { type: 'Literal', value: tok.value }; }
    if (tok.type === 'STRING') { next(); return { type: 'Literal', value: tok.value }; }
    if (tok.type === 'TRUE') { next(); return { type: 'Literal', value: true }; }
    if (tok.type === 'FALSE') { next(); return { type: 'Literal', value: false }; }
    if (tok.type === 'IDENT') { next(); return { type: 'Identifier', name: tok.value }; }

    if (tok.type === '(') {
      next();
      const expr = parseExpression();
      expect(')');
      return expr;
    }

    throw new Error(`unexpected token '${tok.type}' on line ${tok.line}`);
  }

  return parseProgram();
}