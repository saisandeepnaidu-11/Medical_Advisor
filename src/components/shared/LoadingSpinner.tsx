import { ActivitySquare } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ fullScreen = false, message = 'Loading...' }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
           style={{ background: '#0a0f1e' }}>
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-900 border-t-emerald-500 animate-spin" />
          <ActivitySquare className="absolute inset-0 m-auto text-emerald-400 w-6 h-6" />
        </div>
        <p className="text-emerald-400 font-medium animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 rounded-full border-3 border-emerald-900 border-t-emerald-500 animate-spin" />
    </div>
  );
}
