import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import PublicInboxPage from "./pages/PublicInboxPage";
import AdminPage from "./pages/AdminPage";
import CardInboxPage from "./pages/CardInboxPage";
import CardPublicPage from "./pages/CardPublicPage";
import CreateCardPage from "./pages/CreateCardPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth } from "./context/AuthContext";
import PageLoader from "./components/PageLoader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader message="Checking your session…" />;
  return user ? children : <Navigate to="/auth" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader message="Checking your session…" />;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth?mode=register" replace />} />
        <Route path="/u/:username" element={<PublicInboxPage />} />
        <Route path="/c/:linkKey" element={<CardPublicPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-card"
          element={
            <ProtectedRoute>
              <CreateCardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cards/:cardId"
          element={
            <ProtectedRoute>
              <CardInboxPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
