# Stack Flow VM

A browser-based domain language runtime written without third-party frameworks. It takes custom string input, lexes it into discrete tokens, constructs a abstract syntax tree, lowers that tree into linear stack-based bytecode instructions, and evaluates the final result in a virtual machine runtime.

## How It Works
```bash
+-------------+     +--------+     +--------+     +----------+     +------------+
| Source Text | --> | Lexer  | --> | Parser | --> | Compiler | --> | Stack VM   |
+-------------+     +--------+     +--------+     +----------+     +------------+
|              |               |                   |
Tokens          AST          Bytecode             Console
```

1. **Lexical Analysis (`lexer.js`)**: Converts string primitives into token streams with tracked source coordinates.
2. **Grammar Parsing (`parser.js`)**: Applies recursive descent parsing to turn tokens into an Abstract Syntax Tree (AST) while enforcing operator precedence.
3. **Bytecode Compilation (`compiler.js`)**: Walks the AST using the Visitor pattern, emitting sequential stack instructions (`PUSH`, `STORE`, `JMPF`) and backpatching jump targets for control flow blocks.
4. **Execution Runtime (`vm.js`)**: Runs a fetch-decode-execute loop against internal evaluation stacks and variable lookup maps.

## Key Features

* **Manual Lexing & Token Tracking**: Handles double-quoted strings, numeric floating values, operators, keywords, and single-line comment skipping with line-number metadata for diagnostics.
* **Precedence-Aware Operator Parsing**: Handles mathematical, relational, and logical evaluation rules directly in the recursive parser structure.
* **Control Flow Backpatching**: Compiles `if/else` conditions and `while` loop cycles into flat instruction arrays using instruction pointer manipulation.
* **Inspector Interface**: Provides live tab switching between AST JSON views, disassembly bytecode output, and execution logs.

## Tech Stack Breakdown

* **Language**: Vanilla ECMAScript (ES6+)
* **Styling**: Standard CSS (Grid/Flexbox Layouts, Dark Theme Variable Palette)
* **DOM Driver**: Plain JavaScript event handlers binding editor controls and view switches

## Local & Web Setup

### GitHub Codespaces (Browser Only)
1. Click **Code** at the top right of this repository.
2. Select the **Codespaces** tab and click **Create codespace on main**.
3. Once loaded, start a simple HTTP server using Python:
   ```bash
   python3 -m http.server 8000
   ```
4. Open the forwarded port in your browser tab.

### Local Development

1. Clone the repository:
   ```text
   git clone [https://github.com/](https://github.com/)<your-username>/stack-flow-vm.git
   ```
2. Navigate into the root folder:
    ```text
   cd stack-flow-vm
   ```
3. Open index.html directly in any web browser or use a live server extension.

## Repository Structure

```bash
.
├── .github/
│   └── workflows/
│       └── code-health.yml   # Structural code health check
├── index.html                # Workspace shell and pane layout
├── style.css                 # CSS styles for code panels
├── lexer.js                  # Tokenizer with line location tracking
├── parser.js                 # Recursive descent parser producing AST
├── compiler.js               # AST-to-Bytecode compiler with jump offset patching
├── vm.js                     # Fetch-decode-execute loop and stack state manager
├── script.js                 # DOM glue, view switcher, and runtime runner
├── .gitignore                # Workspace ignore file
└── LICENSE                   # MIT License text
```

## Roadmap

[ ] Add support for user-defined function declarations and call stack frames (CALL, RET).

[ ] Add array literals and indexing instructions inside the compiler and VM loop.

[ ] Support step-by-step bytecode execution with visual stack inspection controls.
