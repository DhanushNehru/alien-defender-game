var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var arrowKeyPressed = {};

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 20;
const PADDLE_HEIGHT = 100;

var player1Image = new Image();
var player2Image = new Image();
var ballImage = new Image();
var backgroundImage = new Image();
player1Image.src = "images/spaceship.png";
player2Image.src = "images/alien.png";
ballImage.src = "images/meteor.png";
backgroundImage.src = "images/space-bg.jpg";

var isDarkMode = true;

const startGame = document.getElementById("startGame");
const pauseGame = document.getElementById("pauseGame");
const resetGame = document.getElementById("resetGame");

startGame.onclick = function () {
  resetGame.onclick = () => location.reload();

  pauseGame.onclick = function () {
    if (pauseGame.innerHTML === "Pause Game") {
      alert("Game Paused, Click Ok to resume");
    }
  };

  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(() => {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  const speedInX = document.getElementById("speedInputInX");
  const speedInY = document.getElementById("speedInputInY");

  speedInX.addEventListener("input", () => ballSpeedX = parseFloat(speedInX.value));
  speedInY.addEventListener("input", () => ballSpeedY = parseFloat(speedInY.value));

  var backgroundSound = document.getElementById("backgroundSound");

  canvas.addEventListener("mousedown", function (evt) {
    handleMouseClick(evt);
    if (backgroundSound.paused) {
      backgroundSound.play().catch(error => console.log("Error playing sound: ", error));
    }
  });

  canvas.addEventListener("mousemove", evt => {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });

  document.getElementById("modeToggle").addEventListener("click", toggleDarkMode);

  document.getElementById("muteButton").addEventListener("click", function () {
    var icon = document.querySelector("#muteButton i");
    backgroundSound.muted = !backgroundSound.muted;
    icon.classList.toggle("fa-volume-mute", backgroundSound.muted);
    icon.classList.toggle("fa-volume-up", !backgroundSound.muted);
  });

  document.body.classList.add("dark-mode");
  document.querySelector("#modeToggle i").classList.add("fa-moon");
};

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  return {
    x: evt.clientX - rect.left - root.scrollLeft,
    y: evt.clientY - rect.top - root.scrollTop
  };
}

function handleMouseClick() {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark-mode", isDarkMode);
  document.body.classList.toggle("light-mode", !isDarkMode);
  const icon = document.querySelector("#modeToggle i");
  icon.classList.toggle("fa-moon", isDarkMode);
  icon.classList.toggle("fa-sun", !isDarkMode);
  drawEverything();
}

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) paddle2Y += 6;
  else if (paddle2YCenter > ballY + 35) paddle2Y -= 6;
}

window.addEventListener("keydown", evt => arrowKeyPressed[evt.key] = true);
window.addEventListener("keyup", evt => delete arrowKeyPressed[evt.key]);

function moveEverything() {
  if (showingWinScreen) return;

  if (arrowKeyPressed["ArrowUp"] && paddle1Y > 0) paddle1Y -= 10;
  if (arrowKeyPressed["ArrowDown"] && paddle1Y + PADDLE_HEIGHT < canvas.height) paddle1Y += 10;
  paddle1Y = Math.max(0, Math.min(paddle1Y, canvas.height - PADDLE_HEIGHT));

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX - 20 < PADDLE_THICKNESS) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      ballSpeedY = (ballY - (paddle1Y + PADDLE_HEIGHT / 2)) * 0.35;
    } else {
      player2Score++;
      document.getElementById("player2Score").innerText = player2Score;
      ballReset();
    }
  }

  if (ballX + 20 > canvas.width - PADDLE_THICKNESS) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      ballSpeedY = (ballY - (paddle2Y + PADDLE_HEIGHT / 2)) * 0.35;
    } else {
      player1Score++;
      document.getElementById("player1Score").innerText = player1Score;
      ballReset();
    }
  }

  if (ballY < 0 || ballY > canvas.height) ballSpeedY = -ballSpeedY;
}

function drawEverything() {
  canvasContext.fillStyle = isDarkMode ? "black" : "white";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  if (showingWinScreen) {
    canvasContext.fillStyle = isDarkMode ? "white" : "black";
    canvasContext.font = "60px Orbitron";
    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "middle";

    if (player1Score >= WINNING_SCORE) canvasContext.fillText("EARTH WINS!", canvas.width / 2, canvas.height / 2 - 100);
    if (player2Score >= WINNING_SCORE) canvasContext.fillText("ALIENS CONQUER!", canvas.width / 2, canvas.height / 2 - 100);

    const buttonWidth = 200;
    const buttonHeight = 60;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = canvas.height / 2 + 50;

    canvasContext.fillStyle = isDarkMode ? "#444" : "#ddd";
    canvasContext.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    canvasContext.fillStyle = isDarkMode ? "white" : "black";
    canvasContext.font = "24px Orbitron";
    canvasContext.fillText("Restart Game", canvas.width / 2, buttonY + buttonHeight / 2);

    canvas.onclick = function (event) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
        canvas.onclick = null;
      }
    };
    return;
  }

  canvasContext.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  canvasContext.drawImage(player1Image, 0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT);
  canvasContext.drawImage(player2Image, canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT);
  canvasContext.drawImage(ballImage, ballX - 10, ballY - 10, 20, 20);
}