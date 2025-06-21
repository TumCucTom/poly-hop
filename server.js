const express = require('express');
require('dotenv').config();
const { ethers } = require('ethers');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// ---------------- Polygon Gasless Mint Setup ----------------
// Basic provider & signer using private key (relayer pays gas)
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const relayerWallet = new ethers.Wallet(process.env.PRIVATE_MINT_KEY, provider);

// Minimal ABI for the mint function (ERC-721)
const characterAbi = [
  "function mintCharacter(address to, string tokenURI) public returns (uint256)"
];

// Instantiate contract lazily (only if env vars present)
let characterContract;
if (process.env.CONTRACT_ADDRESS) {
  characterContract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    characterAbi,
    relayerWallet
  );
}

// POST /api/mint – the game client calls this to mint for the player
app.post('/api/mint', async (req, res) => {
  try {
    if (!characterContract) {
      return res.status(500).json({ error: 'Contract not configured on server' });
    }

    const { to, tokenURI } = req.body || {};

    if (!ethers.isAddress(to)) {
      return res.status(400).json({ error: 'Invalid recipient address' });
    }
    if (!tokenURI || typeof tokenURI !== 'string') {
      return res.status(400).json({ error: 'tokenURI missing' });
    }

    console.log(`🚀 Mint request: to=${to}, uri=${tokenURI}`);

    const tx = await characterContract.mintCharacter(to, tokenURI);
    console.log('📨 Tx submitted:', tx.hash);

    // Return transaction hash so client can track it
    return res.json({ txHash: tx.hash });
  } catch (err) {
    console.error('❌ Mint error', err);
    return res.status(500).json({ error: err.message || 'Mint failed' });
  }
});
// ------------------------------------------------------------

// Serve static files
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

// Main game route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Poly-Hop server running!' });
});

app.listen(PORT, () => {
    console.log(`🎮 Poly-Hop server running on http://localhost:${PORT}`);
    console.log(`📹 Webcam tracking enabled`);
    console.log(`🎨 Retro pixel art style loaded`);
}); 