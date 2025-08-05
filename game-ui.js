// Math Quest - Game UI Helper Functions
class GameUI {
    constructor() {
        this.particles = [];
        this.animations = new Map();
        this.init();
    }

    init() {
        this.setupVisualEffects();
        this.setupKeyboardShortcuts();
        this.setupTouchSupport();
        console.log('🎨 Game UI initialized!');
    }

    setupVisualEffects() {
        // Add click particle effects
        document.addEventListener('click', (e) => {
            // Only add particles for specific elements
            if (e.target.matches('.submit-btn, .option-btn, .action-btn, .difficulty-btn, .control-btn')) {
                this.createClickParticles(e.pageX, e.pageY);
            }
        });

        // Add hover effects for interactive elements
        document.querySelectorAll('.submit-btn, .option-btn, .action-btn, .difficulty-btn').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.addHoverEffect(element);
            });

            element.addEventListener('mouseleave', () => {
                this.removeHoverEffect(element);
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't interfere with input fields
            if (e.target.matches('input')) return;

            switch (e.key.toLowerCase()) {
                case 'p':
                    if (window.mathQuest && !window.mathQuest.isPaused) {
                        window.mathQuest.togglePause();
                    }
                    break;

                case 'h':
                    if (window.mathQuest) {
                        window.mathQuest.showHelp();
                    }
                    break;

                case 'escape':
                    if (window.mathQuest) {
                        window.mathQuest.togglePause();
                    }
                    break;

                case '1':
                case '2':
                case '3':
                case '4':
                    // Quick select difficulty or multiple choice
                    const num = parseInt(e.key);
                    this.handleNumberKey(num);
                    break;
            }
        });
    }

    setupTouchSupport() {
        // Add touch feedback for mobile devices
        document.addEventListener('touchstart', (e) => {
            if (e.target.matches('.submit-btn, .option-btn, .action-btn, .difficulty-btn')) {
                e.target.style.transform = 'scale(0.95)';
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.matches('.submit-btn, .option-btn, .action-btn, .difficulty-btn')) {
                e.target.style.transform = '';
            }
        });
    }

    handleNumberKey(num) {
        // Handle difficulty selection (1-4)
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        if (difficultyBtns.length >= num && document.getElementById('welcomeScreen').classList.contains('active')) {
            difficultyBtns[num - 1].click();
            return;
        }

        // Handle multiple choice selection (1-4)
        const optionBtns = document.querySelectorAll('.option-btn');
        if (optionBtns.length >= num && document.getElementById('questionScreen').classList.contains('active')) {
            optionBtns[num - 1].click();
        }
    }

    createClickParticles(x, y) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd700', '#ff9a9e'];
        const particleCount = 6;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';

            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 6 + 4;
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 50 + 30;

            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 10px ${color};
            `;

            document.body.appendChild(particle);

            // Animate particle
            this.animateParticle(particle, angle, velocity, x, y);
        }
    }

    animateParticle(particle, angle, velocity, startX, startY) {
        const startTime = Date.now();
        const duration = 1000;
        const gravity = 0.5;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                particle.remove();
                return;
            }

            const distance = velocity * progress;
            const x = startX + Math.cos(angle) * distance;
            const y = startY + Math.sin(angle) * distance + (progress * progress * 100 * gravity);

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = (1 - progress).toString();
            particle.style.transform = `scale(${1 - progress * 0.5})`;

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    addHoverEffect(element) {
        element.style.transition = 'all 0.2s ease';
        element.style.filter = 'brightness(1.1)';
    }

    removeHoverEffect(element) {
        element.style.filter = 'brightness(1)';
    }

    showScoreAnimation(points, element = null) {
        const scoreElement = document.createElement('div');
        scoreElement.className = 'score-animation';
        scoreElement.textContent = `+${points}`;

        // Position relative to element or center of screen
        const rect = element ? element.getBoundingClientRect() : {
            left: window.innerWidth / 2,
            top: window.innerHeight / 2
        };

        scoreElement.style.cssText = `
            position: fixed;
            left: ${rect.left + (element?.offsetWidth || 0) / 2}px;
            top: ${rect.top}px;
            color: #4ecdc4;
            font-size: 2rem;
            font-weight: bold;
            pointer-events: none;
            z-index: 9999;
            text-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
            transform: translateX(-50%);
        `;

        document.body.appendChild(scoreElement);

        // Animate upward and fade
        let position = 0;
        let opacity = 1;
        const animate = () => {
            position -= 2;
            opacity -= 0.02;

            scoreElement.style.transform = `translateX(-50%) translateY(${position}px)`;
            scoreElement.style.opacity = opacity.toString();

            if (opacity <= 0) {
                scoreElement.remove();
            } else {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    showLevelUpAnimation() {
        const overlay = document.createElement('div');
        overlay.className = 'level-up-overlay';
        overlay.innerHTML = `
            <div class="level-up-content">
                <h2>🎉 LEVEL UP! 🎉</h2>
                <p>Congratulations! You've advanced to the next level!</p>
                <div class="level-up-sparkles">✨ ⭐ ✨ ⭐ ✨</div>
            </div>
        `;

        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s ease-out;
        `;

        const content = overlay.querySelector('.level-up-content');
        content.style.cssText = `
            text-align: center;
            color: white;
            font-family: 'Orbitron', monospace;
            animation: bounceIn 0.8s ease-out;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
            .level-up-sparkles {
                font-size: 2rem;
                margin-top: 20px;
                animation: sparkle 2s ease-in-out infinite;
            }
            @keyframes sparkle {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(overlay);

        // Remove after 3 seconds
        setTimeout(() => {
            overlay.style.animation = 'fadeOut 0.5s ease-in forwards';
            setTimeout(() => {
                overlay.remove();
                style.remove();
            }, 500);
        }, 3000);
    }

    showCorrectAnswerAnimation() {
        this.showAnswerFeedback('✅', '#28a745', 'Correct!');
    }

    showIncorrectAnswerAnimation() {
        this.showAnswerFeedback('❌', '#dc3545', 'Try Again!');
    }

    showAnswerFeedback(icon, color, message) {
        const feedback = document.createElement('div');
        feedback.className = 'answer-feedback';
        feedback.innerHTML = `
            <div class="feedback-icon">${icon}</div>
            <div class="feedback-message">${message}</div>
        `;

        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: ${color};
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
            z-index: 9999;
            animation: feedbackPulse 0.6s ease-out;
            pointer-events: none;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes feedbackPulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            .feedback-icon {
                font-size: 3rem;
                margin-bottom: 10px;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
            style.remove();
        }, 1500);
    }

    updateProgressBar(current, total) {
        const progressBar = document.getElementById('progressFill');
        if (progressBar) {
            const percentage = (current / total) * 100;
            progressBar.style.width = `${percentage}%`;

            // Add celebration effect when reaching milestones
            if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
                this.celebrateProgress(percentage);
            }
        }
    }

    celebrateProgress(percentage) {
        const messages = {
            25: "🎯 Quarter way there!",
            50: "⭐ Halfway done!",
            75: "🔥 Almost finished!",
            100: "🏆 Quest Complete!"
        };

        if (messages[percentage]) {
            this.showToast(messages[percentage], 'success');
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `game-toast toast-${type}`;
        toast.textContent = message;

        const colors = {
            success: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
            warning: 'linear-gradient(45deg, #FF9800, #FFC107)',
            error: 'linear-gradient(45deg, #F44336, #E91E63)',
            info: 'linear-gradient(45deg, #2196F3, #03DAC6)'
        };

        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 9999;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 300px;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => toast.remove(), 500);
        }, duration);
    }

    addLoadingSpinner(element) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner"></div>
            <div class="loading-text">Loading...</div>
        `;

        spinner.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #4ecdc4;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(78, 205, 196, 0.3);
                border-top: 4px solid #4ecdc4;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }
            .loading-text {
                font-size: 1rem;
                font-weight: 600;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        element.style.position = 'relative';
        element.appendChild(spinner);

        return {
            remove: () => {
                spinner.remove();
                style.remove();
            }
        };
    }

    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            element.style.animation = '';
            style.remove();
        }, 500);
    }

    pulseElement(element, color = '#4ecdc4') {
        const originalBoxShadow = element.style.boxShadow;
        element.style.animation = `pulse-${color.replace('#', '')} 1s ease-in-out`;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-${color.replace('#', '')} {
                0%, 100% { box-shadow: 0 0 0 0 ${color}40; }
                50% { box-shadow: 0 0 0 10px ${color}00; }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            element.style.animation = '';
            element.style.boxShadow = originalBoxShadow;
            style.remove();
        }, 1000);
    }

    // Utility method to add CSS animations dynamically
    addAnimation(name, keyframes) {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ${name} {
                ${keyframes}
            }
        `;
        document.head.appendChild(style);
        this.animations.set(name, style);
    }

    removeAnimation(name) {
        const style = this.animations.get(name);
        if (style) {
            style.remove();
            this.animations.delete(name);
        }
    }
}

// Initialize UI when page loads
document.addEventListener('DOMContentLoaded', function () {
    window.gameUI = new GameUI();

    // Add some global animation styles
    const globalStyles = document.createElement('style');
    globalStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(globalStyles);

    console.log('🎨 Game UI Ready!');
});
