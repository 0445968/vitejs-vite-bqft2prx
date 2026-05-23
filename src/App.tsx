import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { PasswordGenerator } from './pages/PasswordGenerator';
import { QRTool } from './pages/QRTool';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="/tools/qr-code" element={<QRTool />} />
        <Route
          path="/tools/password-generator"
          element={<PasswordGenerator />}
        />

        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
