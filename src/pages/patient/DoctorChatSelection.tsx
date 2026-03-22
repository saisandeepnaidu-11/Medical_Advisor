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
import type { AppUser, Chat } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Search,
  Mail,
  Stethoscope,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

export default function DoctorChatSelection() {
  const { appUser } = useAuth();
  const [doctors, setDoctors] = useState<AppUser[]>([]);
  const [activeChats, setActiveChats] = useState<(Chat & { otherUser: AppUser })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!appUser) return;

    // Fetch doctors
    const qDocs = query(collection(db, 'users'), where('role', '==', 'doctor'));
    const unsubDocs = onSnapshot(qDocs, (snap) => {
      setDoctors(snap.docs.map((d) => d.data() as AppUser));
    });

    // Fetch existing chats
    const qChats = query(collection(db, 'chats'), where('participants', 'array-contains', appUser.uid));
    const unsubChats = onSnapshot(qChats, async (snap) => {
      const chatData = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data() as Omit<Chat, 'id'>;
          const otherId = data.participants.find((id) => id !== appUser.uid);
          const otherUserSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', otherId)));
          const otherUser = otherUserSnap.docs[0].data() as AppUser;
          return { id: d.id, ...data, otherUser };
        })
      );
      setActiveChats(chatData.sort((a, b) => {
        const aTs = (a.updatedAt as any)?.toMillis?.() || 0;
        const bTs = (b.updatedAt as any)?.toMillis?.() || 0;
        return bTs - aTs;
      }));
      setLoading(false);
    });

    return () => { unsubDocs(); unsubChats(); };
  }, [appUser]);

  const startChat = async (doctor: AppUser) => {
    if (!appUser) return;
    const participants = [appUser.uid, doctor.uid].sort();

    // Check if chat exists
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
    navigate(`/patient/chat/${chatId}`);
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (ts: any) => {
    try {
      const date = ts?.toDate ? ts.toDate() : new Date(ts);
      return format(date, 'MMM d, h:mm a');
    } catch { return ''; }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white">Doctor Consultation</h1>
          <p className="text-slate-400 mt-1">Chat securely with our medical professionals</p>
        </div>

        {/* Action sections */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Active Chats Sidebar */}
          <div className="md:col-span-1 border-r border-white/5 pr-0 md:pr-4 h-full">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Recent Chats
            </h2>
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-emerald-900 border-t-emerald-500 rounded-full animate-spin" /></div>
              ) : activeChats.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-8 glass rounded-xl border border-white/5 italic">No active conversations</p>
              ) : (
                activeChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => navigate(`/patient/chat/${chat.id}`)}
                    className="w-full text-left p-3 rounded-xl glass border border-white/5 hover:border-emerald-500/30 transition-all group flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 group-hover:scale-105 transition-transform flex-shrink-0">
                      {chat.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-white text-sm truncate">{chat.otherUser.name}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate group-hover:text-slate-400 transition-colors">
                        {chat.lastMessage || 'New conversation'}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTime(chat.updatedAt)}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Connect Section */}
          <div className="md:col-span-2">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Available Doctors
            </h2>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a specialist by name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="col-span-2 text-center py-12 glass rounded-2xl border border-white/5">
                  <Stethoscope className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500">No doctors found matching your criteria</p>
                </div>
              ) : (
                filteredDoctors.map((doctor, i) => (
                  <button
                    key={doctor.uid}
                    onClick={() => startChat(doctor)}
                    className="glass p-5 rounded-2xl text-left border border-white/5 hover:border-blue-500/30 transition-all card-hover group flex flex-col items-center text-center sm:items-start sm:text-left"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="relative mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                        {doctor.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0f1e] shadow-sm animate-pulse" />
                    </div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Dr. {doctor.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 truncate w-full">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{doctor.email}</span>
                    </div>
                    <div className="w-full pt-3 border-t border-white/5 mt-auto flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-tighter text-slate-600 font-bold group-hover:text-blue-500/50">Online Now</span>
                      <div className="flex items-center gap-1 text-blue-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                        Start Chat
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
