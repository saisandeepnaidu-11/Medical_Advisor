import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  Pill,
  ShoppingCart,
  FileText,
  MessageSquare,
  Brain,
  Users,
  Package,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

const navLinks = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/medications', label: 'Medications', icon: Package },
  ],
  doctor: [
    { to: '/doctor', label: 'Patients', icon: Users },
    { to: '/doctor/ai-advisor', label: 'AI Advisor', icon: Brain },
    { to: '/doctor/disease-prediction', label: 'Prediction', icon: Activity },
    { to: '/doctor/health-wellbeing', label: 'Wellbeing', icon: HeartPulse },
  ],
  patient: [
    { to: '/patient', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/shop', label: 'Shop', icon: ShoppingCart },
    { to: '/patient/orders', label: 'Orders', icon: Pill },
    { to: '/patient/reports', label: 'Reports', icon: FileText },
    { to: '/patient/chat', label: 'Chat', icon: MessageSquare },
  ],
};

const roleBadgeColors = {
  admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  doctor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  patient: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

export default function Navbar() {
  const { appUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!appUser) return null;

  const links = navLinks[appUser.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`/${appUser.role}`} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-bold text-lg gradient-text">Health Adviser</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  location.pathname === to
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center gap-3">
            <span className={cn(
              'text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wider',
              roleBadgeColors[appUser.role]
            )}>
              {appUser.role}
            </span>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                  {appUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-300 max-w-24 truncate">{appUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 glass-dark rounded-xl shadow-2xl border border-emerald-900/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white truncate">{appUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{appUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-1 animate-fade-in-up">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                location.pathname === to
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="border-t border-white/10 pt-3 mt-3">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                {appUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{appUser.name}</p>
                <p className="text-xs text-slate-400">{appUser.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
