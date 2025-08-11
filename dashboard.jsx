import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const ZYRA_RPC = "https://rpc.zyra.network";

export default function Dashboard() {
  const [blockNumber, setBlockNumber] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [transactionCount, setTransactionCount] = useState(null);
  const [validatorCount, setValidatorCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const provider = new ethers.providers.JsonRpcProvider(ZYRA_RPC);

        // Get latest block number
        const blockNum = await provider.getBlockNumber();
        setBlockNumber(blockNum);

        // Get latest block info
        const block = await provider.getBlock(blockNum);
        setLatestBlock(block);

        // Fetch total transaction count for the block (block.transactions.length)
        setTransactionCount(block.transactions.length);

        // Fetch validators count using custom RPC call (replace with actual Zyra method)
        const validators = await provider.send("zyra_getValidators", []);
        setValidatorCount(validators.length);

        setError(null);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to fetch data from Zyra RPC");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();

    // Refresh data every 15 seconds
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1f44] text-white font-sans p-6">
      <h1 className="text-4xl font-bold mb-6">Zyra Dashboard</h1>

      {loading ? (
        <p>Loading Zyra blockchain data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#123060] p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Latest Block</h2>
            <p className="text-3xl">{blockNumber}</p>
            <p className="text-sm mt-1">Hash: {latestBlock?.hash?.slice(0, 20)}...</p>
          </div>

          <div className="bg-[#123060] p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Transactions in Block</h2>
            <p className="text-3xl">{transactionCount}</p>
          </div>

          <div className="bg-[#123060] p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Validator Nodes</h2>
            <p className="text-3xl">{validatorCount}</p>
          </div>

          <div className="bg-[#123060] p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Token Price (USD)</h2>
            <p className="text-3xl">$0.42</p>
            <p className="text-sm mt-1">* Placeholder</p>
          </div>
        </div>
      )}

      <section className="mt-10 bg-[#123060] p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Block Details</h2>
        {latestBlock ? (
          <ul className="space-y-2 text-sm">
            <li><strong>Timestamp:</strong> {new Date(latestBlock.timestamp * 1000).toLocaleString()}</li>
            <li><strong>Miner:</strong> {latestBlock.miner}</li>
            <li><strong>Gas Used:</strong> {ethers.utils.formatUnits(latestBlock.gasUsed, 0)}</li>
            <li><strong>Gas Limit:</strong> {ethers.utils.formatUnits(latestBlock.gasLimit, 0)}</li>
            <li><strong>Size:</strong> {latestBlock.size} bytes</li>
            <li><strong>Nonce:</strong> {latestBlock.nonce}</li>
          </ul>
        ) : (
          <p>No block data available.</p>
        )}
      </section>
    </div>
  );
}import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ValidatorsPage from "./pages/ValidatorsPage";
import GovernancePage from "./pages/GovernancePage";
import NFTPage from "./pages/NFTPage";
import DocsPage from "./pages/DocsPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#000b1f] text-white font-sans">
        <nav className="bg-[#001f4d] px-6 py-4 flex justify-between items-center shadow-xl">
          <h1 className="text-2xl font-bold text-[#50d8d7]">Zyra Dashboard</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:text-[#50d8d7]">Main Page</Link>
            <Link to="/validators" className="hover:text-[#50d8d7]">Validators</Link>
            <Link to="/governance" className="hover:text-[#50d8d7]">Governance</Link>
            <Link to="/nfts" className="hover:text-[#50d8d7]">NFTs</Link>
            <Link to="/docs" className="hover:text-[#50d8d7]">Docs</Link>
            <Link to="/" className="hover:text-[#50d8d7]">Main Page</Link>
          </div>
        </nav>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/validators" element={<ValidatorsPage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/nfts" element={<NFTPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
