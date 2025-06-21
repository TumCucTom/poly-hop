// Global variables
let poseDetector;
let game;
let character;
let isGameRunning = false;
let cameraStream = null;

// DOM elements
const video = document.getElementById('webcam');
const poseCanvas = document.getElementById('pose-canvas');
const cameraModal = document.getElementById('camera-modal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Poly-Hop initializing...');
    
    // Initialize components
    initializeComponents();
    setupEventListeners();
    
    // Show the camera access modal
    showCameraModal();
});

function initializeComponents() {
    // Initialize pose detector
    poseDetector = new PoseDetector();
    
    // Initialize character
    character = new Character();
    
    // Initialize game
    game = new Game();
    
    console.log('✅ Components initialized');
}

function setupEventListeners() {
    // Modal buttons
    document.getElementById('request-camera-modal').addEventListener('click', requestCameraAccess);
    document.getElementById('start-tracking-modal').addEventListener('click', startBodyTracking);
    document.getElementById('start-game').addEventListener('click', startGame);
    
    // Regular buttons (fallback)
    document.getElementById('request-camera').addEventListener('click', requestCameraAccess);
    document.getElementById('start-tracking').addEventListener('click', startBodyTracking);
    
    // Character customization
    document.getElementById('skin-tone').addEventListener('change', updateCharacter);
    document.getElementById('outfit').addEventListener('change', updateCharacter);
    document.getElementById('hair').addEventListener('change', updateCharacter);
    
    // Mint character (legacy simulated flow) - DISABLED now handled by mint.js
    // document.getElementById('mint-character').addEventListener('click', mintCharacter);

    // Global keyboard controls (e.g., restart on SPACE)
    document.addEventListener('keydown', (e) => {
        const code = e.code;

        // Handle gameplay movement keys when playing
        if (game && game.gameState === 'playing') {
            switch (code) {
                case 'ArrowLeft':
                case 'KeyA':
                    game.handleMovement('left');
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    game.handleMovement('right');
                    break;
                case 'ArrowUp':
                case 'KeyW':
                case 'Space':
                    game.handleMovement('jump');
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    game.handleMovement('duck');
                    break;
            }
        }

        // Forward key to handleKeyPress for meta actions (space on game over etc.)
        if (game && typeof game.handleKeyPress === 'function') {
            game.handleKeyPress(e.keyCode || e.which);
        }

        // Prevent scrolling on space and arrow keys
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
            e.preventDefault();
        }
    });

    // Stop movement / duck on key release
    document.addEventListener('keyup', (e) => {
        const code = e.code;
        if (!game || game.gameState !== 'playing') return;

        if (['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(code)) {
            game.character.stop();
        }

        if (['ArrowDown', 'KeyS'].includes(code)) {
            if (game.character.isDucking) {
                game.character.stand();
            }
        }
    });
}

async function requestCameraAccess() {
    try {
        updateModalStatus('Requesting camera access...', 'info');
        
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 640, 
                height: 480,
                facingMode: 'user'
            } 
        });
        
        cameraStream = stream;
        video.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
            video.onloadedmetadata = resolve;
        });
        
        // Set canvas size to match video
        poseCanvas.width = video.videoWidth;
        poseCanvas.height = video.videoHeight;
        
        updateModalStatus('Camera access granted! Click "Start Body Tracking" to continue.', 'success');
        
        // Show next step
        showStep(2);
        
        console.log('📹 Camera access granted successfully');
        
    } catch (error) {
        console.error('❌ Error requesting camera access:', error);
        updateModalStatus('Error: Could not access camera. Please check permissions and try again.', 'error');
    }
}

async function startBodyTracking() {
    try {
        updateModalStatus('Initializing pose detection...', 'info');
        
        // Initialize pose detection
        const initialized = await poseDetector.initialize(video, poseCanvas);
        
        if (!initialized) {
            updateModalStatus('Failed to initialize pose detection. Please refresh the page.', 'error');
            return;
        }
        
        // Start tracking
        const trackingStarted = await poseDetector.startTracking();
        
        if (!trackingStarted) {
            updateModalStatus('Failed to start body tracking. Please try again.', 'error');
            return;
        }
        
        // Set up pose update callback
        poseDetector.onPoseUpdate = (poseData) => {
            if (isGameRunning && game) {
                game.handlePoseInput(poseData);
            }
            updateMovementLog(poseData);
        };
        
        updateModalStatus('Body tracking started! Click "Start Game" to begin playing.', 'success');
        
        // Show next step
        showStep(3);
        
        console.log('🎯 Body tracking started successfully');
        
    } catch (error) {
        console.error('❌ Error starting body tracking:', error);
        updateModalStatus('Error: Could not start body tracking. Please try again.', 'error');
    }
}

