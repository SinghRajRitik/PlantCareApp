import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import PlantCareHomepage from './components/PlantCareHomepage';
import Login from './components/Login';
import Register from './components/Register';

function AppContent() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center  from-green-50 to-blue-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-xl text-green-800 font-semibold">Loading PlantCare AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <Login onToggle={() => setShowLogin(false)} />
    ) : (
      <Register onToggle={() => setShowLogin(true)} />
    );
  }

  return <PlantCareHomepage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;