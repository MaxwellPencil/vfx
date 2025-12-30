import React, { useState, useRef } from 'react';
import { generateVFXPrompt } from '../services/geminiService';
import { GenerationState, HistoryItem } from '../types';
import { Wand2, Loader2, Copy, AlertCircle, Terminal, CheckCircle2, Eraser } from 'lucide-react';

const VFXGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [state, setState] = useState<GenerationState>({ status: 'idle' });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setState({ status: 'generating' });
    try {
      const vfxPrompt = await generateVFXPrompt(input);
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        input: input,
        prompt: vfxPrompt,
      };

      setHistory(prev => [newItem, ...prev]);
      setState({ 
        status: 'completed', 
        prompt: vfxPrompt 
      });
    } catch (e: any) {
      setState({ status: 'error', error: e.message });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      
      {/* Header Area */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
          绿幕特效提示词生成器
        </h1>
        <p className="text-gray-400">Green Screen VFX Prompt Generator</p>
      </div>

      {/* Input Section */}
      <div className="bg-panel-bg border border-gray-800 rounded-2xl p-6 shadow-xl">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          描述您需要的素材 (支持中文)
        </label>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：一只燃烧的火凤凰，正在展翅高飞..."
            className="w-full bg-dark-bg border border-gray-700 text-white rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-chroma-green focus:border-transparent outline-none transition-all resize-none"
          />
        </div>
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleGenerate}
            disabled={state.status === 'generating' || !input.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-chroma-green hover:bg-green-500 text-black font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_25px_rgba(0,255,0,0.5)] transform hover:scale-[1.01]"
          >
            {state.status === 'generating' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Wand2 className="w-5 h-5" />
            )}
            <span>生成提示词 (Generate Prompt)</span>
          </button>
        </div>
      </div>

      {/* Status & Error Messages */}
      {state.status === 'error' && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">Error</p>
            <p className="text-sm opacity-80">{state.error}</p>
          </div>
        </div>
      )}

      {/* Current Result Section */}
      {state.prompt && (
        <div ref={resultRef} className="bg-panel-bg border border-gray-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gray-900/50 p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-chroma-green font-mono text-sm">
              <Terminal className="w-4 h-4" />
              <span>PROMPT OUTPUT</span>
            </div>
            <button 
              onClick={() => copyToClipboard(state.prompt!)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Copy className="w-3 h-3" /> Copy Text
            </button>
          </div>
          
          <div className="p-6">
            <div className="bg-black/40 p-6 rounded-lg font-mono text-gray-200 border border-gray-800 leading-relaxed relative group shadow-inner">
                {state.prompt}
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-chroma-green opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-chroma-green opacity-60"></div>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gray-500" />
              历史记录 (History)
            </h2>
            <button 
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <Eraser className="w-3 h-3" /> Clear
            </button>
          </div>
          
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-panel-bg border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                   <div className="text-xs text-gray-500 font-mono">{new Date(item.timestamp).toLocaleTimeString()}</div>
                   <button 
                    onClick={() => copyToClipboard(item.prompt)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all"
                    title="Copy Prompt"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-3">
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Input</span>
                   <p className="text-white text-sm font-medium">{item.input}</p>
                </div>

                <div className="bg-black/20 rounded p-3 border border-gray-800/50">
                  <span className="text-xs font-bold text-chroma-green uppercase tracking-wider block mb-1">Generated Prompt</span>
                  <p className="text-gray-400 text-xs font-mono leading-relaxed">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VFXGenerator;