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
  // Ensure DOM is ready before querying button
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMintLogic);
  } else {
    initMintLogic();
  }

  function initMintLogic() {
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
              // 4902 = chain not added to wallet
              if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: POLYGON_CHAIN_ID,
                        chainName: "Polygon Amoy Testnet",
                        nativeCurrency: {
                          name: "MATIC",
                          symbol: "MATIC",
                          decimals: 18,
                        },
                        rpcUrls: ["https://rpc-amoy.polygon.technology"],
                        blockExplorerUrls: [
                          "https://amoy.polygonscan.com",
                        ],
                      },
                    ],
                  });
                  // Retry switch now that chain is added
                  await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: POLYGON_CHAIN_ID }],
                  });
                } catch (addError) {
                  console.error("Failed to add Amoy chain", addError);
                  alert(
                    "Couldn't add the Polygon Amoy network automatically. Please add it manually in MetaMask and retry."
                  );
                  return;
                }
              } else {
                console.error("Chain switch error", switchError);
                alert("Please switch to the Polygon network in MetaMask and try again.");
                return;
              }
            }
          }

          // 3. Connect / request accounts if necessary
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // 4. Build metadata from UI selections
          const traits = getSelectedTraits();
          const metadata = {
            name: `Poly-Hop Character – ${Date.now()}`,
            description: "Poly-Hop avatar NFT (testnet).",
            image: "", // image omitted for testnet to keep metadata small
            traits: traits // keep small
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
  } // end initMintLogic

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
    const encoded = encodeURIComponent(json);
    return `data:application/json,${encoded}`;
  }
})(); 