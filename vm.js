function run(code, onPrint) {
  const stack = [];
  const vars = {};
  let pc = 0;

  const push = v => stack.push(v);
  const pop = () => stack.pop();

  while (pc < code.length) {
    const instr = code[pc];

    switch (instr.op) {
      case 'PUSH':
        push(instr.arg);
        break;

      case 'POP':
        pop();
        break;

      case 'LOAD':
        if (!(instr.arg in vars)) throw new Error(`'${instr.arg}' is not defined`);
        push(vars[instr.arg]);
        break;

      case 'STORE':
        vars[instr.arg] = pop();
        break;

      case 'ADD': { const b = pop(), a = pop(); push(a + b); break; }
      case 'SUB': { const b = pop(), a = pop(); push(a - b); break; }
      case 'MUL': { const b = pop(), a = pop(); push(a * b); break; }
      case 'DIV': { const b = pop(), a = pop(); push(a / b); break; }
      case 'MOD': { const b = pop(), a = pop(); push(a % b); break; }

      case 'EQ':  { const b = pop(), a = pop(); push(a === b); break; }
      case 'NEQ': { const b = pop(), a = pop(); push(a !== b); break; }
      case 'LT':  { const b = pop(), a = pop(); push(a < b); break; }
      case 'GT':  { const b = pop(), a = pop(); push(a > b); break; }
      case 'LTE': { const b = pop(), a = pop(); push(a <= b); break; }
      case 'GTE': { const b = pop(), a = pop(); push(a >= b); break; }

      case 'AND': { const b = pop(), a = pop(); push(Boolean(a && b)); break; }
      case 'OR':  { const b = pop(), a = pop(); push(Boolean(a || b)); break; }

      case 'NEG': push(-pop()); break;
      case 'NOT': push(!pop()); break;

      case 'JMP':
        pc = instr.arg;
        continue;

      case 'JMPF':
        if (!pop()) { pc = instr.arg; continue; }
        break;

      case 'PRINT':
        onPrint(pop());
        break;

      case 'HALT':
        return;

      default:
        throw new Error(`vm hit unknown instruction '${instr.op}'`);
    }

    pc++;
  }
}