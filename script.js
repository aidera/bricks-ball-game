"use strict";

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

/* Draws a rounded rectangle using the current state of the canvas */
const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    let defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (let side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

};

/* ----------------------------- */
/* ----- Controls settings ----- */
/* ----------------------------- */

let rightPressed = false;
let leftPressed = false;

const keyDownHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
};

const keyUpHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
};

const mouseMoveHandler = (e) => {
  // detect where the mouse is, left or right part of window
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
    if (paddleX <= 0) {
      paddleX = 0;
    }
    if (paddleX >= canvas.width - paddleWidth) {
      paddleX = canvas.width - paddleWidth;
    }
  }
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

/* ------------------------- */

/* -------------------------- */
/* ----- Score settings ----- */
/* -------------------------- */

let score = 0;

const drawScore = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
};

let lives = 3;

const drawLives = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
};


/* ------------------------- */

/* ------------------------- */
/* ----- Ball settings ----- */
/* ------------------------- */

/* Current ball position */
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
/* Ball direction movement */
let ballDirectX = 2;
let ballDirectY = -2;
/* Ball displaying */
let ballRadius = 10;
/* Paddle actions */
let ballSpeed = 2;

const ballDraw = () => {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};
/* ------------------------- */

/* --------------------------- */
/* ----- Paddle settings ----- */
/* --------------------------- */

/* Paddle displaying */
let paddleHeight = 10;
let paddleWidth = 75;
let paddleRadius = 5;
/* Current paddle position */
let paddleX = (canvas.width - paddleWidth) / 2;
/* Paddle actions */
let paddleSpeed = 5;

const drawPaddle = () => {
  roundRect(ctx, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, paddleRadius, "#0095DD", false);
};

/* --------------------------- */

/* --------------------------- */
/* ----- Bricks settings ----- */
/* --------------------------- */

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickRadius = 12;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

/**
 *  Create bricks "table" in array like columns -> rows -> x pos + y pos + status
 *  Example:
 *  let bricks = [
 *    [
 *      { x: 0, y: 0, status: 1 },
 *      { x: 10, y: 0, status: 1 },
 *      { x: 20, y: 0, status: 1 },
 *    ],
 *    [
 *      { x: 0, y: 20, status: 1 },
 *      { x: 10, y: 20, status: 1 },
 *      { x: 20, y: 20 ,status: 1 },
 *    ]
 *  ];
 *  */
let bricks = [];
// columns
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  // rows
  for (let r = 0; r < brickRowCount; r++) {
    // positions
    bricks[c][r] = {x: 0, y: 0, status: 1};
  }
}

const drawBricks = () => {
  //columns
  for (let c = 0; c < brickColumnCount; c++) {
    // rows
    for (let r = 0; r < brickRowCount; r++) {
      // define positions
      let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
      let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
      let brick = bricks[c][r];
      brick.x = brickX;
      brick.y = brickY;
      console.log(brick.status);
      let brickColor = "#0095DD";
      if (brick.status !== 1) {
        brickColor = "rgba(0, 0, 0, 0)";
      }
      // draw brick
      roundRect(
        ctx,
        brickX,
        brickY,
        brickWidth,
        brickHeight,
        brickRadius,
        brickColor,
        false
      );
    }
  }
};

const collisionDetection = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
          ballDirectY = -ballDirectY;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
};


/* ------------------------- */

/* ------------------------- */
/* ----- Game settings ----- */
/* ------------------------- */

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* ------------ */
  /* --- Ball --- */
  /* ------------ */

  ballDraw();

  // If we've got left or right max positions
  if (ballX + ballDirectX > canvas.width - ballRadius || ballX + ballDirectX < ballRadius) {
    ballDirectX = -ballDirectX;
  }
  // If we've got top max position
  if (ballY + ballDirectY < ballRadius) {
    ballDirectY = -ballDirectY;
    // If we've got bottom max position
  } else if (ballY + ballDirectY > canvas.height - ballRadius) {
    // Checking for paddle position for bounce able
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDirectY = -ballDirectY;
    }
    // If there is no paddle to bounce - minus live or game over
    else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        // Need to bounce or it will loop
        ballDirectY = -ballDirectY;
      }
    }
  }

  // Change of current position at each interval
  ballX += ballDirectX * ballSpeed;
  ballY += ballDirectY * ballSpeed;

  /* ------------------------- */

  /* -------------- */
  /* --- Paddle --- */
  /* -------------- */

  drawPaddle();

  if (rightPressed) {
    paddleX += paddleSpeed;
    // To stop platform if it gets the right corner
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= paddleSpeed;
    // To stop platform if it gets the left corner
    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  /* -------------- */
  /* --- Bricks --- */
  /* -------------- */

  drawBricks();
  collisionDetection();

  /* ------------- */
  /* --- Score --- */
  /* ------------- */
  drawScore();
  drawLives();

  ballSpeed = ballSpeed * 1.0005;

  // This function will make another call of current draw() function in animation interval
  // alternative: let interval = setInterval(draw, 10);
  // but we will need to call it outside this draw() function
  requestAnimationFrame(draw);
};

draw();
