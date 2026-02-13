import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router";
import { AuthContext } from "../context/auth/AuthContext.tsx";

import Home from "../views/home/index.tsx";
import Register from "../views/auth/register.tsx";
import Login from "../views/auth/login.tsx";
import Dashboard from "../views/admin/dashboard/index.tsx";
import Users from "../views/admin/users/index.tsx";
import Documents from "../views/admin/documents/index.tsx";
import ChatView from "../views/admin/chat/index.tsx";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated ?? false;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated ?? false;
  return isAuthenticated ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/documents"
        element={
          <PrivateRoute>
            <Documents />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/chats"
        element={
          <PrivateRoute>
            <ChatView />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
