// pages/api/mint.js
import { JsonRpcProvider, Wallet, isAddress, Contract } from 'ethers';

const characterAbi = [
  'function mintCharacter(address to, string tokenURI) public returns (uint256)'
];

// Singleton pattern to avoid re-instantiation on every request
let cachedContract;

function getContract() {
  if (!cachedContract) {
    const provider = new JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const relayer = new Wallet(process.env.PRIVATE_MINT_KEY, provider);
    cachedContract = new Contract(process.env.CONTRACT_ADDRESS, characterAbi, relayer);
  }
  return cachedContract;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { to, tokenURI } = req.body || {};

  if (!isAddress(to)) {
    return res.status(400).json({ error: 'Invalid recipient address' });
  }
  if (!tokenURI || typeof tokenURI !== 'string') {
    return res.status(400).json({ error: 'tokenURI missing' });
  }

  try {
    const contract = getContract();
    const tx = await contract.mintCharacter(to, tokenURI);
    return res.status(200).json({ txHash: tx.hash });
  } catch (err) {
    console.error('Mint Error:', err);
    return res.status(500).json({ error: err.message || 'Mint failed' });
  }
} 