function startGame() {
    try {
        updateModalStatus('Starting game...', 'info');
        
        // Hide the modal
        hideCameraModal();
        
        // Start the game
        game.start();
        isGameRunning = true;
        
        console.log('🎮 Game started successfully');
        
    } catch (error) {
        console.error('❌ Error starting game:', error);
        updateModalStatus('Error: Could not start game. Please refresh the page.', 'error');
    }
}

function updateCharacter() {
    const skinTone = document.getElementById('skin-tone').value;
    const outfit = document.getElementById('outfit').value;
    const hair = document.getElementById('hair').value;
    
    character.updateAppearance(skinTone, outfit, hair);
    
    console.log('👤 Character updated:', { skinTone, outfit, hair });
}

// Legacy simulated mint – kept for reference but no longer wired to UI
async function mintCharacter_legacy() {
    // Retro-compatibility shim: ensure game.getScore exists
    if (game && typeof game.getScore !== 'function') {
        game.getScore = () => game && typeof game.score === 'number' ? game.score : 0;
    }
    try {
        const mintBtn = document.getElementById('mint-character');
        mintBtn.disabled = true;
        mintBtn.textContent = '⏳ Minting...';
        
        // Get character data
        const skinTone = document.getElementById('skin-tone').value;
        const outfit = document.getElementById('outfit').value;
        const hair = document.getElementById('hair').value;
        const score = game ? game.getScore() : 0;
        
        // Simulate Polygon minting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const characterData = {
            name: `Poly-Hop Character #${Date.now()}`,
            skinTone,
            outfit,
            hair,
            score,
            mintedAt: new Date().toISOString(),
            blockchain: 'Polygon',
            tokenId: Math.floor(Math.random() * 1000000)
        };
        
        // Show success message
        alert(`🎉 Character minted successfully on Polygon!\n\nToken ID: ${characterData.tokenId}\nName: ${characterData.name}\nScore: ${score}`);
        
        console.log('🚀 Character minted:', characterData);
        
    } catch (error) {
        console.error('❌ Error minting character:', error);
        alert('Error minting character. Please try again.');
    } finally {
        const mintBtn = document.getElementById('mint-character');
        mintBtn.disabled = false;
        mintBtn.textContent = '🚀 Mint Character on Polygon';
    }
}

function updateMovementLog(poseData) {
    if (!poseData) return;
    
    const logContainer = document.getElementById('movement-log-content');
    const timestamp = new Date().toLocaleTimeString();
    
    let movement = 'idle';
    if (poseData.isJumping) movement = 'JUMP';
    else if (poseData.isMovingLeft) movement = 'LEFT';
    else if (poseData.isMovingRight) movement = 'RIGHT';
    else if (poseData.isDucking) movement = 'DUCK';
    
    // Create log entry
    const logEntry = document.createElement('div');
    logEntry.className = `movement-entry ${movement.toLowerCase()}`;
    logEntry.textContent = `${timestamp} - ${movement} (${poseData.confidence.toFixed(1)}%)`;
    
    // Add to log
    logContainer.appendChild(logEntry);
    
    // Keep only last 10 entries
    while (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.firstChild);
    }
}

function showCameraModal() {
    cameraModal.style.display = 'flex';
    showStep(1);
}

function hideCameraModal() {
    cameraModal.style.display = 'none';
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show the specified step
    const stepElement = document.getElementById(`step-${stepNumber}`);
    if (stepElement) {
        stepElement.style.display = 'flex';
    }
}

function updateModalStatus(message, type = 'info') {
    const statusElement = document.getElementById('modal-status-text');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status-${type}`;
    }
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause tracking
        if (poseDetector && poseDetector.isTracking) {
            poseDetector.stopTracking();
        }
    } else {
        // Page is visible, resume tracking if game is running
        if (isGameRunning && poseDetector) {
            poseDetector.startTracking();
        }
    }
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    if (poseDetector) {
        poseDetector.stopTracking();
    }
});

console.log('🎮 Poly-Hop main.js loaded'); 