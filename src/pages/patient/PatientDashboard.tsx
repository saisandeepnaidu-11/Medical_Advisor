import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Order } from '../../types';
import {
  ShoppingCart,
  MessageSquare,
  FileText,
  Activity,
  TrendingUp,
  Pill,
  ArrowRight,
} from 'lucide-react';

export default function PatientDashboard() {
  const { appUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [chatsCount, setChatsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);

  useEffect(() => {
    if (!appUser) return;

    const q1 = query(collection(db, 'orders'), where('patientId', '==', appUser.uid));
    const unsub1 = onSnapshot(q1, (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }))));

    const q2 = query(collection(db, 'chats'), where('participants', 'array-contains', appUser.uid));
    const unsub2 = onSnapshot(q2, (snap) => setChatsCount(snap.size));

    const q3 = query(collection(db, 'reports'), where('patientId', '==', appUser.uid));
    const unsub3 = onSnapshot(q3, (snap) => setReportsCount(snap.size));

    return () => { unsub1(); unsub2(); unsub3(); };
  }, [appUser]);

  const recentOrders = orders
    .sort((a, b) => {
      const aTs = (a.createdAt as unknown as { toMillis?: () => number })?.toMillis?.() ?? 0;
      const bTs = (b.createdAt as unknown as { toMillis?: () => number })?.toMillis?.() ?? 0;
      return bTs - aTs;
    })
    .slice(0, 5);

  const completedOrders = orders.filter((o) => o.status === 'completed').length;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, link: '/patient/orders', color: 'from-emerald-500 to-teal-600', bg: 'from-emerald-500/10 to-teal-600/5' },
    { label: 'Active Chats', value: chatsCount, icon: MessageSquare, link: '/patient/chat', color: 'from-blue-500 to-indigo-600', bg: 'from-blue-500/10 to-indigo-600/5' },
    { label: 'Health Reports', value: reportsCount, icon: FileText, link: '/patient/reports', color: 'from-purple-500 to-violet-600', bg: 'from-purple-500/10 to-violet-600/5' },
    { label: 'Completed', value: completedOrders, icon: TrendingUp, link: '/patient/orders', color: 'from-amber-500 to-orange-600', bg: 'from-amber-500/10 to-orange-600/5' },
  ];

  const formatDate = (date: unknown) => {
    try {
      const ts = date as { toDate?: () => Date };
      const d = ts.toDate ? ts.toDate() : new Date(date as string);
      return d.toLocaleDateString();
    } catch { return '—'; }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Good day</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Welcome, <span className="gradient-text">{appUser?.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 mt-1">Here's an overview of your health activities</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, link, color, bg }, i) => (
            <Link
              key={label}
              to={link}
              className={`glass rounded-2xl p-5 bg-gradient-to-br ${bg} card-hover animate-fade-in-up block`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${color} items-center justify-center mb-3 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-slate-400 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="glass rounded-2xl p-6 mb-8 animate-fade-in-up">
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { to: '/patient/shop', label: 'Browse Medications', icon: Pill, color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-400/50', textColor: 'text-emerald-400' },
              { to: '/patient/chat', label: 'Chat with Doctor', icon: MessageSquare, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-400/50', textColor: 'text-blue-400' },
              { to: '/patient/reports', label: 'View Reports', icon: FileText, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-400/50', textColor: 'text-purple-400' },
            ].map(({ to, label, icon: Icon, color, textColor }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-br ${color} border transition-all group`}
              >
                <Icon className={`w-5 h-5 ${textColor}`} />
                <span className={`font-medium text-sm ${textColor}`}>{label}</span>
                <ArrowRight className={`w-4 h-4 ${textColor} ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="glass rounded-2xl overflow-hidden animate-fade-in-up">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <Link to="/patient/orders" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500">No orders yet</p>
              <Link to="/patient/shop" className="text-emerald-400 text-sm hover:underline mt-2 inline-block">
                Browse medications →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Date', 'Medication', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-3 text-sm text-slate-400">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-3 text-sm text-slate-300">{order.medicationName || 'Medication'}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-emerald-400">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                          order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
