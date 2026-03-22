import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Order } from '../../types';
import { ShoppingCart, Package, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function OrdersPage() {
  const { appUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appUser) return;
    const q = query(
      collection(db, 'orders'),
      where('patientId', '==', appUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) })));
      setLoading(false);
    });
    return unsub;
  }, [appUser]);

  const formatDate = (date: unknown) => {
    try {
      const ts = date as { toDate?: () => Date };
      const d = ts.toDate ? ts.toDate() : new Date(date as string);
      return format(d, 'MMM d, yyyy • h:mm a');
    } catch { return '—'; }
  };

  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.totalPrice, 0);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <p className="text-slate-400 mt-1">Track your medication orders</p>
        </div>

        {/* Stats */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Orders', value: orders.length, color: 'text-emerald-400' },
              { label: 'Pending', value: statusCounts.pending || 0, color: 'text-amber-400' },
              { label: 'Completed', value: statusCounts.completed || 0, color: 'text-blue-400' },
              { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, color: 'text-purple-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass rounded-2xl p-4 animate-fade-in-up">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-sm text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-900 border-t-emerald-500 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl animate-fade-in-up">
            <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No orders yet</p>
            <a href="/patient/shop" className="text-emerald-400 text-sm hover:underline">Browse medications →</a>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Medication', 'Date', 'Qty', 'Total', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-white">{order.medicationName || 'Medication'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{order.quantity}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                          <DollarSign className="w-3.5 h-3.5" />
                          {order.totalPrice.toFixed(2)}
                        </div>
                      </td>
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
          </div>
        )}
      </div>
    </div>
  );
}
