import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Medication } from '../../types';
import {
  ShoppingCart,
  DollarSign,
  Layers,
  CheckCircle,
  Search,
  Pill,
  AlertCircle,
} from 'lucide-react';

export default function MedicationShop() {
  const { appUser } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'medications'), orderBy('name'));
    const unsub = onSnapshot(q, (snap) => {
      setMedications(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Medication, 'id'>) }))
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleOrder = async (med: Medication) => {
    if (!appUser || med.stock <= 0) return;
    setOrdering(med.id);
    setSuccess(null);
    setError(null);
    try {
      // Verify stock
      const medSnap = await getDoc(doc(db, 'medications', med.id));
      if (!medSnap.exists() || (medSnap.data().stock ?? 0) <= 0) {
        setError(`${med.name} is out of stock`);
        return;
      }
      // Place order
      await addDoc(collection(db, 'orders'), {
        patientId: appUser.uid,
        medicationId: med.id,
        medicationName: med.name,
        quantity: 1,
        totalPrice: med.price,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      // Decrement stock
      await updateDoc(doc(db, 'medications', med.id), {
        stock: increment(-1),
      });
      setSuccess(`${med.name} ordered successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to place order. Please try again.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setOrdering(null);
    }
  };

  const filtered = medications.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white">Medication Shop</h1>
          <p className="text-slate-400 mt-1">Browse and order your prescribed medications</p>
        </div>

        {/* Notifications */}
        {success && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm animate-fade-in-up">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in-up">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medications..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-900 border-t-emerald-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <Pill className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No medications found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((med, i) => (
              <div
                key={med.id}
                className="glass rounded-2xl overflow-hidden card-hover animate-fade-in-up group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative overflow-hidden h-44">
                  <img
                    src={med.imageUrl}
                    alt={med.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/400/300?random=${med.id}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold ${
                    med.stock > 20 ? 'bg-emerald-500/80 text-white' :
                    med.stock > 0 ? 'bg-amber-500/80 text-white' :
                    'bg-red-500/80 text-white'
                  }`}>
                    {med.stock > 0 ? `${med.stock} left` : 'Out of stock'}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-white mb-1 truncate">{med.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">{med.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-xl">
                      <DollarSign className="w-4 h-4" />
                      {med.price.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Layers className="w-3 h-3" />
                      {med.stock} units
                    </div>
                  </div>

                  <button
                    onClick={() => handleOrder(med)}
                    disabled={med.stock <= 0 || ordering === med.id}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed
                      bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {ordering === med.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Ordering...
                      </>
                    ) : med.stock <= 0 ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Order Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
