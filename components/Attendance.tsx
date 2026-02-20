
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Filter, 
  ChevronDown, 
  ShieldCheck, 
  BellRing,
  Loader2,
  CheckSquare
} from 'lucide-react';
import { Student } from '../types';

interface AttendanceProps {
  students: Student[];
  onOpenMetaConnect: () => void;
}

const Attendance: React.FC<AttendanceProps> = ({ students }) => {
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  
  // Initialize all students as "Present" (true)
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>(
    students.reduce((acc, s) => ({ ...acc, [s.id]: true }), {})
  );

  const toggleAttendance = (id: string) => {
    setAttendanceState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markAll = (present: boolean) => {
    const newState = { ...attendanceState };
    filteredStudents.forEach(s => {
      newState[s.id] = present;
    });
    setAttendanceState(newState);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'All Batches' || s.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const absentees = Object.entries(attendanceState).filter(([id, present]) => !present).length;
  const presentCount = Object.values(attendanceState).filter(v => v).length;

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call to sync and send notifications
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 5000);
    }, 2000);
  };

  const batches = ['All Batches', ...Array.from(new Set(students.map(s => s.batch).filter(Boolean)))];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Present</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{presentCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Absent</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{absentees}</h3>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none mb-1">System Date</p>
              <h3 className="text-lg font-black tracking-tight">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
            </div>
          </div>
        </div>
      </div>

      {syncSuccess && (
        <div className="bg-emerald-600 text-white p-5 rounded-2xl flex items-center justify-between shadow-xl animate-in slide-in-from-top-6">
          <div className="flex items-center space-x-3">
            <ShieldCheck size={24} />
            <span className="font-bold">Sync Complete: {absentees} absentee notifications queued for Meta broadcast.</span>
          </div>
        </div>
      )}

      {/* Main Controls */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Find student..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <select 
                className="appearance-none pl-6 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 cursor-pointer"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                {batches.map(b => <option key={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => markAll(true)}
              className="flex-1 md:flex-none px-4 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-100 transition-all"
            >
              All Present
            </button>
            <button 
              onClick={() => markAll(false)}
              className="flex-1 md:flex-none px-4 py-4 bg-rose-50 text-rose-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
            >
              All Absent
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch/Course</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const isPresent = attendanceState[student.id];
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${isPresent ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100' : 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100 opacity-50'}`}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-black tracking-tight ${isPresent ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{student.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{student.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 uppercase">
                        {student.batch} • {student.course}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl">
                        <button 
                          onClick={() => toggleAttendance(student.id)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${isPresent ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => toggleAttendance(student.id)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${!isPresent ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-slate-400">
            <CheckSquare size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Batch Complete Verification Pending</span>
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSyncing ? <Loader2 size={24} className="animate-spin" /> : <BellRing size={24} />}
            <span>{isSyncing ? 'SYCHRONIZING...' : `SYNC & NOTIFY ABSENTEES (${absentees})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
