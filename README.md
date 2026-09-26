# 🏡 VillaSell — India's Premier Zero-Brokerage Real Estate Marketplace

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![RERA Compliant](https://img.shields.io/badge/RERA-100%25_Verified-10B981)](#-legal--rera-compliance)
[![Zero Brokerage](https://img.shields.io/badge/Brokerage-0%25_Direct_Owner-F59E0B)](#)

> **VillaSell** is a modern, high-performance real estate aggregator and property marketplace designed for discovering, buying, and renting verified luxury villas, modern high-rise apartments, commercial spaces, and sanctioned residential plots with **zero brokerage** and direct owner connectivity.

---

## 🌟 Key Features

### 1. 🔍 Comprehensive Property Discovery
- **Multi-Category Filtration**: Explore by `Buy`, `Rent`, `Commercial`, and `Plots` with instant category switching.
- **Advanced Dynamic Filters**: Filter by Top Cities (Mumbai, Bangalore, Delhi NCR, Pune, Hyderabad, Lucknow, Varanasi), BHK options (1, 2, 3, 4+ BHK / Villa), Budget ranges, Possession status (Ready to Move / Under Construction), and Furnishing.
- **Locality & Project Search**: Search bar with real-time text matching across landmarks, projects, and localities.
- **High-Converting Property Cards**: Full photo galleries, price breakdowns (₹/sq.ft), verified RERA badge, EMI estimates, and direct WhatsApp / Call actions.

### 2. ⚡ Services & Financial Tools (Housing Edge Style)
- **🏦 Home Loan Portal**: Compare leading bank interest rates (starting at 8.35%* p.a.), instant eligibility calculator, processing fee breakdown, and digital application submission.
- **👑 Housing Premium VIP Club**: Silver, Gold, and Platinum tier buyer & tenant protection memberships with dedicated Relationship Managers, priority owner contacts, and instant deselect / delete membership management.
- **🧮 Smart EMI Calculator**: Interactive loan amount, interest rate, and tenure sliders with real-time monthly EMI, principal vs. interest breakdown, and payment charts.
- **📊 AI Property Valuation Calculator**: Instant fair-market price valuation based on city, micro-locality, property type, carpet area, and age of construction.
- **🧾 Instant Rent Receipt Generator**: Generate, preview, print, and download PDF-ready HRA tax-exemption rent receipts with PAN and owner declaration details.

### 3. 📝 Free Property Posting for Owners
- 4-step streamlined listing wizard: Basic info, exact locality, pricing & dimensions, amenities, and high-resolution photo uploads.
- Instant listing publication with zero commission fees.

### 4. 🔒 Legal & Compliance (Ready for Google Live Verification)
- **Privacy Policy**: Full disclosure on data collection, zero-spam protocols, and SSL/TLS data security.
- **Terms of Service**: Detailed marketplace facilitator terms, fair-use policies, and user agreements.
- **RERA Compliance**: Disclosure of state RERA authorities (MahaRERA, Karnataka RERA, UP RERA, HRERA) and verified registration codes.
- **Cookie Policy**: Transparent documentation on local storage usage and client-side shortlist management.

---

## 🚀 SEO & Search Engine Optimization

VillaSell is pre-configured with top-ranking SEO assets for Google search indexing:
- **Rich Meta Tags**: Tailored meta descriptions, high-intent Hindi & English keywords (`villa sell`, `real estate india`, `ghar khareedne ke liye`, `luxury villas`, `flat khareedein`, `zero brokerage`).
- **Schema.org Structured Data**: Embedded JSON-LD tags for `RealEstateAgent` and `WebSite` with Google Sitelinks `SearchAction`.
- **OpenGraph & Twitter Cards**: High-res social share previews (`1200x630`) for WhatsApp, Facebook, LinkedIn, and X/Twitter.
- **Robots.txt & Sitemap.xml**: Located in `/public/` for automated Googlebot and Bingbot web crawling.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Modern UI components with functional hooks |
| **TypeScript** | Strict type safety across property schemas and filters |
| **Vite 8** | Ultra-fast development server and optimized production bundling |
| **Tailwind CSS v4** | Clean, responsive, utility-first styling with zero runtime CSS overhead |
| **Lucide React** | Consistent, accessible iconography |
| **Local Storage API** | Fast, client-side persistence for shortlists, rent receipts, and active memberships |

---

## 📁 Project Architecture

```
villasell/
├── public/
│   ├── robots.txt              # Search engine crawler instructions
│   └── sitemap.xml             # XML sitemap for Google indexing
├── src/
│   ├── components/
│   │   ├── CustomDropdown.tsx  # Fast, custom accessible dropdowns (no OS black box glitch)
│   │   ├── EmiCalculatorView.tsx # Interactive home loan EMI tool
│   │   ├── Footer.tsx          # Comprehensive directory, cities, and policy links
│   │   ├── HeroSearch.tsx      # Main search hero with city graphics & quick filters
│   │   ├── HomeLoanView.tsx    # Bank home loan comparison and lead submission
│   │   ├── HousingPremiumView.tsx # VIP membership tiers with Delete/Deselect options
│   │   ├── LegalView.tsx       # Privacy Policy, Terms, RERA, and Cookie legal pages
│   │   ├── Navbar.tsx          # Sticky navigation with city selector and Services menu
│   │   ├── PostPropertyModal.tsx # Free owner listing wizard
│   │   ├── PropertyCard.tsx    # Property card with image carousel & WhatsApp connect
│   │   ├── PropertyValuationView.tsx # Real estate fair-market price estimator
│   │   ├── RentReceiptView.tsx # HRA tax exemption rent receipt generator
│   │   └── ServicesDropdown.tsx # Instant Housing Edge & Tools navigation menu
│   ├── data/
│   │   └── mockProperties.ts   # Curated Indian real estate dataset & brand config
│   ├── types/
│   │   └── property.ts         # TypeScript data contracts & models
│   ├── App.tsx                 # Root application controller and routing
│   ├── index.css               # Global typography, color schemes & Tailwind imports
│   └── main.tsx                # React DOM entry point
├── index.html                  # SEO metadata, OpenGraph, JSON-LD schema
├── metadata.json               # Application manifest
├── package.json                # Project dependencies and build scripts
└── vite.config.ts              # Vite bundling configuration
```

---

## 💻 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/villasell.git
   cd villasell
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The compiled production output will be in the `dist/` directory.

5. **Typecheck & Linting**:
   ```bash
   npm run lint
   ```

---

## 🌐 Deploying to GitHub & Custom Domain

### Option 1: Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**.
6. Under **Project Settings > Domains**, connect your custom domain (e.g. `villasell.in`).

### Option 2: Deploy to Netlify
1. Push your repository to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and choose **"Import an existing project"**.
3. Set Build Command to `npm run build` and Publish Directory to `dist`.
4. Click **Deploy Site** and configure your custom domain in **Domain management**.

### Option 3: GitHub Pages
1. In `vite.config.ts`, ensure `base: './'` or your repo path is configured.
2. Run `npm run build`.
3. Deploy the `dist` folder to the `gh-pages` branch.

---

## 📞 Support & Inquiries

- **Helpline Phone**: [+91 8383826205](tel:+918383826205)
- **WhatsApp Support**: [+91 8383826205](https://wa.me/918383826205)
- **Official Email**: [support@villasell.in](mailto:support@villasell.in)
- **RERA Registration**: `UPRERA2026/VILLASELL`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
