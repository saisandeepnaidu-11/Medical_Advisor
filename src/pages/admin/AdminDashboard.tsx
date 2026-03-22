import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Medication, Order } from '../../types';
import { Package, ShoppingCart, DollarSign, TrendingUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { appUser } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'medications'), (snap) => {
      setMedications(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Medication, 'id'>) })));
    });
    const unsub2 = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) })));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((s, o) => s + o.totalPrice, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const stats = [
    { label: 'Total Products', value: medications.length, icon: Package, color: 'from-emerald-500 to-teal-600', bg: 'from-emerald-500/10 to-teal-600/5' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'from-blue-500 to-indigo-600', bg: 'from-blue-500/10 to-indigo-600/5' },
    { label: 'Pending Orders', value: pendingOrders, icon: TrendingUp, color: 'from-amber-500 to-orange-600', bg: 'from-amber-500/10 to-orange-600/5' },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'from-purple-500 to-violet-600', bg: 'from-purple-500/10 to-violet-600/5' },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="gradient-text">{appUser?.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 mt-1">Here's your platform overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
            <div
              key={label}
              className={`glass rounded-2xl p-5 bg-gradient-to-br ${bg} animate-fade-in-up card-hover`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${color} items-center justify-center mb-3 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick action */}
        <div className="glass rounded-2xl p-6 mb-8 animate-fade-in-up">
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/medications" className="btn-emerald flex items-center gap-2 text-sm bg-emerald-500 hover:bg-emerald-600">
              <Package className="w-4 h-4" />
              Manage Medications
            </Link>
            <Link to="/admin/patients" className="btn-emerald flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700">
              <User className="w-4 h-4" />
              View Patients
            </Link>
          </div>
        </div>

        {/* Recent orders */}
        <div className="glass rounded-2xl overflow-hidden animate-fade-in-up">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          </div>
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Order ID', 'Patient', 'Amount', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-400">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{order.patientId.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-400">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
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
