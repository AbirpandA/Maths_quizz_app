// Math Quest - Homepage Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize homepage features
    initializeHomepage();
    setupFormHandler();
    createParticleEffects();
    addInteractiveElements();
});

// Initialize homepage features
function initializeHomepage() {
    console.log('🎮 Math Quest Homepage Initialized!');

    // Add welcome animation
    animateWelcome();

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();

    // Add sound effects preparation (for future implementation)
    prepareSoundEffects();
}

// Animate welcome elements
function animateWelcome() {
    const gameTitle = document.querySelector('.game-title');
    const heroSection = document.querySelector('.hero-section');
    const features = document.querySelectorAll('.feature-card');

    // Animate title entrance
    if (gameTitle) {
        gameTitle.style.opacity = '0';
        gameTitle.style.transform = 'translateY(-50px)';

        setTimeout(() => {
            gameTitle.style.transition = 'all 1s ease-out';
            gameTitle.style.opacity = '1';
            gameTitle.style.transform = 'translateY(0)';
        }, 200);
    }

    // Animate hero section
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'scale(0.9)';

        setTimeout(() => {
            heroSection.style.transition = 'all 0.8s ease-out';
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'scale(1)';
        }, 500);
    }

    // Animate feature cards with stagger effect
    features.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 800 + (index * 150));
    });
}

// Setup form handler for player registration
function setupFormHandler() {
    const playerForm = document.getElementById('playerForm');
    const playerNameInput = document.getElementById('playerName');
    const startBtn = document.querySelector('.start-btn');

    if (playerForm && playerNameInput && startBtn) {
        // Handle form submission
        playerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const playerName = playerNameInput.value.trim();

            if (playerName.length < 2) {
                showMessage('Please enter a name with at least 2 characters! 🎮', 'warning');
                playerNameInput.focus();
                return;
            }

            if (playerName.length > 20) {
                showMessage('Name too long! Please keep it under 20 characters. ✂️', 'warning');
                playerNameInput.focus();
                return;
            }

            // Store player name for the game
            localStorage.setItem('mathQuestPlayerName', playerName);

            // Show success message and prepare game start
            showMessage(`Welcome to Math Quest, ${playerName}! 🚀`, 'success');

            // Add button loading animation
            startBtn.innerHTML = '<span class="btn-text">LOADING QUEST...</span><span class="btn-icon">⏳</span>';
            startBtn.disabled = true;

            // Simulate game loading and transition
            setTimeout(() => {
                startGameTransition(playerName);
            }, 2000);
        });

        // Add input validation and formatting
        playerNameInput.addEventListener('input', function (e) {
            let value = e.target.value;

            // Remove special characters except spaces, hyphens, and underscores
            value = value.replace(/[^a-zA-Z0-9\s\-_]/g, '');

            // Limit length
            if (value.length > 20) {
                value = value.substring(0, 20);
            }

            e.target.value = value;

            // Update button state based on input
            updateStartButtonState();
        });

        // Add focus effects
        playerNameInput.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        playerNameInput.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });
    }
}

// Update start button state based on input
function updateStartButtonState() {
    const playerNameInput = document.getElementById('playerName');
    const startBtn = document.querySelector('.start-btn');

    if (playerNameInput && startBtn) {
        const isValid = playerNameInput.value.trim().length >= 2;

        if (isValid) {
            startBtn.style.opacity = '1';
            startBtn.style.pointerEvents = 'auto';
            startBtn.style.transform = 'scale(1)';
        } else {
            startBtn.style.opacity = '0.6';
            startBtn.style.pointerEvents = 'none';
            startBtn.style.transform = 'scale(0.95)';
        }
    }
}

