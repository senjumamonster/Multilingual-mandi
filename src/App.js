import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PriceDiscovery from './components/PriceDiscovery';
import AIAssistant from './components/AIAssistant';
import VendorDashboard from './components/VendorDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/prices" element={<PriceDiscovery />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/vendor" element={<VendorDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;