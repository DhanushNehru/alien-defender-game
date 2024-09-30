

var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10; // Default speed
var ballSpeedY = 4;  // Default speed

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



// Get the number of rounds from the HTML input
var numberOfRounds = parseInt(document.getElementById('numberOfRounds').value) || WINNING_SCORE;
var currentRound = 1;

// Function to check if the game should end
function shouldEndGame() {
    return currentRound > numberOfRounds;
}
function handleGameEnd() {
    if (shouldEndGame()) {
        showingWinScreen = true;
        if (player1Score > player2Score) {
            canvasContext.fillText("Earth Wins!", 350, 200);
        } else if (player2Score > player1Score) {
            canvasContext.fillText("Aliens Win!", 350, 200);
        } else {
            canvasContext.fillText("It's a Tie!", 350, 200);
        }
        canvasContext.fillText("Click to restart", 350, 500);
    } else {
        currentRound++;
        ballReset();
    }
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }

    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
        } else {
            player2Score++;
            handleGameEnd();
        }
    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
        } else {
            player1Score++; 
            handleGameEnd();
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  document.getElementById("startGame").addEventListener("click", function () {
    // Get the number of rounds
    numberOfRounds = parseInt(document.getElementById('numberOfRounds').value);

    if (!isNaN(numberOfRounds) && numberOfRounds > 0) {
      // Prompt user for ball speed
      var userSpeedX = prompt("Enter ball speed for X-axis (default is 10):");
      var userSpeedY = prompt("Enter ball speed for Y-axis (default is 4):");

      // Set ball speed based on user input or default
      ballSpeedX = userSpeedX ? parseFloat(userSpeedX) : ballSpeedX;
      ballSpeedY = userSpeedY ? parseFloat(userSpeedY) : ballSpeedY;

      startGameLoop();
    } else {
      alert("Please enter a valid number of rounds.");
    }
  });

  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  // Load background sound
  var backgroundSound = document.getElementById("backgroundSound");

  // Event listener to start the game and the sound when the user clicks the canvas
  canvas.addEventListener("mousedown", function (evt) {
    handleMouseClick(evt);

    // Play background sound after user interaction
    if (backgroundSound.paused) {
      backgroundSound.play().catch(function (error) {
        console.log("Error playing sound: ", error);
      });
    }
  });

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });

  // Toggle Dark/Light Mode
  document.getElementById("modeToggle").addEventListener("click", toggleDarkMode);

  // Mute/unmute sound
  document.getElementById("muteButton").addEventListener("click", function () {
    var icon = document.querySelector("#muteButton i");

    if (backgroundSound.muted) {
      backgroundSound.muted = false;
      icon.classList.remove("fa-volume-mute");
      icon.classList.add("fa-volume-up");
    } else {
      backgroundSound.muted = true;
      icon.classList.remove("fa-volume-up");
      icon.classList.add("fa-volume-mute");
    }
  });

  // Set initial mode
  document.body.classList.add("dark-mode");
  document.querySelector("#modeToggle i").classList.add("fa-moon");
};

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
