import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Apple, Activity, User, LogOut, Dumbbell, MessageSquare } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Sidebar() {
    const { logout } = useContext(AppContext);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: MessageSquare, label: 'AI Coach', path: '/coach' },
        { icon: Apple, label: 'Food Logs', path: '/food' },
        { icon: Activity, label: 'Activity', path: '/activity' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 h-screen hidden lg:flex flex-col sticky top-0">
            <div className="p-6 flex items-center gap-3 text-emerald-600">
                <Dumbbell className="w-8 h-8" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">FitTrack AI</span>
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                                isActive
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
