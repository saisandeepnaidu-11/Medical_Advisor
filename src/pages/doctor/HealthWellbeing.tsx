import { useState } from 'react';
import { Bot, LineChart, MessageCircle, HeartPulse, Send, Calendar } from 'lucide-react';

export default function HealthWellbeing() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! I am your Accessible Healthcare Assistant. How can I help you understand your health today?', lang: 'en' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'patient', text: input, lang: 'en' }]);
    setInput('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'bot', 
        text: 'Thank you for sharing. Remember to stay hydrated and consult your doctor if symptoms persist.', 
        lang: 'en' 
      }]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Health & Wellbeing</h1>
          <p className="text-slate-400">Accessible assistants and mental health tracking tools.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chatbot Column */}
        <div className="glass-card flex flex-col h-[600px]">
          <div className="p-4 border-b border-emerald-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white leading-tight">Healthcare Assistant</h3>
                <p className="text-xs text-emerald-400">Local Language Support</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm flex gap-2 ${
                  m.sender === 'patient' 
                    ? 'bg-emerald-600 text-white rounded-tr-sm' 
                    : 'bg-emerald-950/50 border border-emerald-500/20 text-slate-200 rounded-tl-sm'
                }`}>
                  {m.sender === 'bot' && <MessageCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />}
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-emerald-900/30 bg-black/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about symptoms, routines, or health literacy..."
                className="flex-1 bg-white/5 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button 
                type="submit"
                className="w-12 flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Mental Health Column */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-purple-500/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <HeartPulse className="w-6 h-6 text-purple-400" />
                Mental Health Tracking
              </h3>
              <button className="text-sm px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors">
                New Journal Entry
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {[
                { date: 'Today, 10:30 AM', mood: 'Stressed', note: 'Feeling overwhelmed with appointments.', score: 4 },
                { date: 'Yesterday', mood: 'Calm', note: 'A very productive and peaceful shift.', score: 8 },
                { date: 'Dec 12th', mood: 'Tired', note: 'Long hours affecting sleep cycle.', score: 5 },
              ].map((entry, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {entry.date}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded border font-medium ${
                      entry.score > 6 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                      entry.score > 4 ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                      'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}>
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{entry.note}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20">
              <h4 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                <LineChart className="w-4 h-4" /> Recommended Resources
              </h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> AI-Suggested Mindfulness Techniques
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Connect with a Therapist (Partner API)
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Local Support Groups
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
