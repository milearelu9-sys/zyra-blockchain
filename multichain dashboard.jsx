import React, { useState, useEffect } from 'react';
import ZyraBlock from './ZyraBlock'; // Your Zyra-specific component
import './Dashboard.css';

const COIN_IDS = ['bitcoin', 'ethereum', 'solana', 'ripple'];

const EXPLORERS = {
  bitcoin: 'https://www.blockchain.com/explorer',
  ethereum: 'https://etherscan.io',
  solana: 'https://solscan.io',
  ripple: 'https://xrpscan.com/',
};

const MultiChainDashboard = () => {
  const [activeChain, setActiveChain] = useState('zyra');
  const [prices, setPrices] = useState({ zyra: 2.6 }); // default Zyra price

  useEffect(() => {
    fetchPrices();

    const interval = setInterval(fetchPrices, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS.join(',')}&vs_currencies=usd`
      );
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      const updatedPrices = COIN_IDS.reduce((acc, coin) => {
        acc[coin] = data[coin]?.usd ?? 0;
        return acc;
      }, { zyra: 2.6 });

      setPrices(updatedPrices);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Zyra Multi-Chain Dashboard</h1>
        <div className="price-bar" role="list" aria-label="Cryptocurrency prices">
          {Object.entries(prices).map(([key, price]) => (
            <span key={key} role="listitem" aria-label={`${key.toUpperCase()} price`}>
              {key.toUpperCase()}: ${price.toFixed(2)}
            </span>
          ))}
        </div>
      </header>

      <nav className="tab-buttons" role="tablist" aria-label="Select blockchain">
        <button
          onClick={() => setActiveChain('zyra')}
          className={activeChain === 'zyra' ? 'active' : ''}
          role="tab"
          aria-selected={activeChain === 'zyra'}
        >
          Zyra
        </button>
        {COIN_IDS.map((coin) => (
          <button
            key={coin}
            onClick={() => setActiveChain(coin)}
            className={activeChain === coin ? 'active' : ''}
            role="tab"
            aria-selected={activeChain === coin}
          >
            {coin.charAt(0).toUpperCase() + coin.slice(1)}
          </button>
        ))}
      </nav>

      <section className="chain-view" role="tabpanel" aria-live="polite">
        {activeChain === 'zyra' ? (
          <ZyraBlock />
        ) : (
          <div className="chain-info">
            <h2>{activeChain.toUpperCase()} Dashboard</h2>
            <p>Live price: ${prices[activeChain]?.toFixed(2)}</p>
            <button
              onClick={() => window.open(EXPLORERS[activeChain], '_blank', 'noopener,noreferrer')}
              aria-label={`Open ${activeChain.toUpperCase()} explorer in new tab`}
            >
              Open {activeChain.toUpperCase()} Explorer
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MultiChainDashboard;
import React from 'react';