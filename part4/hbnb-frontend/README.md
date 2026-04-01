# HBnB Frontend

The React frontend for the HBnB project, built with **Vite**.  
This application consumes the `part4/hbnb-backend` API to display places, their details, reviews, and manage user interactions such as authentication and favorites.

## 🚀 Tech Stack

- **React 19** (Functional Components, Hooks)
- **Vite** (Build tool & Dev server)
- **React Router 7** (Routing)
- **Tailwind CSS 4** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**
- **HBnB Backend** running on the port specified in `src/constants.jsx` (default: `5000`)

### Installation & Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Production Build

```bash
npm run build
# Preview the build locally
npm run preview
```

## ✨ Key Features

- **Infinite Scrolling Home Page**: Explore places in a seamless, randomized loop with smooth scroll-snap transitions.
- **Dynamic Theming**: Support for Light and Dark modes with persistent storage in cookies.
- **User Authentication**: Login/Logout functionality with secure token management and protected routes.
- **Place Details**: Comprehensive view of place information, including amenities and owner details.
- **Review System**: View reviews for any place and submit new ones (authenticated users only).
- **Favorites Management**: Save and remove favorite places, synchronized with the backend.
- **Interactive UI**: Visual feedback for likes, smooth page transitions, and procedural gradient backgrounds for each place.

## 📁 Project Structure

- `src/App.jsx`: Main entry point, routing, and global state (auth, theme).
- `src/feature/`: Page-level components (Home, Place, User Profile, Login).
- `src/components/`: Reusable UI components (Header, ReviewCard, StarRating, etc.).
- `src/utils/`: Helper functions (Cookie management).
- `src/constants.jsx`: Global configuration (API Base URL).

## 📝 Ongoing Development (Todo)

- [ ] Implement editing and deleting own reviews.
- [ ] Allow users to view an owner's profile and their listed places.
- [ ] Add functionality to create or edit places directly from the frontend.
