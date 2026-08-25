import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bot, User, Wrench, AlertTriangle, Check, X, Send, RotateCcw, Loader2 } from 'lucide-react';

const API = 'http://localhost:4007';
const SESSION_ID = 'demo-session-1';

export default function App() {
  const [messages, setMessages] = useState<any[]>([]);
  const [pendingAction, setPendingAction] = useState<any | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSession = async () => {
    try {
      const res = await axios.get(`${API}/api/session/${SESSION_ID}`);
      setMessages(res.data.messages);
      setPendingAction(res.data.pendingAction);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingAction]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || pendingAction) return;
    
    setLoading(true);
    const text = input;
    setInput('');
    
    // Optimistic UI update
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    
    try {
      const res = await axios.post(`${API}/api/chat`, { sessionId: SESSION_ID, message: text });
      if (res.data.status === 'pending_approval') {
        setPendingAction(res.data.action);
      }
      await fetchSession();
    } catch (e: any) {
      console.error(e);
      alert('Error sending message');
    }
    setLoading(false);
  };

  const handleApproval = async (approved: boolean) => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/approve`, { 
        sessionId: SESSION_ID, 
        approved, 
        feedback: approved ? undefined : feedback 
      });
      setFeedback('');
      await fetchSession();
    } catch (e: any) {
      console.error(e);
      alert('Error handling approval');
    }
    setLoading(false);
  };

  const clearSession = async () => {
    await axios.post(`${API}/api/session/${SESSION_ID}/clear`);
    await fetchSession();
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* LEFT: Chat Interface */}
      <div className="flex-1 flex flex-col border-r border-slate-700">
        <header className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-violet-400" />
            <h1 className="text-xl font-bold">AgentOS Chat</h1>
          </div>
          <button onClick={clearSession} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.filter(m => m.role !== 'system').map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl p-4 shadow-md ${
                msg.role === 'user' ? 'bg-violet-600 text-white' : 
                msg.role === 'tool' ? 'bg-slate-800 border border-slate-600' : 'bg-slate-700'
              }`}>
                <div className="flex items-center gap-2 mb-2 opacity-70 text-xs uppercase tracking-wider font-semibold">
                  {msg.role === 'user' && <><User className="w-4 h-4"/> User</>}
                  {msg.role === 'assistant' && <><Bot className="w-4 h-4"/> Agent</>}
                  {msg.role === 'tool' && <><Wrench className="w-4 h-4"/> Tool Result: {msg.name}</>}
                </div>
                
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>

                {/* Display pending tool calls from assistant */}
                {msg.role === 'assistant' && msg.tool_calls && msg.tool_calls.map((tc: any, j: number) => (
                  <div key={j} className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 text-xs font-mono">
                    <span className="text-cyan-400 font-bold">{tc.function.name}</span>
                    <span className="text-slate-400">( {tc.function.arguments} )</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {loading && !pendingAction && (
             <div className="flex justify-start">
               <div className="bg-slate-700 rounded-2xl p-4 shadow-md flex items-center gap-2">
                 <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                 <span className="text-slate-400 text-sm">Agent is thinking...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 bg-slate-800 border-t border-slate-700">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading || !!pendingAction}
              placeholder={pendingAction ? "Awaiting your approval..." : "Ask the agent to calculate, search, or send an email..."}
              className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 disabled:opacity-50"
            />
            <button type="submit" disabled={!input.trim() || loading || !!pendingAction}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>

      {/* RIGHT: Human-in-the-loop Dashboard */}
      <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col">
        <header className="p-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-300">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Security & Approvals
          </h2>
        </header>

        <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
          {pendingAction ? (
            <div className="bg-slate-900 border border-amber-500/50 shadow-2xl shadow-amber-500/10 rounded-2xl p-6 w-full animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3 mb-4 text-amber-400">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-lg font-bold">Action Requires Approval</h3>
              </div>
              
              <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Tool Requested</p>
                <p className="text-cyan-400 font-mono font-bold mb-4">{pendingAction.toolName}</p>
                
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Arguments</p>
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap bg-slate-900 p-3 rounded-lg border border-slate-700 overflow-x-auto">
                  {JSON.stringify(pendingAction.toolArgs, null, 2)}
                </pre>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Optional rejection feedback..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                />
                
                <div className="flex gap-3">
                  <button onClick={() => handleApproval(false)} disabled={loading}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-500/30 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-colors">
                    <X className="w-5 h-5" /> Reject
                  </button>
                  <button onClick={() => handleApproval(true)} disabled={loading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-colors">
                    <Check className="w-5 h-5" /> Approve
                  </button>
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center text-slate-500 flex flex-col items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                 <Check className="w-8 h-8 text-slate-600" />
               </div>
               <p className="text-sm">No actions currently require your approval.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
