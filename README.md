# Transmetro Client Admin

This is the administration panel for the Transmetro system. It provides a comprehensive dashboard for administrators to monitor and manage various aspects of the transport network, including buses, stations, routes (roads), alerts, and user accounts. The application is built as a single-page application (SPA) focused on performance and usability.

## Tech Stack

The project is built using modern web technologies:

- **Core:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling & UI Components:** [Tailwind CSS](https://tailwindcss.com/) & [@material-tailwind/react](https://www.material-tailwind.com/)
- **Maps:** [Leaflet](https://leafletjs.com/) & [react-leaflet](https://react-leaflet.js.org/)
- **Charts:** [Recharts](https://recharts.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons & Notifications:** [lucide-react](https://lucide.dev/), [react-hot-toast](https://react-hot-toast.com/)

## Folder Structure

The source code follows a feature-based modular structure to maintain a scalable and clean codebase.

```text
src/
├── app/                  # Application core, main entry points, layouts, and routing
│   ├── layouts/          # Global layouts (e.g., DashboardPage)
│   ├── router/           # React Router configuration and protected routes
│   ├── App.jsx           # Root component
│   └── main.jsx          # Application entry point
├── assets/               # Static assets like images and global CSS
├── features/             # Feature modules (each contains its components, pages, and store)
│   ├── alerts/           # Alerts management
│   ├── auth/             # Authentication (Login, Forgot Password)
│   ├── buses/            # Bus fleet management
│   ├── dashboard/        # Dashboard overview and charts
│   ├── roads/            # Roads/Routes management
│   ├── stations/         # Stations management
│   └── users/            # Administrator users management
├── shared/               # Shared UI components and utilities across features
│   └── components/       # Common components (Navbar, Sidebar, etc.)
└── styles/               # Global styles and Tailwind configuration
```

## Routes / Pages

The application defines the following routes for navigation:

- `/` : Root path, auto-redirects to `/dashboard` if authenticated, otherwise to `/auth`.
- `/auth` : Authentication page (Login and Forgot Password).
- `/dashboard` : Main dashboard overview containing charts and general statistics.
- `/dashboard/roads` : Roads and routes management.
- `/dashboard/stations` : Transmetro stations management.
- `/dashboard/buses` : Buses and fleet management.
- `/dashboard/alerts` : System alerts management and monitoring.
- `/dashboard/users` : Administrator accounts management.
- `/*` : Wildcard catch-all route redirecting back to authentication.

## Scripts

Available npm/pnpm scripts defined in `package.json`:

- `dev` : Starts the development server using Vite.
- `build` : Builds the app for production.
- `preview` : Locally previews the production build.
- `lint` : Runs ESLint to analyze the code for potential issues.
