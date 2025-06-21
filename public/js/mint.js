/*
 * mint.js - Simple Polygon character minting
 * Requires ethers.js (UMD) loaded prior to this script.
 *
 * Flow:
 * 1. User clicks the 🚀 Mint button
 * 2. We compose metadata from selected traits
 * 3. Encode metadata as base64 data URI (no IPFS needed for demo)
 * 4. Ask MetaMask to connect (if not already)
 * 5. Send mintCharacter(tokenURI) transaction on Polygon
 */

(function () {
  // CONFIG --------------------------------------------------
  const CONTRACT_ADDRESS = "0xCb0d18F697C255bCb029F3950F58A8Dafd91E373";
  // Minimal ABI containing only the mint function
  const CONTRACT_ABI = [
    {
      inputs: [
        {
          internalType: "string",
          name: "tokenURI",
          type: "string",
        },
      ],
      name: "mintCharacter",
      outputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const POLYGON_CHAIN_ID = "0x13882"; // 0x13882 = 80002 (Polygon Amoy testnet)
  //----------------------------------------------------------

  // HTML elements
  const mintBtn = document.getElementById("mint-character");
  if (!mintBtn) return console.warn("Mint button not found, skipping mint init");

  // Use capture phase so we can cancel any earlier bubble listeners (e.g., legacy mintCharacter in main.js)
  mintBtn.addEventListener(
    "click",
    async (event) => {
      // Prevent legacy handlers
      event.stopImmediatePropagation();

      try {
        // 1. Detect wallet
        if (!window.ethereum) {
          alert("MetaMask (or any EIP-1193 wallet) is required to mint.");
          return;
        }

        // 2. Ensure we're on Polygon (optional – you can remove this block to allow any network)
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        if (currentChainId !== POLYGON_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: POLYGON_CHAIN_ID }],
            });
          } catch (switchError) {
            console.error("Chain switch error", switchError);
            alert("Please switch to the Polygon network in MetaMask and try again.");
            return;
          }
        }

        // 3. Connect / request accounts if necessary
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // 4. Build metadata from UI selections
        const traits = getSelectedTraits();
        const metadata = {
          name: `Poly-Hop Character – ${Date.now()}`,
          description: "A unique character minted from the Poly-Hop platformer game.",
          image: "data:image/png;base64,", // placeholder, you can swap for off-screen PNG later
          attributes: [
            { trait_type: "Skin", value: traits.skinTone },
            { trait_type: "Outfit", value: traits.outfit },
            { trait_type: "Hair", value: traits.hair },
          ],
        };
        const tokenURI = buildDataURI(metadata);

        // 5. Send transaction
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        mintBtn.disabled = true;
        mintBtn.textContent = "⏳ Minting…";

        const tx = await contract.mintCharacter(tokenURI);
        console.log("Transaction submitted", tx.hash);
        await tx.wait();
        console.log("Mint confirmed");

        mintBtn.textContent = "✅ Minted! View on Polygonscan";
        mintBtn.onclick = () => {
          window.open(`https://amoy.polygonscan.com/tx/${tx.hash}`, "_blank");
        };
      } catch (err) {
        console.error(err);
        alert("Mint failed: " + (err.message || err));
        mintBtn.disabled = false;
        mintBtn.textContent = "🚀 Mint Character on Polygon";
      }
    },
    { capture: true }
  );

  // Helpers -------------------------------------------------
  function getSelectedTraits() {
    return {
      skinTone: document.getElementById("skin-tone")?.value || "medium",
      outfit: document.getElementById("outfit")?.value || "adventurer",
      hair: document.getElementById("hair")?.value || "spiky",
    };
  }

  function buildDataURI(obj) {
    const json = JSON.stringify(obj);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return `data:application/json;base64,${base64}`;
  }
})(); 