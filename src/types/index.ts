export type UserRole = 'patient' | 'doctor' | 'admin';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  addedBy: string;
}

export interface Order {
  id: string;
  patientId: string;
  medicationId: string;
  medicationName?: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Report {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName?: string;
  title: string;
  content: string;
  date: string;
}

export interface AIMessage {
  role: 'user' | 'model';
  text: string;
}
