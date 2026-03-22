import { useState } from 'react';
import { Activity, AlertTriangle, Map, TrendingUp, ShieldAlert } from 'lucide-react';

export default function DiseasePrediction() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Disease Prediction & Early Warning</h1>
          <p className="text-slate-400">Monitor community outbreaks and public health data in real-time.</p>
        </div>
        <select 
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
        >
          <option>All Regions</option>
          <option>North District</option>
          <option>East District</option>
          <option>South District</option>
          <option>West District</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-red-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Outbreak Alerts</p>
              <h3 className="text-2xl font-bold text-white">3 Regions</h3>
            </div>
          </div>
          <p className="text-sm text-red-300">High risk of seasonal influenza spread in the East District.</p>
        </div>

        <div className="glass-card p-6 border-orange-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Reported Cases (7 Days)</p>
              <h3 className="text-2xl font-bold text-white">+24%</h3>
            </div>
          </div>
          <p className="text-sm text-orange-300">Above average reporting for respiratory symptoms.</p>
        </div>

        <div className="glass-card p-6 border-emerald-500/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Preventative Measures</p>
              <h3 className="text-2xl font-bold text-white">Active</h3>
            </div>
          </div>
          <p className="text-sm text-emerald-300">Vaccination drives deployed to high-risk areas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 h-96 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Infection Trend Analysis
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-slate-500 text-sm italic">AI Trend Chart Visualization</p>
          </div>
        </div>

        <div className="glass-card p-6 h-96 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-400" />
              Community Heatmap
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl relative overflow-hidden bg-white/5">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/40 via-transparent to-transparent blur-xl"></div>
            <p className="text-slate-500 text-sm italic z-10">Geospatial Disease Heatmap</p>
          </div>
        </div>
      </div>
    </div>
  );
}
