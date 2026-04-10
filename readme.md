# 🌐 Isometric Server Room Explorer v5

A high-fidelity, interactive 3D Data Center Monitoring interface built with **Three.js**. This prototype features a massive isometric server grid, a "Scissor-Rendered" isolation zone for server inspection, and a functional CLI-style data panel.

![Project Status](https://img.shields.io/badge/Status-Prototype-blueviolet)
![Tech Stack](https://img.shields.io/badge/Tech-Three.js%20|%20HTML5%20|%20CSS3-blue)

---

## 🚀 Features

* **Massive Isometric Grid:** View a 20x20 grid of servers with a deep perspective "Data Center" feel.
* **Dynamic Textures:** Servers are rendered with procedural textures including server blades and glowing status LEDs.
* **Isolation Zone (Inspector):** Click any server to enter an inspection mode. The selected server is isolated in a high-detail "box" on the left.
* **Scissor Rendering:** Advanced WebGL technique used to render two independent 3D scenes simultaneously with isolated lighting.
* **CLI Data Panel:** A right-side dashboard providing server specs, trace routes, and sequential website availability checks in a monospace console font.

---

## 🛠️ Installation & Setup

Because this project uses **ES Modules** and **Three.js via CDN**, it must be run through a local web server to bypass browser CORS security.

1.  **Clone the repository** (or save the files into a folder).
2.  **Launch a Local Server:**
    * **VS Code:** Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html`, and select "Open with Live Server".
    * **Python:** Run `python -m http.server 8000` in the directory.
    * **Node.js:** Run `npx serve`.
3.  **View the Project:** Navigate to `http://localhost:8000` in your browser.

---

## 📁 Project Structure

```text
server-prototype
