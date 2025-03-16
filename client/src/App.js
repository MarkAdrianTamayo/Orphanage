import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { routes } from './router/router';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Modify routes to wrap protected routes with ProtectedRoute
const protectedRoutes = routes.map(route => {
  // List of routes that should be protected
  const protectedPaths = [
    '/dashboard',
    '/dashboard/',
    '/dashboard/recoreds',
    '/dashboard/volunteers',
    '/dashboard/calendar',
    '/dashboard/inventory'
  ];

  if (protectedPaths.includes(route.path)) {
    return {
      ...route,
      element: <ProtectedRoute>{route.element}</ProtectedRoute>
    };
  }
  if (route.children) {
    return {
      ...route,
      children: route.children.map(child => {
        const fullPath = `${route.path}/${child.path}`;
        if (protectedPaths.includes(fullPath)) {
          return {
            ...child,
            element: <ProtectedRoute>{child.element}</ProtectedRoute>
          };
        }
        return child;
      })
    };
  }
  return route;
});

const router = createBrowserRouter(protectedRoutes);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;