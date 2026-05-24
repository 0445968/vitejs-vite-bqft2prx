import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { PasswordGenerator } from './pages/PasswordGenerator';
import { ToolCategoryRoute } from './pages/ToolCategoryRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />

        {/* New scalable category routes */}
        <Route path="/tools" element={<Navigate to="/tools/developer" replace />} />
        <Route path="/tools/:categorySlug" element={<ToolCategoryRoute />} />

        {/* Keep original individual tool routes working */}
        <Route
          path="/tools/qr-code"
          element={<Navigate to="/tools/design?tool=qr-studio" replace />}
        />
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