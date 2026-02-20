
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Messaging from './components/Messaging';
import Campaigns from './components/Campaigns';
import Automation from './components/Automation';
import Attendance from './components/Attendance';
import Finance from './components/Finance';
import MetaConnectModal from './components/MetaConnectModal';
import { Student, Campaign, Transaction } from './types';

const MOCK_STUDENTS: Student[] = [
  { 
    id: '1', name: 'Rahul Sharma', phone: '+91 9876543210', course: 'NEET 2024', batch: 'Alpha', location: 'Latur', tags: ['Paid', 'Scholarship'],
    totalFees: 85000, paidFees: 85000, scholarship: 10000, feeDueDate: '2023-12-01', lastPaymentDate: '2023-11-15', feeStatus: 'Paid'
  },
  { 
    id: '2', name: 'Ananya Deshmukh', phone: '+91 9876543211', course: 'JEE Mains', batch: 'Delta', location: 'Nanded', tags: ['Top-Batch'],
    totalFees: 95000, paidFees: 45000, scholarship: 5000, feeDueDate: '2025-03-15', lastPaymentDate: '2024-01-10', feeStatus: 'Pending'
  },
  { 
    id: '3', name: 'Siddharth Patil', phone: '+91 9876543212', course: 'NEET 2025', batch: 'Omega', location: 'Pune', tags: ['New Admission'],
    totalFees: 120000, paidFees: 20000, scholarship: 0, feeDueDate: '2024-02-28', lastPaymentDate: '2023-12-05', feeStatus: 'Overdue'
  },
  { 
    id: '4', name: 'Priya Kulkarni', phone: '+91 7276926165', course: 'MHT-CET', batch: 'Beta', location: 'Latur', tags: ['Verification Target'],
    totalFees: 65000, paidFees: 65000, scholarship: 0, feeDueDate: '2023-11-10', lastPaymentDate: '2023-10-30', feeStatus: 'Paid'
  },
  { 
    id: '5', name: 'Amit Varma', phone: '+91 8888899999', course: 'NEET 2024', batch: 'Alpha', location: 'Chhatrapati Sambhajinagar', tags: ['Hostel'],
    totalFees: 85000, paidFees: 30000, scholarship: 15000, feeDueDate: '2025-03-10', lastPaymentDate: '2024-02-15', feeStatus: 'Pending'
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-1001', studentId: '1', studentName: 'Rahul Sharma', amount: 25000, method: 'UPI', date: '2023-11-15', status: 'Success' },
  { id: 'TXN-1002', studentId: '2', studentName: 'Ananya Deshmukh', amount: 15000, method: 'Cash', date: '2024-01-10', status: 'Success' },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'NEET 2024 Exam Prep Tips', status: 'Sent', totalMessages: 4500, delivered: 4482, failed: 18, scheduledAt: '2023-11-20 10:00 AM', templateId: 't1' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [connectedPlatform, setConnectedPlatform] = useState<'whatsapp' | 'instagram'>('whatsapp');
  const [showMetaModal, setShowMetaModal] = useState(false);

  const addStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const addTransaction = (txn: Transaction) => {
    setTransactions(prev => [txn, ...prev]);
  };

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard campaignCount={campaigns.length} totalSent={campaigns.reduce((acc, c) => acc + c.delivered, 0)} />;
      case 'contacts':
        return <Contacts students={students} onAddStudent={addStudent} />;
      case 'attendance':
        return <Attendance students={students} onOpenMetaConnect={() => setShowMetaModal(true)} />;
      case 'finance':
        return (
          <Finance 
            students={students} 
            transactions={transactions}
            onUpdateStudent={updateStudent} 
            onAddTransaction={addTransaction}
            onOpenMetaConnect={() => setShowMetaModal(true)} 
          />
        );
      case 'messaging':
        return <Messaging 
          studentCount={students.length} 
          onCampaignCreated={addCampaign} 
          isMetaConnected={isMetaConnected}
          connectedPlatform={connectedPlatform}
          onOpenMetaConnect={() => setShowMetaModal(true)}
        />;
      case 'campaigns':
        return <Campaigns campaigns={campaigns} />;
      case 'automation':
        return <Automation students={students} />;
      default:
        return <Dashboard campaignCount={campaigns.length} totalSent={campaigns.reduce((acc, c) => acc + c.delivered, 0)} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMetaConnected={isMetaConnected}
        connectedPlatform={connectedPlatform}
        onOpenMetaConnect={() => setShowMetaModal(true)}
      >
        {renderContent()}
      </Layout>
      {showMetaModal && (
        <MetaConnectModal 
          onClose={() => setShowMetaModal(false)} 
          onSuccess={(platform) => {
            setConnectedPlatform(platform);
            setIsMetaConnected(true);
            setShowMetaModal(false);
          }} 
        />
      )}
    </>
  );
};

export default App;
