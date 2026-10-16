import React, { createContext, useContext, useState, useEffect } from 'react';
import { NEXA_PERFIS, USUARIOS_SIMULADOS } from '../data/perfis';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const salvo = localStorage.getItem('usuario_logado');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, senha) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        const usuario = await response.json();
        const usuarioFormatado = {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.role === 'ADMIN' ? 'Administradora' : 'Secretária',
          cargo: usuario.role === 'ADMIN' ? 'Diretora Clínica' : 'Recepcionista Pleno'
        };
        setUser(usuarioFormatado);
        localStorage.setItem('usuario_logado', JSON.stringify(usuarioFormatado));
        return { success: true, user: usuarioFormatado };
      }

      if (response.status === 403) {
        return { success: false, error: 'Usuário desativado pela administração.' };
      }
      if (response.status === 401) {
        return { success: false, error: 'E-mail ou senha inválidos.' };
      }
    } catch (err) {
      console.warn('Backend indisponível para login, tentando base local simulada:', err);
    }

    // Fallback simulado caso o backend não esteja ativo
    const encontrado = USUARIOS_SIMULADOS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    );

    if (encontrado) {
      setUser(encontrado);
      localStorage.setItem('usuario_logado', JSON.stringify(encontrado));
      return { success: true, user: encontrado };
    }

    return { success: false, error: 'E-mail ou senha inválidos.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuario_logado');
  };

  const hasModule = (moduleName) => {
    if (!user) return false;
    const perfil = NEXA_PERFIS[user.perfil];
    return perfil ? perfil.modulos.includes(moduleName) : false;
  };

  const can = (moduleName, action) => {
    if (!user) return false;
    const perfil = NEXA_PERFIS[user.perfil];
    if (!perfil || !perfil[moduleName]) return false;
    return !!perfil[moduleName][action];
  };

  const isSecretaria = user?.perfil === 'Secretária';
  const isAdmin = user?.perfil === 'Administradora';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasModule,
        can,
        isSecretaria,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
