import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Agendamento } from './pages/Agendamento';
import { Estoque } from './pages/Estoque';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Autenticadas da Secretária */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/agendamento" replace />} />
              <Route path="/agendamento" element={<Agendamento />} />
              <Route path="/estoque" element={<Estoque />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/agendamento" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
