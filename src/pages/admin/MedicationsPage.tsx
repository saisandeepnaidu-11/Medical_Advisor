import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Medication } from '../../types';
import Papa from 'papaparse';
import {
  Plus,
  Trash2,
  Package,
  DollarSign,
  Layers,
  X,
  AlertCircle,
  Search,
  TrendingUp,
  Upload,
} from 'lucide-react';

function AddMedicationModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: Omit<Medication, 'id' | 'imageUrl' | 'addedBy'>) => Promise<void>;
}) {
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.description || !form.price || !form.stock) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await onAdd({
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      });
      onClose();
    } catch (err) {
      setError('Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="glass-dark rounded-2xl w-full max-w-md p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add Medication</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'name', label: 'Medication Name', type: 'text', placeholder: 'e.g. Paracetamol' },
            { id: 'price', label: 'Price ($)', type: 'number', placeholder: '0.00', step: '0.01', min: '0' },
            { id: 'stock', label: 'Stock Count', type: 'number', placeholder: '0', min: '0' },
          ].map(({ id, label, ...rest }) => (
            <div key={id}>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">{label}</label>
              <input
                {...rest}
                value={form[id as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Brief description of the medication..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-emerald w-full py-3">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </span>
            ) : 'Add Medication'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MedicationsPage() {
  const { appUser } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const handleAdd = async (data: Omit<Medication, 'id' | 'imageUrl' | 'addedBy'>) => {
    await addDoc(collection(db, 'medications'), {
      ...data,
      imageUrl: `https://picsum.photos/seed/${data.name.replace(/\s+/g, '-').toLowerCase()}/400/300`,
      addedBy: appUser?.uid,
      createdAt: serverTimestamp(),
    });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'medications', id));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = medications.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = medications.reduce((s, m) => s + m.price * m.stock, 0);

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white">Medication Inventory</h1>
            <p className="text-slate-400 mt-1">Manage your pharmaceutical stock</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="btn-emerald flex items-center gap-2 w-fit bg-blue-600 hover:bg-blue-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              Import CSV
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    Papa.parse(file, {
                      header: true,
                      complete: async (results) => {
                        const data = results.data as any[];
                        setLoading(true);
                        try {
                          for (const row of data) {
                            if (row.Name) {
                              await handleAdd({
                                name: row.Name,
                                description: `${row.Category} - ${row.Indication}. Manufacturer: ${row.Manufacturer}. Strength: ${row.Strength}.`,
                                price: Math.floor(Math.random() * 50) + 10.99, // Random price for demo
                                stock: Math.floor(Math.random() * 100) + 20,    // Random stock for demo
                              });
                            }
                          }
                          alert(`Successfully imported ${data.length} medications!`);
                        } catch (err) {
                          alert("Failed to import some medications");
                        } finally {
                          setLoading(false);
                        }
                      }
                    });
                  }
                }}
              />
            </label>
            <button onClick={() => setShowModal(true)} className="btn-emerald flex items-center gap-2 w-fit">
              <Plus className="w-4 h-4" />
              Add Medication
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Products', value: medications.length, icon: Package, color: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
            { label: 'Total Units', value: medications.reduce((s, m) => s + m.stock, 0).toLocaleString(), icon: Layers, color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400' },
            { label: 'Inventory Value', value: `$${totalValue.toFixed(2)}`, icon: TrendingUp, color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400' },
          ].map(({ label, value, icon: Icon, color, iconColor }) => (
            <div key={label} className={`glass rounded-2xl p-5 bg-gradient-to-br ${color} animate-fade-in-up`}>
              <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${iconColor}`} />
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-slate-400">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

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

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-900 border-t-emerald-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">{search ? 'No medications found' : 'No medications yet. Add your first one!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((med, i) => (
              <div
                key={med.id}
                className="glass rounded-2xl overflow-hidden card-hover animate-fade-in-up group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={med.imageUrl}
                    alt={med.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/400/300?random=${med.id}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${med.stock > 20 ? 'bg-emerald-500/80 text-white' : med.stock > 0 ? 'bg-amber-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                      {med.stock > 0 ? `${med.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1 truncate">{med.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">{med.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-lg">
                      <DollarSign className="w-4 h-4" />
                      {med.price.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleDelete(med.id)}
                      disabled={deletingId === med.id}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                      {deletingId === med.id ? (
                        <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddMedicationModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
