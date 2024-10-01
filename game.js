
var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var arrowKeyPressed = {}; // Since no key is pressed initially

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
var backgroundImage = new Image();
player1Image.src = "images/spaceship.png";
player2Image.src = "images/alien.png";
ballImage.src = "images/meteor.png";
backgroundImage.src = "images/space-bg.jpg";

var isDarkMode = true; // Default to dark mode

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  // Getting user input for speed of ball(issue #12)
  const speedInX = document.getElementById("speedInputInX");
  const speedInY = document.getElementById("speedInputInY");
  speedInX.addEventListener('input', () => {
    ballSpeedX = parseFloat(speedInX.value);  // Update ball speed in X 
  });

  speedInY.addEventListener('input', () => {
    ballSpeedY = parseFloat(speedInY.value);  // Update ball speed in Y
  });
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

// Eventlistners for issue #4
window.addEventListener("keydown", function (evt) {
  arrowKeyPressed[evt.key] = true;
});

window.addEventListener("keyup", function (evt) {
  delete arrowKeyPressed[evt.key];
});



function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  // Working on Issue #4 Adding buttonMovement Functionality by Shishu-Ranjan( @github.com/yesahem )

  if (arrowKeyPressed["ArrowUp"] && paddle1Y > 0) {
    paddle1Y -= 10;
  } else if (arrowKeyPressed["ArrowDown"] && paddle1Y + PADDLE_HEIGHT < canvas.height) {
    paddle1Y += 10;
  } else if (paddle1Y < 0) {
    paddle1Y = 0;
  } else if (paddle1Y + PADDLE_HEIGHT > canvas.height) {
    paddle1Y = canvas.height - PADDLE_HEIGHT;
  }

  computerMovement();


  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX-20 < PADDLE_THICKNESS) {
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
  if (ballX+20 > canvas.width-PADDLE_THICKNESS) {
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


  // Merging the following logics in same condional statement
  if (ballY < 0 || ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  /*
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  */
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

  // Draw background image.
  canvasContext.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

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
