# 🏥 Health Adviser: Your Intelligent Healthcare Companion

## 🌐 About the Project
**Health Adviser** is a next-generation healthcare platform designed to bridge the gap between patients, medical professionals, and pharmacy services. By leveraging **Artificial Intelligence** and real-time data, it provides a seamless, secure, and intuitive environment for managing health.

The mission of this project is to make specialized healthcare more accessible through an AI-powered triage system while providing doctors and admins the tools they need to deliver high-quality care efficiently.

---

## 🚀 What Can You Do?

### 👥 For Patients: "Your Health in Your Hands"
- **AI Health Consultation**: Get instant, intelligent health insights and triage guidance powered by **Gemini 2.0 Flash AI**.
- **Digital Pharmacy**: Directly browse available medications, check real-time stock, and place orders without waiting in line.
- **Secure Records**: Instantly access your medical reports and prescriptions in a clean, easy-to-read format.

### 👨‍⚕️ For Doctors: "Tools for Precision Medicine"
- **AI-Enhanced Diagnostics**: Use AI-assisted observations to help provide more accurate assessments.
- **Seamless Prescription Management**: Assign medications from the centralized inventory directly to patient records.
- **Real-Time Patient Connection**: Secure, instant messaging to follow up with patients and answer questions.

### 🛡️ For Administrators: "Efficient Operations"
- **Smart Pharmacy Inventory**: Complete control over medication stock, pricing, and availability.
- **Patient & Doctor Management**: An bird's-eye view of all system users to ensure smooth healthcare delivery.
- **Detailed Audit Logs**: Track orders and pharmacy transactions for better resource planning.

---

## ✨ Design Philosophy
The website is built with a **Premium Glassmorphism** aesthetic. We use an emerald-green color palette to evoke a sense of health and calm, paired with a responsive design that feels alive and intuitive on any device.

---

## 🛠️ Core Technology
- **Intelligence**: Google Gemini 2.0 Flash
- **Cloud Infrastructure**: Firebase (Auth, Firestore)
- **Framework & Performance**: React 19, Vite, TypeScript
- **Visuals**: Tailwind CSS v4, Lucide Icons

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
