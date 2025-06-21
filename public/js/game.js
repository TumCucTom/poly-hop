class Game {
    constructor() {
        this.canvas = null;
        this.character = null;
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameState = 'playing'; // 'playing', 'paused', 'gameOver', 'levelComplete'
        this.camera = { x: 0, y: 0 };
        this.groundLevel = 400;
        
        // Game settings
        this.gravity = 0.8;
        this.friction = 0.8;
        
        // Level generation
        this.levelWidth = 2000;
        this.platformCount = 15;
        this.enemyCount = 8;
        this.coinCount = 20;
        
        // Background
        this.backgroundLayers = [];
        this.parallaxSpeed = 0.5;
        
        // UI
        this.uiElements = [];
        
        this.initialize();
    }

    /**
     * Called once from main.js when the user presses “Start Game”.
     * Resets basic runtime values and ensures we are in the playing state.
     */
    start() {
        // Reset primary stats
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameState = 'playing';

        // Reset character and level
        this.character = new Character(100, 300);
        if (window.customPixelHex) {
            this.character.setCustomPixelData(window.customPixelHex);
        }
        this.generateLevel();

        console.log('▶️ Game Started');
    }

    initialize() {
        // Create p5.js sketch
        this.sketch = (p5) => {
            this.p5 = p5;
            
            p5.setup = () => {
                this.canvas = p5.createCanvas(800, 500);
                this.canvas.parent('game-canvas-container');
                p5.pixelDensity(1);
                p5.frameRate(60);
                
                // Initialize game objects
                this.character = new Character(100, 300);
                this.generateLevel();
                this.generateBackground();
                
                console.log('🎮 Game initialized successfully');
            };
            
            p5.draw = () => {
                this.update();
                this.draw(p5);
            };
        };
        
        new p5(this.sketch);
    }

    generateLevel() {
        this.platforms = [];
        this.enemies = [];
        this.coins = [];
        
        // Generate ground platforms
        for (let i = 0; i < this.levelWidth; i += 100) {
            this.platforms.push({
                x: i,
                y: this.groundLevel,
                width: 100,
                height: 20,
                type: 'ground'
            });
        }
        
        // Generate floating platforms
        for (let i = 0; i < this.platformCount; i++) {
            const x = Math.random() * (this.levelWidth - 200) + 100;
            const y = Math.random() * 200 + 100;
            const width = Math.random() * 100 + 50;
            
            this.platforms.push({
                x: x,
                y: y,
                width: width,
                height: 20,
                type: 'floating'
            });
        }
        
        // Generate enemies
        for (let i = 0; i < this.enemyCount; i++) {
            const x = Math.random() * (this.levelWidth - 100) + 50;
            const y = this.groundLevel - 30;
            
            this.enemies.push({
                x: x,
                y: y,
                width: 30,
                height: 30,
                velocityX: (Math.random() - 0.5) * 2,
                velocityY: 0,
                health: 30,
                type: 'slime'
            });
        }
        
        // Generate coins
        for (let i = 0; i < this.coinCount; i++) {
            const x = Math.random() * (this.levelWidth - 50) + 25;
            const y = Math.random() * 300 + 50;
            
            this.coins.push({
                x: x,
                y: y,
                width: 20,
                height: 20,
                collected: false,
                animationFrame: 0
            });
        }
    }

    generateBackground() {
        this.backgroundLayers = [
            { color: '#1a1a2e', y: 0, height: 500, speed: 0 },
            { color: '#16213e', y: 0, height: 400, speed: 0.1 },
            { color: '#0f3460', y: 0, height: 300, speed: 0.2 }
        ];
    }

    update() {
        if (this.gameState !== 'playing') return;
        
        // Update character
        this.character.update();
        
        // Update camera to follow character
        this.camera.x = this.character.x - 400;
        this.camera.x = Math.max(0, Math.min(this.camera.x, this.levelWidth - 800));
        
        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.velocityY += this.gravity;
            enemy.x += enemy.velocityX;
            enemy.y += enemy.velocityY;
            
            // Simple AI - bounce off walls
            if (enemy.x <= 0 || enemy.x >= this.levelWidth - enemy.width) {
                enemy.velocityX *= -1;
            }
            
            // Ground collision
            if (enemy.y > this.groundLevel - enemy.height) {
                enemy.y = this.groundLevel - enemy.height;
                enemy.velocityY = 0;
            }
        });
        
        // Update coins
        this.coins.forEach(coin => {
            if (!coin.collected) {
                coin.animationFrame += 0.1;
            }
        });
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += 0.1;
            particle.life -= 1;
            return particle.life > 0;
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Check win condition
        if (this.coins.filter(coin => !coin.collected).length === 0) {
            this.levelComplete();
        }
    }

    checkCollisions() {
        // Character-platform collisions
        this.platforms.forEach(platform => {
            if (this.character.x < platform.x + platform.width &&
                this.character.x + this.character.width > platform.x &&
                this.character.y < platform.y + platform.height &&
                this.character.y + this.character.height > platform.y) {
                
                // Landing on top of platform
                if (this.character.velocityY > 0 && 
                    this.character.y < platform.y) {
                    this.character.y = platform.y - this.character.height;
                    this.character.velocityY = 0;
                    this.character.isOnGround = true;
                    this.character.isJumping = false;
                }
            }
        });
        
        // Character-enemy collisions
        this.enemies.forEach(enemy => {
            if (this.character.x < enemy.x + enemy.width &&
                this.character.x + this.character.width > enemy.x &&
                this.character.y < enemy.y + enemy.height &&
                this.character.y + this.character.height > enemy.y) {
                
                // Character lands on enemy
                if (this.character.velocityY > 0 && 
                    this.character.y < enemy.y) {
                    this.character.velocityY = -10;
                    enemy.health -= 10;
                    
                    if (enemy.health <= 0) {
                        this.enemies = this.enemies.filter(e => e !== enemy);
                        this.score += 100;
                        this.createParticles(enemy.x, enemy.y, '#ff0000');
                    }
                } else {
                    // Character gets hit
                    this.character.takeDamage(20);
                    this.lives--;
                    this.createParticles(this.character.x, this.character.y, '#ff0000');
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        });
        
        // Character-coin collisions
        this.coins.forEach(coin => {
            if (!coin.collected &&
                this.character.x < coin.x + coin.width &&
                this.character.x + this.character.width > coin.x &&
                this.character.y < coin.y + coin.height &&
                this.character.y + this.character.height > coin.y) {
                
                coin.collected = true;
                this.score += 50;
                this.createParticles(coin.x, coin.y, '#ffd700');
            }
        });
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + Math.random() * 20,
                y: y + Math.random() * 20,
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: (Math.random() - 0.5) * 10,
                color: color,
                life: 30
            });
        }
    }

    draw(p5) {
        // Clear canvas
        p5.background('#1a1a2e');
        
        // Draw background layers
        this.drawBackground(p5);
        
        // Apply camera transform
        p5.push();
        p5.translate(-this.camera.x, -this.camera.y);
        
        // Draw platforms
        this.drawPlatforms(p5);
        
        // Draw enemies
        this.drawEnemies(p5);
        
        // Draw coins
        this.drawCoins(p5);
        
        // Draw character
        this.character.draw(p5);
        
        // Draw particles
        this.drawParticles(p5);
        
        p5.pop();
        
        // Draw UI
        this.drawUI(p5);
        
        // Draw game state messages
        this.drawGameState(p5);
    }

    drawBackground(p5) {
        this.backgroundLayers.forEach(layer => {
            p5.fill(layer.color);
            p5.noStroke();
            p5.rect(0, layer.y, 800, layer.height);
        });
        
        // Draw stars
        p5.fill('#ffffff');
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % 800;
            const y = (i * 73) % 200;
            p5.circle(x, y, 1);
        }
    }

    drawPlatforms(p5) {
        this.platforms.forEach(platform => {
            if (platform.type === 'ground') {
                p5.fill('#654321');
                p5.stroke('#8b4513');
            } else {
                p5.fill('#8b4513');
                p5.stroke('#654321');
            }
            
            p5.strokeWeight(2);
            p5.rect(platform.x, platform.y, platform.width, platform.height);
        });
    }

    drawEnemies(p5) {
        this.enemies.forEach(enemy => {
            // Draw slime enemy
            p5.fill('#00ff00');
            p5.stroke('#008000');
            p5.strokeWeight(2);
            p5.ellipse(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width, enemy.height);
            
            // Draw eyes
            p5.fill('#000000');
            p5.noStroke();
            p5.circle(enemy.x + 8, enemy.y + 8, 4);
            p5.circle(enemy.x + 22, enemy.y + 8, 4);
        });
    }

    drawCoins(p5) {
        this.coins.forEach(coin => {
            if (!coin.collected) {
                p5.push();
                p5.translate(coin.x + coin.width/2, coin.y + coin.height/2);
                p5.rotate(coin.animationFrame);
                
                p5.fill('#ffd700');
                p5.stroke('#ff8c00');
                p5.strokeWeight(2);
                p5.circle(0, 0, coin.width);
                
                p5.fill('#ff8c00');
                p5.noStroke();
                p5.rect(-2, -8, 4, 16);
                p5.rect(-8, -2, 16, 4);
                
                p5.pop();
            }
        });
    }

    drawParticles(p5) {
        this.particles.forEach(particle => {
            p5.fill(particle.color);
            p5.noStroke();
            p5.circle(particle.x, particle.y, 3);
        });
    }

    drawUI(p5) {
        // Update UI elements
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        
        // Draw health bar
        const healthBarWidth = 200;
        const healthBarHeight = 20;
        const healthBarX = 20;
        const healthBarY = 20;
        
        p5.fill('#333333');
        p5.stroke('#666666');
        p5.strokeWeight(2);
        p5.rect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        
        const healthPercentage = this.character.health / this.character.maxHealth;
        p5.fill(healthPercentage > 0.5 ? '#00ff00' : healthPercentage > 0.25 ? '#ffff00' : '#ff0000');
        p5.noStroke();
        p5.rect(healthBarX + 2, healthBarY + 2, (healthBarWidth - 4) * healthPercentage, healthBarHeight - 4);
    }

    drawGameState(p5) {
        if (this.gameState === 'gameOver') {
            p5.fill('rgba(0, 0, 0, 0.8)');
            p5.rect(0, 0, 800, 500);
            
            p5.fill('#ff0000');
            p5.textSize(48);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text('GAME OVER', 400, 200);
            
            p5.fill('#ffffff');
            p5.textSize(24);
            p5.text(`Final Score: ${this.score}`, 400, 280);
            p5.text('Press SPACE to restart', 400, 320);
        } else if (this.gameState === 'levelComplete') {
            p5.fill('rgba(0, 0, 0, 0.8)');
            p5.rect(0, 0, 800, 500);
            
            p5.fill('#00ff00');
            p5.textSize(48);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text('LEVEL COMPLETE!', 400, 200);
            
            p5.fill('#ffffff');
            p5.textSize(24);
            p5.text(`Score: ${this.score}`, 400, 280);
            p5.text('Press SPACE for next level', 400, 320);
        }
    }

    handleMovement(movement) {
        if (this.gameState !== 'playing') return;
        
        switch (movement) {
            case 'left':
                this.character.move(-1);
                break;
            case 'right':
                this.character.move(1);
                break;
            case 'jump':
                this.character.jump();
                break;
            case 'duck':
                this.character.duck();
                break;
        }
    }

    handleKeyPress(keyCode) {
        if (keyCode === 32) { // SPACE
            if (this.gameState === 'gameOver') {
                this.restart();
            } else if (this.gameState === 'levelComplete') {
                this.nextLevel();
            }
        }
    }

    /**
     * Convert pose-detection flags into in-game movement.
     * @param {Object} poseData – output from PoseDetector.processPoseData()
     */
    handlePoseInput(poseData) {
        if (this.gameState !== 'playing' || !poseData) return;

        // Horizontal movement (swap left/right due to mirrored video)
        if (poseData.isMovingLeft) {
            this.handleMovement('right');
        } else if (poseData.isMovingRight) {
            this.handleMovement('left');
        } else {
            // No lean – stop horizontal motion gradually
            this.character.stop();
        }

        // Jumping / ducking take precedence over horizontal input
        if (poseData.isJumping) {
            this.handleMovement('jump');
        } else if (poseData.isDucking) {
            this.handleMovement('duck');
        } else {
            // Stand up if previously ducking and no longer crouched
            if (this.character.isDucking) {
                this.character.stand();
            }
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        console.log('💀 Game Over!');
    }

    levelComplete() {
        this.gameState = 'levelComplete';
        console.log('🎉 Level Complete!');
    }

    nextLevel() {
        this.level++;
        this.gameState = 'playing';
        this.generateLevel();
        console.log(`🚀 Starting Level ${this.level}`);
    }

    restart() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameState = 'playing';
        this.character = new Character(100, 300);
        this.generateLevel();
        console.log('🔄 Game Restarted');
    }

    getGameData() {
        return {
            score: this.score,
            lives: this.lives,
            level: this.level,
            character: this.character.getCharacterData(),
            gameState: this.gameState
        };
    }

    /**
     * Compatibility method used by older minting code.
     * Returns the current score without exposing internal state shape.
     */
    getScore() {
        return this.score;
    }
} 