import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { ethers } from "ethers";

// Lazy load components for performance
const Dashboard = lazy(() => import("./dashboard"));
const NFT = lazy(() => import("./NFT"));
const Explorer = lazy(() => import("./Explorer"));
const Validators = lazy(() => import("./Validators"));
const Governance = lazy(() => import("./Governance"));
const Launchpad = lazy(() => import("./Launchpad"));
const Docs = lazy(() => import("./Docs"));

// Navigation Component with notifications and theme toggle
function Navigation({ theme, setTheme, notifications }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/explorer", label: "Explorer", icon: "🔍" },
    { path: "/validators", label: "Validators", icon: "🛡️" },
    { path: "/governance", label: "Governance", icon: "🗳️" },
    { path: "/launchpad", label: "Launchpad", icon: "🚀" },
    { path: "/nft", label: "NFT", icon: "🎨" },
    { path: "/docs", label: "Docs", icon: "📚" }
  ];

  return (
    <nav className={`bg-gradient-to-r from-[#0047ab] to-[#001f4d] shadow-lg sticky top-0 z-50 ${theme === "dark" ? "" : "bg-white text-[#0047ab]"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className={`text-2xl font-bold tracking-wider ${theme === "dark" ? "text-[#a8d0ff]" : "text-[#0047ab]"}`}>ZYRA</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                    location.pathname === item.path
                      ? 'bg-[#3385ff] text-white shadow-lg'
                      : theme === "dark"
                        ? 'text-[#a8d0ff] hover:bg-[#3385ff] hover:text-white'
                        : 'text-[#0047ab] hover:bg-[#3385ff] hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              {/* Notification Bell */}
              <div className="relative ml-4">
                <button className="text-xl" aria-label="Notifications">
                  🔔
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">{notifications.length}</span>
                  )}
                </button>
              </div>
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="ml-4 px-2 py-1 rounded bg-[#3385ff] text-white hover:bg-[#66b2ff] transition"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-[#3385ff] inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#66b2ff] focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${theme === "dark" ? "bg-[#001f4d]" : "bg-white text-[#0047ab]"}`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-[#3385ff] text-white'
                    : theme === "dark"
                      ? 'text-[#a8d0ff] hover:bg-[#3385ff] hover:text-white'
                      : 'text-[#0047ab] hover:bg-[#3385ff] hover:text-white'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// Wallet Connection Hook with multi-chain support
function useWallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        const network = await provider.getNetwork();

        setAccount(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));
        setChainId(network.chainId);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setIsConnected(false);
  };

  return { account, balance, isConnected, chainId, connectWallet, disconnectWallet };
}

