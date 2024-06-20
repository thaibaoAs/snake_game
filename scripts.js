const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const grid = 20;
let snake = [{ x: 160, y: 160 }];
let dx = grid;
let dy = 0;
let food = { x: 320, y: 320 };
let obstacles = [];
let running = false;
let paused = false;
let score = 0;

function drawFood() {
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, grid - 1, grid - 1);
}

function drawSnake() {
    context.fillStyle = 'lime';
    snake.forEach(part => context.fillRect(part.x, part.y, grid - 1, grid - 1));
}

function drawObstacles() {
    context.fillStyle = 'gray';
    obstacles.forEach(obstacle => context.fillRect(obstacle.x, obstacle.y, grid - 1, grid - 1));
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (snake[0].x === food.x && snake[0].y === food.y) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
            y: Math.floor(Math.random() * (canvas.height / grid)) * grid,
        };
        score++;
        document.getElementById("score").innerText = `Điểm: ${score}`;
        if (score % 10 === 0) {
            addObstacle();
        }
    } else {
        snake.pop();
    }
}

function addObstacle() {
    let obstacle;
    do {
        obstacle = {
            x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
            y: Math.floor(Math.random() * (canvas.height / grid)) * grid,
        };
    } while (
        snake.some(part => part.x === obstacle.x && part.y === obstacle.y) ||
        (obstacle.x === food.x && obstacle.y === food.y)
    );
    obstacles.push(obstacle);
}

function checkCollision() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= canvas.width ||
        snake[0].y < 0 ||
        snake[0].y >= canvas.height
    ) {
        return true;
    }

    for (let i = 4; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }

    for (let obstacle of obstacles) {
        if (snake[0].x === obstacle.x && snake[0].y === obstacle.y) {
            return true;
        }
    }

    return false;
}

function drawGame() {
    if (running && !paused) {
        moveSnake();

        if (checkCollision()) {
            running = false;
            alert("Game Over");
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        drawSnake();
        drawObstacles();
        setTimeout(drawGame, 100);
    } else if (running && paused) {
        setTimeout(drawGame, 100);
    }
}

document.addEventListener("keydown", event => {
    if (event.keyCode === 37 && dx === 0) {
        dx = -grid;
        dy = 0;
    } else if (event.keyCode === 38 && dy === 0) {
        dx = 0;
        dy = -grid;
    } else if (event.keyCode === 39 && dx === 0) {
        dx = grid;
        dy = 0;
    } else if (event.keyCode === 40 && dy === 0) {
        dx = 0;
        dy = grid;
    }
});

document.getElementById("startBtn").addEventListener("click", () => {
    if (!running) {
        running = true;
        paused = false;
        drawGame();
    }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
    paused = !paused;
    if (!paused) {
        drawGame();
    }
});

document.getElementById("resetBtn").addEventListener("click", () => {
    snake = [{ x: 160, y: 160 }];
    dx = grid;
    dy = 0;
    food = { x: 320, y: 320 };
    obstacles = [];
    running = false;
    paused = false;
    score = 0;
    document.getElementById("score").innerText = `Điểm: 0`;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
});
