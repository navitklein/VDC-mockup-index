
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Mockup, MockupStatus, ChatMessage } from './types';
import { INITIAL_MOCKUPS } from './constants';
import { MockupCard } from './components/MockupCard';
import { getGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [mockups, setMockups] = useState<Mockup[]>(INITIAL_MOCKUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<MockupStatus | 'All'>('All');
  
  // Create Mockup State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMockup, setNewMockup] = useState<Partial<Mockup>>({
    title: '',
    description: '',
    status: MockupStatus.IN_DESIGN,
    url: '',
    azureUrl: '',
    docsUrl: '',
    tags: []
  });

  // AI Assistant State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const filteredMockups = useMemo(() => {
    return mockups.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            m.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || m.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [mockups, searchTerm, selectedStatus]);

  const handleStatusChange = (id: string, newStatus: MockupStatus) => {
    setMockups(prev => prev.map(m => m.id === id ? { 
      ...m, 
      status: newStatus, 
      lastUpdated: new Date().toISOString().split('T')[0] 
    } : m));
  };

  const handleAddMockup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMockup.title || !newMockup.url) return;

    const mockup: Mockup = {
      id: Math.random().toString(36).substr(2, 9),
      title: newMockup.title || '',
      description: newMockup.description || 'No description provided.',
      status: newMockup.status as MockupStatus,
      url: newMockup.url || '',
      azureUrl: newMockup.azureUrl,
      docsUrl: newMockup.docsUrl,
      lastUpdated: new Date().toISOString().split('T')[0],
      author: 'Lead Architect',
      version: '1.0.0',
      tags: (newMockup.tags as string[]) || ['General']
    };

    setMockups([mockup, ...mockups]);
    setIsModalOpen(false);
    setNewMockup({ title: '', description: '', status: MockupStatus.IN_DESIGN, url: '', azureUrl: '', docsUrl: '' });
  };

  const handleSendPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentPrompt.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: currentPrompt, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setCurrentPrompt('');
    setIsAiLoading(true);

    const aiResponse = await getGeminiResponse(currentPrompt, mockups);
    
    const assistantMsg: ChatMessage = { 
      role: 'assistant', 
      content: aiResponse, 
      timestamp: new Date() 
    };
    setChatHistory(prev => [...prev, assistantMsg]);
    setIsAiLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <i className="fa-solid fa-layer-group text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">VDC Index</h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold -mt-1">Mockup Repository</p>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input 
                  type="text" 
                  placeholder="Search mockups..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                New Mockup
              </button>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-sparkles text-xs"></i>
                AI Assistant
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {(['All', ...Object.values(MockupStatus)] as const).map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedStatus === status 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Projects: {filteredMockups.length}
          </p>
        </div>

        {filteredMockups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredMockups.map(mockup => (
              <MockupCard key={mockup.id} mockup={mockup} onStatusChange={handleStatusChange} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <i className="fa-solid fa-folder-open text-3xl"></i>
            </div>
            <h3 className="text-slate-900 font-semibold text-lg">No mockups match your criteria</h3>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Add first mockup</button>
          </div>
        )}
      </main>

      {/* Add Mockup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add New VDC Mockup</h2>
                <p className="text-xs text-slate-500">Define project details and resource links.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <form onSubmit={handleAddMockup} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Real-time Asset Tracking"
                    value={newMockup.title}
                    onChange={e => setNewMockup({...newMockup, title: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20 h-24"
                    placeholder="Briefly describe the objective of this mockup..."
                    value={newMockup.description}
                    onChange={e => setNewMockup({...newMockup, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Initial Status</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20"
                    value={newMockup.status}
                    onChange={e => setNewMockup({...newMockup, status: e.target.value as MockupStatus})}
                  >
                    {Object.values(MockupStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mockup URL</label>
                  <input 
                    required
                    type="url" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="https://..."
                    value={newMockup.url}
                    onChange={e => setNewMockup({...newMockup, url: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Azure Board Link (Optional)</label>
                  <input 
                    type="url" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="https://dev.azure.com/..."
                    value={newMockup.azureUrl}
                    onChange={e => setNewMockup({...newMockup, azureUrl: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Docs Link (Optional)</label>
                  <input 
                    type="url" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="https://docs..."
                    value={newMockup.docsUrl}
                    onChange={e => setNewMockup({...newMockup, docsUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-colors"
                >
                  Create Mockup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Assistant Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div>
                  <h2 className="font-bold text-sm">VDC AI Assistant</h2>
                  <p className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Intelligent Hub</p>
                </div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 && (
                <div className="text-center py-10 px-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mx-auto mb-4">
                    <i className="fa-solid fa-comments text-xl"></i>
                  </div>
                  <h3 className="text-slate-800 font-bold">Need a project summary?</h3>
                  <p className="text-sm text-slate-500 mt-2">I can find links for Azure tasks or technical docs for you.</p>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[9px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-slate-100">
              <form onSubmit={handleSendPrompt} className="relative">
                <input 
                  type="text"
                  placeholder="Ask for an Azure link or status summary..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  disabled={isAiLoading}
                />
                <button 
                  type="submit"
                  disabled={!currentPrompt.trim() || isAiLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 transition-all hover:bg-indigo-700"
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-bold text-sm tracking-tight">VDC Central</span>
            <span className="text-slate-300 text-xs font-bold">v2.0</span>
          </div>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            INTERNAL USE ONLY • CONFIDENTIAL
          </p>
          <div className="flex items-center gap-4 text-slate-400">
             <i className="fa-brands fa-figma text-sm"></i>
             <i className="fa-brands fa-microsoft text-sm"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
