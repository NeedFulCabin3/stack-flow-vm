const sourceEl = document.getElementById('source');
const consoleEl = document.getElementById('console');
const astEl = document.getElementById('ast');
const bytecodeEl = document.getElementById('bytecode');
const runBtn = document.getElementById('runBtn');

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

function log(msg, isErr) {
  const line = document.createElement('div');
  if (isErr) line.className = 'err';
  line.textContent = msg;
  consoleEl.appendChild(line);
}

function formatBytecode(code) {
  return code.map((instr, idx) => {
    const num = String(idx).padStart(3, ' ');
    return instr.arg !== undefined ? `${num}  ${instr.op} ${JSON.stringify(instr.arg)}` : `${num}  ${instr.op}`;
  }).join('\n');
}

runBtn.addEventListener('click', () => {
  consoleEl.innerHTML = '';
  astEl.textContent = '';
  bytecodeEl.textContent = '';

  try {
    const tokens = tokenize(sourceEl.value);
    const ast = parse(tokens);
    astEl.textContent = JSON.stringify(ast, null, 2);

    const bytecode = compile(ast);
    bytecodeEl.textContent = formatBytecode(bytecode);

    run(bytecode, val => log(String(val)));
  } catch (err) {
    log(err.message, true);
  }
});

runBtn.click();