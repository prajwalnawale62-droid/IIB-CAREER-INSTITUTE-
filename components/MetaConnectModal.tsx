
import React, { useState } from 'react';
import { X, Shield, Lock, Globe, Loader2, CheckCircle2, ExternalLink, MessageCircle, Instagram } from 'lucide-react';

interface MetaConnectModalProps {
  onClose: () => void;
  onSuccess: (platform: 'whatsapp' | 'instagram') => void;
}

const MetaConnectModal: React.FC<MetaConnectModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState<'whatsapp' | 'instagram'>('whatsapp');
  const [creds, setCreds] = useState({
    token: '',
    id: '', // Phone ID or IG User ID
    businessId: ''
  });

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate Meta Handshake
    setTimeout(() => {
      setStep(2);
      setIsLoading(false);
      setTimeout(() => {
        onSuccess(platform);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Connect Meta Ecosystem</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Service</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPlatform('whatsapp')}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-2xl border-2 transition-all ${platform === 'whatsapp' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                  >
                    <MessageCircle size={20} />
                    <span className="font-bold">WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => setPlatform('instagram')}
                    className={`flex items-center justify-center space-x-2 p-4 rounded-2xl border-2 transition-all ${platform === 'instagram' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                  >
                    <Instagram size={20} />
                    <span className="font-bold">Instagram</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start space-x-3">
                <Lock className="text-blue-600 mt-0.5" size={18} />
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  {platform === 'whatsapp' 
                    ? "Link your WABA (WhatsApp Business Account) to send bulk broadcasts to students' phone numbers."
                    : "Link your Instagram Professional account to send DMs to students who have interacted with your page."
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Permanent Access Token</label>
                  <input 
                    type="password"
                    placeholder="EAAG..."
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    value={creds.token}
                    onChange={(e) => setCreds({...creds, token: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {platform === 'whatsapp' ? 'Phone Number ID' : 'Instagram Scoped ID'}
                    </label>
                    <input 
                      type="text"
                      placeholder={platform === 'whatsapp' ? '1029...' : 'ig_user_...'}
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                      value={creds.id}
                      onChange={(e) => setCreds({...creds, id: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Business ID</label>
                    <input 
                      type="text"
                      placeholder="2938..."
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                      value={creds.businessId}
                      onChange={(e) => setCreds({...creds, businessId: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleConnect}
                  disabled={!creds.token || !creds.id || isLoading}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-xl ${platform === 'instagram' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' : 'bg-slate-900 text-white hover:bg-black'}`}
                >
                  {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Globe size={24} />}
                  <span>{isLoading ? 'Establishing Handshake...' : `Connect ${platform === 'whatsapp' ? 'WhatsApp' : 'Instagram'}`}</span>
                </button>
                <a 
                  href="https://developers.facebook.com" 
                  target="_blank" 
                  className="text-center text-xs text-blue-600 font-bold hover:underline flex items-center justify-center"
                >
                  Configure Meta Graph Settings <ExternalLink size={12} className="ml-1" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-bounce ${platform === 'instagram' ? 'bg-pink-100 text-pink-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {platform === 'instagram' ? <Instagram size={40} /> : <CheckCircle2 size={40} />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">
                  {platform.toUpperCase()} Connected
                </h3>
                <p className="text-slate-500 font-medium">IIB Career Institute is now live on {platform}.</p>
              </div>
              <p className="text-xs text-slate-400 font-mono">Status: HTTP 200 OK / Node: {platform}_graph_v18</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetaConnectModal;
