
import React, { useState } from 'react';
import { Mockup, MockupStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { STATUS_COLORS } from '../constants';

interface MockupCardProps {
  mockup: Mockup;
  onStatusChange: (id: string, newStatus: MockupStatus) => void;
}

export const MockupCard: React.FC<MockupCardProps> = ({ mockup, onStatusChange }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all group flex flex-col h-full relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors leading-tight pr-4">
          {mockup.title}
        </h3>
        <div className="relative">
          <button onClick={() => setShowStatusMenu(!showStatusMenu)}>
            <StatusBadge status={mockup.status} />
          </button>
          
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-10 overflow-hidden py-1">
              {Object.values(MockupStatus).map((status) => (
                <button
                  key={status}
                  className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${mockup.status === status ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
                  onClick={() => {
                    onStatusChange(mockup.id, status);
                    setShowStatusMenu(false);
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-3">
        {mockup.description}
      </p>
      
      {/* External Resources */}
      <div className="flex gap-2 mb-4">
        {mockup.azureUrl && (
          <a href={mockup.azureUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold hover:bg-blue-100 transition-colors">
            <i className="fa-solid fa-clipboard-list"></i>
            AZURE BOARD
          </a>
        )}
        {mockup.docsUrl && (
          <a href={mockup.docsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] font-bold hover:bg-slate-100 transition-colors">
            <i className="fa-solid fa-book"></i>
            DOCS
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {mockup.tags.map(tag => (
          <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-[10px]">
            {mockup.author.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-700 leading-none">{mockup.author}</p>
            <p className="text-[10px] text-slate-400">Updated {mockup.lastUpdated}</p>
          </div>
        </div>
        <a 
          href={mockup.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
          title="Open Mockup"
        >
          PREVIEW
          <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </div>
    </div>
  );
};
