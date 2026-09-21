import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LayoutDashboard, Apple, Activity, User } from 'lucide-react';

export default function Layout() {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Apple, label: 'Food', path: '/food' },
        { icon: Activity, label: 'Activity', path: '/activity' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="layout-container">
            <Sidebar />
            <main className="flex-1 w-full lg:max-h-screen lg:overflow-y-auto">
                <Outlet />
            </main>

            {/* Mobile Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 pb-safe z-50">
                <div className="flex items-center justify-around p-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center p-2 rounded-xl transition-colors ${
                                    isActive
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-slate-400 hover:text-slate-600'
                                }`
                            }
                        >
                            <item.icon className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}
