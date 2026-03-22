import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { AppUser } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  FileText,
  Search,
  Mail,
  Activity,
} from 'lucide-react';

export default function PatientMonitoring() {
  const { appUser } = useAuth();
  const [patients, setPatients] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'patient'));
    const unsub = onSnapshot(q, (snap) => {
      setPatients(snap.docs.map((d) => d.data() as AppUser));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleChat = async (patient: AppUser) => {
    if (!appUser) return;
    const participants = [appUser.uid, patient.uid].sort();

    // Find or create chat
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', '==', participants));
    const snap = await getDocs(q);

    let chatId: string;
    if (snap.empty) {
      const newChat = await addDoc(chatsRef, {
        participants,
        lastMessage: '',
        updatedAt: serverTimestamp(),
      });
      chatId = newChat.id;
    } else {
      chatId = snap.docs[0].id;
    }

    navigate(`/doctor/chat/${chatId}`);
  };

  const handleReports = (patient: AppUser) => {
    navigate(`/doctor/reports/${patient.uid}`);
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white">Patient Monitoring</h1>
          <p className="text-slate-400 mt-1">
            <span className="text-emerald-400 font-semibold">{patients.length}</span> registered patient{patients.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats */}
        <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-4 animate-fade-in-up">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{patients.length} Patients</p>
            <p className="text-xs text-slate-500">All registered patients on the platform</p>
          </div>
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

        {/* Patient grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-900 border-t-emerald-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">{search ? 'No patients found' : 'No patients registered yet'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((patient, i) => (
              <div
                key={patient.uid}
                className="glass rounded-2xl p-5 card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">{patient.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-500">Patient</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleChat(patient)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-sm font-medium transition-all hover:scale-105"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                  </button>
                  <button
                    onClick={() => handleReports(patient)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 text-sm font-medium transition-all hover:scale-105"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Reports
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
