
import React from 'react';
import { Clock, Play, Pause, Settings, Cake, CreditCard, Bell, Sparkles } from 'lucide-react';
import { Student } from '../types';

interface AutomationProps {
  students?: Student[];
}

const Automation: React.FC<AutomationProps> = ({ students = [] }) => {
  const pendingFeesCount = students.filter(s => s.feeStatus !== 'Paid').length;
  const absenteesScanReady = students.length > 0;

  const automations = [
    { 
      id: 1, 
      name: 'Birthday Wishes', 
      description: 'Automatically sends personalized greetings to students on their birthdays.',
      icon: Cake,
      active: true,
      stats: 'Sent 12 today',
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      id: 2, 
      name: 'Fee Payment Reminders', 
      description: 'Sends alerts to students with pending fees 3 days before the deadline.',
      icon: CreditCard,
      active: true,
      stats: `${pendingFeesCount.toLocaleString()} pending accounts synced`,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      id: 3, 
      name: 'Attendance Notifications', 
      description: 'Notifies parents if a student is absent from their scheduled class.',
      icon: Bell,
      active: true,
      stats: absenteesScanReady ? 'Scanning active session' : 'Ready to scan',
      color: 'bg-emerald-50 text-emerald-600'
    },
    { 
      id: 4, 
      name: 'Test Result Alerts', 
      description: 'Broadcasts individual test scores immediately after they are published.',
      icon: Sparkles,
      active: true,
      stats: 'Portal sync active',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Workflow Automation</h3>
          <p className="text-sm text-slate-500 font-medium">Global communication rules for IIB Career Institute</p>
        </div>
        <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl font-black text-xs uppercase tracking-widest active:scale-95">
          New Global Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {automations.map((rule) => (
          <div key={rule.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className={`${rule.color} p-5 rounded-2xl shadow-inner`}>
                <rule.icon size={28} />
              </div>
              <div className="flex items-center space-x-3">
                <button className={`p-3 rounded-xl transition-all shadow-sm active:scale-90 ${rule.active ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                  {rule.active ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-all active:scale-90">
                  <Settings size={20} />
                </button>
              </div>
            </div>
            
            <h4 className="text-xl font-black text-slate-800 mb-2 tracking-tight">{rule.name}</h4>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
              {rule.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase ${rule.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {rule.active ? 'SYSTEM ONLINE' : 'PAUSED'}
              </span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center">
                <Clock size={12} className="mr-1.5" /> {rule.stats}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="bg-white/10 w-16 h-16 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
            <Sparkles size={32} className="text-blue-200" />
          </div>
          <h3 className="text-4xl font-black tracking-tighter mb-4 italic">IIB Smart-Scheduler</h3>
          <p className="text-blue-100 mb-8 text-lg font-medium leading-relaxed">
            Our proprietary AI engine optimizes message delivery times based on historical student engagement data. Increase your reach with predictive broadcasting.
          </p>
          <button className="px-10 py-5 bg-white text-blue-900 rounded-[1.5rem] font-black text-lg hover:bg-blue-50 transition-all shadow-2xl active:scale-95 uppercase tracking-widest">
            Enable AI Optimization
          </button>
        </div>
        <Sparkles className="absolute right-[-40px] bottom-[-40px] text-white opacity-10" size={320} />
      </div>
    </div>
  );
};

export default Automation;