// Wallet Component with chain info
function WalletStatus({ wallet }) {
  return (
    <div className="fixed top-20 right-4 z-40 bg-[#001f4d] p-4 rounded-lg shadow-lg border border-[#3385ff]">
      {wallet.isConnected ? (
        <div className="text-sm">
          <div className="text-[#a8d0ff] mb-1">Wallet Connected</div>
          <div className="text-white font-mono text-xs mb-1">
            {wallet.account.slice(0, 6)}...{wallet.account.slice(-4)}
          </div>
          <div className="text-[#7eff7e] text-xs mb-2">
            {wallet.balance ? `${parseFloat(wallet.balance).toFixed(4)} ETH` : '0.0000 ETH'}
          </div>
          <div className="text-[#3385ff] text-xs mb-2">
            Chain ID: {wallet.chainId}
          </div>
          <button
            onClick={wallet.disconnectWallet}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={wallet.connectWallet}
          className="bg-[#3385ff] hover:bg-[#66b2ff] text-white px-4 py-2 rounded text-sm font-medium"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

// Notification system
function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    // Example: Listen for new blocks or governance events
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setNotifications((prev) => [
          ...prev,
          { id: Date.now(), message: "New block finalized!", type: "info" }
        ]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return notifications;
}

// Loading Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0047ab] to-[#001f4d]">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#a8d0ff]"></div>
    </div>
  );
}

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0047ab] to-[#001f4d]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-400 mb-4">Something went wrong!</h1>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-[#3385ff] hover:bg-[#66b2ff] text-white px-6 py-2 rounded"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("dark");
  const wallet = useWallet();
  const notifications = useNotifications();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.className = theme === "dark"
      ? "bg-gradient-to-br from-[#0047ab] to-[#001f4d] text-white"
      : "bg-white text-[#0047ab]";
  }, [theme]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className={`min-h-screen font-sans ${theme === "dark" ? "bg-gradient-to-br from-[#0047ab] to-[#001f4d] text-white" : "bg-white text-[#0047ab]"}`}>
          <Navigation theme={theme} setTheme={setTheme} notifications={notifications} />
          <WalletStatus wallet={wallet} />
          {/* Notification popups */}
          <div className="fixed top-4 left-4 z-50 space-y-2">
            {notifications.map(n => (
              <div key={n.id} className="bg-[#3385ff] text-white px-4 py-2 rounded shadow-lg animate-pulse">
                {n.message}
              </div>
            ))}
          </div>
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Dashboard wallet={wallet} theme={theme} />} />
                <Route path="/explorer" element={<Explorer theme={theme} />} />
                <Route path="/validators" element={<Validators theme={theme} />} />
                <Route path="/governance" element={<Governance wallet={wallet} theme={theme} />} />
                <Route path="/launchpad" element={<Launchpad wallet={wallet} theme={theme} />} />
                <Route path="/nft" element={<NFT wallet={wallet} theme={theme} />} />
                <Route path="/docs" element={<Docs theme={theme} />} />
                <Route path="*" element={<NotFound theme={theme} />} />
              </Routes>
            </Suspense>
          </main>
          <Footer theme={theme} />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

// 404 Component
function NotFound({ theme }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className={`text-6xl font-bold mb-4 ${theme === "dark" ? "text-[#a8d0ff]" : "text-[#0047ab]"}`}>404</h1>
        <p className="text-xl text-gray-300 mb-6">Page not found</p>
        <Link
          to="/"
          className="bg-[#3385ff] hover:bg-[#66b2ff] text-white px-6 py-3 rounded-lg transition-all duration-200"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

// Footer Component
function Footer({ theme }) {
  return (
    <footer className={`${theme === "dark" ? "bg-[#001f4d] border-t border-[#3385ff]" : "bg-white border-t border-[#0047ab]"} mt-16`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className={`text-lg font-bold mb-4 ${theme === "dark" ? "text-[#a8d0ff]" : "text-[#0047ab]"}`}>ZYRA</h3>
            <p className="text-gray-300 text-sm">
              Fast, secure, and scalable blockchain infrastructure for the future of decentralized applications.
            </p>
          </div>
          <div>
            <h4 className={`text-md font-semibold mb-4 ${theme === "dark" ? "text-[#a8d0ff]" : "text-[#0047ab]"}`}>Platform</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/dashboard" className="hover:text-[#66b2ff]">Dashboard</Link></li>
              <li><Link to="/explorer" className="hover:text-[#66b2ff]">Explorer</Link></li>
              <li><Link to="/validators" className="hover:text-[#66b2ff]">Validators</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-md font-semibold mb-4 ${theme === "dark" ? "text-[#a8d0ff]" : "text-[#0047ab]"}`}>Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/docs" className="hover:text-[#66b2ff]">Documentation</Link></li>
              <li><a href="#" className="hover:text-[#66b2ff]">API Reference</a></li>
              <li><a href="#" className="hover:text-[#66b2ff]">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-md font-semibold mb-4 ${theme === "dark" ? "text-[#a8d0ff]" : "text-[#0047ab]"}`}>Community</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-[#66b2ff]">Discord</a></li>
              <li><a href="#" className="hover:text-[#66b2ff]">Twitter</a></li>
              <li><a href="#" className="hover:text-[#66b2ff]">Telegram</a></li>
            </ul>
          </div>
        </div>
        <div className={`border-t mt-8 pt-8 text-center ${theme === "dark" ? "border-[#3385ff]" : "border-[#0047ab]"}`}>
          <p className="text-gray-400 text-sm">
            © 2025 Zyra Blockchain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}