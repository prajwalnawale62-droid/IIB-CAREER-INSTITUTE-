
import React from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Search, Filter, Download, MoreVertical } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignsProps {
  campaigns: Campaign[];
}

const Campaigns: React.FC<CampaignsProps> = ({ campaigns }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Communication History</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Calendar size={18} />
          <span>New Broadcast</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Recipients</th>
                <th className="px-6 py-4">Sent At</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {campaigns.length > 0 ? campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{c.name}</div>
                    <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">{c.templateId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'Sent' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                      {c.status === 'Sent' ? <CheckCircle2 size={10} className="mr-1" /> : <Clock size={10} className="mr-1" />}
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">{c.delivered.toLocaleString()} Students</div>
                    <div className="text-[10px] text-slate-400">{((c.delivered / c.totalMessages) * 100).toFixed(1)}% Success Rate</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {c.scheduledAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">No campaigns sent yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
