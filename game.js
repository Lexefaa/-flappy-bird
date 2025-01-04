class FlappyBird {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 600;
        
        this.bird = {
            x: 50,
            y: this.canvas.height / 2,
            velocity: 0,
            gravity: 0.5,
            jump: -8,
            size: 20
        };

        this.pipes = [];
        this.pipeWidth = 50;
        this.pipeGap = 150;
        this.pipeSpacing = 200;
        this.score = 0;
        this.gameOver = false;

        this.bgMusic = document.getElementById('bgMusic');
        this.setupAutoPlayAudio();

        this.bindEvents();
        this.startGame();

        this.setupTouchControls();
        this.adjustCanvasSize();
        window.addEventListener('resize', () => this.adjustCanvasSize());
    }

    setupTouchControls() {
        // Prevent scrolling when touching the canvas
        document.body.addEventListener('touchstart', function(e) {
            if (e.target.id === 'game-canvas') {
                e.preventDefault();
            }
        }, { passive: false });

        document.body.addEventListener('touchmove', function(e) {
            if (e.target.id === 'game-canvas') {
                e.preventDefault();
            }
        }, { passive: false });
    }

    adjustCanvasSize() {
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        
        // Maintain aspect ratio
        this.canvas.width = Math.min(400, containerWidth - 20);
        this.canvas.height = (this.canvas.width * 1.5);

        // Adjust game parameters based on canvas size
        this.bird.x = this.canvas.width * 0.125;
        this.bird.size = this.canvas.width * 0.05;
        this.pipeWidth = this.canvas.width * 0.125;
        this.pipeGap = this.canvas.height * 0.25;
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.bird.velocity = this.bird.jump;
            }
        });

        this.canvas.addEventListener('touchstart', () => {
            this.bird.velocity = this.bird.jump;
        });

        this.canvas.addEventListener('click', () => {
            this.bird.velocity = this.bird.jump;
        });
    }

    startGame() {
        this.gameLoop();
        this.spawnPipe();
    }

    spawnPipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight;
        const height = Math.random() * (maxHeight - minHeight) + minHeight;

        this.pipes.push({
            x: this.canvas.width,
            height: height,
            passed: false
        });

        setTimeout(() => {
            if (!this.gameOver) this.spawnPipe();
        }, 2000);
    }

    update() {
        if (this.gameOver) return;

        // Update bird
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;

        // Check collisions
        if (this.bird.y < 0 || this.bird.y > this.canvas.height) {
            this.endGame();
        }

        // Update pipes
        this.pipes.forEach((pipe, index) => {
            pipe.x -= 2;

            // Check collision
            if (this.checkCollision(pipe)) {
                this.endGame();
            }

            // Score point
            if (!pipe.passed && pipe.x < this.bird.x) {
                pipe.passed = true;
                this.score++;
                document.getElementById('score').textContent = `Score: ${this.score}`;
                
                if (this.score >= 5) {
                    this.showLoginForm();
                }
            }

            // Remove off-screen pipes
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(index, 1);
            }
        });
    }

    checkCollision(pipe) {
        const birdRight = this.bird.x + this.bird.size;
        const birdLeft = this.bird.x;
        const birdTop = this.bird.y;
        const birdBottom = this.bird.y + this.bird.size;

        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + this.pipeWidth;
        const topPipeBottom = pipe.height;
        const bottomPipeTop = pipe.height + this.pipeGap;

        return (
            birdRight > pipeLeft &&
            birdLeft < pipeRight &&
            (birdTop < topPipeBottom || birdBottom > bottomPipeTop)
        );
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bird
        this.ctx.fillStyle = '#e683c0';
        this.ctx.beginPath();
        this.ctx.arc(
            this.bird.x + this.bird.size/2,
            this.bird.y + this.bird.size/2,
            this.bird.size/2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Draw pipes dengan ukuran responsif
        this.ctx.fillStyle = '#83e6de';
        this.pipes.forEach(pipe => {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.height);
            // Bottom pipe
            this.ctx.fillRect(
                pipe.x,
                pipe.height + this.pipeGap,
                this.pipeWidth,
                this.canvas.height - pipe.height - this.pipeGap
            );
            
            // Aksen kuning dengan ukuran responsif
            this.ctx.fillStyle = '#e6d583';
            const accentHeight = this.canvas.height * 0.033;
            this.ctx.fillRect(pipe.x - 2, pipe.height - accentHeight, 
                            this.pipeWidth + 4, accentHeight);
            this.ctx.fillRect(pipe.x - 2, pipe.height + this.pipeGap, 
                            this.pipeWidth + 4, accentHeight);
            this.ctx.fillStyle = '#83e6de';
        });
    }

    gameLoop() {
        this.update();
        this.draw();
        if (!this.gameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    endGame() {
        this.gameOver = true;
        setTimeout(() => {
            alert(`Game Over! Score: ${this.score}`);
            location.reload();
        }, 100);
    }

    showLoginForm() {
        this.gameOver = true;
        document.getElementById('game-container').style.display = 'none';
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h2>🎉 Horee! Kamu Berhasil! 🎮</h2>
            <p>Wah keren! Kamu sudah menyelesaikan game dengan score ${this.score}!</p>
            <p>✨ Silakan login untuk melanjutkan petualanganmu! ✨</p>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(successMessage, document.getElementById('login-form'));
        
        setTimeout(() => {
            document.getElementById('login-form').style.display = 'block';
        }, 1500);
    }

    setupAutoPlayAudio() {
        // Tambahkan tombol musik
        const musicBtn = document.createElement('button');
        musicBtn.innerHTML = '🎵 Music Off';
        musicBtn.className = 'music-btn';
        document.querySelector('.container').appendChild(musicBtn);

        // Coba mainkan musik secara otomatis
        const playMusic = () => {
            this.bgMusic.play()
                .then(() => {
                    musicBtn.style.backgroundColor = '#e683c0';
                })
                .catch((error) => {
                    console.log("Autoplay prevented:", error);
                });
        };

        // Mainkan musik saat ada interaksi pertama
        const handleFirstInteraction = () => {
            playMusic();
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);

        // Event listener untuk tombol musik
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent double-triggering
            if (this.bgMusic.paused) {
                this.bgMusic.play();
                musicBtn.innerHTML = '🎵 Music Off';
                musicBtn.style.backgroundColor = '#e683c0';
            } else {
                this.bgMusic.pause();
                musicBtn.innerHTML = '🎵 Music On';
                musicBtn.style.backgroundColor = '#83e6de';
            }
        });

        // Coba mainkan musik secara otomatis
        playMusic();
    }
}

document.getElementById('start-game').addEventListener('click', () => {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    // Coba mainkan musik jika belum dimainkan
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic.paused) {
        bgMusic.play()
            .catch(error => console.log("Autoplay prevented:", error));
    }
    new FlappyBird();
}); 