# 🏥 Health Adviser: AI-Powered Healthcare Platform

An advanced, role-based healthcare management system featuring AI-driven medical insights, automated pharmacy inventory, and secure doctor-patient communication. Built using React, TypeScript, Vite, Tailwind CSS, Firebase, and Gemini AI.

---

## 🌟 Key Features

### 👤 Patient Portal
- **AI Health Advisor**: Real-time triage and medical Q&A powered by **Gemini 2.0 Flash**.
- **Pharmacy Access**: Browse the inventory, check stock availability, and place orders.
- **Personal Health Records**: Access secure, markdown-rendered medical reports and summaries.

### 👨‍⚕️ Doctor Dashboard
- **Medication Prescriptions**: Assign medications to patients directly from the master inventory.
- **Patient Insight**: View patient histories and AI-assisted health assessments.
- **Secure Communication**: Real-time messaging with patients via Firestore.

### 🛡 Admin System
- **Inventory Control**: Add, edit, and track medications. Manage stock levels in real-time.
- **User Management**: Overview of all registered patients and doctors.
- **System Logs**: Track orders and pharmacy transactions.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, **Vite**, **Tailwind CSS v4**
- **Backend & Auth**: **Firebase** (Auth, Cloud Firestore)
- **AI Core**: Google **Gemini 2.0 Flash** (via `@google/genai`)
- **Icons & UI**: Lucide-React, Glassmorphism design system

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Firebase Project
- A Google AI Studio API Key

### 2. Firebase Configuration
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a project named **"Health Adviser"**.
3. Enable **Authentication** (Google login).
4. Enable **Cloud Firestore**.
5. Register a **Web App** and copy the config object into your `.env`.

### 3. Setup Project
```bash
# Clone the repository
git clone https://github.com/saisandeepnaidu-11/Medical_Advisor.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Environment Configuration
Create a `.env` file in the root directory and add the following:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_key
```

---

## 🔒 Security Rules
For production, ensure your Firestore rules are configured correctly to manage role-based access for patients, doctors, and admins as documented in the internal security guide.

---

## 📁 Project Structure
- `/src/pages`: Role-based route components (Patient, Doctor, Admin).
- `/src/components`: Shared UI components (Glassmorphism design).
- `/src/contexts`: Auth and Global state management.
- `/src/lib`: Configuration for Firebase and Gemini AI.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
