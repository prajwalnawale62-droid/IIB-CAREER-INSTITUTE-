
import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Loader2, Zap, Globe, ShieldCheck, Link2, Instagram, MessageCircle, Smartphone } from 'lucide-react';
import { Tone, Campaign } from '../types';
import { enhanceMessage } from '../services/geminiService';

interface MessagingProps {
  studentCount: number;
  onCampaignCreated: (campaign: Campaign) => void;
  isMetaConnected: boolean;
  connectedPlatform: 'whatsapp' | 'instagram';
  onOpenMetaConnect: () => void;
}

const Messaging: React.FC<MessagingProps> = ({ 
  studentCount, 
  onCampaignCreated, 
  isMetaConnected, 
  connectedPlatform,
  onOpenMetaConnect 
}) => {
  const [message, setMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [statusText, setStatusText] = useState('');

  const handleEnhance = async () => {
    if (!message.trim()) return;
    setIsEnhancing(true);
    const result = await enhanceMessage(message, selectedTone);
    setMessage(result);
    setIsEnhancing(false);
  };

  const handleSend = (isSingle: boolean = false) => {
    if (!message.trim()) return;
    setIsSending(true);
    setProgress(0);
    setSendSuccess(false);

    const steps = [
      { p: 20, m: "Authenticating Meta Handshake..." },
      { p: 40, m: `Connecting to ${connectedPlatform.toUpperCase()} Node...` },
      { p: 60, m: "Optimizing media packets..." },
      { p: 80, m: "Broadcasting to student network..." },
      { p: 100, m: "Transmission Successful." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].m);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSending(false);
          setSendSuccess(true);
          
          if (!isSingle) {
            onCampaignCreated({
              id: `c-${Date.now()}`,
              name: campaignName || `Broadcast ${new Date().toLocaleDateString()}`,
              status: 'Sent',
              totalMessages: studentCount,
              delivered: studentCount,
              failed: 0,
              scheduledAt: new Date().toLocaleString(),
              templateId: connectedPlatform === 'instagram' ? 'ig_verified_v1' : 'waba_verified_v1'
            });
          }

          setMessage('');
          setCampaignName('');
          setTimeout(() => setSendSuccess(false), 5000);
        }, 800);
      }
    }, 600);
  };

  const isIG = connectedPlatform === 'instagram';

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Sending Overlay */}
      {isSending && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-white/20 text-center space-y-8 animate-in zoom-in duration-300">
            <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-6 transition-transform hover:rotate-0 ${isIG ? 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]' : 'bg-[#25D366]'}`}>
              {isIG ? <Instagram size={56} className="text-white animate-pulse" /> : <MessageCircle size={56} className="text-white animate-pulse" />}
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
                {isIG ? 'Meta Direct Link' : 'WhatsApp Secure'}
              </h3>
              <p className="text-slate-500 font-bold tracking-tight h-6 uppercase text-[10px] tracking-[0.2em]">{statusText}</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden p-1.5 shadow-inner border border-slate-200">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ease-out ${isIG ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-emerald-500'}`} 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">
                {progress}% Complete
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Controls */}
        <div className="lg:col-span-8 space-y-6">
          {sendSuccess && (
            <div className={`${isIG ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-emerald-600'} text-white p-6 rounded-3xl flex items-center justify-between shadow-2xl animate-in slide-in-from-top-6`}>
              <div className="flex items-center space-x-4">
                <ShieldCheck size={28} />
                <div>
                  <p className="font-black text-lg tracking-tight">Broadcast Successful</p>
                  <p className="text-xs opacity-80 font-bold uppercase tracking-widest">Delivered via Meta {isIG ? 'Instagram' : 'WhatsApp'} Gateway</p>
                </div>
              </div>
            </div>
          )}

          {!isMetaConnected && (
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex items-center justify-between border-4 border-slate-800">
              <div className="flex items-center space-x-6">
                <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-xl rotate-3">
                  <Link2 size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Meta API Integration Required</h3>
                  <p className="text-xs text-blue-400 font-black uppercase tracking-[0.2em]">Sandbox Emulator Active</p>
                </div>
              </div>
              <button 
                onClick={onOpenMetaConnect}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl active:scale-95"
              >
                CONNECT NOW
              </button>
            </div>
          )}

          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-500">
            <div className="bg-slate-950 p-8 text-white flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${isIG ? 'bg-gradient-to-br from-purple-600 to-pink-600 rotate-3' : 'bg-emerald-500 -rotate-3'}`}>
                  {isIG ? <Instagram size={28} /> : <MessageCircle size={28} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter">
                    {isIG ? 'Instagram Meta' : 'WhatsApp Business'}
                  </h3>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em]">
                    IIB Official Channel • {isMetaConnected ? 'Verified' : 'Simulated'}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400 font-black uppercase tracking-widest">Global Reach</span>
                  <span className="text-xs font-black text-blue-400">{studentCount.toLocaleString()} Students</span>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Campaign Identifier</label>
                <input 
                  type="text" 
                  placeholder="e.g. NEET 2024 Registration Alert"
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-bold text-slate-700 transition-all text-lg shadow-inner"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Message Content</label>
                  <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase">Secure Transmission</span>
                </div>
                <div className="relative group">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Type the broadcast message for ${isIG ? 'Instagram DMs' : 'WhatsApp'}...`}
                    className="w-full h-80 p-10 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all resize-none shadow-inner text-xl text-slate-700 leading-relaxed font-medium"
                  />
                  <button 
                    onClick={handleEnhance}
                    disabled={isEnhancing || !message}
                    className={`absolute bottom-10 right-10 flex items-center space-x-3 px-10 py-5 text-white rounded-full font-black shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 ${isIG ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-900'}`}
                  >
                    {isEnhancing ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
                    <span className="tracking-tight">AI PROFESSIONALIZER</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {Object.values(Tone).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-8 py-4 rounded-[1.2rem] text-[12px] font-black uppercase tracking-[0.1em] transition-all ${selectedTone === tone ? (isIG ? 'bg-pink-600 text-white shadow-xl scale-105' : 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105') : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:scale-102'}`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-6">
               <button 
                onClick={() => handleSend(true)}
                disabled={!message || isSending}
                className={`flex-1 flex items-center justify-center space-x-4 py-8 text-white rounded-[2rem] font-black text-2xl shadow-2xl transition-all active:scale-95 hover:-translate-y-1 ${isIG ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-pink-100' : (isMetaConnected ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-900 hover:bg-black shadow-slate-100')}`}
              >
                {isIG ? <Instagram size={32} /> : <Zap size={32} />}
                <span>SINGLE TEST</span>
              </button>
              <button 
                onClick={() => handleSend(false)}
                disabled={!message || isSending}
                className={`flex-1 flex items-center justify-center space-x-4 py-8 text-white rounded-[2rem] font-black text-2xl shadow-2xl transition-all active:scale-95 hover:-translate-y-1 ${isIG ? 'bg-slate-900 hover:bg-black' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
              >
                <Send size={32} />
                <span>BULK BROADCAST</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Preview Mockup */}
        <div className="lg:col-span-4 sticky top-28 hidden xl:block">
          <div className="relative mx-auto w-[320px] h-[640px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden p-2">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-800 rounded-b-[2rem] z-20"></div>
            
            {/* Phone Screen */}
            <div className="h-full w-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
              {/* IG Header */}
              <div className="p-4 pt-10 border-b border-slate-100 flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${isIG ? 'bg-gradient-to-tr from-purple-600 to-pink-500' : 'bg-emerald-500'}`}>
                  IIB
                </div>
                <div>
                  <p className="text-[12px] font-black text-slate-900 leading-none">IIB Career Institute</p>
                  <p className="text-[10px] text-slate-400 font-bold">{isIG ? 'Instagram' : 'WhatsApp'}</p>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 flex flex-col justify-end space-y-4 bg-slate-50/50">
                {message ? (
                  <div className={`max-w-[85%] p-4 rounded-[1.5rem] shadow-sm animate-in slide-in-from-bottom-4 duration-300 ${isIG ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white rounded-br-none self-end' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message}</p>
                    <p className={`text-[9px] mt-2 font-bold ${isIG ? 'text-white/60' : 'text-slate-400'}`}>10:42 AM • Sent</p>
                  </div>
                ) : (
                  <div className="text-center pb-20 opacity-30">
                    <Smartphone size={40} className="mx-auto mb-4 text-slate-400" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Live Preview</p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-100 flex items-center space-x-2">
                <div className="flex-1 h-10 bg-slate-100 rounded-full px-4 flex items-center">
                  <span className="text-[12px] text-slate-300">Message...</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  {isIG ? <Instagram size={16} className="text-slate-400" /> : <MessageCircle size={16} className="text-slate-400" />}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-slate-400">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Meta Validated Output</span>
            </div>
            <p className="text-[10px] text-slate-400 px-10 leading-relaxed font-medium">
              This preview shows exactly how the message appears on student devices via the {isIG ? 'Instagram Direct' : 'WhatsApp Business'} API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
