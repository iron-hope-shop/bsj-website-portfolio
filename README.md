 <!-- TODO
1. rick roll
2. spotify app -->

# Brad Jackson Portfolio 🧑🏻‍💻

Welcome to my interactive 3D portfolio—a modern, Vite-powered frontend that showcases my work as a Software Architect and Computer Systems Engineer. This project blends an immersive 3D scene with a virtual desktop simulation and even a built‑in terminal, all designed for a smooth, engaging user experience.

---

## Overview

This portfolio is built entirely with modern web technologies, including React, Three.js, and react‑three‑fiber. It delivers an interactive desktop environment with dynamic UI overlays, smooth GSAP animations, and a responsive design that works flawlessly on both desktop and mobile devices. Deployed on Google Cloud Platform App Engine, it offers a lightning‑fast, scalable solution for showcasing my work.

---

## About Me

I'm Brad Jackson—a Software Architect and Computer Systems Engineer with over 7 years of professional experience. My passion lies in creating scalable, cost‑saving solutions that seamlessly integrate cloud architecture, cybersecurity, and automation to solve real‑world challenges.

---

## Features 🚀

- **Immersive 3D Scene:** Navigate through an interactive 3D environment powered by Three.js and react‑three‑fiber.
- **Desktop Simulation:** Experience a virtual computer OS complete with draggable icons, movable windows, and a custom taskbar.
- **Virtual Terminal:** Engage with a simulated command‑line interface that brings a touch of old‑school tech charm.
- **Dynamic Overlays:** Enjoy responsive login screens, info panels, and custom sliders that enhance user interaction.
- **Responsive & Scalable:** Built using Vite for rapid development and deployed on GCP App Engine for reliable performance.

---

## Application Routes 🛣️

The project leverages **react-router-dom** to manage client-side routing and dynamically adjust the 3D scene and UI based on the current route:

- **`/`** – The default view featuring the immersive 3D scene with no specific mode active.
- **`/gallery`** – Activates the left wall camera view for the gallery experience.
- **`/bookshelf`** – Switches to the right wall camera view to explore the bookshelf.
- **`/computer`** – Engages the computer view, where you can interact with the virtual computer OS overlay (e.g., login, desktop apps).
- **`/desktop`** – Directly renders the desktop environment (auto‑logged in), providing a full desktop simulation.

Each route not only changes the visible components but also triggers smooth camera animations and state transitions to match the intended view.

---

## Architecture & Components 🧩

Key components include:

- **Application Core:**  
  - `App.jsx` & `main.jsx` – Entry points that handle routing, state management, and scene initialization.
  
- **3D Scene & Camera:**  
  - `Model.jsx`, `WireframeSphere.jsx`, `TargetedDirectionalLight.jsx`, `CameraUpdater.jsx` – Create the immersive 3D environment.
  
- **Desktop Environment:**  
  - `Desktop.jsx`, `DesktopIcon.jsx`, `MovableWindow.jsx`, `Taskbar.jsx` – Simulate a computer desktop with window management.
  
- **UI Overlays & Interactions:**  
  - `ComputerOS.jsx`, `LoginOverlay.jsx`, `InfoOverlay.jsx`, `Loader.jsx`, `CustomSlider.jsx` – Manage user overlays and interactive UI elements.
  
- **Utility Components:**  
  - `Terminal.jsx`, `SimpleButton.jsx`, `useIsMobileDevice.jsx` – Enhance interactivity and responsiveness.

---

## Technology Stack 🛠️

- **Frontend:** React, Vite, and modern CSS.
- **3D Graphics:** Three.js, react‑three‑fiber, and @react‑three/drei.
- **Animations:** GSAP for smooth transitions and camera animations.
- **Routing:** React Router for client‑side navigation.
- **Deployment:** Google Cloud Platform App Engine (configured via `app.yaml`).

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Deployment ☁️

This portfolio is deployed on **Google Cloud Platform App Engine**. After building the project, deploy with:
```bash
gcloud app deploy
```
Deployment settings are defined in the `app.yaml` file.

---

## License 📜

This project is open source and available under the [MIT License](./LICENSE).

---

## Contact & Connect

- **Website:** [brad-jackson.com](https://brad-jackson.com)
- **Email:** [me@brad-jackson.com](mailto:me@brad-jackson.com)
- **LinkedIn:** [Brad Jackson](https://www.linkedin.com/in/bradley-jackson-a73a92191/)
