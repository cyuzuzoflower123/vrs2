import { Car, ClipboardList, FileText, LogOut, Users } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const links = isAdmin
    ? [
        { to: '/admin', label: 'Dashboard', icon: ClipboardList },
        { to: '/admin/vehicles', label: 'Vehicles', icon: Car },
        { to: '/admin/customers', label: 'Customers', icon: Users },
        { to: '/admin/reservations', label: 'Reservations', icon: ClipboardList },
        { to: '/admin/report', label: 'Report', icon: FileText }
      ]
    : [{ to: '/reservations', label: 'Reservations', icon: ClipboardList }];

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight">
            Swift Wheels
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-black text-white' : 'text-neutral-700 hover:bg-neutral-100'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
            <button className="btn-light" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
