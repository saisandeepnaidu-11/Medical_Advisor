import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navbar from './components/shared/Navbar';
import LoginPage from './pages/LoginPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import MedicationsPage from './pages/admin/MedicationsPage';
import RegisteredPatients from './pages/admin/RegisteredPatients';

// Doctor
import PatientMonitoring from './pages/doctor/PatientMonitoring';
import AIAdvisor from './pages/doctor/AIAdvisor';
import ChatPage from './pages/doctor/ChatPage';
import PatientReports from './pages/doctor/PatientReports';
import DiseasePrediction from './pages/doctor/DiseasePrediction';
import HealthWellbeing from './pages/doctor/HealthWellbeing';

// Patient
import PatientDashboard from './pages/patient/PatientDashboard';
import MedicationShop from './pages/patient/MedicationShop';
import OrdersPage from './pages/patient/OrdersPage';
import ReportsPage from './pages/patient/ReportsPage';
import DoctorChatSelection from './pages/patient/DoctorChatSelection';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/medications" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MedicationsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/patients" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RegisteredPatients />
              </ProtectedRoute>
            } />

            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <PatientMonitoring />
              </ProtectedRoute>
            } />
            <Route path="/doctor/ai-advisor" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AIAdvisor />
              </ProtectedRoute>
            } />
            <Route path="/doctor/chat/:chatId" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/doctor/reports/:patientId" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <PatientReports />
              </ProtectedRoute>
            } />
            <Route path="/doctor/disease-prediction" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DiseasePrediction />
              </ProtectedRoute>
            } />
            <Route path="/doctor/health-wellbeing" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <HealthWellbeing />
              </ProtectedRoute>
            } />

            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/patient/shop" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <MedicationShop />
              </ProtectedRoute>
            } />
            <Route path="/patient/orders" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/patient/reports" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/patient/chat" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DoctorChatSelection />
              </ProtectedRoute>
            } />
            <Route path="/patient/chat/:chatId" element={
              <ProtectedRoute allowedRoles={['patient']}>
                <ChatPage />
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
