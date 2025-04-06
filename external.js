document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score-display');
    const gun = document.getElementById('gun');
    const crosshair = document.getElementById('crosshair');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    
    let score = 0;
    let gameRunning = true;
    let mouseX = 0;
    let mouseY = 0;
    
    // Create mountains
    const mountainPositions = [100, 500, 900];
    mountainPositions.forEach(position => {
        const mountain = document.createElement('div');
        mountain.className = 'mountain';
        mountain.style.left = `${position}px`;
        gameContainer.appendChild(mountain);
    });
    
    // Create trees
    const treePositions = [200, 400, 700, 1000];
    treePositions.forEach(position => {
        const tree = document.createElement('div');
        tree.className = 'tree';
        tree.style.left = `${position}px`;
        tree.style.width = '80px';
        tree.style.height = '110px';
        
        const trunk = document.createElement('div');
        trunk.className = 'tree-trunk';
        
        const top = document.createElement('div');
        top.className = 'tree-top';
        
        tree.appendChild(trunk);
        tree.appendChild(top);
        gameContainer.appendChild(tree);
    });
    
    // Create clouds
    for (let i = 0; i < 5; i++) {
        createCloud();
    }
    
    // Create birds at intervals
    const birdCreationInterval = setInterval(() => {
        if (gameRunning) {
            createBird();
        }
    }, 1500);
    
    // Mouse move event to track cursor position
    gameContainer.addEventListener('mousemove', function(e) {
        const rect = gameContainer.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        // Update crosshair position
        crosshair.style.left = `${mouseX}px`;
        crosshair.style.top = `${mouseY}px`;
        
        // Calculate angle for gun rotation
        const gunRect = gun.getBoundingClientRect();
        const gunCenterX = gunRect.left - rect.left + 20;
        const gunCenterY = gunRect.top - rect.top + 40;
        
        const angle = Math.atan2(mouseY - gunCenterY, mouseX - gunCenterX) * 180 / Math.PI;
        gun.style.transform = `rotate(${angle}deg)`;
    });
    
    // Click event to shoot
    gameContainer.addEventListener('click', function(e) {
        if (gameRunning) {
            shoot(mouseX, mouseY);
        }
    });
    
    // Restart button event
    restartButton.addEventListener('click', function() {
        restartGame();
    });
    
    // Game functions
    function createBird() {
        const bird = document.createElement('img');
        bird.className = 'bird';
        bird.dataset.hit = 'false';
        
        // Randomly choose direction
        const direction = Math.random() > 0.5 ? 'right' : 'left';
        const startX = direction === 'right' ? -60 : window.innerWidth;
        const birdY = Math.random() * (window.innerHeight * 0.6) + 50;
        
        bird.style.left = `${startX}px`;
        bird.style.top = `${birdY}px`;
        
        // Set bird image based on direction
        if (direction === 'right') {
            bird.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Cpath d='M25,30 Q40,20 55,30 L90,25 L55,35 Q40,45 25,35 L25,30 Z' fill='%23CD853F'/%3E%3Ccircle cx='85' cy='25' r='5' fill='black'/%3E%3Cpath d='M50,30 L65,15 L40,15 Z' fill='%23CD853F'/%3E%3Cpath d='M15,30 L40,25 L15,20 Z' fill='%23CD853F'/%3E%3C/svg%3E";
        } else {
            bird.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Cpath d='M75,30 Q60,20 45,30 L10,25 L45,35 Q60,45 75,35 L75,30 Z' fill='%23CD853F'/%3E%3Ccircle cx='15' cy='25' r='5' fill='black'/%3E%3Cpath d='M50,30 L35,15 L60,15 Z' fill='%23CD853F'/%3E%3Cpath d='M85,30 L60,25 L85,20 Z' fill='%23CD853F'/%3E%3C/svg%3E";
        }
        
        bird.dataset.direction = direction;
        bird.dataset.speed = Math.random() * 2 + 1;
        
        gameContainer.appendChild(bird);
        
        // Move bird with animation frame
        moveBird(bird);
    }
    
    function moveBird(bird) {
        const birdMovement = setInterval(() => {
            if (!gameRunning || bird.dataset.hit === 'true') {
                clearInterval(birdMovement);
                return;
            }
            
            const currentLeft = parseFloat(bird.style.left);
            const speed = parseFloat(bird.dataset.speed);
            const direction = bird.dataset.direction;
            
            if (direction === 'right') {
                bird.style.left = `${currentLeft + speed}px`;
                // Bird flapping effect
                bird.style.transform = Math.random() > 0.5 ? 'translateY(-2px)' : 'translateY(2px)';
                
                if (currentLeft > window.innerWidth) {
                    bird.remove();
                    clearInterval(birdMovement);
                }
            } else {
                bird.style.left = `${currentLeft - speed}px`;
                // Bird flapping effect
                bird.style.transform = Math.random() > 0.5 ? 'translateY(-2px)' : 'translateY(2px)';
                
                if (currentLeft < -60) {
                    bird.remove();
                    clearInterval(birdMovement);
                }
            }
        }, 16);
    }
    
    function createCloud() {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        const startX = Math.random() * window.innerWidth;
        const cloudY = Math.random() * (window.innerHeight * 0.3);
        
        cloud.style.left = `${startX}px`;
        cloud.style.top = `${cloudY}px`;
        cloud.style.opacity = Math.random() * 0.5 + 0.3;
        
        const cloudSize = Math.random() * 60 + 80;
        cloud.style.width = `${cloudSize}px`;
        cloud.style.height = `${cloudSize * 0.6}px`;
        
        gameContainer.appendChild(cloud);
        
        // Move cloud slowly
        const cloudSpeed = Math.random() * 0.5 + 0.1;
        const cloudDirection = Math.random() > 0.5 ? 1 : -1;
        
        const cloudMovement = setInterval(() => {
            if (!gameRunning) {
                clearInterval(cloudMovement);
                return;
            }
            
            const currentLeft = parseFloat(cloud.style.left);
            cloud.style.left = `${currentLeft + (cloudSpeed * cloudDirection)}px`;
            
            if (currentLeft > window.innerWidth + 100 || currentLeft < -200) {
                cloud.remove();
                clearInterval(cloudMovement);
                createCloud();
            }
        }, 50);
    }
    
    function shoot(x, y) {
        // Create bullet effect
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        
        const gunRect = gun.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();
        const gunX = gunRect.left - containerRect.left + 80;
        const gunY = gunRect.top - containerRect.top + 30;
        
        bullet.style.left = `${gunX}px`;
        bullet.style.top = `${gunY}px`;
        gameContainer.appendChild(bullet);
        
        // Animate bullet
        const angle = Math.atan2(y - gunY, x - gunX);
        const speed = 15;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        
        const bulletFlight = setInterval(() => {
            if (!gameRunning) {
                clearInterval(bulletFlight);
                bullet.remove();
                return;
            }
            
            const currentLeft = parseFloat(bullet.style.left);
            const currentTop = parseFloat(bullet.style.top);
            
            bullet.style.left = `${currentLeft + dx}px`;
            bullet.style.top = `${currentTop + dy}px`;
            
            // Check collision with birds
            checkBulletCollision(bullet);
            
            // Remove bullet if it goes out of bounds
            if (currentLeft < 0 || currentLeft > window.innerWidth ||
                currentTop < 0 || currentTop > window.innerHeight) {
                clearInterval(bulletFlight);
                bullet.remove();
            }
        }, 16);
    }
    
    function checkBulletCollision(bullet) {
        const bulletRect = bullet.getBoundingClientRect();
        const birds = document.querySelectorAll('.bird');
        
        birds.forEach(bird => {
            if (bird.dataset.hit === 'true') return;
            
            const birdRect = bird.getBoundingClientRect();
            
            if (bulletRect.left < birdRect.right &&
                bulletRect.right > birdRect.left &&
                bulletRect.top < birdRect.bottom &&
                bulletRect.bottom > birdRect.top) {
                // Hit!
                bird.dataset.hit = 'true';
                bird.style.transform = 'rotate(180deg)';
                bird.style.transition = 'transform 0.5s, top 1s';
                bird.style.top = `${window.innerHeight}px`;
                
                // Update score
                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;
                
                // Remove bird after falling animation
                setTimeout(() => {
                    bird.remove();
                }, 1000);
                
                // Add timer to end game after 60 seconds
                if (score === 10) {
                    setTimeout(() => {
                        endGame();
                    }, 60000);
                }
            }
        });
    }
    
    function endGame() {
        gameRunning = false;
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'block';
    }
    
    function restartGame() {
        // Reset score
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        
        // Remove all birds
        const birds = document.querySelectorAll('.bird');
        birds.forEach(bird => bird.remove());
        
        // Remove all bullets
        const bullets = document.querySelectorAll('.bullet');
        bullets.forEach(bullet => bullet.remove());
        
        // Hide game over screen
        gameOverScreen.style.display = 'none';
        
        // Restart game
        gameRunning = true;
    }
});