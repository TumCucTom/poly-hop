# 🎮 Poly-Hop: Webcam-Controlled Platformer

A retro-style 2D platformer game where you control your character using full-body movements tracked via your webcam! Built with MediaPipe pose detection, p5.js, and designed for Polygon blockchain integration.

## 🚀 Features

### 🕹️ Core Gameplay
- **Retro Pixel Art Style**: 8-bit/16-bit aesthetic inspired by classic platformers
- **Webcam Body Tracking**: Control your character with real body movements
- **Platformer Mechanics**: Jump, run, duck, and navigate through procedurally generated levels
- **Enemy Combat**: Defeat slime enemies by jumping on them
- **Coin Collection**: Gather coins to increase your score
- **Multiple Levels**: Progress through increasingly challenging levels

### 👤 Character Customization
- **Skin Tones**: Light, medium, and dark options
- **Outfits**: Adventurer, Knight, and Wizard styles
- **Hair Styles**: Spiky, curly, and straight options
- **Real-time Updates**: See changes instantly in the game

### 📹 Body Movement Controls
- **Jump**: Raise your arms or jump in real life
- **Move Left/Right**: Lean your body left or right
- **Duck**: Lower your body or crouch down
- **Movement Log**: See all your detected movements in real-time

### 🔗 Blockchain Integration
- **Polygon NFT Minting**: Mint your customized character as an NFT
- **Character Metadata**: Includes traits, stats, and movement history
- **On-chain Storage**: Character data stored on Polygon blockchain

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Game Engine**: p5.js for 2D graphics and physics
- **Computer Vision**: MediaPipe Pose for body tracking
- **Backend**: Node.js with Express
- **Blockchain**: Polygon (Ethereum L2) for NFT minting
- **Styling**: Custom CSS with retro pixel art aesthetics

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser with webcam support
- Webcam for body tracking

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/poly-hop.git
   cd poly-hop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001`

5. **Grant webcam permissions**
   Click "Request Camera Access" button and allow the browser to access your webcam

## 🎯 How to Play

### Getting Started
1. **Click "Request Camera Access"**: Grant webcam permissions when prompted
2. **Click "Start Body Tracking"**: Initialize the pose detection system
3. **Position yourself**: Stand 6-8 feet from your webcam with good lighting
4. **Check the webcam feed**: Verify the skeleton overlay appears correctly
5. **Start moving**: Use your body to control the character

### Controls
- **Jump**: Raise your arms above your head or jump
- **Move Left**: Lean your body to the left
- **Move Right**: Lean your body to the right
- **Duck**: Lower your body or crouch down

### Game Objectives
- **Collect coins**: Gather all coins in each level
- **Defeat enemies**: Jump on slime enemies to defeat them
- **Survive**: Avoid taking damage from enemies
- **Progress**: Complete levels to advance

### Character Customization
1. Select your preferred skin tone, outfit, and hair style
2. Changes are applied instantly to your character
3. Customize before or during gameplay

### Minting Your Character
1. Play the game and customize your character
2. Click the "Mint Character on Polygon" button
3. Your character will be minted as an NFT with:
   - Customization traits
   - Game statistics
   - Movement history
   - Character image

## 🎨 Game Features

### Visual Design
- **Retro Aesthetic**: Pixel art graphics with limited color palette
- **Smooth Animations**: Fluid character and enemy movements
- **Particle Effects**: Visual feedback for actions and collisions
- **Responsive UI**: Works on different screen sizes

### Audio (Future Enhancement)
- **8-bit Soundtrack**: Retro game music
- **Sound Effects**: Jump, coin collection, enemy defeat
- **Audio Feedback**: Movement confirmation sounds

### Level Design
- **Procedural Generation**: Each level is uniquely generated
- **Progressive Difficulty**: Enemies and platforms increase with level
- **Multiple Paths**: Different routes through each level
- **Hidden Areas**: Secret platforms and bonus coins

## 🔧 Development

### Project Structure
```
poly-hop/
├── public/
│   ├── index.html          # Main game interface
│   ├── styles.css          # Retro styling
│   └── js/
│       ├── main.js         # Application entry point
│       ├── game.js         # Game engine and mechanics
│       ├── character.js    # Character system and customization
│       └── pose-detection.js # MediaPipe integration
├── server.js               # Express server
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

### Key Components

#### Pose Detection (`pose-detection.js`)
- MediaPipe Pose integration
- Real-time body tracking
- Movement detection algorithms
- Skeleton visualization
- Camera access management

#### Game Engine (`game.js`)
- p5.js sketch management
- Physics and collision detection
- Level generation
- Enemy AI and behavior

#### Character System (`character.js`)
- Pixel art character rendering
- Customization options
- Animation system
- Health and damage system

#### Main Application (`main.js`)
- Application lifecycle management
- Event handling
- UI interactions
- Blockchain integration
- Camera control flow

### Customization Options

#### Adding New Character Traits
1. Update the `colors` object in `character.js`
2. Add new pixel data patterns
3. Update the HTML select options
4. Modify the minting metadata

#### Adding New Game Elements
1. Create new game object classes
2. Add to the game update loop
3. Implement collision detection
4. Add visual rendering

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

## 🔗 Blockchain Integration

### Polygon Setup
1. **Network**: Polygon Mainnet or Mumbai Testnet
2. **Smart Contract**: ERC-721 NFT contract
3. **Metadata**: IPFS storage for character data
4. **Gas Fees**: Low-cost transactions on Polygon

### NFT Metadata Structure
```json
{
  "name": "Poly-Hop Character #1234567890",
  "description": "A unique Poly-Hop character...",
  "image": "ipfs://...",
  "attributes": [
    {
      "trait_type": "Skin Tone",
      "value": "medium"
    },
    {
      "trait_type": "Outfit",
      "value": "adventurer"
    },
    {
      "trait_type": "Final Score",
      "value": 1500
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test webcam functionality thoroughly
- Ensure responsive design
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

#### Camera Access Issues
- Click "Request Camera Access" button
- Check browser permissions in settings
- Ensure webcam is not in use by another application
- Try refreshing the page
- Check browser console for errors

#### Poor Movement Detection
- Improve lighting conditions
- Stand further from the webcam
- Ensure full body is visible
- Check pose confidence indicator
- Make sure "Start Body Tracking" is active

#### Game Performance Issues
- Close other browser tabs
- Reduce browser window size
- Check system resources
- Update graphics drivers

#### Blockchain Integration
- Ensure MetaMask is installed
- Connect to Polygon network
- Have sufficient MATIC for gas fees
- Check network connectivity

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe**: Google's pose detection technology
- **p5.js**: Creative coding library
- **Polygon**: Ethereum L2 scaling solution
- **Retro Gaming Community**: Inspiration for pixel art style

## 📞 Support

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Documentation**: Check the docs folder for detailed guides

---

**🎮 Happy Gaming! Move your body and mint your character on Polygon! 🚀** 