[![Deploy Status](https://img.shields.io/badge/Deployed%20on-Vercel-00C7B7?style=for-the-badge&logo=vercel)](https://poly-hop.thomasbale.com)
[![Issues](https://img.shields.io/badge/Issues-VibeOps-FF6B6B?style=for-the-badge)](https://github.com/TumCucTom/poly-hop/issues)

# 🎮 Poly-Hop — IRL? Platformer & Polygon NFT Minter

A retro 8-bit platformer you play **with your body**. Lean left/right, jump, crouch — MediaPipe Pose turns you into the controller. When you've perfected your look, mint the avatar as an on-chain NFT on Polygon (Amoy test-net for now).

Checkout the prompts [here](docs/prompt.md)

---

## 🚀 Live Demo

🌐 Play it here → **https://poly-hop.thomasbale.com**

*(Works best on desktop Chrome with a webcam.)*

See the **POLYGON** amoy testnet contract [here](https://amoy.polygonscan.com/address/0xCb0d18F697C255bCb029F3950F58A8Dafd91E373)

---

## ✨ Demo Screenshots

![Gameplay Screenshot](docs/Screenshot%202025-06-21%20at%2023.08.20.png)

![Minting Screenshot](docs/Screenshot%202025-06-21%20at%2023.09.10.png)

![Pixel Editor](docs/Screenshot%202025-06-21%20at%2023.09.32.png)

![Custom Character in Game](docs/Screenshot%202025-06-21%20at%2023.09.49.png)

![AI Generation](docs/Screenshot%202025-06-21%20at%2023.10.03.png)

---

## 🎯 Features

### 🕹️ Core Gameplay
- **Retro Pixel Art** – 8/16-bit look & feel.
- **Full-Body Controls** – MediaPipe translates real-world motion (lean / jump / crouch) into game actions.
- **Procedural Levels** – Each run feels fresh.
- **Enemies & Coins** – Stomp slimes, collect coins, rack up score.

### 👤 Character Customisation
- **Skin Tones**: Light / Medium / Dark.
- **Outfits**: Adventurer, Knight, Wizard.
- **Hair**: Spiky, Curly, Straight.
- **Instant Preview**: Changes render in-game immediately.

### 🔗 Blockchain
- **🪙 Mint on Polygon** – Click one button to mint your avatar as an ERC-721.
- **Gas Paid by User** – Uses Polygon Amoy (chain 80002) so fees are tiny.
- **On-Chain Metadata** – Traits stored in `tokenURI`; image base-64 for the prototype.

### 📸 Camera UX
- **Request → Track → Play** 3-step modal.
- **Pose Overlay** for confidence feedback.
- **Movement Log** to debug your motions.

### 🚧 Roadmap
- Audio & chip-tune soundtrack.
- Level editor.
- Gasless meta-tx via Biconomy.
- Mobile PWA wrapper.

---

## 🛠️ Technical Stack

| Layer | Tech |
|-------|------|
| Front-end | HTML, CSS, Vanilla JS |
| Game Engine | **p5.js** |
| Pose Estimation | **MediaPipe Pose** |
| Blockchain | **Hardhat**, **Ethers v6**, Polygon Amoy |
| Server | Node.js + Express (static serve) |
| Hosting | Vercel |

---

## ⚡ Quick Start (Local)

```bash
# 1. Clone
$ git clone https://github.com/TumCucTom/poly-hop.git && cd poly-hop

# 2. Install deps
$ npm install

# 3. Start dev server
$ npm run dev        # or: node server.js

# 4. Open
# navigate to http://localhost:3001
```

Grant webcam permission → Click "Start Body Tracking" → Play!

---

## 📚 Documentation

* [Camera Access Flow](docs/CAMERA_ACCESS_FEATURE.md)
* [Forced Camera Access](docs/FORCED_CAMERA_ACCESS.md)
* [Game Design Summary](docs/GAME_SUMMARY.md)
* [Prompt Library](docs/prompt.md)

---

## 🌐 Deployment

### Production (Vercel)
1. Push → Vercel auto-builds `main`.
2. Custom domain + SSL handled by Vercel.
3. Express server runs via `vercel.json` API routes.

### Manual (Node)
```bash
npm run build
NODE_ENV=production node server.js
```

---

## 🔗 Contract Details

| Item | Value |
|------|-------|
| Network | Polygon **Amoy** (chain 80002) |
| Contract | `0xCb0d18F697C255bCb029F3950F58A8Dafd91E373` |
| Explorer | https://amoy.polygonscan.com/address/0xCb0d18F697C255bCb029F3950F58A8Dafd91E373 |

Update `public/js/mint.js` if you redeploy.

---

## 🐛 Issue Tracking & VibeOps

Issues and feature requests live in the [GitHub Issues](https://github.com/TumCucTom/poly-hop/issues) tab and are surfaced through VibeOps for prioritisation.

---

## 🤝 Contributing

1. Fork → `git checkout -b feature/awesome`
2. Commit → `git commit -m "feat: add awesome feature"`
3. Push  → `git push origin feature/awesome`
4. Open Pull Request

Please test webcam + body-tracking flows before submitting.

---

## 🙏 Acknowledgements

* **MediaPipe Pose** – real-time body tracking.
* **p5.js** – lightweight drawing & game loop.
* **OpenZeppelin** – ERC-721 implementation.
* **Polygon Labs** – low-cost, eco-friendly NFTs. 