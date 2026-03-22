# 🏥 Health Adviser

AI-powered healthcare platform connecting patients, doctors, and administrators. Built with React, TypeScript, Vite, Tailwind CSS v4, Firebase, and Google Gemini.

## 🚀 Features

- **Role-Based Workflows**: Dedicated interfaces for Patients, Doctors, and Admins.
- **AI Health Advisor**: Intelligent chat with **Gemini 2.0 Flash** for medical inquiries.
- **Pharmacy System**: Admin-managed inventory with real-time stock and patient ordering.
- **Secure Messaging**: Real-time encrypted-style doctor-patient chat via Firestore.
- **Medical Reports**: Markdown-supported health assessments.
- **Premium UI**: Emerald green glassmorphism design with Lucide icons.

## 🛠 Setup Instructions

### 1. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named **"Health Adviser"**.
3. Enable **Authentication** and turn on **Google** as a sign-in provider.
4. Enable **Cloud Firestore** and choose a location.
5. Register a **Web App** in the project settings.
6. Copy the Firebase config object.

### 2. Google AI Studio (Gemini)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a new API key for **Gemini 2.0 Flash**.

### 3. Environment Variables
Update the `.env` file in the project root with your credentials:

```bash
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_key
```

### 4. Firestore Security Rules
Copy the following rules to your **Firebase Console > Firestore > Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper: Is user authenticated
    function isSignedIn() {
      return request.auth != null;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == userId;
    }

    // Medications collection
    match /medications/{medId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if isSignedIn() && (
        request.auth.uid == resource.data.patientId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow create: if isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'patient';
      allow update: if isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Chats and Messages
    match /chats/{chatId} {
      allow read, write: if isSignedIn() && request.auth.uid in resource.data.participants;
      allow create: if isSignedIn();

      match /messages/{messageId} {
        allow read, write: if isSignedIn();
      }
    }

    // Reports collection
    
    match /reports/{reportId} {
      allow read: if isSignedIn() && (
        request.auth.uid == resource.data.patientId ||
        request.auth.uid == resource.data.doctorId
      );
      allow create: if isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'doctor';
    }
  }
}
```

## 📦 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on [http://localhost:3000](http://localhost:3000).
