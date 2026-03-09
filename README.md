# Admission Form (React)

Converted the original static form into a small React app using Vite.

Quick start:

1. Install deps:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Open http://localhost:5173 in your browser to see the React form.

The application entrypoint is `src/main.jsx`, which mounts `src/App.jsx`. Styles live in `src/index.css` and Bootstrap/FontAwesome are pulled in via CDN in `index.html`.

The form itself has been refactored into several components under `src/components`:
- `Stepper.jsx` (progress indicator)
- `StudentInfo.jsx`, `ParentInfo.jsx`, `Education.jsx`, `Subjects.jsx`, `Documents.jsx`, `Auxiliaries.jsx`, `Review.jsx` for each step

This makes the code easier to maintain and extend.

The original `form.html`, `form.css`, `form.js`, and `script.js` are preserved in the root directory for reference but are no longer used by the React build.
