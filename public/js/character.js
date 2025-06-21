class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpPower = 15;
        this.gravity = 0.8;
        this.isOnGround = false;
        this.isDucking = false;
        this.direction = 1; // 1 = right, -1 = left
        this.animationFrame = 0;
        this.animationSpeed = 0.2;
        this.animationTimer = 0;
        
        // Character customization
        this.skinTone = 'medium';
        this.outfit = 'adventurer';
        this.hair = 'spiky';
        
        // Character states
        this.isMoving = false;
        this.isJumping = false;
        this.health = 100;
        this.maxHealth = 100;
        
        // Pixel art colors
        this.colors = {
            skin: {
                light: '#ffdbac',
                medium: '#f1c27d',
                dark: '#e0ac69'
            },
            outfits: {
                adventurer: {
                    primary: '#8b4513',
                    secondary: '#654321',
                    accent: '#ffd700'
                },
                knight: {
                    primary: '#696969',
                    secondary: '#2f4f4f',
                    accent: '#c0c0c0'
                },
                wizard: {
                    primary: '#4b0082',
                    secondary: '#800080',
                    accent: '#ff69b4'
                }
            },
            hair: {
                spiky: '#8b4513',
                curly: '#654321',
                straight: '#2f1810'
            }
        };
    }

    update() {
        // Apply gravity
        this.velocityY += this.gravity;
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Ground collision
        if (this.y > 400 - this.height) {
            this.y = 400 - this.height;
            this.velocityY = 0;
            this.isOnGround = true;
            this.isJumping = false;
        } else {
            this.isOnGround = false;
        }
        
        // Screen boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > 800 - this.width) this.x = 800 - this.width;
        
        // Animation
        this.animationTimer += this.animationSpeed;
        if (this.animationTimer >= 1) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }

    move(direction) {
        this.velocityX = direction * this.speed;
        this.direction = direction;
        this.isMoving = true;
    }

    stop() {
        this.velocityX = 0;
        this.isMoving = false;
    }

    jump() {
        if (this.isOnGround && !this.isDucking) {
            this.velocityY = -this.jumpPower;
            this.isOnGround = false;
            this.isJumping = true;
        }
    }

    duck() {
        this.isDucking = true;
        this.height = 32; // Make character shorter when ducking
    }

    stand() {
        this.isDucking = false;
        this.height = 48;
    }

    setCustomization(skinTone, outfit, hair) {
        this.skinTone = skinTone;
        this.outfit = outfit;
        this.hair = hair;
    }

    draw(p5) {
        p5.push();
        p5.translate(this.x, this.y);
        
        if (this.direction === -1) {
            p5.scale(-1, 1);
            p5.translate(-this.width, 0);
        }
        
        this.drawPixelCharacter(p5);
        p5.pop();
    }

    drawPixelCharacter(p5) {
        const skinColor = this.colors.skin[this.skinTone];
        const outfitColors = this.colors.outfits[this.outfit];
        const hairColor = this.colors.hair[this.hair];
        
        // Pixel size
        const pixelSize = 2;
        
        // Character pixel data (16x24 pixels)
        const characterData = this.getCharacterPixelData();
        
        // Draw character pixel by pixel
        for (let y = 0; y < characterData.length; y++) {
            for (let x = 0; x < characterData[y].length; x++) {
                const pixel = characterData[y][x];
                if (pixel !== null) {
                    let color;
                    
                    switch (pixel) {
                        case 'skin':
                            color = skinColor;
                            break;
                        case 'hair':
                            color = hairColor;
                            break;
                        case 'outfit1':
                            color = outfitColors.primary;
                            break;
                        case 'outfit2':
                            color = outfitColors.secondary;
                            break;
                        case 'outfit3':
                            color = outfitColors.accent;
                            break;
                        case 'eye':
                            color = '#000000';
                            break;
                        case 'mouth':
                            color = '#8b0000';
                            break;
                        default:
                            color = pixel;
                    }
                    
                    p5.fill(color);
                    p5.noStroke();
                    p5.rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }

    getCharacterPixelData() {
        // 16x24 pixel character data
        const baseCharacter = [
            // Row 0-7: Head and hair
            [null, null, null, null, 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', null, null, null, null],
            [null, null, null, 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', null, null, null],
            [null, null, 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', 'hair', null, null],
            [null, 'hair', 'hair', 'hair', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'hair', 'hair', 'hair', null],
            ['hair', 'hair', 'hair', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'hair', 'hair', 'hair'],
            ['hair', 'hair', 'skin', 'skin', 'skin', 'eye', 'skin', 'skin', 'skin', 'skin', 'eye', 'skin', 'skin', 'skin', 'hair', 'hair'],
            ['hair', 'hair', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'skin', 'hair', 'hair'],
            ['hair', 'hair', 'skin', 'skin', 'skin', 'skin', 'skin', 'mouth', 'mouth', 'skin', 'skin', 'skin', 'skin', 'skin', 'hair', 'hair'],
            
            // Row 8-15: Torso and arms
            [null, 'hair', 'skin', 'skin', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'skin', 'skin', 'hair', null],
            [null, 'skin', 'skin', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'skin', 'skin', null],
            [null, 'skin', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'skin', null],
            [null, 'skin', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'skin', null],
            [null, 'skin', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'skin', null],
            [null, 'skin', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'skin', null],
            [null, 'skin', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'skin', null],
            [null, 'skin', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'outfit1', 'skin', null],
            
            // Row 16-23: Legs
            [null, 'skin', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'skin', null],
            [null, 'skin', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'skin', null],
            [null, 'skin', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'skin', null],
            [null, 'skin', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'skin', null],
            [null, 'skin', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'skin', null],
            [null, 'skin', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'skin', null],
            [null, 'skin', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'skin', null],
            [null, 'skin', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'outfit2', 'skin', null]
        ];

        // Add outfit-specific details
        const outfitDetails = this.getOutfitDetails();
        return this.mergePixelData(baseCharacter, outfitDetails);
    }

    getOutfitDetails() {
        const details = Array(24).fill().map(() => Array(16).fill(null));
        
        switch (this.outfit) {
            case 'adventurer':
                // Add belt
                details[14][4] = 'outfit3';
                details[14][5] = 'outfit3';
                details[14][6] = 'outfit3';
                details[14][7] = 'outfit3';
                details[14][8] = 'outfit3';
                details[14][9] = 'outfit3';
                details[14][10] = 'outfit3';
                details[14][11] = 'outfit3';
                break;
                
            case 'knight':
                // Add armor details
                details[8][3] = 'outfit3';
                details[8][12] = 'outfit3';
                details[9][3] = 'outfit3';
                details[9][12] = 'outfit3';
                details[10][3] = 'outfit3';
                details[10][12] = 'outfit3';
                details[11][3] = 'outfit3';
                details[11][12] = 'outfit3';
                details[12][3] = 'outfit3';
                details[12][12] = 'outfit3';
                details[13][3] = 'outfit3';
                details[13][12] = 'outfit3';
                break;
                
            case 'wizard':
                // Add robe details
                details[8][2] = 'outfit3';
                details[8][13] = 'outfit3';
                details[9][2] = 'outfit3';
                details[9][13] = 'outfit3';
                details[10][2] = 'outfit3';
                details[10][13] = 'outfit3';
                details[11][2] = 'outfit3';
                details[11][13] = 'outfit3';
                details[12][2] = 'outfit3';
                details[12][13] = 'outfit3';
                details[13][2] = 'outfit3';
                details[13][13] = 'outfit3';
                break;
        }
        
        return details;
    }

    mergePixelData(base, details) {
        const merged = [];
        for (let y = 0; y < base.length; y++) {
            merged[y] = [];
            for (let x = 0; x < base[y].length; x++) {
                merged[y][x] = details[y][x] || base[y][x];
            }
        }
        return merged;
    }

    getCharacterData() {
        return {
            skinTone: this.skinTone,
            outfit: this.outfit,
            hair: this.hair,
            position: { x: this.x, y: this.y },
            health: this.health,
            maxHealth: this.maxHealth
        };
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return this.health <= 0;
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    isDead() {
        return this.health <= 0;
    }
} 