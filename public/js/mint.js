// Simple gasless minting client for Poly-Hop
// Dependencies: MetaMask (window.ethereum)

const mintButton = document.getElementById('mint-character');
let userAddress = null;

async function connectWallet() {
  if (!window.ethereum) {
    alert('MetaMask not found. Please install it to mint characters.');
    return null;
  }
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  userAddress = accounts[0];
  console.log('🔌 Wallet connected:', userAddress);
  return userAddress;
}

async function mintCharacter() {
  try {
    // Ensure wallet connected
    if (!userAddress) {
      await connectWallet();
      if (!userAddress) return;
    }

    // TODO: Build real tokenURI (upload to IPFS). For now, use a placeholder
    const placeholderTokenURI = 'ipfs://QmPlaceholderTokenURI';

    // Call server API to mint gaslessly
    const res = await fetch('/api/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: userAddress, tokenURI: placeholderTokenURI })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Mint failed');
    }

    alert(`🎉 Mint transaction submitted!\nTx Hash: ${data.txHash}`);
  } catch (err) {
    console.error(err);
    alert(`Mint failed: ${err.message}`);
  }
}

if (mintButton) {
  mintButton.addEventListener('click', mintCharacter);
} 