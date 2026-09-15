import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clientes } from './pages/Clientes';
import { Agendamento } from './pages/Agendamento';
import { Estoque } from './pages/Estoque';
import { Relatorios } from './pages/Relatorios';
import { Financeiro } from './pages/Financeiro';
import { Usuarios } from './pages/Usuarios';
import { Chatbot } from './pages/Chatbot';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Autenticadas (Secretária & Administradora) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/agendamento" element={<Agendamento />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/relatorios" element={<Relatorios />} />

              {/* Rotas Exclusivas da Administradora */}
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
