
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Send, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface DashboardProps {
  campaignCount: number;
  totalSent: number;
}

const data = [
  { name: 'Mon', sent: 2400 },
  { name: 'Tue', sent: 1398 },
  { name: 'Wed', sent: 9800 },
  { name: 'Thu', sent: 3908 },
  { name: 'Fri', sent: 4800 },
  { name: 'Sat', sent: 3800 },
  { name: 'Sun', sent: 4300 },
];

const Dashboard: React.FC<DashboardProps> = ({ campaignCount, totalSent }) => {
  const stats = [
    { label: 'Active Students', value: '12,482', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Messages', value: totalSent.toLocaleString(), icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Campaigns', value: campaignCount.toString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'System Health', value: '100%', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
                <TrendingUp size={12} className="mr-1" /> +12%
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-lg font-semibold mb-6 text-slate-800">Broadcast Volume (7 Days)</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Area type="monotone" dataKey="sent" stroke="#2563eb" fillOpacity={1} fill="url(#colorSent)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
