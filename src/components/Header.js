import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { t, currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const location = useLocation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { path: '/', label: t('dashboard'), icon: '🏠' },
    { path: '/prices', label: t('prices'), icon: '💰' },
    { path: '/assistant', label: t('assistant'), icon: '🤖' },
    { path: '/vendor', label: t('vendor'), icon: '🏪' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🏪</span>
          <span className="logo-text">{t('appTitle')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Language Selector */}
        <div className="language-selector">
          <button
            className="language-button"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <Globe size={20} />
            <span>{availableLanguages.find(lang => lang.code === currentLanguage)?.flag}</span>
          </button>
          
          {showLanguageMenu && (
            <div className="language-menu">
              {availableLanguages.map(lang => (
                <button
                  key={lang.code}
                  className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setShowLanguageMenu(false);
                  }}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <nav className="nav-mobile">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link-mobile ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;