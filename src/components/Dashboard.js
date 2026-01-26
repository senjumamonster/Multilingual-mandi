import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { products, priceData, weatherImpacts, cities } from '../data/mockData';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Cloud, Sun } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useLanguage();

  // Get today's best prices (lowest prices across all cities)
  const getBestPrices = () => {
    return products.slice(0, 6).map(product => {
      let bestPrice = Infinity;
      let bestCity = '';
      
      cities.forEach(city => {
        const price = priceData[product.id][city.id].current;
        if (price < bestPrice) {
          bestPrice = price;
          bestCity = city.name;
        }
      });
      
      return {
        ...product,
        bestPrice,
        bestCity,
        trend: priceData[product.id][cities[0].id].trend
      };
    });
  };

  const bestPrices = getBestPrices();

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="trend-icon up" size={16} />;
      case 'down': return <TrendingDown className="trend-icon down" size={16} />;
      default: return <Minus className="trend-icon stable" size={16} />;
    }
  };

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case '🌧️': return <Cloud size={20} />;
      case '☀️': return <Sun size={20} />;
      default: return <AlertTriangle size={20} />;
    }
  };

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1 className="welcome-title">{t('welcomeMessage')}</h1>
        <p className="welcome-subtitle">
          Track prices, get AI assistance, and grow your business
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Today's Best Prices */}
        <section className="dashboard-card best-prices">
          <div className="card-header">
            <h2>{t('todaysBestPrices')}</h2>
            <Link to="/prices" className="view-all-link">View All →</Link>
          </div>
          <div className="price-grid">
            {bestPrices.map(product => (
              <div key={product.id} className="price-item">
                <div className="product-info">
                  <span className="product-icon">{product.icon}</span>
                  <div>
                    <div className="product-name">{t(product.id)}</div>
                    <div className="best-city">{product.bestCity}</div>
                  </div>
                </div>
                <div className="price-info">
                  <div className="price">₹{product.bestPrice}/kg</div>
                  {getTrendIcon(product.trend)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weather Impact */}
        <section className="dashboard-card weather-impact">
          <div className="card-header">
            <h2>{t('weatherImpact')}</h2>
          </div>
          <div className="weather-list">
            {weatherImpacts.map(impact => (
              <div key={impact.id} className={`weather-item ${impact.severity}`}>
                <div className="weather-icon">
                  {getWeatherIcon(impact.icon)}
                </div>
                <div className="weather-text">
                  {impact.impact}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-card quick-actions">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="action-buttons">
            <Link to="/prices" className="action-button">
              <span className="action-icon">💰</span>
              <span>Check Prices</span>
            </Link>
            <Link to="/assistant" className="action-button">
              <span className="action-icon">🤖</span>
              <span>AI Assistant</span>
            </Link>
            <Link to="/vendor" className="action-button">
              <span className="action-icon">🏪</span>
              <span>My Products</span>
            </Link>
            <button className="action-button" onClick={() => alert('WhatsApp integration coming soon!')}>
              <span className="action-icon">📱</span>
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </section>

        {/* Fair Trade Score */}
        <section className="dashboard-card fair-trade">
          <div className="card-header">
            <h2>{t('fairTradeScore')}</h2>
          </div>
          <div className="fair-trade-content">
            <div className="score-circle green">
              <div className="score-text">85%</div>
            </div>
            <div className="score-info">
              <p>Your recent deals have been fair to both buyers and sellers.</p>
              <div className="score-breakdown">
                <div className="score-item">
                  <span className="score-dot green"></span>
                  <span>Fair Deals: 17</span>
                </div>
                <div className="score-item">
                  <span className="score-dot yellow"></span>
                  <span>Acceptable: 3</span>
                </div>
                <div className="score-item">
                  <span className="score-dot red"></span>
                  <span>Unfair: 0</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Alerts */}
        <section className="dashboard-card price-alerts">
          <div className="card-header">
            <h2>{t('priceAlerts')}</h2>
          </div>
          <div className="alert-list">
            <div className="alert-item">
              <span className="alert-icon">🧅</span>
              <div className="alert-content">
                <div className="alert-title">Onion prices dropped!</div>
                <div className="alert-text">Now ₹28/kg in Delhi (was ₹35/kg)</div>
              </div>
              <div className="alert-time">2h ago</div>
            </div>
            <div className="alert-item">
              <span className="alert-icon">🍅</span>
              <div className="alert-content">
                <div className="alert-title">Tomato demand rising</div>
                <div className="alert-text">Expected to reach ₹45/kg by tomorrow</div>
              </div>
              <div className="alert-time">4h ago</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;