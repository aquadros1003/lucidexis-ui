import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import './MainLayout.scss';

export function MainLayout() {

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-layout__main">
        <Navbar />
        <div className="main-layout__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
