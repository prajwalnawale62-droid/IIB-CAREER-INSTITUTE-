
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Send, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Clock, 
  CheckCircle2, 
  Calendar,
  ShieldCheck,
  Zap,
  HelpCircle,
  Link2,
  CheckSquare,
  CreditCard
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMetaConnected: boolean;
  connectedPlatform?: 'whatsapp' | 'instagram';
  onOpenMetaConnect: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  isMetaConnected, 
  connectedPlatform = 'whatsapp',
  onOpenMetaConnect 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'contacts', label: 'Student Directory', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'finance', label: 'Fees & Finance', icon: CreditCard },
    { id: 'messaging', label: 'Live Broadcast', icon: Send },
    { id: 'campaigns', label: 'Sent History', icon: Calendar },
    { id: 'automation', label: 'AI Automation', icon: Clock },
  ];

  const activationChecklist = [
    { label: `${connectedPlatform === 'whatsapp' ? 'WABA' : 'IG'} API Token`, status: isMetaConnected ? 'Active' : 'Pending' },
    { label: 'Verified Templates', status: 'Ready' },
    { label: 'Backend Proxy', status: 'Ready' },
    { label: 'Sandbox Verification', status: 'Active' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-x-hidden">
      {/* Sidebar Mobile Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/20"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-blue-950 text-white transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        lg:relative lg:translate-x-0 border-r border-white/5
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-950 shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                <Zap size={28} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white">IIB Portal</h1>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400">Career Institute</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group
                    ${activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
                      : 'text-blue-200 hover:bg-white/5 hover:text-white hover:translate-x-1'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-blue-400 group-hover:text-blue-300'} />
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  {item.id === 'attendance' && <div className="w-2 h-2 bg-rose-400 rounded-full shadow-sm shadow-rose-400/50"></div>}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Gateway Status</span>
                <HelpCircle size={14} className="text-blue-400 cursor-help" />
              </div>
              <div className="space-y-3">
                {activationChecklist.map((check, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{check.label}</span>
                    <span className={`font-black text-[9px] px-2 py-0.5 rounded-full ${check.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
              {!isMetaConnected && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <button 
                    onClick={onOpenMetaConnect}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all uppercase tracking-widest flex items-center justify-center space-x-2"
                  >
                    <Link2 size={12} />
                    <span>Connect Meta API</span>
                  </button>
                </div>
              )}
            </div>

            <button className="w-full flex items-center justify-center space-x-3 text-blue-300 hover:text-white transition-colors py-3 border border-white/5 rounded-2xl bg-white/5 font-bold text-sm">
              <LogOut size={18} />
              <span>Logout Securely</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            <div className={`flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isMetaConnected ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
              <ShieldCheck size={12} className="mr-1.5" />
              {isMetaConnected ? `Meta ${connectedPlatform === 'instagram' ? 'Instagram' : 'WhatsApp'} Connected` : 'Sandbox Mode Active'}
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
            <button className="relative p-2.5 text-slate-400 hover:text-blue-600 bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 pl-5 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800 leading-tight">Admin Office</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">IIB Staff</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-100 border-2 border-white">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
