const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

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