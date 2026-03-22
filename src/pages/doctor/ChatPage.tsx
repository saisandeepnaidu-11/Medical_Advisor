import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Message, AppUser } from '../../types';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const { appUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [otherUser, setOtherUser] = useState<AppUser | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    // Get chat participants
    const chatRef = doc(db, 'chats', chatId);
    getDoc(chatRef).then(async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const otherId = data.participants.find((id: string) => id !== appUser?.uid);
        if (otherId) {
          const userSnap = await getDoc(doc(db, 'users', otherId));
          if (userSnap.exists()) {
            setOtherUser(userSnap.data() as AppUser);
          }
        }
      }
    });

    // Real-time messages
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, 'id'>) }))
      );
    });
    return unsub;
  }, [chatId, appUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !chatId || !appUser || loading) return;
    const text = input.trim();
    setInput('');
    setLoading(true);
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        chatId,
        senderId: appUser.uid,
        text,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: text,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (createdAt: unknown) => {
    if (!createdAt) return '';
    try {
      const ts = createdAt as { toDate?: () => Date };
      const date = ts.toDate ? ts.toDate() : new Date(createdAt as string);
      return format(date, 'h:mm a');
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col" style={{ background: '#0a0f1e' }}>
      {/* Chat header */}
      <div className="glass-dark border-b border-emerald-900/30 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {otherUser && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-white text-sm">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{otherUser.name}</p>
              <p className="text-xs text-slate-400 capitalize">{otherUser.role}</p>
            </div>
          </div>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-3xl w-full mx-auto">
        {messages.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderId === appUser?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}>
              <div className={`max-w-[75%] group`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-md'
                    : 'glass border border-white/10 text-slate-200 rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
                <p className={`text-xs text-slate-600 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-dark border-t border-emerald-900/30 px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none text-sm"
            style={{ maxHeight: '120px' }}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-40 hover:scale-105 disabled:hover:scale-100 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
