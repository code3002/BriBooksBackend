# BriBooks Frontend

This is the frontend application for the BriBooks platform, built with React, TypeScript, and Vite. It provides a modern, responsive user interface for users to write, publish, and sell books, powered by AI.

## 🚀 Tech Stack

-   **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Routing**: [React Router DOM](https://reactrouter.com/)
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🎨 Design System

The application follows a playful yet professional design system inspired by bribooks.com:

-   **Typography**:
    -   **Headings**: "Chalkboard SE", sans-serif (Playful, child-friendly)
    -   **Body**: "Signika", sans-serif (Clean, readable)
-   **Color Palette**:
    -   **Primary**: `#3b82f6` (Blue)
    -   **Secondary**: `#f43f5e` (Rose)
    -   **Accent**: `#8b5cf6` (Violet)
-   **Components**:
    -   `Button`: Reusable button with variants (primary, secondary, outline, ghost) and sizes.
    -   `Input`: Form input with validation state and error messaging.
    -   `Header` & `Footer`: Responsive navigation components.

## 🏗️ Architecture

### Directory Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/             # Atomic components (Button, Input)
│   └── ...             # Feature components (Header, Footer)
├── context/            # Global state (AuthContext)
├── layouts/            # Page layouts (MainLayout)
├── lib/                # Utilities (cn, helpers)
├── pages/              # Route components (HomePage, LoginPage, SignupPage)
├── services/           # API integration
│   └── api/            # Service modules (auth, books, ai, etc.)
└── App.tsx             # Root component with routing
```

### Backend Integration

The frontend connects to the backend microservices via an API Gateway running on port 3000.

-   **Proxy**: Vite is configured to proxy `/api` requests to `http://localhost:3000`.
-   **Services**:
    -   Clerk handles sign-in and sign-up. `AuthContext` attaches session tokens to API requests.
    -   `books.service.ts`: Manages book creation and retrieval.
    -   `ai.service.ts`: Interfaces with AI services for story and illustration generation.

## 🛠️ Setup & Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🔐 Authentication

Set `VITE_CLERK_PUBLISHABLE_KEY` in `mybackend-frontend/.env.local` and
`CLERK_SECRET_KEY` plus `FRONTEND_URL` in the root and service environment.
Clerk handles sign-in and sign-up. Protected API requests use short-lived Clerk session tokens.

## ✅ Recent Updates

-   **Frontend-Backend Connection**: Successfully integrated `SignupPage` and `LoginPage` with the live backend.
-   **Bug Fixes**:
    -   Resolved `react-hot-toast` import issues.
    -   Fixed API Gateway body parsing to prevent request hangs.
    -   Ensured password complexity compliance in signup forms.
