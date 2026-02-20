
import React, { useState } from 'react';
import { Upload, Search, Plus, Filter, MoreHorizontal, Phone, MapPin, X, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { Student } from '../types';

interface ContactsProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
}

const Contacts: React.FC<ContactsProps> = ({ students, onAddStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    phone: '',
    course: 'NEET 2024',
    batch: '',
    location: '',
    totalFees: '',
    paidFees: '',
    scholarship: '', // Added scholarship to newStudent state
    feeDueDate: new Date().toISOString().split('T')[0],
    feeStatus: 'Pending' as 'Paid' | 'Pending' | 'Overdue',
  });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm) ||
    s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.phone) return;

    // Determine final status based on numbers if not explicitly set
    const total = Number(newStudent.totalFees) || 0;
    const paid = Number(newStudent.paidFees) || 0;
    const scholarship = Number(newStudent.scholarship) || 0; // Parse scholarship value
    let finalStatus = newStudent.feeStatus;
    
    // Improved logic: student is Paid if paidFees covers (totalFees - scholarship)
    if (paid >= (total - scholarship) && total > 0) finalStatus = 'Paid';

    // Fix: Added missing 'scholarship' property to satisfy the Student interface requirement at line 42.
    const student: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStudent.name,
      phone: newStudent.phone,
      course: newStudent.course,
      batch: newStudent.batch,
      location: newStudent.location,
      tags: ['New Admission'],
      totalFees: total,
      paidFees: paid,
      scholarship: scholarship,
      feeDueDate: newStudent.feeDueDate,
      feeStatus: finalStatus,
    };

    onAddStudent(student);
    setIsModalOpen(false);
    setNewStudent({ 
      name: '', phone: '', course: 'NEET 2024', batch: '', location: '',
      totalFees: '', paidFees: '', scholarship: '', feeDueDate: new Date().toISOString().split('T')[0], feeStatus: 'Pending'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search students, courses, or numbers..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
            <Upload size={18} />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course / Batch</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone size={14} className="mr-2 text-slate-400" /> {student.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">{student.course}</div>
                    <div className="text-xs text-slate-500">Batch: {student.batch || 'Unassigned'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      student.feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                      student.feeStatus === 'Overdue' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-full uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
            <div className="flex items-center justify-between p-8 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <Plus size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">New Student Enrollment</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-slate-400 mb-2">
                  <Search size={14} className="opacity-50" />
                  <span className="text-[10px] font-black uppercase tracking-widest">General Information</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-slate-700"
                      value={newStudent.name}
                      onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="+91"
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-slate-700"
                      value={newStudent.phone}
                      onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Course</label>
                    <select 
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-slate-700 appearance-none"
                      value={newStudent.course}
                      onChange={e => setNewStudent({...newStudent, course: e.target.value})}
                    >
                      <option>NEET 2024</option>
                      <option>NEET 2025</option>
                      <option>JEE Mains</option>
                      <option>MHT-CET</option>
                      <option>Foundations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Batch Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alpha"
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-slate-700"
                      value={newStudent.batch}
                      onChange={e => setNewStudent({...newStudent, batch: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Financial Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2 text-slate-400 mb-2">
                  <CreditCard size={14} className="opacity-50" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Financial Records</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Total Fee (₹)</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-slate-700"
                      value={newStudent.totalFees}
                      onChange={e => setNewStudent({...newStudent, totalFees: e.target.value})}
                    />
                  </div>
                  <div>
                    {/* Added Scholarship input field to fix missing data for Student interface */}
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Scholarship (₹)</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-slate-700"
                      value={newStudent.scholarship}
                      onChange={e => setNewStudent({...newStudent, scholarship: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Amount Paid (₹)</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-slate-700"
                      value={newStudent.paidFees}
                      onChange={e => setNewStudent({...newStudent, paidFees: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Payment Due Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-slate-700"
                        value={newStudent.feeDueDate}
                        onChange={e => setNewStudent({...newStudent, feeDueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Account Status</label>
                    <select 
                      className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-slate-700 appearance-none"
                      value={newStudent.feeStatus}
                      onChange={e => setNewStudent({...newStudent, feeStatus: e.target.value as any})}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all border border-slate-200"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                  Finalize Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
