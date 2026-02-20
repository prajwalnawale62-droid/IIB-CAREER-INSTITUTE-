
export enum Tone {
  PROFESSIONAL = 'Professional',
  FRIENDLY = 'Friendly',
  MOTIVATIONAL = 'Motivational',
  URGENT = 'Urgent'
}

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  method: string;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  course: string;
  batch: string;
  location: string;
  tags: string[];
  // Fee Sync Fields
  totalFees: number;
  paidFees: number;
  scholarship: number;
  feeDueDate: string;
  lastPaymentDate?: string;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Failed';
  totalMessages: number;
  delivered: number;
  failed: number;
  scheduledAt: string;
  templateId: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  placeholders: string[];
}

export interface AnalyticsStats {
  totalStudents: number;
  totalMessagesSent: number;
  deliveryRate: number;
  failedMessages: number;
}
