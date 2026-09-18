const BINOP_TO_OP = {
  '+': 'ADD', '-': 'SUB', '*': 'MUL', '/': 'DIV', '%': 'MOD',
  '==': 'EQ', '!=': 'NEQ', '<': 'LT', '>': 'GT', '<=': 'LTE', '>=': 'GTE',
};

function compile(ast) {
  const code = [];

  function emit(op, arg) {
    code.push(arg === undefined ? { op } : { op, arg });
    return code.length - 1;
  }

  function patch(index, target) {
    code[index].arg = target;
  }

  function compileNode(node) {
    switch (node.type) {
      case 'Program':
        node.body.forEach(compileNode);
        emit('HALT');
        break;

      case 'Block':
        node.body.forEach(compileNode);
        break;

      case 'Let':
        compileNode(node.init);
        emit('STORE', node.name);
        break;

      case 'Assign':
        compileNode(node.value);
        emit('STORE', node.name);
        break;

      case 'Print':
        compileNode(node.expr);
        emit('PRINT');
        break;

      case 'ExprStmt':
        compileNode(node.expr);
        emit('POP');
        break;

      case 'If': {
        compileNode(node.test);
        const jmpfIdx = emit('JMPF');
        compileNode(node.cons);
        if (node.alt) {
          const jmpIdx = emit('JMP');
          patch(jmpfIdx, code.length);
          compileNode(node.alt);
          patch(jmpIdx, code.length);
        } else {
          patch(jmpfIdx, code.length);
        }
        break;
      }

      case 'While': {
        const start = code.length;
        compileNode(node.test);
        const jmpfIdx = emit('JMPF');
        compileNode(node.body);
        emit('JMP', start);
        patch(jmpfIdx, code.length);
        break;
      }

      case 'Logical':
        compileNode(node.left);
        compileNode(node.right);
        emit(node.op === '&&' ? 'AND' : 'OR');
        break;

      case 'Binary':
        compileNode(node.left);
        compileNode(node.right);
        emit(BINOP_TO_OP[node.op]);
        break;

      case 'Unary':
        compileNode(node.arg);
        emit(node.op === '-' ? 'NEG' : 'NOT');
        break;

      case 'Literal':
        emit('PUSH', node.value);
        break;

      case 'Identifier':
        emit('LOAD', node.name);
        break;

      default:
        throw new Error(`compiler doesn't know how to handle '${node.type}'`);
    }
  }

  compileNode(ast);
  return code;
}