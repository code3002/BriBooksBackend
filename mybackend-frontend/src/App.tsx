import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { BooksPage } from "./pages/BooksPage";
import { BookReadPage } from "./pages/BookReadPage";
import { BookEditorPage } from "./pages/BookEditorPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { BookOnboardingWizard } from "./pages/BookOnboardingWizard";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:bookId" element={<BookReadPage />} />
            <Route
              path="editor"
              element={
                <ProtectedRoute>
                  <BookEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="editor/:bookId"
              element={
                <ProtectedRoute>
                  <BookEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            {/* Add more routes here */}
          </Route>
          <Route
            path="/start-writing"
            element={
              <ProtectedRoute>
                <BookOnboardingWizard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
