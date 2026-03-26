# ✨ JX Photocard Gallery

A premium, highly modular Single Page Application (SPA) designed specifically for serious Photocard Collectors to manage, showcase, and generate trades for their collections. Built from the ground up prioritizing high-end aesthetics, comprehensive global sync, and desktop-class architectures.

## 🚀 Features

### 1. 🛡️ Dedicated Admin Gateway & Global Sync
The application is physically split into a public viewer route (`/`) and a secure Admin Dashboard (`/#/admin`). 
Through the Admin Gateway, changes you make instantly sync via Firebase to **every visitor globally**:
* **Showcase Mode:** Strip away all search bars, metadata, and buttons to give visitors an ultra-clean, portfolio-style grid with gorgeous entering animations.
* **Theme Enforcement:** Force all outside visitors into Dark Mode, Light Mode, or Pastel Mode instantly!

### 2. 💎 Premium Desktop Architecture & Aesthetics
* **3-Column Dashboard:** Search and filter your cards via a sticky left-sidebar while tracking your collection statistics and $$ portfolio value on a right-sidebar.
* **Dynamic Grid Scaling:** Viewers can instantly toggle between Small, Medium, and Large Masonry Grid layouts.
* **Frosted Glass Standardization:** The codebase uses CSS to forcefully standardize all your odd-shaped photo crops into perfect `3:4` vertical playing cards using duplicated, dynamically blurred backdrop layers for a high-end ambient glow instead of boring black bars.

### 3. 🤔 Advanced Engagement Modules
* **The Lightbox Theater:** Clicking any photocard aggressively expands the high-definition image into a center-screen lightbox, displaying custom metadata, group chips, market value, and statuses on a sleek glass sub-panel.
* **Wishlist Generator:** Click the `📸 Export Wishlist` button in the admin panel to utilize the `html2canvas` module. It instantly patches together every single card marked "Wishlist" in your database and natively downloads a `.PNG` target graphic directly to your computer to post on social media!
* **Status Analytics:** Visualizes your entire collection database (Owned, Wishlist, Incoming, Traded) through a dynamically animated glowing Donut Chart (`recharts`).
* **True Free-Form Cropping:** Added an integrated `react-cropper` allowing precise numeric zoom inputs, panning, and multiple aspect-ratio lock toggles on every photo upload.

## 🛠️ Technology Stack
* **Frontend:** React 18, Vite.
* **Routing:** React-Router-DOM (`HashRouter` optimization for GH Pages).
* **Database & Config:** Firebase (Firestore / Authing).
* **Image Hosting:** Cloudinary (Unsigned bulk uploading).
* **Modules:** `react-cropper`, `recharts`, `html2canvas`, `react-icons`.

## 📦 Setup & Deployment

### Environment Setup
You must supply a `.env` file at the root of the project to map to your Firebase and Cloudinary clusters:
```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Local Development
```bash
npm install
npm run dev
```

### Deploying to GitHub Pages
The deployment scripts are automatically bound to the `package.json`. Make sure you have created your repository on GitHub first!
```bash
npm run deploy
```
*This command bundles a minified `/dist` folder and force-pushes it to the `gh-pages` branch. Map your GitHub Pages settings strictly to the `gh-pages` branch for a flawless 60-second go-live!*
