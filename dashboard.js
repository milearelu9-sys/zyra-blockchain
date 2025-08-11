// Advanced MetaMask & Zyra Blockchain integration

const connectBtn = document.getElementById('connectWalletBtn');
const walletInfo = document.getElementById('walletInfo');
const status = document.getElementById('status');
let zyraChainId = '0x1A4'; // Example: 420 in hex, replace with Zyra's actual chainId

async function connectWallet() {
  if (!window.ethereum) {
    status.textContent = "MetaMask not found. Please install it.";
    return;
  }
  try {
    // Request wallet connection
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    walletInfo.innerHTML = `<strong>Wallet:</strong> ${walletAddress}`;

    // Check current network
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChainId !== zyraChainId) {
      // Try to switch to Zyra, or add if missing
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: zyraChainId }]
        });
        status.textContent = "Switched to Zyra Blockchain!";
      } catch (switchError) {
        // If Zyra not added, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: zyraChainId,
              chainName: 'Zyra Blockchain',
              nativeCurrency: { name: 'Zyra', symbol: 'ZYRA', decimals: 18 },
              rpcUrls: ['https://rpc.zyra.network'],
              blockExplorerUrls: ['https://explorer.zyra.network']
            }]
          });
          status.textContent = "Zyra Blockchain added and selected!";
        } else {
          status.textContent = "Network switch failed: " + switchError.message;
        }
      }
    } else {
      status.textContent = "Connected to Zyra Blockchain!";
    }
  } catch (err) {
    status.textContent = "Connection failed: " + err.message;
  }
}

// Listen for account/network changes
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    walletInfo.innerHTML = `<strong>Wallet:</strong> ${accounts[0] || 'Not connected'}`;
  });
  window.ethereum.on('chainChanged', (chainId) => {
    if (chainId === zyraChainId) {
      status.textContent = "Connected to Zyra Blockchain!";
    } else {
      status.textContent = "Please switch to Zyra Blockchain!";
    }
  });
}

connectBtn.onclick
