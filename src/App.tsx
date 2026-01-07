import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { Documents } from './pages/Documents';
import { DocumentView } from './pages/DocumentView';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/Routes/ProtectedRoute';
import { PublicRoute } from './components/Routes/PublicRoute';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route index element={<Documents />} />
          <Route path="/" element={<Documents />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Documents />} />
          <Route path="/recent" element={<Documents />} />
          <Route path="/archived" element={<Documents />} />
          <Route path="/category/:category" element={<Documents />} />
        </Route>
        <Route element={<ProtectedRoute navbarVisible={false} />}>
          <Route path="/document/:id" element={<DocumentView />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

export default App;
