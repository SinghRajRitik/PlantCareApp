import React, { useState, useRef, useEffect } from 'react';
import { Send, Leaf, Sun, Droplets, Bug, HelpCircle, LogOut } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PlantCareBot = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `🌱 Hi ${user?.name || 'there'}! I'm your Plant Care Assistant. I can help you with plant care, identify issues, suggest solutions, and provide growing tips. What can I help you with today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickSuggestions = [
    "My plant has yellow leaves",
    "How often should I water?",
    "Best light for houseplants",
    "How to increase humidity",
    "Signs of overwatering",
    "When to repot plants"
  ];

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/send`,
        { message: currentInput }
      );

      const botResponse = {
        id: messages.length + 2,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again! 🌿",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickSuggestion = (suggestion) => {
    setInputText(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-screen w-full lg:max-w-6xl mx-auto bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Leaf className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Plant Care Assistant</h1>
              <p className="text-green-100 text-sm">Logged in as {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded-lg text-sm transition-colors"
              >
                Home
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition-colors flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-b">
        <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleQuickSuggestion(suggestion)}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex items-center mb-1">
                  <Leaf className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-xs text-gray-500">Plant Expert</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-green-100' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 shadow-sm px-4 py-2 rounded-lg max-w-xs">
              <div className="flex items-center mb-1">
                <Leaf className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-gray-500">Plant Expert is typing...</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about plant care, watering, lighting, or specific plants..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="1"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex justify-center space-x-6 mt-3 text-gray-400">
          <div className="flex items-center space-x-1 text-xs">
            <Droplets className="w-4 h-4" />
            <span>Watering</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <Sun className="w-4 h-4" />
            <span>Lighting</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <Bug className="w-4 h-4" />
            <span>Problems</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <HelpCircle className="w-4 h-4" />
            <span>Care Tips</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCareBot;