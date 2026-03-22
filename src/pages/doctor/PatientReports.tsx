import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Report, AppUser, Medication } from '../../types';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft,
  FileText,
  Plus,
  X,
  AlertCircle,
  Calendar,
  User,
  Pill,
  Search,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';

function AddReportModal({
  patient,
  doctorId,
  onClose,
}: {
  patient: AppUser;
  doctorId: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMeds, setSelectedMeds] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch medications from Firebase
  useEffect(() => {
    const q = query(collection(db, 'medications'), orderBy('name'));
    const unsub = onSnapshot(q, (snap) => {
      setMedications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Medication)));
    });
    return unsub;
  }, []);

  const handleAddMed = (med: Medication) => {
    if (selectedMeds.find(m => m.id === med.id)) return;
    setSelectedMeds([...selectedMeds, med]);
    
    // Auto-update content with a prescription section if not present
    let newContent = content;
    if (!newContent.includes('## Prescribed Medications')) {
      newContent += '\n\n## Prescribed Medications\n';
    }
    newContent += `- **${med.name}**: [Dosage Instruction Here]\n`;
    setContent(newContent);
  };

  const removeMed = (id: string) => {
    setSelectedMeds(selectedMeds.filter(m => m.id !== id));
  };

  const filteredMeds = medications.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) && 
    !selectedMeds.find(sm => sm.id === m.id)
  ).slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'reports'), {
        patientId: patient.uid,
        doctorId,
        title: title.trim(),
        content: content.trim(),
        medications: selectedMeds.map(m => m.id), // Store references if needed
        date: serverTimestamp(),
      });
      onClose();
    } catch {
      setError('Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="glass-dark rounded-2xl w-full max-w-4xl p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-6">
        {/* Main Form */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Create Prescription Report</h2>
              <p className="text-sm text-slate-400 mt-0.5">Patient: {patient.name}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 md:hidden">
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
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Report Title / Reason</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fever and Cough Diagnosis"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Report Content <span className="text-slate-600 text-xs ml-1">(Markdown supported)</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="## Diagnosis&#10;Patient presents with...&#10;&#10;## Medications&#10;- Medication 1: 1 tablet daily"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none font-mono text-sm leading-relaxed"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-emerald w-full py-3 shadow-lg shadow-emerald-500/20">
              {loading ? 'Saving Report...' : 'Finalize & Send to Patient'}
            </button>
          </form>
        </div>

        {/* Medication Selector Sidebar */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Pill className="w-4 h-4 text-emerald-400" />
              Prescribe Medicine
            </h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hidden md:block">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pharmacy..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Search Results */}
          <div className="space-y-2 mb-6 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
            {search.trim() ? (
              filteredMeds.length > 0 ? (
                filteredMeds.map(med => (
                  <button
                    key={med.id}
                    onClick={() => handleAddMed(med)}
                    className="w-full text-left p-2.5 rounded-lg border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white group-hover:text-emerald-400">{med.name}</p>
                      <Plus className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{med.description}</p>
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-600 text-center py-4 italic">No matching medicines found</p>
              )
            ) : (
              <p className="text-xs text-slate-600 text-center py-4">Search to see available medications</p>
            )}
          </div>

          {/* Selected Medications */}
          {selectedMeds.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Selected ({selectedMeds.length})</h4>
              <div className="space-y-2">
                {selectedMeds.map(med => (
                  <div key={med.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      <p className="text-xs text-white truncate font-medium">{med.name}</p>
                    </div>
                    <button onClick={() => removeMed(med.id)} className="p-1 hover:text-red-400 text-slate-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PatientReports() {
  const { patientId } = useParams<{ patientId: string }>();
  const { appUser } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [patient, setPatient] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;
    getDoc(doc(db, 'users', patientId)).then((snap) => {
      if (snap.exists()) setPatient(snap.data() as AppUser);
    });
    const q = query(collection(db, 'reports'), where('patientId', '==', patientId));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Report, 'id'>) }))
        .sort((a, b) => {
          const aDate = (a.date as unknown as { toMillis?: () => number })?.toMillis?.() ?? new Date(a.date).getTime();
          const bDate = (b.date as unknown as { toMillis?: () => number })?.toMillis?.() ?? new Date(b.date).getTime();
          return bDate - aDate;
        });
      setReports(data);
      setLoading(false);
    });
    return unsub;
  }, [patientId]);

  const formatDate = (date: unknown) => {
    try {
      const ts = date as { toDate?: () => Date };
      const d = ts.toDate ? ts.toDate() : new Date(date as string);
      return format(d, 'MMM d, yyyy');
    } catch { return '—'; }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-10" style={{ background: '#0a0f1e' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {patient ? `${patient.name}'s Reports` : 'Health Reports'}
            </h1>
            {patient && (
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                <User className="w-3 h-3" />
                {patient.email}
              </p>
            )}
          </div>
          {patient && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-emerald flex items-center gap-2 text-sm px-5 py-2.5 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              New Prescription
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-900 border-t-emerald-500 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl animate-fade-in-up">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No reports or prescriptions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report, i) => (
              <div
                key={report.id}
                className="glass rounded-2xl overflow-hidden animate-fade-in-up card-hover border border-white/5 hover:border-white/10"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <button
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{report.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(report.date)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-emerald-500/80 font-medium">Prescription</span>
                      </div>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-white/5 transition-transform duration-200 ${expandedId === report.id ? 'rotate-180' : ''}`}>
                    <ArrowLeft className="w-4 h-4 text-slate-400 rotate-[-90deg]" />
                  </div>
                </button>
                {expandedId === report.id && (
                  <div className="px-5 pb-5 border-t border-white/10 pt-4 bg-white/[0.02]">
                    <div className="markdown-content text-slate-300 text-sm leading-relaxed">
                      <ReactMarkdown>{report.content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && patient && appUser && (
        <AddReportModal
          patient={patient}
          doctorId={appUser.uid}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
