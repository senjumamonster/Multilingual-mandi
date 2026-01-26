import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { products, priceData, cities, calculateFairTradeScore } from '../data/mockData';
import { Plus, Edit3, Trash2, TrendingUp, TrendingDown, Mic, Search, Share } from 'lucide-react';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const { t } = useLanguage();
  const [vendorProducts, setVendorProducts] = useState([
    {
      id: 1,
      productId: 'tomato',
      quality: 'good',
      quantity: 50,
      myPrice: 42,
      addedDate: new Date('2024-01-20'),
      sold: 35
    },
    {
      id: 2,
      productId: 'onion',
      quality: 'excellent',
      quantity: 100,
      myPrice: 28,
      addedDate: new Date('2024-01-21'),
      sold: 80
    },
    {
      id: 3,
      productId: 'potato',
      quality: 'good',
      quantity: 75,
      myPrice: 22,
      addedDate: new Date('2024-01-22'),
      sold: 45
    }
  ]);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: '',
    quality: 'good',
    quantity: '',
    myPrice: ''
  });
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);

  const getRecommendedPrice = (productId, quality) => {
    const marketPrice = priceData[productId][selectedCity].current;
    const qualityMultiplier = {
      excellent: 1.15,
      good: 1.05,
      average: 0.95,
      poor: 0.85
    };
    return Math.round(marketPrice * qualityMultiplier[quality]);
  };

  const addProduct = () => {
    if (newProduct.productId && newProduct.quantity && newProduct.myPrice) {
      const product = {
        id: Date.now(),
        ...newProduct,
        quantity: parseInt(newProduct.quantity),
        myPrice: parseFloat(newProduct.myPrice),
        addedDate: new Date(),
        sold: 0
      };
      setVendorProducts([...vendorProducts, product]);
      setNewProduct({ productId: '', quality: 'good', quantity: '', myPrice: '' });
      setShowAddProduct(false);
    }
  };

  const removeProduct = (id) => {
    setVendorProducts(vendorProducts.filter(p => p.id !== id));
  };

  const updateSold = (id, sold) => {
    setVendorProducts(vendorProducts.map(p => 
      p.id === id ? { ...p, sold: Math.min(sold, p.quantity) } : p
    ));
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        const voiceInputs = ['Add tomato', 'टमाटर जोड़ें', 'Add onion', 'प्याज जोड़ें'];
        const randomInput = voiceInputs[Math.floor(Math.random() * voiceInputs.length)];
        setSearchTerm(randomInput);
        setIsListening(false);
      }, 2000);
    }
  };

  const shareOnWhatsApp = (product) => {
    const productName = t(product.productId);
    const message = `🏪 Fresh ${productName} available!\n💰 Price: ₹${product.myPrice}/kg\n📦 Quantity: ${product.quantity - product.sold}kg available\n⭐ Quality: ${product.quality}\n\nContact me for bulk orders! 📱`;
    
    // In a real app, this would open WhatsApp
    alert(`WhatsApp message ready:\n\n${message}`);
  };

  const getTotalRevenue = () => {
    return vendorProducts.reduce((total, product) => {
      return total + (product.sold * product.myPrice);
    }, 0);
  };

  const getTotalProfit = () => {
    return vendorProducts.reduce((total, product) => {
      const marketPrice = priceData[product.productId][selectedCity].current;
      const profit = (product.myPrice - marketPrice) * product.sold;
      return total + profit;
    }, 0);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t(product.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="vendor-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>{t('vendor')} Dashboard</h1>
          <p>Manage your products and track your sales</p>
        </div>
        <div className="header-actions">
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="city-select"
          >
            {cities.map(city => (
              <option key={city.id} value={city.id}>{t(city.id)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="sales-summary">
        <div className="summary-card revenue">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <div className="summary-value">₹{getTotalRevenue().toLocaleString()}</div>
            <div className="summary-label">Total Revenue</div>
          </div>
        </div>
        <div className="summary-card profit">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <div className="summary-value">₹{getTotalProfit().toLocaleString()}</div>
            <div className="summary-label">Total Profit</div>
          </div>
        </div>
        <div className="summary-card products">
          <div className="summary-icon">📦</div>
          <div className="summary-content">
            <div className="summary-value">{vendorProducts.length}</div>
            <div className="summary-label">Active Products</div>
          </div>
        </div>
        <div className="summary-card sold">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-value">
              {vendorProducts.reduce((total, p) => total + p.sold, 0)}kg
            </div>
            <div className="summary-label">Total Sold</div>
          </div>
        </div>
      </div>

      {/* My Products Section */}
      <div className="products-section">
        <div className="section-header">
          <h2>{t('myProducts')}</h2>
          <button 
            className="btn-primary add-product-btn"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus size={20} />
            {t('addProduct')}
          </button>
        </div>

        <div className="products-grid">
          {vendorProducts.map(product => {
            const productInfo = products.find(p => p.id === product.productId);
            const marketPrice = priceData[product.productId][selectedCity].current;
            const recommendedPrice = getRecommendedPrice(product.productId, product.quality);
            const fairTrade = calculateFairTradeScore(product.myPrice, marketPrice, product.quality);
            const remaining = product.quantity - product.sold;
            const soldPercentage = (product.sold / product.quantity) * 100;

            return (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <div className="product-info">
                    <span className="product-icon">{productInfo?.icon}</span>
                    <div>
                      <div className="product-name">{t(product.productId)}</div>
                      <div className="product-quality">{product.quality} quality</div>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="action-btn share"
                      onClick={() => shareOnWhatsApp(product)}
                      title="Share on WhatsApp"
                    >
                      <Share size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => removeProduct(product.id)}
                      title="Remove product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="price-comparison">
                  <div className="price-item">
                    <span className="price-label">My Price</span>
                    <span className="price-value my-price">₹{product.myPrice}/kg</span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">Market Price</span>
                    <span className="price-value market-price">₹{marketPrice}/kg</span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">Recommended</span>
                    <span className="price-value recommended-price">₹{recommendedPrice}/kg</span>
                  </div>
                </div>

                <div className="fair-trade-indicator">
                  <span className={`fair-trade-badge ${fairTrade.score}`}>
                    {fairTrade.text}
                  </span>
                  <span className="price-difference">
                    {product.myPrice > marketPrice ? '+' : ''}
                    ₹{(product.myPrice - marketPrice).toFixed(2)} vs market
                  </span>
                </div>

                <div className="inventory-status">
                  <div className="inventory-header">
                    <span>Inventory: {remaining}kg remaining</span>
                    <span>{soldPercentage.toFixed(0)}% sold</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${soldPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="sales-input">
                  <label>Update sold quantity:</label>
                  <div className="input-group">
                    <input
                      type="number"
                      min="0"
                      max={product.quantity}
                      value={product.sold}
                      onChange={(e) => updateSold(product.id, parseInt(e.target.value) || 0)}
                      className="sold-input"
                    />
                    <span className="input-suffix">kg</span>
                  </div>
                </div>

                <div className="revenue-info">
                  <span>Revenue: ₹{(product.sold * product.myPrice).toLocaleString()}</span>
                  <span>Profit: ₹{((product.myPrice - marketPrice) * product.sold).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{t('addProduct')}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddProduct(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
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
                  <button 
                    className={`voice-btn ${isListening ? 'listening' : ''}`}
                    onClick={toggleVoiceInput}
                  >
                    <Mic size={16} />
                  </button>
                </div>
              </div>

              {/* Product Selection */}
              <div className="product-selection">
                <h4>Select Product:</h4>
                <div className="product-options">
                  {filteredProducts.slice(0, 12).map(product => (
                    <button
                      key={product.id}
                      className={`product-option ${newProduct.productId === product.id ? 'selected' : ''}`}
                      onClick={() => setNewProduct({...newProduct, productId: product.id})}
                    >
                      <span className="option-icon">{product.icon}</span>
                      <span className="option-name">{t(product.id)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details Form */}
              {newProduct.productId && (
                <div className="product-form">
                  <div className="form-group">
                    <label>Quality:</label>
                    <select
                      value={newProduct.quality}
                      onChange={(e) => setNewProduct({...newProduct, quality: e.target.value})}
                      className="form-select"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="average">Average</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Quantity (kg):</label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                      className="form-input"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div className="form-group">
                    <label>My Price (₹/kg):</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.myPrice}
                      onChange={(e) => setNewProduct({...newProduct, myPrice: e.target.value})}
                      className="form-input"
                      placeholder="Enter your price"
                    />
                    {newProduct.productId && (
                      <div className="price-suggestion">
                        <span>Market: ₹{priceData[newProduct.productId][selectedCity].current}/kg</span>
                        <span>Recommended: ₹{getRecommendedPrice(newProduct.productId, newProduct.quality)}/kg</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowAddProduct(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={addProduct}
                disabled={!newProduct.productId || !newProduct.quantity || !newProduct.myPrice}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;