import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Stethoscope,
  User,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Activity,
  Zap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

interface RoleOption {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
}

const roles: RoleOption[] = [
  {
    role: 'patient',
    label: 'Login as Patient',
    description: 'Access your health records, medications & chat with doctors',
    icon: User,
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/30',
  },
  {
    role: 'doctor',
    label: 'Login as Doctor',
    description: 'Monitor patients, write reports & use AI health advisor',
    icon: Stethoscope,
    gradient: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/30',
  },
  {
    role: 'admin',
    label: 'Login as Admin',
    description: 'Manage medication inventory and platform settings',
    icon: ShieldCheck,
    gradient: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-500/30',
  },
];

const features = [
  { icon: Activity, text: 'Real-time health monitoring' },
  { icon: Zap, text: 'AI-powered diagnostics' },
  { icon: Sparkles, text: 'Seamless doctor-patient chat' },
];

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (role: UserRole) => {
    setLoading(role);
    setError(null);
    try {
      await loginWithGoogle(role);
      const paths: Record<UserRole, string> = {
        patient: '/patient',
        doctor: '/doctor',
        admin: '/admin',
      };
      navigate(paths[role]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg.includes('popup-closed')) {
        setError('Sign-in window was closed. Please try again.');
      } else if (msg.includes('popup-blocked')) {
        setError('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(16, 185, 129, 0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), #0a0f1e',
      }}
    >
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-2xl shadow-emerald-500/40 mb-6 animate-pulse-glow">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3">
            <span className="gradient-text">Health Adviser</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            AI-powered healthcare platform connecting patients, doctors, and administrators
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-slate-400">
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in-up max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Role cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map(({ role, label, description, icon: Icon, gradient, glow }, i) => (
            <button
              key={role}
              onClick={() => handleLogin(role)}
              disabled={loading !== null}
              className="group relative glass rounded-2xl p-6 text-left transition-all duration-300 hover:border-white/20 card-hover disabled:opacity-60 disabled:cursor-not-allowed animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />

              {/* Icon */}
              <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} items-center justify-center mb-4 shadow-lg ${glow} group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                {label}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">{description}</p>

              {/* Google login button */}
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-semibold justify-center shadow-lg ${glow} group-hover:shadow-xl transition-all duration-300`}>
                {loading === role ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
