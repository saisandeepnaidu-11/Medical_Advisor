import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Report } from '../../types';
import ReactMarkdown from 'react-markdown';
import { FileText, Calendar, Search, Activity, Heart } from 'lucide-react';
import { format } from 'date-fns';

export default function ReportsPage() {
  const { appUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!appUser) return;
    const q = query(
      collection(db, 'reports'),
      where('patientId', '==', appUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Report, 'id'>) }))
        .sort((a, b) => {
          const aTs = (a.date as any)?.toMillis?.() || 0;
          const bTs = (b.date as any)?.toMillis?.() || 0;
          return bTs - aTs;
        });
      setReports(data);
      setLoading(false);
    });
    return unsub;
  }, [appUser]);

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.content.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: any) => {
    try {
      const d = date?.toDate ? date.toDate() : new Date(date);
      return format(d, 'MMMM d, yyyy');
    } catch {
      return '—';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white">My Health Reports</h1>
          <p className="text-slate-400 mt-1">View and download your medical assessments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="glass rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{reports.length}</p>
                <p className="text-sm text-slate-400">Total Reports</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Recent</p>
                <p className="text-sm text-slate-400">
                  {reports.length > 0 ? `Last report: ${formatDate(reports[0].date)}` : 'No reports yet'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md animate-fade-in-up">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by title or content..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-900 border-t-emerald-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl animate-fade-in-up">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">{search ? 'No reports found' : 'No medical reports have been written for you yet.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((report, i) => (
              <div
                key={report.id}
                className="glass rounded-2xl overflow-hidden animate-fade-in-up card-hover border border-white/5"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                  onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/10 to-emerald-600/5 border border-emerald-500/20 flex items-center justify-center transition-all group-hover:scale-110 ${expandedId === report.id ? 'rotate-12' : ''}`}>
                      <Heart className="w-6 h-6 text-emerald-400 fill-emerald-400/10" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">{report.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(report.date)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-emerald-500/80 font-medium">Verified by Doctor</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-slate-500 transition-all duration-300 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${expandedId === report.id ? 'rotate-180 bg-emerald-500/20 text-emerald-400' : 'group-hover:bg-white/10'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {expandedId === report.id && (
                  <div className="px-6 pb-6 border-t border-white/10 pt-5 animate-fade-in-up">
                    <div className="prose prose-invert max-w-none markdown-content">
                      <ReactMarkdown>{report.content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
