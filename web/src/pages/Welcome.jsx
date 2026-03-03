import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession, getSession } from '../lib/storage.js';
import { Camera, BarChart3, Smartphone, Shield, Sparkles } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('new'); // 'new' or 'join'
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);
  
  // Check if already has session
  const existingSession = getSession();
  
  const handleCreate = () => {
    const sessionId = passphrase 
      ? createSession(passphrase)
      : createSession('my-journal-' + Date.now().toString(36));
    
    navigate(`/s/${sessionId}`);
  };
  
  const handleJoin = () => {
    if (!passphrase.trim()) {
      setError('Please enter a passphrase');
      return;
    }
    
    const sessionId = createSession(passphrase.trim());
    navigate(`/s/${sessionId}`);
  };

  const features = [
    { icon: Camera, title: 'Snap & Track', desc: 'Take a photo and AI estimates calories instantly' },
    { icon: BarChart3, title: 'Visual Stats', desc: 'See your nutrition trends over time' },
    { icon: Smartphone, title: 'Works Offline', desc: 'No internet? No problem. Data stays on device.' },
    { icon: Shield, title: 'Private by Default', desc: 'No account needed. Your data, your device.' },
  ];

  // If has existing session, show continue option
  if (existingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-100 dark:bg-primary-900/30 mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SnapCal</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Snap a photo. Know your food.</p>
          </div>
          
          <div className="card p-6 space-y-4">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Continue your session?</p>
              <code className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-primary-600 dark:text-primary-400 font-mono text-lg">
                {existingSession}
              </code>
            </div>
            
            <button
              onClick={() => navigate(`/s/${existingSession}`)}
              className="w-full btn-primary py-3 text-lg shadow-lg shadow-primary-500/25"
            >
              Continue Tracking
            </button>
            
            <button
              onClick={() => { localStorage.removeItem('snapcal_session'); setMode('new'); }}
              className="w-full btn-ghost text-gray-500"
            >
              Start New Journal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-100 dark:bg-primary-900/30 mb-4">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SnapCal</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Snap a photo. Know your food.</p>
        </div>

        {/* Feature highlights */}
        {!showFeatures && (
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="card p-4 text-center">
                <f.icon className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <div className="font-medium text-gray-900 dark:text-white text-sm">{f.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Main card */}
        <div className="card p-6 space-y-4">
          {/* Mode tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setMode('new')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'new' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Create New
            </button>
            <button
              onClick={() => setMode('join')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'join' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Join Existing
            </button>
          </div>
          
          {mode === 'new' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Journal Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="my-food-log"
                  className="input w-full"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  ↳ A unique name makes it easy to share your journal across devices
                </p>
              </div>
              
              <button
                onClick={handleCreate}
                className="w-full btn-primary py-3 text-lg shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Tracking
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Journal Name
                </label>
                <input
                  type="text"
                  value={passphrase}
                  onChange={(e) => { setPassphrase(e.target.value); setError(''); }}
                  placeholder="my-food-log"
                  className="input w-full"
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              
              <button
                onClick={handleJoin}
                className="w-full btn-primary py-3 text-lg shadow-lg shadow-primary-500/25"
              >
                Open Journal
              </button>
            </div>
          )}
        </div>
        
        {/* Privacy note */}
        <div className="text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            🔒 No account needed • Data stays on your device
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
            Works great on mobile — add to home screen for the best experience
          </p>
        </div>
      </div>
    </div>
  );
}