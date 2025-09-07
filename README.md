# Blindfolded 3x3x3 Cube Memo Generator

A web tool for generating memo sequences to solve a 3x3 Rubik's Cube blindfolded.
Inspired by the [MemoGenerator for Blindsolving](https://play.google.com/store/apps/details?id=de.jojo.memogenerator) Android app.

---

## ✨ Features & 🛠️ Roadmap

### Features

- [x] Custom buffer selection
- [x] Custom cycle break priority
- [x] Cube Preview with [Cubing.js](https://js.cubing.net/cubing/twisty/) + orientation selection
- [x] Option to show flipped edges/corners separately
- [x] Scramble only Edges / Corners + Blindfoled scramble
- [x] Support for Pseudo Swapping
- [x] Support for wide moves and cube rotations
- [x] Hyperlink letterpair to [BLDDB](https://v2.blddb.net/)
- [x] Customizable Letter Scheme
- [x] Customizable Letter Pair
- [x] Inline cycle break edit
- [ ] Support for Floating Buffer
- [ ] Support for LTCT, T2C
- [ ] Cycle break notation by color

### Improvements

- [x] UI improvements
- [ ] Refactor and clean up codebase
- [ ] Clearer descriptions and instructions
- [ ] More documentation and usage examples

---

## 🚀 Getting Started

1. Open the app in your browser: [memo3bld.com](memo3bld.com)
2. Set your buffer, priority, and scheme in the options panel.
3. Click the "Scramble" button to generate a new scramble.
4. The result will be displayed automatically. You can modify the order of cycles or search corresponding 3style algorithms in [BLDDB](https://v2.blddb.net/)
5. You can even display custom letterpairs, such as "AP" -> "Apple".

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** the repository.
2. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature-name
   ```
5. **Open a pull request** describing your changes.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
