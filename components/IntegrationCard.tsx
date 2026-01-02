
import React from 'react';
import { Integration } from '../types.ts';
import { ICONS } from '../constants.tsx';

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (id: string) => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration, onConnect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 transition-all hover:shadow-lg hover:border-indigo-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
          {ICONS[integration.name as keyof typeof ICONS] 
            ? ICONS[integration.name as keyof typeof ICONS]('w-8 h-8 text-slate-700 group-hover:text-indigo-600') 
            : null}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(integration.status)}`}>
          {integration.status.toUpperCase()}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-1">{integration.name}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {integration.description}
      </p>
      
      <button
        onClick={() => onConnect(integration.id)}
        disabled={integration.status === 'active'}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2
          ${integration.status === 'active' 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-200'
          }`}
      >
        {integration.status === 'active' ? 'Connected' : `Connect ${integration.name}`}
        {integration.status !== 'active' && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default IntegrationCard;
