import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { products, cities, priceData } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Search, Bell } from 'lucide-react';
import './PriceDiscovery.css';

const PriceDiscovery = () => {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState('tomato');
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceAlerts, setPriceAlerts] = useState({});

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t(product.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentProductData = priceData[selectedProduct];
  const currentCityData = currentProductData[selectedCity];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="trend-icon up" size={20} />;
      case 'down': return <TrendingDown className="trend-icon down" size={20} />;
      default: return <Minus className="trend-icon stable" size={20} />;
    }
  };

  const getPriceChange = (current, yesterday) => {
    const change = current - yesterday;
    const percentage = ((change / yesterday) * 100).toFixed(1);
    return { change, percentage };
  };

  const togglePriceAlert = (productId, cityId, targetPrice) => {
    const alertKey = `${productId}-${cityId}`;
    setPriceAlerts(prev => ({
      ...prev,
      [alertKey]: prev[alertKey] ? null : { targetPrice, active: true }
    }));
  };

  const formatChartData = (historicalData) => {
    return historicalData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      price: item.price
    }));
  };

  return (
    <div className="price-discovery">
      <div className="page-header">
        <h1>{t('priceComparison')}</h1>
        <p>Real-time mandi prices across major Indian cities</p>
      </div>

      {/* Product Search */}
      <div className="search-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map(product => (
          <button
            key={product.id}
            className={`product-card ${selectedProduct === product.id ? 'selected' : ''}`}
            onClick={() => setSelectedProduct(product.id)}
          >
            <span className="product-icon">{product.icon}</span>
            <span className="product-name">{t(product.id)}</span>
            <span className="product-category">{product.category}</span>
          </button>
        ))}
      </div>

      {/* City Selector */}
      <div className="city-selector">
        <h3>{t('selectCity')}</h3>
        <div className="city-buttons">
          {cities.map(city => (
            <button
              key={city.id}
              className={`city-button ${selectedCity === city.id ? 'selected' : ''}`}
              onClick={() => setSelectedCity(city.id)}
            >
              {t(city.id)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Information */}
      <div className="price-info-grid">
        {/* Current Price Card */}
        <div className="price-card current-price">
          <div className="price-header">
            <h3>{t('currentPrice')}</h3>
            <button
              className={`alert-button ${priceAlerts[`${selectedProduct}-${selectedCity}`] ? 'active' : ''}`}
              onClick={() => togglePriceAlert(selectedProduct, selectedCity, currentCityData.current)}
              title="Set Price Alert"
            >
              <Bell size={16} />
            </button>
          </div>
          <div className="price-value">
            ₹{currentCityData.current}<span className="price-unit">/kg</span>
          </div>
          <div className="price-change">
            {getTrendIcon(currentCityData.trend)}
            <span className={`change-text ${currentCityData.trend}`}>
              {(() => {
                const { change, percentage } = getPriceChange(currentCityData.current, currentCityData.yesterday);
                return `₹${Math.abs(change)} (${percentage}%)`;
              })()}
            </span>
          </div>
        </div>

        {/* Predicted Price Card */}
        <div className="price-card predicted-price">
          <div className="price-header">
            <h3>{t('expectedTomorrow')}</h3>
            <span className="ai-badge">AI</span>
          </div>
          <div className="price-value">
            ₹{currentCityData.predicted}<span className="price-unit">/kg</span>
          </div>
          <div className="prediction-confidence">
            <span className="confidence-text">85% confidence</span>
          </div>
        </div>

        {/* Price Comparison Across Cities */}
        <div className="price-card city-comparison">
          <h3>Price Across Cities</h3>
          <div className="city-price-list">
            {cities.map(city => {
              const cityPrice = currentProductData[city.id];
              const { change, percentage } = getPriceChange(cityPrice.current, cityPrice.yesterday);
              return (
                <div key={city.id} className="city-price-item">
                  <div className="city-info">
                    <span className="city-name">{t(city.id)}</span>
                    <span className="city-state">{city.state}</span>
                  </div>
                  <div className="city-price">
                    <span className="price">₹{cityPrice.current}/kg</span>
                    <span className={`change ${change >= 0 ? 'up' : 'down'}`}>
                      {change >= 0 ? '+' : ''}₹{change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Chart */}
        <div className="price-card chart-card">
          <h3>{t('last7Days')} - {t(selectedProduct)} in {t(selectedCity)}</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={formatChartData(currentCityData.historical)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}/kg`, 'Price']}
                  labelStyle={{ color: '#333' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#FF6B35" 
                  strokeWidth={3}
                  dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#FF6B35', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Insights */}
        <div className="price-card market-insights">
          <h3>Market Insights</h3>
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-icon">📈</span>
              <div className="insight-text">
                <strong>Seasonal Trend:</strong> {t(selectedProduct)} prices typically rise 15-20% during monsoon season
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🚛</span>
              <div className="insight-text">
                <strong>Supply Chain:</strong> Transportation costs from {t(selectedCity)} are currently normal
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🌡️</span>
              <div className="insight-text">
                <strong>Weather Impact:</strong> Favorable weather conditions expected to stabilize prices
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Price Alerts */}
      {Object.keys(priceAlerts).length > 0 && (
        <div className="active-alerts">
          <h3>Active Price Alerts</h3>
          <div className="alerts-list">
            {Object.entries(priceAlerts).map(([key, alert]) => {
              if (!alert) return null;
              const [productId, cityId] = key.split('-');
              return (
                <div key={key} className="alert-item">
                  <span className="alert-product">
                    {products.find(p => p.id === productId)?.icon} {t(productId)} in {t(cityId)}
                  </span>
                  <span className="alert-target">Target: ₹{alert.targetPrice}/kg</span>
                  <button 
                    className="remove-alert"
                    onClick={() => togglePriceAlert(productId, cityId)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDiscovery;