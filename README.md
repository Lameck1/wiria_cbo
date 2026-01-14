# WIRIA CBO - Frontend

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

The official frontend application for the **WIRIA Community Based Organization**. Built with modern technologies to provide a high-performance, accessible, and responsive platform for social impact and community management.

---

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/) (Concurrent rendering, Server Components ready)
- **Build Tool**: [Vite 6](https://vitejs.dev/) (Ultra-fast HMR and bundling)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) (Utility-first system)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Client-side) & [TanStack Query v5](https://tanstack.com/query/latest) (Server state)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) (Schema-based validation)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: [React Router 6](https://reactrouter.com/)

---

## 🛠 Features

| Module | Description |
| :--- | :--- |
| **Admin Dashboard** | Real-time statistics, trend charts, and management panels for applications, memberships, and safeguarding cases. |
| **Membership Portal** | Multi-step registration, login, and customized member activities/meetings. |
| **Donation System** | Integrated flow for processing community support and tracking history. |
| **HR & Careers** | Management of job listings, volunteer opportunities, and tender applications. |
| **Safeguarding** | Secure reporting and case management for community protection. |
| **Resources & News** | Dynamic CMS for publishing updates, policy documents, and community tools. |

---

## 📂 Project Structure

The project follows a **Feature-based Component Architecture**, promoting scalability and separation of concerns.

```text
src/
├── app/          # Application-wide providers, routing, and store
├── features/     # Encapsulated logic, components, and hooks per feature
│   ├── admin/    # Dashboard, statistics, and administrative tools
│   ├── auth/     # Unified login systems (Member/Staff)
│   ├── membership/ # Registration and member profile logic
│   └── ...       # Other modular features
├── pages/        # Route-level components mapping features together
├── shared/       # Reusable UI components, hooks, utilities, and constants
└── styles/       # Global CSS and Tailwind configurations
```

---

## ⚙️ Development

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📜 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Compile TypeScript and build for production.
- `npm run test`: Run the test suite with Vitest.
- `npm run lint`: Check the code for linting errors.
- `npm run lint:fix`: Auto-fix linting errors.
- `npm run format`: Prettify code using Prettier.
- `npm run type-check`: Run TypeScript type checking.
- `npm run deploy`: Automated deployment to GitHub Pages.

### Code Quality Scripts
- `npm run audit:full`: Run all quality checks (deps, code, bundle, unused).
- `npm run audit:deps`: Check dependencies for security issues.
- `npm run audit:code`: Run lint and type-check.
- `npm run audit:bundle`: Analyze bundle size.
- `npm run audit:unused`: Find unused code with knip.
- `npm run fix:all`: Auto-fix linting and format issues.
- `./analyze.sh`: Generate comprehensive code quality reports.

📖 See [CODE_QUALITY.md](./CODE_QUALITY.md) for detailed documentation on code quality tools and practices.

---

## 🚢 Deployment

This application is configured for deployment via **GitHub Pages**.
1. Ensure `VITE_API_BASE_URL` is set in your environment for the build.
2. Run `npm run deploy`.
3. The build process automatically handles Hashing, Minification, and Tree Shaking.

---

## 🤝 Contributing

We follow a professional engineering standard:
1. Use **Semantic HTML** and **Tailwind CSS**.
2. All new forms must use the unified `Form` abstraction in `shared/components/ui/form`.
3. Ensure all API calls are typed and wrapped in TanStack Query.
4. Run `npm run fix:all` before committing.
5. Ensure `npm run type-check` passes.

📖 See [CODE_QUALITY.md](./CODE_QUALITY.md) for comprehensive code quality guidelines, tools, and best practices.

---
© 2026 WIRIA CBO. Licensed under MIT.
