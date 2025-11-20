import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import { Toaster } from 'sonner';
import './MainLayout.scss';

export function MainLayout() {
  
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-layout__main">
        <Navbar />
        <div className="main-layout__content">
          <Toaster position="top-right" richColors />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
