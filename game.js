var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 20; // Wider paddle to resemble spaceship
const PADDLE_HEIGHT = 100;

var player1Image = new Image();
var player2Image = new Image();
var ballImage = new Image();
player1Image.src = "images/spaceship.png";
player2Image.src = "images/alien.png";
ballImage.src = "images/meteor.png";

var isDarkMode = true; // Default to dark mode

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleMouseClick(evt) {
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

  // Update the icon
  const icon = document.querySelector("#modeToggle i");
  if (isDarkMode) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }

  drawEverything(); // Redraw the canvas with new color scheme
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });

  document
    .getElementById("modeToggle")
    .addEventListener("click", toggleDarkMode);

  // Set initial mode
  document.body.classList.add("dark-mode");
  // Ensure the correct initial icon is displayed
  document.querySelector("#modeToggle i").classList.add("fa-moon");
};

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
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // Alien scores
      document.getElementById("player2Score").innerText = player2Score;
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // Earth scores
      document.getElementById("player1Score").innerText = player1Score;
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawEverything() {
  // Clear the canvas with the appropriate background color
  canvasContext.fillStyle = isDarkMode ? "black" : "white";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  if (showingWinScreen) {
    canvasContext.fillStyle = isDarkMode ? "white" : "black";
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("Earth Wins!", 350, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Aliens Conquer!", 350, 200);
    }

    canvasContext.fillText("click to continue", 350, 500);
    return;
  }

  // Draw paddles and ball
  canvasContext.drawImage(
    player1Image,
    0,
    paddle1Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT
  );
  canvasContext.drawImage(
    player2Image,
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT
  );
  canvasContext.drawImage(ballImage, ballX - 10, ballY - 10, 20, 20);
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
