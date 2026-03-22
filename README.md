# 🏥 Health Adviser: Your Intelligent Healthcare Companion

<div align="center">
  <h3>Next-generation healthcare platform bridging patients, doctors, and pharmacy services.</h3>
  <p> Powered by AI, designed for modern care.</p>
</div>

---

## 🌐 Overview
**Health Adviser** is a robust web application that streamlines the medical journey. Whether you're a patient looking for quick advice, a doctor managing prescriptions, or an admin overseeing a pharmacy inventory, Health Adviser provides an intuitive, high-performance interface for all your needs.

## ✨ Key Features

### 🤵 For Patients
- **🤖 AI-Powered Triage**: Instant health insights and preliminary advice powered by **Gemini 2.0 Flash**.
- **💊 Online Pharmacy**: Browse medications and check stock levels in real-time.
- **📄 Digital Records**: Access all your reports and prescriptions securely from anywhere.

### 🩺 For Doctors
- **🩺 Smart Diagnostics**: Leverage AI-assisted symptom analysis for more informed decision-making.
- **📝 Easy Prescribing**: Quick-select medications from the pharmacy's real-time inventory.
- **💬 Direct Communication**: Connect with your patients for follow-ups and inquiries.

### 🛡️ For Administrators
- **📦 Inventory Control**: Full suite of tools to manage medicine stocks, pricing, and availability.
- **👥 User Management**: System-wide oversight of all doctors and patients to ensure smooth operations.
- **📈 Insightful Auditing**: Track transactions and orders for better organizational planning.

---

## 🛠️ Project Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern UI library for a responsive experience. |
| **Vite** | Ultra-fast build tool and development server. |
| **TypeScript** | Type-safe development for reliable code. |
| **Tailwind CSS v4** | Utility-first styling with premium Glassmorphism design patterns. |
| **Firebase** | Backend-as-a-service providing Authentication and Firestore. |
| **Google Gemini 2.0 Flash** | Cutting-edge AI for intelligent consultations. |

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. Prerequisites
- **Node.js**: (Current LTS recommended)
- **NPM** or **Yarn**
- A **Google Gemini API Key**
- A **Firebase Project**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/saisandeepnaidu-11/Medical_Advisor.git

# Navigate to the project directory
cd health-adviser

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your credentials:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_key
```

### 4. Running the App
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure
```text
/src
├── /components   # Reusable UI components (buttons, modals, cards)
├── /contexts     # Application state & Authentication logic
├── /lib          # Configuration for Firebase and Google AI
├── /pages        # Role-based pages (Patient, Doctor, Admin Dashboards)
└── /types        # Centralized TypeScript interfaces
```

---

## 🔐 Security & Access
The project uses role-based access control (RBAC). Ensure your Firestore security rules are configured to only allow authorized roles (e.g., Doctors can create prescriptions, but Patients can only view their own).

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for a Healthier World.</p>
