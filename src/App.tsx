import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import { ProtectedRoute } from './components/Routes/ProtectedRoute'
import { PublicRoute } from './components/Routes/PublicRoute'
import './App.scss'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  )
}

export default App
