import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { AppUser } from '../../types';
import { User, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function RegisteredPatients() {
  const [patients, setPatients] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'patient'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPatients(snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<AppUser, 'uid'>) })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch {
      return '—';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Registered Patients</h1>
            <p className="text-slate-400 mt-1">
              Currently managing <span className="text-emerald-400 font-semibold">{patients.length}</span> patients
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-900 border-t-emerald-500 animate-spin" />
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No patients registered yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="glass rounded-2xl overflow-hidden overflow-x-auto shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {patients.map((patient) => (
                    <tr key={patient.uid} className="hover:bg-white/3 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                            {patient.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {patient.name}
                            </p>
                            <p className="text-xs text-slate-500 font-mono">UID: {patient.uid.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Mail className="w-3.5 h-3.5" />
                          {patient.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(patient.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold uppercase">
                          {patient.role}
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
