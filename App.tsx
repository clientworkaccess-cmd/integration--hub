
import React, { useState, useEffect, useCallback } from 'react';
import { Integration, AppState } from './types';
import IntegrationCard from './components/IntegrationCard';
import EmailModal from './components/EmailModal';
import { GITHUB_AUTH_URL } from './constants';
import { triggerWebhook } from './services/webhookService';

const AVAILABLE_INTEGRATIONS: Integration[] = [
  {
    id: 'github-1',
    name: 'GitHub',
    description: 'Sync repositories, issues, and pull requests directly with your workflow.',
    icon: 'github',
    connected: false,
    status: 'disconnected',
  },
  {
    id: 'discord-1',
    name: 'Discord',
    description: 'Send automated alerts and notifications to your team channels.',
    icon: 'discord',
    connected: false,
    status: 'disconnected',
  },
  {
    id: 'slack-1',
    name: 'Slack',
    description: 'Post messages to your workspace when specific triggers are met.',
    icon: 'slack',
    connected: false,
    status: 'disconnected',
  }
];

const App: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(AVAILABLE_INTEGRATIONS);
  const [state, setState] = useState<AppState>({
    isConnecting: false,
    error: null,
    success: false,
    email: localStorage.getItem('user_email') || '',
  });
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleOAuthCallback = useCallback(async (code: string) => {
    const savedEmail = localStorage.getItem('user_email');
    if (!savedEmail) {
      setState(prev => ({ ...prev, error: 'Email missing. Please try connecting again.' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true }));
    
    const success = await triggerWebhook(code, savedEmail);
    
    if (success) {
      setState(prev => ({ ...prev, isConnecting: false, success: true }));
      setIntegrations(prev => 
        prev.map(item => item.name === 'GitHub' ? { ...item, status: 'active', connected: true } : item)
      );
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setState(prev => ({ ...prev, isConnecting: false, error: 'Failed to notify webhook. Check console for details.' }));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      handleOAuthCallback(code);
    }
  }, [handleOAuthCallback]);

  const initiateConnection = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (integration?.name === 'GitHub') {
      setShowEmailModal(true);
    } else {
      alert(`${integration?.name} integration is coming soon!`);
    }
  };

  const handleEmailSubmit = (email: string) => {
    localStorage.setItem('user_email', email);
    setState(prev => ({ ...prev, email }));
    setShowEmailModal(false);
    window.location.href = GITHUB_AUTH_URL;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">AppIntegrator<span className="text-indigo-600">Pro</span></span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-700">{state.email || 'Guest User'}</span>
                <span className="text-xs text-slate-400">Personal Hub</span>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://picsum.photos/seed/${state.email || 'guest'}/40/40`} alt="avatar" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Connect Your Ecosystem</h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Authorize your favorite apps and let our automations handle the heavy lifting. All events are piped directly to your n8n workflows.
          </p>
        </div>

        {/* Global Notifications */}
        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-4">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{state.error}</span>
            <button onClick={() => setState(p => ({ ...p, error: null }))} className="ml-auto hover:bg-red-100 p-1 rounded-md transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {state.success && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-4">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Success! GitHub integration has been authorized and synchronized.</span>
            <button onClick={() => setState(p => ({ ...p, success: false }))} className="ml-auto hover:bg-emerald-100 p-1 rounded-md transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {state.isConnecting && (
          <div className="mb-8 p-8 bg-white border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Finalizing Connection</h3>
            <p className="text-slate-500">Communicating with n8n webhook and registering your credentials...</p>
          </div>
        )}

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item) => (
            <IntegrationCard 
              key={item.id} 
              integration={item} 
              onConnect={initiateConnection} 
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>© 2024 AppIntegrator Pro. Powering your workflows.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EmailModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)} 
        onSubmit={handleEmailSubmit} 
      />
    </div>
  );
};

export default App;
