# Trevor's VS Code Extension

A VS Code extension that includes my personal code snippets and a powerful custom CSS/SCSS property sorter — designed to match my preferred property order, reduce visual clutter, and save serious time when writing or refactoring styles.


## 🧠 Why I Built This

I built this extension to solve a long-standing friction point I had when working with CSS and SCSS: inconsistent property order, unpredictable formatting, and subtle visual clutter that made refactoring slower than it should be. This tool saves me from falling into formatting rabbit holes — and lets me focus on functionality and flow.


## ✨ Features

- 📋 Custom CSS/SCSS property sorter (with fully customizable order)
- 💬 Preserves comments (it isn't perfect), sorts mixins like `@include`, and keeps formatting clean
- ⌨️ Keybindings:
  - `Ctrl+O`: Sort all properties in the current file
  - `Ctrl+Shift+O`: Sort all properties with additional formatting enhancements ("CSS Sorter Ultra")
  - `Ctrl+Alt+O`: Sort only selected block


## 📦 Installation

Since we are assuming you use VS Code...:

1. Clone this project. Either open the folder with `Open with Code` or `cd trevors-vs-code-extension`.
2. Open the Terminal (`Ctrl+Tilde (~)`)
3. *(Only if you plan to make edits)* Run:
    ```
    npm install
    ```
4. *(If a .vsix file already exists and you don't plan to edit anything)* Run:
    ```
    code --install-extension trevors-extension-0.0.1.vsix
    ```
5. *(If you made edits or no .vsix exists)* Run:
    ```
    vsce package
    code --install-extension trevors-extension-0.0.1.vsix
    ```


## 📁 Project Structure

```
./Trevors-VS-Code-Extension/
  ├── cssSorter.js             # Custom PostCSS-based property sorter
  ├── extension.js             # Command definitions and VS Code activation
  ├── snippets.code-snippets   # My personal reusable snippets
  ├── package.json             # Keybinds, snippets, activation triggers
  └── README.md
```

---

## 📎 Related Tools

- [VS Code](https://code.visualstudio.com/)
  - [VSCE CLI](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Node.js](https://nodejs.org/en)
  - [PostCSS](https://postcss.org/)
  - [postcss-scss](https://github.com/postcss/postcss-scss)