// Show messages to user
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.game-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `game-message game-message-${type}`;
    messageElement.innerHTML = message;

    // Style the message
    Object.assign(messageElement.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: type === 'success' ? 'linear-gradient(45deg, #4CAF50, #8BC34A)' :
            type === 'warning' ? 'linear-gradient(45deg, #FF9800, #FFC107)' :
                'linear-gradient(45deg, #2196F3, #03DAC6)',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '50px',
        fontWeight: '600',
        fontSize: '1rem',
        zIndex: '1000',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        animation: 'slideInTop 0.5s ease-out',
        textAlign: 'center',
        minWidth: '200px'
    });

    // Add animation keyframes if not already present
    if (!document.querySelector('#messageAnimations')) {
        const style = document.createElement('style');
        style.id = 'messageAnimations';
        style.textContent = `
            @keyframes slideInTop {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes slideOutTop {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-30px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(messageElement);

    // Auto-remove message after 3 seconds
    setTimeout(() => {
        messageElement.style.animation = 'slideOutTop 0.5s ease-in forwards';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 500);
    }, 3000);
}

// Start game transition animation
function startGameTransition(playerName) {
    const container = document.querySelector('.container');

    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #0f0f23, #4a148c);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Orbitron', monospace;
        text-align: center;
    `;

    overlay.innerHTML = `
        <h2 style="font-size: 2.5rem; margin-bottom: 20px; animation: pulse 2s infinite;">
            Preparing Your Quest, ${playerName}! 🚀
        </h2>
        <div style="font-size: 1.2rem; margin-bottom: 30px;">
            Loading mathematical challenges...
        </div>
        <div class="loading-spinner" style="
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid #4ecdc4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.appendChild(overlay);

    // After transition, you would typically redirect to the game page
    setTimeout(() => {
        showMessage('Game will start here! (Connect to your game logic) 🎮', 'success');
        overlay.remove();

        // Reset the start button
        const startBtn = document.querySelector('.start-btn');
        if (startBtn) {
            startBtn.innerHTML = '<span class="btn-text">START QUEST</span><span class="btn-icon">⚡</span>';
            startBtn.disabled = false;
        }

        // Here you would typically navigate to the game screen
        // window.location.href = 'game.html';
    }, 3000);
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        const playerNameInput = document.getElementById('playerName');

        // Enter key to start game when input is focused
        if (e.key === 'Enter' && document.activeElement === playerNameInput) {
            e.preventDefault();
            const form = document.getElementById('playerForm');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }

        // Escape key to clear input
        if (e.key === 'Escape' && playerNameInput) {
            playerNameInput.value = '';
            playerNameInput.focus();
            updateStartButtonState();
        }

        // Focus input with 'n' key
        if (e.key.toLowerCase() === 'n' && document.activeElement !== playerNameInput) {
            e.preventDefault();
            if (playerNameInput) {
                playerNameInput.focus();
            }
        }
    });
}

// Create particle effects
function createParticleEffects() {
    // Add click particle effects to buttons and cards
    const clickableElements = document.querySelectorAll('.start-btn, .feature-card, .instruction-step');

    clickableElements.forEach(element => {
        element.addEventListener('click', function (e) {
            createClickParticles(e.pageX, e.pageY);
        });
    });
}

// Create click particle animation
function createClickParticles(x, y) {
    const particles = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd700', '#ff9a9e'];

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${x}px;
            top: ${y}px;
        `;

        document.body.appendChild(particle);
        particles.push(particle);

        // Animate particle
        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 50 + Math.random() * 50;
        const life = 1000;

        let startTime = Date.now();

        function animateParticle() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / life;

            if (progress >= 1) {
                particle.remove();
                return;
            }

            const distance = velocity * progress;
            const newX = x + Math.cos(angle) * distance;
            const newY = y + Math.sin(angle) * distance + (progress * progress * 100); // Gravity effect

            particle.style.left = newX + 'px';
            particle.style.top = newY + 'px';
            particle.style.opacity = (1 - progress).toString();
            particle.style.transform = `scale(${1 - progress * 0.5})`;

            requestAnimationFrame(animateParticle);
        }

        requestAnimationFrame(animateParticle);
    }
}

// Add interactive elements
function addInteractiveElements() {
    // Add hover sound effect preparation for buttons
    const interactiveElements = document.querySelectorAll('.start-btn, .feature-card, .instruction-step');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            // Prepare for sound effects when implementing audio
            this.style.transition = 'all 0.2s ease';
        });

        element.addEventListener('mouseleave', function () {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Add random motivational messages
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            const messages = [
                "💡 Ready to challenge your mind?",
                "🧮 Mathematics is the language of the universe!",
                "⭐ Every problem solved makes you stronger!",
                "🎯 Precision and speed will lead to victory!",
                "🚀 Your mathematical journey awaits!"
            ];

            const randomMessage = messages[Math.floor(Math.random() * messages.length)];

            // Only show if no other messages are present
            if (!document.querySelector('.game-message')) {
                showMessage(randomMessage, 'info');
            }
        }
    }, 15000); // Check every 15 seconds
}

// Prepare sound effects (for future implementation)
function prepareSoundEffects() {
    // This function prepares the sound system for future audio implementation
    window.mathQuestSounds = {
        hover: null,
        click: null,
        success: null,
        warning: null,
        background: null
    };

    console.log('🔊 Sound system prepared for Math Quest');
}

// Utility function to get player name
function getPlayerName() {
    return localStorage.getItem('mathQuestPlayerName') || 'Anonymous Hero';
}

// Utility function to clear player data
function clearPlayerData() {
    localStorage.removeItem('mathQuestPlayerName');
    const playerNameInput = document.getElementById('playerName');
    if (playerNameInput) {
        playerNameInput.value = '';
        updateStartButtonState();
    }
}

// Export functions for external use
window.MathQuest = {
    getPlayerName,
    clearPlayerData,
    showMessage,
    startGameTransition
};

console.log('🎮 Math Quest Homepage Script Loaded Successfully!');