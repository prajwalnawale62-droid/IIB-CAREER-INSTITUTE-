
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  ChevronDown, 
  Download, 
  BellRing, 
  Loader2, 
  ShieldCheck, 
  DollarSign,
  AlertTriangle,
  FileText,
  Plus,
  ArrowUpRight,
  TrendingDown,
  X,
  Calendar,
  History,
  Wallet,
  CheckCircle,
  Printer,
  Share2,
  Zap,
  Smartphone,
  QrCode
} from 'lucide-react';
import { Student, Transaction } from '../types';

interface FinanceProps {
  students: Student[];
  transactions: Transaction[];
  onUpdateStudent: (student: Student) => void;
  onAddTransaction: (txn: Transaction) => void;
  onOpenMetaConnect: () => void;
}

const Finance: React.FC<FinanceProps> = ({ students, transactions, onUpdateStudent, onAddTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTxn, setLastTxn] = useState<Transaction | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Effect to automatically show QR if UPI is selected and amount is present
  useEffect(() => {
    if (paymentMethod === 'UPI / QR Code' && Number(paymentAmount) > 0) {
      setShowQR(true);
    } else {
      setShowQR(false);
    }
  }, [paymentMethod, paymentAmount]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

  const totalReceivable = students.reduce((acc, s) => acc + s.totalFees, 0);
  const totalCollected = students.reduce((acc, s) => acc + s.paidFees, 0);
  const totalScholarship = students.reduce((acc, s) => acc + (s.scholarship || 0), 0);
  const overdueCount = students.filter(s => s.feeStatus === 'Overdue').length;

  const handleSyncReminders = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 5000);
    }, 2000);
  };

  const handleCollectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !paymentAmount) return;

    setIsProcessing(true);
    
    // Simulate payment gateway handshake
    await new Promise(resolve => setTimeout(resolve, 1500));

    const amount = Number(paymentAmount);
    const newPaid = editingStudent.paidFees + amount;
    
    // Determine new status
    const netPayable = editingStudent.totalFees - (editingStudent.scholarship || 0);
    let newStatus = editingStudent.feeStatus;
    if (newPaid >= netPayable) {
      newStatus = 'Paid';
    } else {
      const today = new Date();
      const due = new Date(editingStudent.feeDueDate);
      newStatus = today > due ? 'Overdue' : 'Pending';
    }

    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxn: Transaction = {
      id: txnId,
      studentId: editingStudent.id,
      studentName: editingStudent.name,
      amount: amount,
      method: paymentMethod,
      date: new Date().toISOString().split('T')[0],
      status: 'Success'
    };

    onUpdateStudent({
      ...editingStudent,
      paidFees: newPaid,
      feeStatus: newStatus as any,
      lastPaymentDate: newTxn.date
    });
    onAddTransaction(newTxn);
    setLastTxn(newTxn);
    setIsProcessing(false);
  };

  const handleCloseReceipt = () => {
    setEditingStudent(null);
    setLastTxn(null);
    setPaymentAmount('');
    setShowQR(false);
  };

  // UPI QR Generator URL (Simulated with Placeholder QR Generator)
  const generateQRUrl = (name: string, amount: string) => {
    const instituteUPI = "iibcareerinstitute@upi";
    const cleanName = encodeURIComponent(name);
    // Standard UPI URI format: upi://pay?pa=address&pn=name&am=amount
    const upiPayload = `upi://pay?pa=${instituteUPI}&pn=${cleanName}&am=${amount}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiPayload)}&bgcolor=f8fafc&color=0f172a&margin=20`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      {/* Finance Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
              <DollarSign size={20} />
            </div>
            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Collection</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">₹{totalCollected.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
              <Wallet size={20} />
            </div>
            <History size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Receivable</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">₹{(totalReceivable - totalCollected - totalScholarship).toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-rose-50 text-rose-600 p-3 rounded-2xl">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overdue Accounts</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{overdueCount}</h3>
          </div>
        </div>

        <div className="bg-slate-900 md:col-span-1 p-6 rounded-[2rem] text-white shadow-xl flex flex-col justify-center space-y-3">
          <button 
            onClick={handleSyncReminders}
            className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <BellRing size={14} />}
            <span>{isSyncing ? 'Syncing...' : 'Sync Fee Reminders'}</span>
          </button>
          <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all">
            <Download size={14} />
            <span>Financial Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search accounts..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Status</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const netPayable = student.totalFees - (student.scholarship || 0);
                  const remaining = netPayable - student.paidFees;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${student.feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm tracking-tight">{student.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{student.course}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            student.feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {student.feeStatus}
                          </span>
                          <p className="text-[11px] font-bold text-slate-500 tracking-tight">Bal: ₹{remaining.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setEditingStudent(student)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                        >
                          Collect Payment
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-black text-slate-800 tracking-tight">Recent Ledger</h4>
              <History size={18} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              {transactions.slice(0, 5).map(txn => (
                <div key={txn.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-lg text-emerald-600 shadow-sm border border-slate-100">
                      <Plus size={14} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-800 leading-tight">{txn.studentName}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{txn.method} • {txn.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">+₹{txn.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">View All Activity</button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing & Receipt Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden relative">
            
            {!lastTxn ? (
              <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                {/* Form Side */}
                <div className="md:col-span-7 p-10 border-r border-slate-100">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 p-2.5 rounded-xl text-white">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Process Payment</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{editingStudent.name}</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleCollectPayment} className="space-y-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Payment Amount (₹)</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">₹</span>
                          <input 
                            required
                            autoFocus
                            type="number" 
                            className="w-full pl-12 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-black text-3xl text-slate-800 transition-all"
                            value={paymentAmount}
                            onChange={e => setPaymentAmount(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Payment Source</label>
                        <select 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none appearance-none cursor-pointer"
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <option>UPI / QR Code</option>
                          <option>Direct Bank Transfer</option>
                          <option>Cash Deposit</option>
                          <option>Cheque / DD</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isProcessing || !paymentAmount}
                      className="w-full py-6 bg-slate-900 text-white font-black text-lg uppercase tracking-widest rounded-[2rem] hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 size={24} className="animate-spin text-blue-400" />
                      ) : (
                        <DollarSign size={24} className="text-emerald-400" />
                      )}
                      <span>{isProcessing ? 'AUTHORIZING...' : 'SUBMIT PAYMENT'}</span>
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                    >
                      Cancel Transaction
                    </button>
                  </form>
                </div>

                {/* QR Side */}
                <div className="md:col-span-5 bg-slate-50 p-10 flex flex-col items-center justify-center text-center space-y-6">
                  {showQR ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-500">
                      <div className="relative group">
                        <div className="absolute -inset-2 bg-blue-500/10 rounded-[2.5rem] blur-xl group-hover:bg-blue-500/20 transition-all duration-700 animate-pulse"></div>
                        <div className="relative bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-2xl">
                          <img 
                            src={generateQRUrl(editingStudent.name, paymentAmount)} 
                            alt="Payment QR"
                            className="w-48 h-48 md:w-56 md:h-56 rounded-3xl"
                          />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-xl shadow-lg border border-slate-100">
                            <QrCode size={24} className="text-blue-600" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2 text-blue-600">
                           <Smartphone size={16} className="animate-bounce" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Scan to Pay UPI</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter">₹{Number(paymentAmount).toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">IIB Career Institute Account</p>
                      </div>

                      <div className="pt-4 border-t border-slate-200 w-full">
                        <p className="text-[8px] font-black text-slate-300 uppercase leading-relaxed tracking-widest">
                          Secured via BharatQR <br/> & NPCI Protocol
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center space-y-4 max-w-[180px]">
                      <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center">
                        <Smartphone size={32} className="opacity-40" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        Enter amount to generate <br/> payment QR
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                  <CheckCircle size={48} strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Payment Confirmed</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-8">Transaction Securely Settled</p>

                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 text-left space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Zap size={80} className="text-blue-900" />
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Institute Copy</p>
                      <h4 className="text-xs font-black text-slate-800 tracking-tight">IIB Career Institute</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Receipt No</p>
                      <p className="text-[10px] font-black text-slate-800">{lastTxn.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[10px] font-bold text-slate-400">STUDENT</span>
                      <span className="text-[10px] font-black text-slate-800">{lastTxn.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-bold text-slate-400">METHOD</span>
                      <span className="text-[10px] font-black text-slate-800">{lastTxn.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-bold text-slate-400">DATE</span>
                      <span className="text-[10px] font-black text-slate-800">{lastTxn.date}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800">TOTAL PAID</span>
                      <span className="text-xl font-black text-emerald-600 tracking-tighter">₹{lastTxn.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center space-x-2 hover:bg-slate-200">
                    <Printer size={16} />
                    <span>Print</span>
                  </button>
                  <button className="flex-1 py-4 bg-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center space-x-2 hover:bg-slate-200">
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>

                <button 
                  onClick={handleCloseReceipt}
                  className="w-full mt-4 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-xl transition-all"
                >
                  Done & Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
