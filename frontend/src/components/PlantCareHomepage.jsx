// frontend/src/components/PlantCareHomepage.jsx
import React, { useState } from 'react';
import PlantCareBot from './PlantCareBot';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const PlantCareHomepage = () => {
  const [currentView, setCurrentView] = useState('homepage');
  const { user, logout } = useAuth();

  const handleGetStarted = () => {
    setCurrentView('chat');
  };

  const handleBackToHome = () => {
    setCurrentView('homepage');
  };

  if (currentView === 'chat') {
    return <PlantCareBot onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen  from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🌱</span>
              <span className="text-2xl font-bold text-green-800">PlantCare AI</span>
            </div>
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Features</a>
                <a href="#about" className="text-gray-600 hover:text-green-600 font-medium transition-colors">About</a>
                <a href="#contact" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Contact</a>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Hi, {user?.name}!</span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🪴</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6 leading-tight">
            Your Personal
            <span className="block text-green-600">Plant Care Assistant</span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
            Get expert advice, care tips, and instant answers about your plants. 
            Our AI chatbot is here to help your green friends thrive!
          </p>
          
          <button
            onClick={handleGetStarted}
            className=" from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold text-lg px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">AI Chat Support</h3>
              <p className="text-gray-600">Get instant answers to all your plant care questions powered by Google Gemini AI</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Easy to Use</h3>
              <p className="text-gray-600">Simple interface designed for plant lovers of all levels with saved chat history</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">🌿</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Expert Knowledge</h3>
              <p className="text-gray-600">Comprehensive plant database with personalized care instructions</p>
            </div>
          </div>

          <div className="mt-16 bg-white/60 backdrop-blur-sm p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Why Choose PlantCare AI?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-green-700 mb-2">🔒 Secure & Private</h3>
                <p className="text-gray-600">Your data is protected with JWT authentication and secure storage</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-700 mb-2">💾 Chat History</h3>
                <p className="text-gray-600">Access your previous conversations anytime, anywhere</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-700 mb-2">🤖 AI-Powered</h3>
                <p className="text-gray-600">Leveraging Google Gemini for intelligent, context-aware responses</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-700 mb-2">🌍 Always Available</h3>
                <p className="text-gray-600">24/7 plant care assistance at your fingertips</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-green-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-semibold">PlantCare AI</span>
          </div>
          <p className="text-green-100 mb-2">
            © 2025 PlantCare AI. Helping your plants grow healthy and strong.
          </p>
          <p className="text-green-200 text-sm">
            Powered by MERN Stack & Google Gemini AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PlantCareHomepage;