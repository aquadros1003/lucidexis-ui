import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import { AssistantModal } from '../AssistantModal';
import { Toaster } from 'sonner';
import './MainLayout.scss';

interface MainLayoutProps {
  navbarVisible?: boolean;
}

export function MainLayout({ navbarVisible = true }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-layout__main">
        {navbarVisible && <Navbar />}
        <div className="main-layout__content">
          <Toaster position="top-right" richColors />
          <Outlet />
        </div>
      </div>
      <AssistantModal />
    </div>
  );
}
